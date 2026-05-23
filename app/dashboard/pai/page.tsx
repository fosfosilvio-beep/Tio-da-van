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
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header Fixo */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-slate-500">Bem-vindo(a),</p>
            <h1 className="text-xl font-bold text-slate-800">{nome}</h1>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-md mx-auto p-6 space-y-6">
        {aluno ? (
          <>
            {/* Status do Trajeto */}
            <section className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-700">Status de Hoje</h2>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${aluno.embarcado_hoje ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {aluno.embarcado_hoje ? "Embarcado" : "Aguardando Van"}
                </span>
              </div>
              
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🚐</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Tio {motorista?.nome_completo?.split(" ")[0] || "Motorista"}
                  </p>
                  <p className="text-xs text-slate-500">Placa: {placa}</p>
                </div>
              </div>
            </section>

            {/* MOCK MAPA ESTRUTURAL */}
            <section className="relative w-full h-64 rounded-3xl overflow-hidden shadow-inner border border-slate-200 bg-slate-100">
              {/* Grid fake simulando mapa */}
              <div className="absolute inset-0 opacity-20" 
                   style={{ backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)', backgroundSize: '24px 24px' }}>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-100/80 to-transparent z-0"></div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <div className="h-14 w-14 bg-white rounded-full shadow-lg flex items-center justify-center relative animate-bounce">
                  <span className="text-2xl">📍</span>
                  <div className="absolute -bottom-1 h-3 w-8 bg-black/10 blur-sm rounded-[100%]"></div>
                </div>
                <div className="mt-4 px-4 py-2 bg-white/90 backdrop-blur rounded-full shadow-sm text-sm font-medium text-slate-700">
                  Van a 3 min de distância
                </div>
              </div>
            </section>

            {/* Ações Rápidas */}
            <section className="space-y-4 pt-2">
              <h3 className="font-semibold text-slate-700 px-1">Ações Rápidas</h3>
              
              <AbsenceButton 
                alunoId={aluno.id} 
                isAusenteHoje={aluno.notificar_ausencia_hoje || false} 
              />

              <button className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 transition-all active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Pagar Mensalidade
              </button>
            </section>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <span className="text-5xl mb-6 block">🚐</span>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Nenhum Tio da Van vinculado</h2>
            <p className="text-slate-500 mb-8 text-sm">
              Encontre o motorista ideal que atenda a escola do seu filho e a sua região.
            </p>
            <Link 
              href="/dashboard/pai/buscar"
              className="inline-flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl py-4 font-bold shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              Buscar Tio da Van
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
