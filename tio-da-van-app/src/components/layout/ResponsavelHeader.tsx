'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import { List, Bell, Gear, User, SignOut, X, SquaresFour, Users, CurrencyDollar, ChatText, Headset } from '@phosphor-icons/react/dist/ssr'

export function ResponsavelHeader() {
  const { perfil, signOut } = useAuth()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Title logic
  let pageTitle = 'Elite Logistics'
  if (pathname.includes('/meu-painel')) pageTitle = 'Dashboard'
  if (pathname.includes('/meus-filhos')) pageTitle = 'Meus Filhos'
  if (pathname.includes('/mensalidades')) pageTitle = 'Financeiro'

  const navItems = [
    { href: '/meu-painel', icon: SquaresFour, label: 'Dashboard' },
    { href: '/meus-filhos', icon: Users, label: 'Meus Filhos' },
    { href: '/mensalidades', icon: CurrencyDollar, label: 'Financeiro' },
    { href: '/mensagens', icon: ChatText, label: 'Mensagens' },
    { href: '/configuracoes', icon: Gear, label: 'Configurações' },
  ]

  return (
    <>
      <header className="bg-[#13345b] text-white fixed top-0 w-full z-50 shadow-md flex justify-between items-center px-4 md:px-8 py-2 md:w-[calc(100%-16rem)] md:left-64 h-16">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-white active:scale-95 duration-200" onClick={() => setMenuOpen(!menuOpen)}>
            <List size={28} weight="bold" />
          </button>
          <span className="text-lg font-bold text-white md:hidden">Elite Logistics</span>
          <span className="text-xl font-bold text-white hidden md:block">{pageTitle}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-[#2d4b73] transition-colors active:scale-95 duration-200">
              <Bell size={24} weight="fill" />
            </button>
            <button className="p-2 rounded-full hover:bg-[#2d4b73] transition-colors active:scale-95 duration-200 hidden md:block">
              <Gear size={24} weight="fill" />
            </button>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#f2f4f6] flex items-center justify-center overflow-hidden border-2 border-[#2d4b73] cursor-pointer">
            {perfil?.avatar_url ? (
               <img src={perfil.avatar_url} alt={perfil.nome} className="w-full h-full object-cover" />
            ) : (
               <User size={20} weight="fill" className="text-[#13345b]" />
            )}
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-[60] transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:hidden`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
        <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white flex flex-col p-4 shadow-xl z-50">
          <div className="flex justify-between items-center mb-8 px-2">
            <div>
              <h1 className="text-xl font-bold text-[#13345b]">Elite Logistics</h1>
              <p className="text-[12px] font-medium text-[#74777f] mt-1">Gestão de Transporte</p>
            </div>
            <button onClick={() => setMenuOpen(false)} className="text-[#74777f]">
              <X size={24} weight="bold" />
            </button>
          </div>
          
          <nav className="flex-1 space-y-2">
            {navItems.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <Link 
                  key={href} 
                  href={href} 
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isActive ? 'bg-[#fdba5f] text-[#744900] font-bold' : 'text-[#43474e] hover:bg-[#f2f4f6] font-semibold'
                  }`}
                >
                  <Icon size={24} weight={isActive ? 'fill' : 'regular'} />
                  <span className="text-sm">{label}</span>
                </Link>
              )
            })}
          </nav>
          
          <div className="mt-auto pt-4 border-t border-[#e1e2e4]">
            <button className="w-full flex justify-center items-center gap-2 bg-[#13345b] text-white text-sm font-semibold py-3 rounded-lg hover:bg-[#13345b]/90 transition-colors mb-4">
              <Headset size={20} weight="fill" /> Suporte
            </button>
            <button onClick={signOut} className="w-full flex items-center gap-3 p-3 rounded-lg text-[#43474e] hover:bg-[#f2f4f6] transition-all">
              <SignOut size={24} weight="bold" />
              <span className="text-sm font-semibold">Sair</span>
            </button>
          </div>
        </aside>
      </div>
    </>
  )
}
