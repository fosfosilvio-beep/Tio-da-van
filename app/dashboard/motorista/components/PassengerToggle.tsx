"use client";

import { useTransition } from "react";
import { toggleEmbarque } from "../actions";

export default function PassengerToggle({
  alunoId,
  isEmbarcado,
}: {
  alunoId: string;
  isEmbarcado: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleEmbarque(alunoId, isEmbarcado);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-inner disabled:opacity-50 ${
        isEmbarcado ? "bg-success" : "bg-slate-200"
      }`}
    >
      <span className="sr-only">Marcar Presença</span>
      <span
        className={`pointer-events-none relative inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
          isEmbarcado ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {isPending ? (
          <svg className="animate-spin h-3.5 w-3.5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : isEmbarcado ? (
          <svg className="h-4 w-4 text-success" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
           <div className="h-1.5 w-1.5 rounded-full bg-slate-300"></div>
        )}
      </span>
    </button>
  );
}
