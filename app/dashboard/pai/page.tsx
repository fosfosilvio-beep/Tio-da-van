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
    <div className="relative min-h-[100dvh] w-full bg-background overflow-hidden flex flex-col">
      {/* Background Dinâmico de Mapa (Glassmorphism Base) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-multiply" 
           style={{ 
             backgroundImage: 'radial-gradient(circle at 50% 50%, #A2E8DF 10%, transparent 11%), radial-gradient(circle at 10% 80%, #3E8AC8 5%, transparent 6%), radial-gradient(circle at 80% 20%, #F5C754 5%, transparent 6%)', 
             backgroundSize: '100px 100px',
             filter: 'blur(3px)'
           }}>
      </div>
      
      {/* Grade abstrata do mapa */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(#0F1B24 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 flex flex-col h-[100dvh]">
        {/* Header Glassmorphism */}
        <header className="sticky top-0 z-50 bg-white/40 backdrop-blur-xl border-b border-white/60 px-6 py-5 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Bem-vindo(a)</p>
              <h1 className="text-2xl font-title text-foreground tracking-tight">{nome}</h1>
            </div>
            <LogoutButton />
          </div>
        </header>

        <main className="flex-1 max-w-md w-full mx-auto p-6 space-y-6 overflow-y-auto pb-24 scrollbar-hide">
          {aluno ? (
            <>
              {/* Card de Status Flutuante Premium */}
              <section className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 shadow-glass border border-white/80 transition-all hover:shadow-[0_8px_40px_0_rgba(31,38,135,0.1)] relative overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <h2 className="font-title text-xl text-foreground">Status do Trajeto</h2>
                  <span className={`px-4 py-1.5 text-xs font-bold rounded-full border shadow-sm ${aluno.embarcado_hoje ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-amber-600 border-warning/20'}`}>
                    {aluno.embarcado_hoje ? "Embarcado" : "Aguardando"}
                  </span>
                </div>
                
                <div className="flex items-center gap-5 bg-white/50 border border-white/60 p-4 rounded-2xl shadow-sm relative z-10">
                  <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30 shadow-glow">
                    <span className="text-2xl">🚐</span>
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground font-title">
                      Tio {motorista?.nome_completo?.split(" ")[0] || "Motorista"}
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Placa: <span className="text-foreground">{placa}</span></p>
                  </div>
                </div>

                {/* Tracking Visualizer */}
                <div className="mt-6 flex flex-col items-center justify-center py-4 bg-gradient-to-b from-white/30 to-transparent rounded-2xl border border-white/40">
                  <div className="h-16 w-16 bg-white rounded-full shadow-lg flex items-center justify-center relative animate-bounce border-2 border-primary">
                    <span className="text-2xl">📍</span>
                    <div className="absolute -bottom-2 h-3 w-8 bg-black/10 blur-md rounded-[100%]"></div>
                  </div>
                  <div className="mt-4 px-5 py-2 bg-foreground text-background rounded-full shadow-md text-sm font-bold tracking-wide">
                    {aluno.embarcado_hoje ? "A caminho da escola" : "Van a 3 min de distância"}
                  </div>
                </div>
              </section>

              {/* Ações Rápidas em Grid */}
              <section className="space-y-4 pt-4">
                <h3 className="font-title text-lg text-foreground px-1">Ações Rápidas</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <AbsenceButton 
                    alunoId={aluno.id} 
                    isAusenteHoje={aluno.notificar_ausencia_hoje || false} 
                  />

                  <button className="w-full flex items-center justify-center gap-3 rounded-2xl py-4 font-bold text-secondary bg-white/60 backdrop-blur-md border border-white/80 shadow-sm hover:shadow-md hover:bg-white/80 transition-all active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Pagar Mensalidade
                  </button>
                </div>
              </section>
            </>
          ) : (
            <div className="text-center mt-12 py-16 bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-glass border border-white/80 px-8 relative overflow-hidden">
              <div className="absolute -top-20 -left-20 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-lg border border-white mb-8 relative">
                  <span className="text-5xl">🚐</span>
                  <div className="absolute -right-2 -bottom-2 h-8 w-8 bg-warning rounded-full border-4 border-white flex items-center justify-center">
                    <span className="text-white text-lg font-bold">!</span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-title font-bold text-foreground mb-3">Nenhum Tio vinculado</h2>
                <p className="text-slate-500 mb-10 text-sm leading-relaxed font-medium">
                  Encontre o motorista ideal que atenda a escola do seu filho e a sua região para começar a rastrear.
                </p>
                
                <Link 
                  href="/dashboard/pai/buscar"
                  className="inline-flex items-center justify-center gap-3 w-full bg-primary text-foreground hover:bg-primary/90 rounded-2xl py-4 font-bold tracking-wide shadow-glow transition-all active:scale-[0.98]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
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
