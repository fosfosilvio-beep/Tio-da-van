'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SquaresFour, Users, CurrencyDollar, ChatText, Gear, Headset, SignOut } from '@phosphor-icons/react/dist/ssr'
import { useAuth } from '@/providers/AuthProvider'

export function ResponsavelSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  const navItems = [
    { href: '/meu-painel', icon: SquaresFour, label: 'Dashboard Principal' },
    { href: '/meus-filhos', icon: Users, label: 'Acompanhar Trajeto' },
    { href: '/mensalidades', icon: CurrencyDollar, label: 'Área Financeira' },
    { href: '/mensagens', icon: ChatText, label: 'Chat & Avisos' },
    { href: '/configuracoes', icon: Gear, label: 'Configurações' },
  ]

  return (
    <aside className="w-full h-full flex flex-col bg-white">
      {/* Brand Area */}
      <div className="h-20 flex items-center px-8 border-b border-slate-100 mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <span className="bg-blue-600 text-white p-1.5 rounded-lg">
            <Users size={20} weight="fill" />
          </span>
          <span className="text-slate-900">TioDaVan</span>
        </h1>
      </div>

      <div className="px-6 mb-2">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-2">Módulos</p>
      </div>

      {/* Slots / Navigation */}
      <nav className="flex-1 space-y-1.5 px-4 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)
          
          if (isActive) {
            return (
              <Link key={href} href={href} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-blue-50 text-blue-700 font-semibold transition-all">
                <Icon size={22} weight="fill" className="text-blue-600" />
                <span className="text-[14px]">{label}</span>
              </Link>
            )
          }

          return (
            <Link key={href} href={href} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium transition-all group">
              <Icon size={22} weight="regular" className="text-slate-400 group-hover:text-slate-600 transition-colors" />
              <span className="text-[14px]">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Area Slots */}
      <div className="px-4 py-6 border-t border-slate-100 space-y-2 mt-auto">
        <button className="w-full flex justify-center items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-semibold py-3.5 rounded-2xl hover:bg-indigo-100 transition-all">
          <Headset size={20} weight="fill" /> 
          <span>Suporte ao Cliente</span>
        </button>
        <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-600 font-medium transition-all group">
          <SignOut size={22} weight="regular" className="text-slate-400 group-hover:text-red-500 transition-colors" />
          <span className="text-[14px]">Sair da Conta</span>
        </button>
      </div>
    </aside>
  )
}
