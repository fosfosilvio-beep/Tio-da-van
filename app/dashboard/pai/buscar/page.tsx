import React from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SearchForm from "./components/SearchForm";
import DriverCard from "./components/DriverCard";

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/");
  }

  const params = await searchParams;
  const bairro = typeof params.bairro === "string" ? params.bairro : "";
  const escola = typeof params.escola === "string" ? params.escola : "";

  let motoristasEncontrados: any[] = [];

  if (bairro && escola) {
    const { data } = await supabase
      .from("motoristas_perfil")
      .select(`
        id,
        placa_veiculo,
        escolas_atendidas,
        bairros_atendidos,
        perfis (
          nome_completo,
          telefone
        )
      `)
      .eq("status_cadastro", "ativo")
      .contains("bairros_atendidos", [bairro])
      .contains("escolas_atendidas", [escola]);

    if (data) {
      motoristasEncontrados = data;
    }
  }

  return (
    <div className="min-h-[100dvh] w-full bg-slate-950 sm:p-4 md:p-8 flex items-center justify-center">
      {/* Contêiner Pai - Simulador de Smartphone de Ponta */}
      <div className="w-full max-w-md mx-auto min-h-[100dvh] sm:min-h-[850px] bg-slate-900 sm:rounded-[2.5rem] sm:border-[8px] sm:border-slate-800 shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* Header Dark Premium */}
        <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-6 py-5">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/pai" className="p-2 -ml-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-title font-bold text-white tracking-tight">Buscar Van</h1>
          </div>
        </header>

        <main className="flex-1 w-full flex flex-col p-6 space-y-8 overflow-y-auto pb-24 scrollbar-hide">
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-title font-bold text-white mb-2">Encontre seu Motorista</h2>
            <p className="text-slate-400 mb-6 text-sm font-medium leading-relaxed">
              Filtre pela sua região e pela escola de destino para listar as vans disponíveis.
            </p>
            
            <SearchForm />
          </section>

          {bairro && escola && (
            <section className="pt-2 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <h3 className="font-title font-bold text-slate-200 text-lg mb-4 flex items-center gap-2">
                Resultados
                <span className="bg-blue-600/20 text-blue-400 text-xs px-2.5 py-1 rounded-lg border border-blue-500/30">
                  {motoristasEncontrados.length}
                </span>
              </h3>
              
              <div className="space-y-4">
                {motoristasEncontrados.length > 0 ? (
                  motoristasEncontrados.map((m) => (
                    <DriverCard
                      key={m.id}
                      id={m.id}
                      nome={m.perfis?.nome_completo || "Motorista"}
                      telefone={m.perfis?.telefone || ""}
                      placa={m.placa_veiculo}
                      escolas={m.escolas_atendidas}
                      escolaDestinoSelecionada={escola}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-slate-800 rounded-2xl border border-slate-700/50 px-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h4 className="font-title font-bold text-slate-200 text-base">Nenhuma van encontrada</h4>
                    <p className="text-sm text-slate-500 mt-2 font-medium">
                      Ainda não temos motoristas cadastrados para esta rota específica.
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
