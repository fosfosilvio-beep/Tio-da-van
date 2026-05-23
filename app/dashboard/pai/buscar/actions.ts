"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Database } from "@/lib/supabase/database.types";

export async function vincularAluno(formData: FormData) {
  const nomeAluno = formData.get("nome_aluno") as string;
  const periodoLetivo = formData.get("periodo_letivo") as string;
  const idMotorista = formData.get("id_motorista") as string;
  const escolaDestino = formData.get("escola_destino") as string;

  if (!nomeAluno || !periodoLetivo || !idMotorista || !escolaDestino) {
    throw new Error("Todos os campos são obrigatórios.");
  }

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

  // RLS vai garantir que o insert no aluno verifique o auth.uid() == id_responsavel
  const { error } = await supabase
    .from("alunos")
    .insert({
      nome_aluno: nomeAluno,
      periodo_letivo: periodoLetivo,
      escola_destino: escolaDestino,
      id_motorista: idMotorista,
      id_responsavel: session.user.id,
      notificar_ausencia_hoje: false,
      embarcado_hoje: false,
    });

  if (error) {
    console.error("Erro ao vincular aluno:", error.message);
    throw new Error("Falha ao registrar o aluno.");
  }

  // Redireciona de volta para o dashboard onde a nova carteirinha do filho vai aparecer!
  redirect("/dashboard/pai");
}
