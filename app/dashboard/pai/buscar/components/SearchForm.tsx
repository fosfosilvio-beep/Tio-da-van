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

    const params = new URLSearchParams();
    params.set("bairro", bairro);
    params.set("escola", escola);

    router.push(`/dashboard/pai/buscar?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-4">
      <div className="relative">
        <label className="block text-xs font-bold text-slate-400 font-title mb-1.5 ml-1 uppercase tracking-wider">Selecione o Bairro</label>
        <div className="relative group">
          <select 
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            className="w-full appearance-none bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-medium shadow-sm transition-all text-sm"
            required
          >
            <option value="" disabled>Bairro Residencial...</option>
            <option value="Centro">Centro</option>
            <option value="Jardim Primavera">Jardim Primavera</option>
            <option value="Vila Nova">Vila Nova</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <div className="relative">
        <label className="block text-xs font-bold text-slate-400 font-title mb-1.5 ml-1 uppercase tracking-wider">Selecione a Escola</label>
        <div className="relative group">
          <select 
            value={escola}
            onChange={(e) => setEscola(e.target.value)}
            className="w-full appearance-none bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-medium shadow-sm transition-all text-sm"
            required
          >
            <option value="" disabled>Escola de Destino...</option>
            <option value="Mãe do Divino Amor">Mãe do Divino Amor</option>
            <option value="Colégio Prisma">Colégio Prisma</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <button 
        type="submit"
        disabled={!bairro || !escola}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-3.5 font-bold shadow-md transition-all active:scale-95 text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Localizar Vans
      </button>
    </form>
  );
}
