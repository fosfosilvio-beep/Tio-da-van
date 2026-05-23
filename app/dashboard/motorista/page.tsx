import React from "react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardMotoristaPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/");
  }

  return (
    <div className="bg-slate-950 min-h-screen text-white p-4">
      <p>Clean Slate - Aguardando Novo Layout Dark Premium</p>
    </div>
  );
}
