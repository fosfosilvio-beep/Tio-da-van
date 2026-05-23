"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { Database } from "@/lib/supabase/database.types";

export async function toggleAusencia(alunoId: string, statusAtual: boolean) {
  const cookieStore = await cookies();
  
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Não autorizado.");
  }

  // A RLS vai garantir que o responsável só modifique SE o aluno for dele
  const { error } = await supabase
    .from("alunos")
    .update({ notificar_ausencia_hoje: !statusAtual })
    .eq("id", alunoId)
    .eq("id_responsavel", session.user.id);

  if (error) {
    console.error("Erro ao alterar ausência:", error.message);
    throw new Error("Falha ao atualizar o status de ausência.");
  }

  revalidatePath("/dashboard/pai");
}
