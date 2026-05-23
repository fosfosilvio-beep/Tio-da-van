"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchForm() {
  const router = useRouter();
  const [bairro, setBairro] = useState("");
  const [escola, setEscola] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bairro || !escola) return;

    // Constrói a URL com os Search Params
    const params = new URLSearchParams();
    params.set("bairro", bairro);
    params.set("escola", escola);

    router.push(`/dashboard/pai/buscar?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Seu Bairro</label>
        <div className="relative">
          <select 
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            required
          >
            <option value="" disabled>Selecione seu bairro...</option>
            <option value="Centro">Centro</option>
            <option value="Jardim Primavera">Jardim Primavera</option>
            <option value="Vila Nova">Vila Nova</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Escola de Destino</label>
        <div className="relative">
          <select 
            value={escola}
            onChange={(e) => setEscola(e.target.value)}
            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            required
          >
            <option value="" disabled>Selecione a escola...</option>
            <option value="Mãe do Divino Amor">Mãe do Divino Amor</option>
            <option value="Colégio Prisma">Colégio Prisma</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <button 
        type="submit"
        disabled={!bairro || !escola}
        className="mt-2 w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-4 font-bold shadow-[0_4px_14px_0_rgba(15,23,42,0.39)] transition-all active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
        Localizar Vans
      </button>
    </form>
  );
}
