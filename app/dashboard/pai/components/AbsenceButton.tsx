"use client";

import { useTransition } from "react";
import { toggleAusencia } from "../actions";

export default function AbsenceButton({
  alunoId,
  isAusenteHoje,
}: {
  alunoId: string;
  isAusenteHoje: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleAusencia(alunoId, isAusenteHoje);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`relative w-full overflow-hidden rounded-2xl py-4 font-bold text-white transition-all active:scale-95 disabled:opacity-70 ${
        isAusenteHoje
          ? "bg-red-500 hover:bg-red-600 shadow-[0_4px_14px_0_rgba(239,68,68,0.39)]"
          : "bg-blue-500 hover:bg-blue-600 shadow-[0_4px_14px_0_rgba(59,130,246,0.39)]"
      }`}
    >
      <div className="flex items-center justify-center gap-2 relative z-10">
        {isPending ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : isAusenteHoje ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )}
        
        {isPending
          ? "Processando..."
          : isAusenteHoje
          ? "Cancelar Ausência"
          : "Informar Ausência do Filho"}
      </div>
      {/* Micro-animation hover effect */}
      <div className="absolute inset-0 h-full w-full bg-white/20 opacity-0 hover:opacity-100 transition-opacity"></div>
    </button>
  );
}
