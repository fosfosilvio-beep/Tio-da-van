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
    <div className="relative min-h-[100dvh] w-full bg-background overflow-hidden flex flex-col">
      {/* Background Decorativo e Orgânico */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-[100dvh]">
        {/* Header Glassmorphism */}
        <header className="sticky top-0 z-50 bg-white/40 backdrop-blur-xl border-b border-white/60 px-6 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
          <div className="max-w-md mx-auto flex items-center gap-4">
            <Link href="/dashboard/pai" className="p-2 -ml-2 rounded-full hover:bg-white/60 transition-colors text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-title font-bold text-foreground">Buscar Van</h1>
          </div>
        </header>

        <main className="flex-1 max-w-md w-full mx-auto p-6 space-y-8 overflow-y-auto pb-24 scrollbar-hide">
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-title font-bold text-foreground mb-3 tracking-tight">O Motorista ideal</h2>
            <p className="text-slate-500 mb-8 text-base font-medium leading-relaxed">
              Filtre pela sua região e pela escola de destino para encontrar o Tio da Van perfeito.
            </p>
            
            <SearchForm />
          </section>

          {bairro && escola && (
            <section className="pt-2 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <h3 className="font-title font-bold text-foreground text-xl mb-5 flex items-center gap-2">
                Resultados
                <span className="bg-primary/20 text-teal-800 text-xs px-2.5 py-1 rounded-full border border-primary/30">
                  {motoristasEncontrados.length}
                </span>
              </h3>
              
              <div className="space-y-5">
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
                  <div className="text-center py-16 bg-white/60 backdrop-blur-2xl rounded-[2rem] border border-white/80 shadow-glass">
                    <span className="text-5xl block mb-5 opacity-40">🧭</span>
                    <h4 className="font-title font-bold text-foreground text-lg">Nenhuma van encontrada</h4>
                    <p className="text-sm text-slate-500 mt-2 px-8 font-medium">
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
