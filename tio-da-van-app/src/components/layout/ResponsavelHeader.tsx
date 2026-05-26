'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import { List, Bell, MagnifyingGlass, User, SignOut, X, SquaresFour, Users, CurrencyDollar, ChatText, Headset, CaretDown } from '@phosphor-icons/react/dist/ssr'

export function ResponsavelHeader() {
  const { perfil, signOut } = useAuth()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Title logic
  let pageTitle = 'Dashboard'
  if (pathname.includes('/meus-filhos')) pageTitle = 'Rastreamento Global'
  if (pathname.includes('/mensalidades')) pageTitle = 'Área Financeira'

  const navItems = [
    { href: '/meu-painel', icon: SquaresFour, label: 'Dashboard Principal' },
    { href: '/meus-filhos', icon: Users, label: 'Acompanhar Trajeto' },
    { href: '/mensalidades', icon: CurrencyDollar, label: 'Área Financeira' },
    { href: '/mensagens', icon: ChatText, label: 'Chat & Avisos' },
  ]

  return (
    <>
      {/* Wowdash Clean White Header */}
      <header className="fixed top-0 left-0 md:left-72 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="flex justify-between items-center h-20 px-6 lg:px-8">
          
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500 active:scale-95 duration-200" onClick={() => setMenuOpen(!menuOpen)}>
              <List size={28} weight="bold" />
            </button>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">{pageTitle}</h2>
          </div>

          <div className="flex items-center gap-5">
            {/* Search Bar */}
            <div className="hidden lg:flex items-center bg-slate-100 rounded-full px-5 py-2.5 gap-3 w-72 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 border border-transparent transition-all">
              <MagnifyingGlass size={18} className="text-slate-400" />
              <input type="text" placeholder="Buscar informações..." className="bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400" />
            </div>

            <div className="flex items-center gap-2">
              <button className="relative p-2.5 rounded-full hover:bg-slate-100 transition-all active:scale-95 duration-200 text-slate-500 hover:text-blue-600">
                <Bell size={22} weight="fill" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
            
            <div className="h-8 w-px bg-slate-200 mx-1"></div>

            <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-200">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border border-slate-200">
                {perfil?.avatar_url ? (
                   <img src={perfil.avatar_url} alt={perfil.nome} className="w-full h-full object-cover" />
                ) : (
                   <User size={20} weight="fill" className="text-blue-600" />
                )}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-bold text-slate-800">{perfil?.nome?.split(' ')[0] || 'Usuário'}</span>
                <span className="text-[11px] text-slate-500 font-medium">Responsável</span>
              </div>
              <CaretDown size={14} className="text-slate-400 hidden md:block ml-1" />
            </div>
          </div>

        </div>
      </header>
      
      {/* Mobile Menu Drawer (Light Theme) */}
      <div className={`fixed inset-0 z-[60] transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:hidden`}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
        <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-200 flex flex-col shadow-2xl z-50">
          <div className="flex justify-between items-center p-6 border-b border-slate-100">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <span className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Users size={20} weight="fill" />
              </span>
              <span>TioDaVan</span>
            </h1>
            <button onClick={() => setMenuOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full">
              <X size={20} weight="bold" />
            </button>
          </div>
          
          <nav className="flex-1 space-y-1.5 p-4">
            {navItems.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <Link 
                  key={href} 
                  href={href} 
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 font-semibold' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  <Icon size={22} weight={isActive ? 'fill' : 'regular'} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                  <span className="text-[14px]">{label}</span>
                </Link>
              )
            })}
          </nav>
          
          <div className="p-4 space-y-2 border-t border-slate-100">
            <button className="w-full flex justify-center items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-semibold py-3.5 rounded-2xl hover:bg-indigo-100 transition-all">
              <Headset size={20} weight="fill" /> Suporte ao Cliente
            </button>
            <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-600 font-medium transition-all group">
              <SignOut size={22} weight="regular" className="text-slate-400 group-hover:text-red-500 transition-colors" />
              <span className="text-[14px]">Sair da Conta</span>
            </button>
          </div>
        </aside>
      </div>
    </>
  )
}
