"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { Database } from "@/lib/supabase/database.types";

export async function toggleEmbarque(alunoId: string, currentStatus: boolean) {
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
            // Ignorado em Server Actions
          }
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Não autorizado.");
  }

  // Atualizar embarcado_hoje
  const { error } = await supabase
    .from("alunos")
    .update({ embarcado_hoje: !currentStatus })
    .eq("id", alunoId)
    .eq("id_motorista", session.user.id);

  if (error) {
    console.error("Erro ao alternar embarque:", error.message);
    throw new Error("Falha ao registrar embarque.");
  }

  revalidatePath("/dashboard/motorista");
}
