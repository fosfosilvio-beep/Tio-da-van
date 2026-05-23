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
    <div className="min-h-[100dvh] w-full bg-background flex flex-col">
      <div className="relative z-10 flex flex-col h-full">
        {/* Header Dark Premium */}
        <header className="sticky top-0 z-50 bg-secondary/95 backdrop-blur-md border-b border-white/5 px-6 py-5 shadow-lg">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Bem-vindo(a)</p>
              <h1 className="text-2xl font-title text-foreground tracking-tight">{nome}</h1>
            </div>
            <LogoutButton />
          </div>
        </header>

        <main className="flex-1 max-w-md w-full mx-auto p-6 space-y-6 overflow-y-auto pb-24 scrollbar-hide">
          {aluno ? (
            <>
              {/* Card de Status Dark Premium */}
              <section className="bg-secondary rounded-2xl p-6 border border-white/10 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <h2 className="font-title text-xl text-foreground">Status do Trajeto</h2>
                  <span className={`px-4 py-1.5 text-xs font-bold rounded-lg border ${aluno.embarcado_hoje ? 'bg-success/20 text-emerald-400 border-success/30' : 'bg-warning/20 text-yellow-400 border-warning/30'}`}>
                    {aluno.embarcado_hoje ? "Embarcado" : "Aguardando"}
                  </span>
                </div>
                
                <div className="flex items-center gap-5 bg-black/20 border border-white/5 p-4 rounded-xl relative z-10">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground font-title">
                      Tio {motorista?.nome_completo?.split(" ")[0] || "Motorista"}
                    </p>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">Placa: <span className="text-slate-200">{placa}</span></p>
                  </div>
                </div>

                {/* Tracking Visualizer Simples */}
                <div className="mt-6 flex flex-col items-center justify-center py-5 bg-slate-900/50 rounded-xl border border-white/5">
                  <div className="h-14 w-14 bg-slate-800 rounded-full flex items-center justify-center relative border border-primary">
                    <span className="text-xl">📍</span>
                  </div>
                  <div className="mt-4 px-5 py-2 bg-primary text-white rounded-lg shadow-md text-sm font-bold tracking-wide">
                    {aluno.embarcado_hoje ? "A caminho da escola" : "Van a 3 min de distância"}
                  </div>
                </div>
              </section>

              {/* Ações Rápidas em Grid */}
              <section className="space-y-4 pt-4">
                <h3 className="font-title text-lg text-slate-200 px-1">Ações Rápidas</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <AbsenceButton 
                    alunoId={aluno.id} 
                    isAusenteHoje={aluno.notificar_ausencia_hoje || false} 
                  />

                  <button className="w-full flex items-center justify-center gap-3 rounded-xl py-4 font-bold text-slate-300 bg-secondary border border-white/10 hover:bg-slate-700 transition-colors active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Pagar Mensalidade
                  </button>
                </div>
              </section>
            </>
          ) : (
            <div className="text-center mt-12 py-12 bg-secondary rounded-2xl border border-white/10 px-6">
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                
                <h2 className="text-2xl font-title font-bold text-foreground mb-3">Nenhum Tio vinculado</h2>
                <p className="text-slate-400 mb-8 text-sm leading-relaxed font-medium">
                  Encontre o motorista ideal que atenda a escola do seu filho para começar a rastrear.
                </p>
                
                <Link 
                  href="/dashboard/pai/buscar"
                  className="inline-flex items-center justify-center gap-2 w-full bg-primary text-white hover:bg-blue-600 rounded-xl py-4 font-bold tracking-wide transition-colors active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
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
