"use client";

import { useState } from "react";
import { vincularAluno } from "../actions";

interface DriverCardProps {
  id: string;
  nome: string;
  placa: string;
  telefone: string;
  escolas: string[];
  escolaDestinoSelecionada: string;
}

export default function DriverCard({
  id,
  nome,
  placa,
  telefone,
  escolas,
  escolaDestinoSelecionada,
}: DriverCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [isPending, setIsPending] = useState(false);

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-glass border border-white/80 transition-all hover:shadow-[0_8px_40px_0_rgba(31,38,135,0.1)] relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-start gap-5 relative z-10">
        <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-3xl border border-primary/30 shadow-sm">
          🚐
        </div>
        <div className="flex-1 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="font-title font-bold text-foreground text-xl tracking-tight">Tio {nome.split(" ")[0]}</h3>
            <div className="flex items-center gap-1 bg-warning/20 px-2 py-0.5 rounded-full border border-warning/30">
              <span className="text-warning text-xs">★</span>
              <span className="text-xs font-bold text-slate-700">5.0</span>
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Placa: <span className="text-foreground">{placa}</span></p>
          
          <div className="mt-3 flex flex-wrap gap-1.5">
            {escolas.map((esc) => (
              <span key={esc} className={`text-[10px] px-2.5 py-1 rounded-full font-bold shadow-sm border ${
                esc === escolaDestinoSelecionada 
                  ? 'bg-primary/20 text-teal-800 border-primary/30' 
                  : 'bg-white/60 text-slate-500 border-white/80'
              }`}>
                {esc}
              </span>
            ))}
          </div>
        </div>
      </div>

      {!showForm ? (
        <button 
          onClick={() => setShowForm(true)}
          className="mt-6 relative z-10 w-full py-3.5 bg-white/60 hover:bg-white/80 text-secondary font-bold font-title tracking-wide rounded-2xl border border-white/80 shadow-sm transition-all active:scale-95"
        >
          Solicitar Vaga
        </button>
      ) : (
        <form 
          className="mt-6 pt-6 border-t border-white/60 animate-in fade-in slide-in-from-top-4 duration-300 relative z-10"
          action={async (formData) => {
            setIsPending(true);
            try {
              formData.append("id_motorista", id);
              formData.append("escola_destino", escolaDestinoSelecionada);
              await vincularAluno(formData);
            } catch (error) {
              console.error(error);
              setIsPending(false);
            }
          }}
        >
          <h4 className="text-sm font-bold font-title text-foreground mb-4">Dados do Aluno</h4>
          
          <div className="space-y-4">
            <div>
              <input 
                type="text" 
                name="nome_aluno"
                placeholder="Nome completo do filho(a)" 
                className="w-full bg-white/70 backdrop-blur-sm border border-white/80 text-foreground rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary font-medium text-sm shadow-sm transition-all"
                required
              />
            </div>
            
            <div className="relative">
              <select 
                name="periodo_letivo"
                className="w-full appearance-none bg-white/70 backdrop-blur-sm border border-white/80 text-foreground rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary font-medium text-sm shadow-sm transition-all"
                required
                defaultValue=""
              >
                <option value="" disabled>Selecione o Turno</option>
                <option value="Matutino">Manhã (Matutino)</option>
                <option value="Vespertino">Tarde (Vespertino)</option>
                <option value="Noturno">Noite (Noturno)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button 
              type="button"
              onClick={() => setShowForm(false)}
              disabled={isPending}
              className="flex-1 py-3.5 bg-white/40 border border-white/60 text-slate-600 font-bold font-title rounded-2xl hover:bg-white/60 transition-all active:scale-95 shadow-sm"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isPending}
              className="flex-1 flex justify-center items-center py-3.5 bg-primary hover:bg-primary/90 text-foreground font-bold font-title tracking-wide rounded-2xl shadow-glow transition-all active:scale-95 disabled:opacity-70"
            >
              {isPending ? (
                <svg className="animate-spin h-5 w-5 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Vincular"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
