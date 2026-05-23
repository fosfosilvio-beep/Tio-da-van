import React from "react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "@/app/components/LogoutButton";
import AbsenceButton from "./components/AbsenceButton";
import Link from "next/link";
import { Database } from "@/lib/supabase/database.types";

export default async function DashboardPaiPage() {
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

  const nome = perfil?.nome_completo?.split(" ")[0] || "Responsável";

  // Buscando os alunos vinculados a este responsável
  const { data: alunos } = await supabase
    .from("alunos")
    .select(`
      id,
      nome_aluno,
      escola_destino,
      notificar_ausencia_hoje,
      embarcado_hoje,
      motoristas_perfil (
        placa_veiculo,
        perfis (
          nome_completo,
          telefone
        )
      )
    `)
    .eq("id_responsavel", user.id);

  const aluno = alunos && alunos.length > 0 ? alunos[0] : null;

  // Extraindo os dados relacionais do motorista
  // @ts-expect-error type inference from joined views can be tricky
  const motorista = aluno?.motoristas_perfil?.perfis;
  // @ts-expect-error type inference
  const placa = aluno?.motoristas_perfil?.placa_veiculo;

  return (
    <div className="min-h-[100dvh] w-full bg-slate-950 sm:p-4 md:p-8 flex items-center justify-center">
      {/* Contêiner Pai - Simulador de Smartphone de Ponta */}
      <div className="w-full max-w-md mx-auto min-h-[100dvh] sm:min-h-[850px] bg-slate-900 sm:rounded-[2.5rem] sm:border-[8px] sm:border-slate-800 shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* Header Premium */}
        <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-6 py-5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-title font-bold text-white tracking-tight">
                Olá, {nome}
              </h1>
            </div>
            <LogoutButton />
          </div>
        </header>

        <main className="flex-1 w-full flex flex-col p-6 overflow-y-auto scrollbar-hide">
          {aluno ? (
            <div className="space-y-6">
              {/* Card de Status Dark Premium */}
              <section className="bg-slate-800/80 backdrop-blur border border-slate-700/50 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-title text-lg text-slate-100 font-bold">Status do Trajeto</h2>
                  <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg border ${aluno.embarcado_hoje ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                    {aluno.embarcado_hoje ? "Embarcado" : "Aguardando"}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl">
                  <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-slate-100 font-title truncate">
                      Tio {motorista?.nome_completo?.split(" ")[0] || "Motorista"}
                    </p>
                    <p className="text-xs font-medium text-slate-400 mt-0.5 truncate">
                      Placa: <span className="text-slate-300">{placa}</span>
                    </p>
                  </div>
                </div>

                {/* Tracking Visualizer */}
                <div className="mt-5 flex flex-col items-center justify-center py-5 bg-slate-900/80 rounded-xl border border-slate-700/50 shadow-inner">
                  <div className="h-12 w-12 bg-slate-800 rounded-full flex items-center justify-center relative border border-slate-700 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="mt-3 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold tracking-wide shadow-lg">
                    {aluno.embarcado_hoje ? "A caminho da escola" : "Van a 3 min de distância"}
                  </div>
                </div>
              </section>

              {/* Ações Rápidas */}
              <section className="space-y-4 pt-2">
                <h3 className="font-title text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Ações Rápidas</h3>
                
                <div className="flex flex-col gap-3">
                  <AbsenceButton 
                    alunoId={aluno.id} 
                    isAusenteHoje={aluno.notificar_ausencia_hoje || false} 
                  />

                  <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all active:scale-95 shadow-sm text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Pagar Mensalidade
                  </button>
                </div>
              </section>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center pb-12">
              <div className="w-full bg-slate-800/50 backdrop-blur border border-slate-700/50 p-8 rounded-2xl text-center shadow-xl">
                <div className="mx-auto h-16 w-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <h2 className="text-zinc-200 font-semibold text-lg font-title mb-2">Nenhum Tio Vinculado</h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                  Encontre o motorista ideal que atenda a escola do seu filho e a sua região para começar a rastrear.
                </p>
                
                <Link 
                  href="/dashboard/pai/buscar"
                  className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm py-3.5 px-4 rounded-xl transition-all shadow-lg active:scale-95"
                >
                  Localizar Vans na Região
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
