import React from "react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "@/app/components/LogoutButton";
import PassengerToggle from "./components/PassengerToggle";

export default async function DashboardMotoristaPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/");
  }

  const { data: perfil } = await supabase
    .from("perfis")
    .select("nome_completo")
    .eq("id", user.id)
    .single();

  const nome = perfil?.nome_completo?.split(" ")[0] || "Motorista";

  // Buscando os alunos vinculados a este motorista
  const { data: alunos } = await supabase
    .from("alunos")
    .select(`
      id,
      nome_aluno,
      escola_destino,
      notificar_ausencia_hoje,
      embarcado_hoje,
      perfis!alunos_id_responsavel_fkey (
        telefone
      )
    `)
    .eq("id_motorista", user.id)
    .order("nome_aluno");

  const alunosPresentes = alunos?.filter(a => !a.notificar_ausencia_hoje) || [];
  const alunosAusentes = alunos?.filter(a => a.notificar_ausencia_hoje) || [];

  return (
    <div className="min-h-[100dvh] w-full bg-slate-950 sm:p-4 md:p-8 flex items-center justify-center">
      {/* Contêiner Pai - Simulador de Smartphone de Ponta */}
      <div className="w-full max-w-md mx-auto min-h-[100dvh] sm:min-h-[850px] bg-slate-900 sm:rounded-[2.5rem] sm:border-[8px] sm:border-slate-800 shadow-2xl overflow-hidden relative flex flex-col">

        {/* Header Dark Premium */}
        <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-6 py-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Painel do Motorista</p>
              <h1 className="text-2xl font-title font-bold text-white tracking-tight">Tio {nome}</h1>
            </div>
            <LogoutButton />
          </div>
        </header>

        <main className="flex-1 w-full flex flex-col p-6 space-y-8 overflow-y-auto pb-24 scrollbar-hide">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-title font-bold text-slate-100 tracking-tight">Chamada</h2>
              <p className="text-slate-400 text-sm font-medium mt-1">
                {alunosPresentes.length} passageiros ativos hoje
              </p>
            </div>
            <div className="h-14 w-14 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shadow-sm text-2xl">
              📋
            </div>
          </div>

          <section className="space-y-4 pt-2">
            {alunosPresentes.length > 0 ? (
              <div className="flex flex-col gap-3">
                {alunosPresentes.map((aluno) => (
                  <div 
                    key={aluno.id}
                    className={`bg-slate-800 rounded-[1.25rem] p-4 flex items-center gap-4 shadow-sm border transition-all ${aluno.embarcado_hoje ? 'border-success/30 bg-success/5' : 'border-slate-700'}`}
                  >
                    {/* Avatar Circular */}
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center font-title font-bold text-lg flex-shrink-0 border ${aluno.embarcado_hoje ? 'bg-success text-white border-success' : 'bg-primary/20 text-blue-400 border-primary/30'}`}>
                      {aluno.nome_aluno.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-title font-bold text-slate-200 text-base truncate">
                        {aluno.nome_aluno}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                        {aluno.escola_destino}
                      </p>
                    </div>

                    <PassengerToggle alunoId={aluno.id} isEmbarcado={aluno.embarcado_hoje || false} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-800 rounded-3xl border border-slate-700">
                <span className="text-4xl block mb-3 opacity-30">🚐</span>
                <p className="text-slate-400 font-medium text-sm px-6">
                  Nenhum aluno vinculado a você no momento.
                </p>
              </div>
            )}
          </section>

          {alunosAusentes.length > 0 && (
            <section className="pt-6 border-t border-slate-800">
              <h3 className="font-title font-bold text-slate-500 text-xs uppercase tracking-widest mb-4 px-1">
                Ausentes Hoje
              </h3>
              <div className="flex flex-col gap-3">
                {alunosAusentes.map((aluno) => (
                  <div key={aluno.id} className="bg-slate-900/50 rounded-2xl p-4 flex items-center gap-4 border border-slate-800">
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center font-title font-bold text-slate-600 flex-shrink-0">
                      {aluno.nome_aluno.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-title font-bold text-slate-500 line-through decoration-slate-600">
                        {aluno.nome_aluno}
                      </h3>
                      <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-2.5 py-0.5 rounded-md mt-1 inline-block border border-red-400/20">
                        Falta Informada
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}
