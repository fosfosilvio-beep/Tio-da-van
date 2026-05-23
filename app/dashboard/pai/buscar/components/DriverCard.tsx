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
    <div className="bg-secondary rounded-xl border border-white/5 shadow-md overflow-hidden">
      <div className="p-4 flex items-center gap-4">
        {/* Left Icon */}
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        
        {/* Central Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-title font-bold text-slate-200 text-sm truncate">Tio {nome.split(" ")[0]}</h3>
          <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">Placa: {placa}</p>
        </div>

        {/* Right Actions */}
        {!showForm && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowForm(true)}
              className="h-8 w-8 rounded-lg border border-slate-600 bg-slate-700/50 flex items-center justify-center hover:bg-slate-700 transition-colors"
              title="Solicitar Vaga"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <form 
          className="border-t border-slate-700 bg-slate-800/50 p-4 animate-in fade-in slide-in-from-top-2 duration-200"
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
          <div className="space-y-3">
            <div>
              <input 
                type="text" 
                name="nome_aluno"
                placeholder="Nome completo do filho(a)" 
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary font-medium text-xs shadow-inner"
                required
              />
            </div>
            
            <div className="relative">
              <select 
                name="periodo_letivo"
                className="w-full appearance-none bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary font-medium text-xs shadow-inner"
                required
                defaultValue=""
              >
                <option value="" disabled>Selecione o Turno</option>
                <option value="Matutino">Manhã (Matutino)</option>
                <option value="Vespertino">Tarde (Vespertino)</option>
                <option value="Noturno">Noite (Noturno)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button 
              type="button"
              onClick={() => setShowForm(false)}
              disabled={isPending}
              className="flex-1 py-2 bg-slate-700 border border-slate-600 text-slate-300 font-bold font-title text-xs rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isPending}
              className="flex-1 flex justify-center items-center py-2 bg-primary hover:bg-blue-600 text-white font-bold font-title text-xs rounded-lg transition-colors disabled:opacity-50"
            >
              {isPending ? (
                <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
