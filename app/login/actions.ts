"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Por favor, preencha todos os campos." };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Credenciais inválidas. Verifique seu e-mail e senha." };
  }

  // Ao invés de tentarmos rotear manualmente aqui, damos um redirect('/')
  // O middleware cuidará de analisar o auth e ejetar o usuário para o dashboard apropriado
  // de forma completamente segura (RBAC).
  redirect("/");
}
