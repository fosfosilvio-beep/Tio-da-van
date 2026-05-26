'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import { List, Bell, MagnifyingGlass, User, SignOut, X, SquaresFour, Users, CurrencyDollar, ChatText, Headset } from '@phosphor-icons/react/dist/ssr'

export function ResponsavelHeader() {
  const { perfil, signOut } = useAuth()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Title logic
  let pageTitle = 'Painel Principal'
  if (pathname.includes('/meus-filhos')) pageTitle = 'Rastreamento Global'
  if (pathname.includes('/mensalidades')) pageTitle = 'Hub Financeiro'

  const navItems = [
    { href: '/meu-painel', icon: SquaresFour, label: 'Dashboard' },
    { href: '/meus-filhos', icon: Users, label: 'Rastreamento' },
    { href: '/mensalidades', icon: CurrencyDollar, label: 'Financeiro' },
    { href: '/mensagens', icon: ChatText, label: 'Mensagens' },
  ]

  return (
    <>
      {/* Wowdash Floating Glass Header */}
      <header className="fixed top-4 w-[calc(100%-2rem)] md:w-[calc(100%-21rem)] md:left-[19rem] mx-4 z-50">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] px-6 py-4 flex justify-between items-center h-16">
          
          <div className="flex items-center gap-4">
            <button className="md:hidden text-cyan-400 active:scale-95 duration-200" onClick={() => setMenuOpen(!menuOpen)}>
              <List size={28} weight="bold" />
            </button>
            <span className="text-lg font-bold text-slate-200 tracking-wide">{pageTitle}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2 gap-2 w-64 focus-within:border-cyan-500/50 focus-within:bg-slate-800 transition-all">
              <MagnifyingGlass size={18} className="text-slate-400" />
              <input type="text" placeholder="Buscar módulos..." className="bg-transparent border-none outline-none text-sm text-slate-200 w-full placeholder:text-slate-500" />
            </div>

            <div className="flex gap-3">
              <button className="relative p-2 rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all active:scale-95 duration-200 text-slate-400 hover:text-cyan-400 group">
                <Bell size={24} weight="fill" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
              </button>
            </div>
            
            <div className="flex items-center gap-3 pl-3 border-l border-slate-700/50">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-slate-200">{perfil?.nome?.split(' ')[0] || 'Usuário'}</p>
                <p className="text-[11px] text-cyan-500 font-medium tracking-wider">RESPONSÁVEL</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden border border-cyan-500/30 cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                {perfil?.avatar_url ? (
                   <img src={perfil.avatar_url} alt={perfil.nome} className="w-full h-full object-cover" />
                ) : (
                   <User size={20} weight="fill" className="text-cyan-400" />
                )}
              </div>
            </div>
          </div>

        </div>
      </header>
      
      {/* Mobile Menu Drawer (Dark HUD Theme) */}
      <div className={`fixed inset-0 z-[60] transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:hidden`}>
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
        <aside className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl z-50">
          <div className="flex justify-between items-center p-6 border-b border-slate-800">
            <div>
              <h1 className="text-2xl font-black text-white tracking-wider flex items-center gap-2">
                <span className="text-cyan-400">ELITE</span>
                <span className="font-light text-slate-400">HUD</span>
              </h1>
            </div>
            <button onClick={() => setMenuOpen(false)} className="text-slate-500 hover:text-white bg-slate-800 p-2 rounded-xl">
              <X size={20} weight="bold" />
            </button>
          </div>
          
          <nav className="flex-1 space-y-2 p-4">
            {navItems.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <Link 
                  key={href} 
                  href={href} 
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                    isActive 
                      ? 'bg-slate-800/80 border border-slate-700/50 text-cyan-400 font-bold shadow-[0_0_20px_rgba(34,211,238,0.15)] relative overflow-hidden' 
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-white font-medium border border-transparent'
                  }`}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]"></div>}
                  <Icon size={24} weight={isActive ? 'fill' : 'regular'} className="relative z-10" />
                  <span className="text-sm tracking-wide relative z-10">{label}</span>
                </Link>
              )
            })}
          </nav>
          
          <div className="p-4 space-y-3">
            <button className="w-full flex justify-center items-center gap-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-sm font-bold py-4 rounded-2xl hover:bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
              <Headset size={20} weight="fill" /> Suporte Tático
            </button>
            <button onClick={signOut} className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-transparent transition-all">
              <SignOut size={24} weight="bold" />
              <span className="text-sm font-medium tracking-wide">Desconectar</span>
            </button>
          </div>
        </aside>
      </div>
    </>
  )
}
