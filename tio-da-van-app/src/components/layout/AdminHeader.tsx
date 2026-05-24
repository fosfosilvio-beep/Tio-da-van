'use client'

import { useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { List } from '@phosphor-icons/react/dist/ssr'

export function AdminHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Topbar bem sutil e limpo */}
      <header className="h-16 border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
        
        {/* Mobile Hamburger */}
        <button
          className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menu admin"
        >
          <List size={24} />
        </button>

        <div className="hidden lg:block text-xs font-mono text-white/40 tracking-wider">
          SESSÃO MESTRE <span className="mx-2">•</span> IP: PROTEGIDO <span className="mx-2">•</span> ENCRIPTAÇÃO ATIVA
        </div>
        
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-success)] animate-pulse shadow-[0_0_8px_var(--accent-success)]"></span>
          <span className="text-xs font-bold text-white">LIVE</span>
        </div>
      </header>
    </>
  )
}
