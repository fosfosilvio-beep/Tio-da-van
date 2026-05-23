"use client";

import React, { useTransition } from "react";
import { logOut } from "@/app/login/actions";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logOut();
    });
  };

  return (
    <button 
      onClick={handleLogout} 
      disabled={isPending}
      className="text-zinc-400 hover:text-zinc-200 text-xs bg-zinc-800/60 py-1.5 px-3 rounded-full transition-all border border-zinc-700/30 flex items-center gap-1.5 disabled:opacity-50"
      title="Sair do aplicativo"
    >
      {isPending ? (
        <svg style={{ width: '14px', height: '14px' }} width={14} height={14} className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          Sair
          <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '14px', height: '14px' }} width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </>
      )}
    </button>
  );
}
