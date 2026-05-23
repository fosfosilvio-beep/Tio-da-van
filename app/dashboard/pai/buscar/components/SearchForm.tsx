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
    <form onSubmit={handleSearch} className="bg-white/60 backdrop-blur-2xl rounded-3xl p-6 shadow-glass border border-white/80 flex flex-col gap-5 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>

      <div className="relative z-10">
        <label className="block text-sm font-bold text-foreground font-title mb-1.5 ml-1">Seu Bairro</label>
        <div className="relative group">
          <select 
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            className="w-full appearance-none bg-white/70 backdrop-blur-sm border border-white/80 text-foreground rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium shadow-sm transition-all group-hover:bg-white/90"
            required
          >
            <option value="" disabled>Selecione seu bairro...</option>
            <option value="Centro">Centro</option>
            <option value="Jardim Primavera">Jardim Primavera</option>
            <option value="Vila Nova">Vila Nova</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <label className="block text-sm font-bold text-foreground font-title mb-1.5 ml-1">Escola de Destino</label>
        <div className="relative group">
          <select 
            value={escola}
            onChange={(e) => setEscola(e.target.value)}
            className="w-full appearance-none bg-white/70 backdrop-blur-sm border border-white/80 text-foreground rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium shadow-sm transition-all group-hover:bg-white/90"
            required
          >
            <option value="" disabled>Selecione a escola...</option>
            <option value="Mãe do Divino Amor">Mãe do Divino Amor</option>
            <option value="Colégio Prisma">Colégio Prisma</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <button 
        type="submit"
        disabled={!bairro || !escola}
        className="mt-3 relative z-10 w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-foreground rounded-2xl py-4 font-bold shadow-glow transition-all active:scale-95 tracking-wide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
        Localizar Vans
      </button>
    </form>
  );
}
