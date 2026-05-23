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
    <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-3xl shadow-inner">
          🚐
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-800 text-lg">Tio {nome.split(" ")[0]}</h3>
          <p className="text-sm text-slate-500 font-medium">Placa: {placa}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {escolas.map((esc) => (
              <span key={esc} className={`text-[10px] px-2 py-1 rounded-full font-bold ${esc === escolaDestinoSelecionada ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                {esc}
              </span>
            ))}
          </div>
        </div>
      </div>

      {!showForm ? (
        <button 
          onClick={() => setShowForm(true)}
          className="mt-6 w-full py-3 bg-slate-50 hover:bg-slate-100 text-blue-600 font-bold rounded-xl border border-blue-100 transition-colors"
        >
          Solicitar Vaga / Vincular
        </button>
      ) : (
        <form 
          className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300"
          action={async (formData) => {
            setIsPending(true);
            try {
              // Inject the hidden fields
              formData.append("id_motorista", id);
              formData.append("escola_destino", escolaDestinoSelecionada);
              await vincularAluno(formData);
            } catch (error) {
              console.error(error);
              setIsPending(false);
            }
          }}
        >
          <h4 className="text-sm font-bold text-slate-700 mb-4">Dados do Passageiro (Aluno)</h4>
          
          <div className="space-y-4">
            <div>
              <input 
                type="text" 
                name="nome_aluno"
                placeholder="Nome completo do Aluno" 
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>
            
            <div>
              <select 
                name="periodo_letivo"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                required
                defaultValue=""
              >
                <option value="" disabled>Selecione o Turno</option>
                <option value="Matutino">Manhã (Matutino)</option>
                <option value="Vespertino">Tarde (Vespertino)</option>
                <option value="Noturno">Noite (Noturno)</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button 
              type="button"
              onClick={() => setShowForm(false)}
              disabled={isPending}
              className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isPending}
              className="flex-1 flex justify-center items-center py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] transition-all disabled:opacity-70"
            >
              {isPending ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Confirmar Vínculo"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
