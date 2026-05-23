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
    <div className="relative min-h-[100dvh] w-full bg-background overflow-hidden flex flex-col">
      {/* Background Decorativo Glassmorphism */}
      <div className="absolute top-0 right-0 w-[80%] h-[40%] bg-success/10 rounded-full blur-[120px] pointer-events-none -mt-20 -mr-20"></div>
      <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-[100dvh]">
        {/* Header Glassmorphism */}
        <header className="sticky top-0 z-50 bg-white/40 backdrop-blur-xl border-b border-white/60 px-6 py-5 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Painel do Motorista</p>
              <h1 className="text-2xl font-title text-foreground tracking-tight">Tio {nome}</h1>
            </div>
            <LogoutButton />
          </div>
        </header>

        <main className="flex-1 max-w-md w-full mx-auto p-6 space-y-8 overflow-y-auto pb-24 scrollbar-hide">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-title font-bold text-foreground tracking-tight">Chamada</h2>
              <p className="text-slate-500 text-sm font-medium mt-1">
                {alunosPresentes.length} passageiros ativos hoje
              </p>
            </div>
            <div className="h-14 w-14 bg-white/60 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/80 shadow-sm text-2xl">
              📋
            </div>
          </div>

          <section className="space-y-4 pt-2">
            {alunosPresentes.length > 0 ? (
              <div className="flex flex-col gap-3">
                {alunosPresentes.map((aluno) => (
                  <div 
                    key={aluno.id}
                    className={`bg-white/70 backdrop-blur-md rounded-[1.5rem] p-4 flex items-center gap-4 shadow-glass border transition-all ${aluno.embarcado_hoje ? 'border-success/30 bg-success/5' : 'border-white/80'}`}
                  >
                    {/* Avatar Circular */}
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center font-title font-bold text-lg flex-shrink-0 border ${aluno.embarcado_hoje ? 'bg-success text-white border-success' : 'bg-primary/20 text-teal-800 border-primary/30'}`}>
                      {aluno.nome_aluno.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-title font-bold text-foreground text-base truncate">
                        {aluno.nome_aluno}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        {aluno.escola_destino}
                      </p>
                    </div>

                    <PassengerToggle alunoId={aluno.id} isEmbarcado={aluno.embarcado_hoje || false} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/50 backdrop-blur-xl rounded-3xl border border-white/80">
                <span className="text-4xl block mb-3 opacity-50">🚐</span>
                <p className="text-slate-500 font-medium text-sm px-6">
                  Nenhum aluno vinculado a você no momento.
                </p>
              </div>
            )}
          </section>

          {alunosAusentes.length > 0 && (
            <section className="pt-6">
              <h3 className="font-title font-bold text-slate-400 text-sm uppercase tracking-wider mb-4 px-1">
                Ausentes Hoje
              </h3>
              <div className="flex flex-col gap-3 opacity-60">
                {alunosAusentes.map((aluno) => (
                  <div key={aluno.id} className="bg-slate-100/50 rounded-[1.5rem] p-4 flex items-center gap-4 border border-slate-200/50">
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-title font-bold text-slate-500 flex-shrink-0">
                      {aluno.nome_aluno.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-title font-bold text-slate-600 line-through decoration-slate-400">
                        {aluno.nome_aluno}
                      </h3>
                      <span className="text-[10px] font-bold text-danger bg-danger/10 px-2 py-0.5 rounded-full mt-1 inline-block">
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
