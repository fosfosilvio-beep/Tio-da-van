import React from "react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "@/app/components/LogoutButton";
import Link from "next/link";
import AbsenceButton from "./components/AbsenceButton";

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
  // @ts-expect-error Type inference can be tricky with joined views
  const motorista = aluno?.motoristas_perfil?.perfis;
  // @ts-expect-error Type inference
  const placa = aluno?.motoristas_perfil?.placa_veiculo;

  return (
    <div className="min-h-screen w-full bg-[#0B0F19] flex items-center justify-center p-4">
      
      {/* Contêiner Pai - Simulador de Smartphone */}
      <div className="max-w-md w-full min-h-[85vh] md:min-h-[800px] bg-[#121826] rounded-[32px] border border-zinc-800/80 shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Cabeçalho Premium Minimalista */}
        <header className="p-6 flex justify-between items-center bg-[#161F30]/40 backdrop-blur-md border-b border-zinc-800/40">
          <div>
            <h1 className="font-bold text-xl text-white tracking-tight font-title">
              Olá, {nome}
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">Arapongas - PR</p>
          </div>
          <LogoutButton />
        </header>

        {/* Content Area */}
        <main className="flex-1 w-full flex flex-col overflow-y-auto scrollbar-hide relative z-10">
          {aluno ? (
            <div className="p-6 space-y-6">
              {/* Card de Status do Trajeto */}
              <section className="bg-[#1A2333]/60 backdrop-blur-lg border border-zinc-700/30 rounded-[24px] p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <h2 className="font-bold text-zinc-100 text-lg font-title">Status Atual</h2>
                  <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border flex items-center gap-1.5 ${aluno.embarcado_hoje ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20'}`}>
                    <span className={`h-2 w-2 rounded-full ${aluno.embarcado_hoje ? 'bg-[#10B981]' : 'bg-[#EAB308]'} animate-pulse`}></span>
                    {aluno.embarcado_hoje ? "Embarcado" : "Aguardando"}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 bg-[#121826]/80 border border-zinc-800/80 p-4 rounded-2xl relative z-10">
                  <div className="h-12 w-12 rounded-xl bg-blue-600/10 flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-zinc-100 font-title truncate">
                      Tio {motorista?.nome_completo?.split(" ")[0] || "Motorista"}
                    </p>
                    <p className="text-xs font-medium text-zinc-400 mt-0.5 truncate">
                      Placa: <span className="text-zinc-300">{placa}</span>
                    </p>
                  </div>
                </div>

                {/* Tracking Radar */}
                <div className="mt-5 flex flex-col items-center justify-center py-6 bg-[#0B0F19]/50 rounded-2xl border border-zinc-800/80 shadow-inner">
                  <div className="h-14 w-14 bg-[#121826] rounded-full flex items-center justify-center relative border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} style={{ width: '24px', height: '24px' }} className="text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <div className="absolute inset-0 rounded-full border border-blue-400/50 animate-ping opacity-20"></div>
                  </div>
                  <div className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold tracking-wide shadow-lg shadow-blue-900/40">
                    {aluno.embarcado_hoje ? "Em trânsito seguro" : "Acompanhando trajeto"}
                  </div>
                </div>
              </section>

              {/* Ações Rápidas */}
              <section className="space-y-4">
                <h3 className="font-title text-[11px] font-bold text-zinc-500 uppercase tracking-widest px-2">Ações do Dia</h3>
                
                <div className="flex flex-col gap-3">
                  <AbsenceButton 
                    alunoId={aluno.id} 
                    isAusenteHoje={aluno.notificar_ausencia_hoje || false} 
                  />

                  <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-zinc-300 bg-[#1A2333] border border-zinc-700/50 hover:bg-[#161F30] hover:text-white transition-all active:scale-[0.98] shadow-sm text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#10B981]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Fatura Mensal
                  </button>
                </div>
              </section>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center animate-in fade-in duration-500">
              {/* Estado Vazio Escolar Pro (Centro da Tela) */}
              <div className="bg-[#1A2333]/60 backdrop-blur-lg border border-zinc-700/30 p-8 rounded-[24px] w-full shadow-xl">
                
                <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} style={{ width: '40px', height: '40px' }} className="text-blue-500 mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                
                <h2 className="text-zinc-100 font-bold text-lg font-title">Nenhum Motorista Vinculado</h2>
                <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                  Encontre o Tio da Van ideal que atende a escola do seu filho e a sua região para começar o monitoramento diário.
                </p>
                
                {/* Botão de Ação */}
                <Link 
                  href="/dashboard/pai/buscar"
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/30 text-sm tracking-wide flex items-center justify-center gap-2"
                >
                  Localizar Vans na Região
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
