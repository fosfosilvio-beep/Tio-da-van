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

  // Next.js 15+ Server Components await searchParams
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
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header com Botão Voltar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Link href="/dashboard/pai" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-slate-800">Buscar Van</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-6 space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Encontre o Motorista ideal</h2>
          <p className="text-slate-500 mb-6 text-sm">
            Filtre pela sua região e pela escola de destino para encontrar as melhores opções disponíveis.
          </p>
          
          <SearchForm />
        </section>

        {bairro && escola && (
          <section className="pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="font-bold text-slate-800 text-lg mb-4">Resultados Encontrados ({motoristasEncontrados.length})</h3>
            
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
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
                  <span className="text-4xl block mb-4 opacity-50">🧭</span>
                  <h4 className="font-bold text-slate-700">Nenhuma van encontrada</h4>
                  <p className="text-sm text-slate-500 mt-2 px-6">
                    Ainda não temos motoristas cadastrados que atendem essa rota específica.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
