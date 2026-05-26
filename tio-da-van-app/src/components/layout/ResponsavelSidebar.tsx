'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SquaresFour, Users, CurrencyDollar, ChatText, Gear, Headset, SignOut } from '@phosphor-icons/react/dist/ssr'
import { useAuth } from '@/providers/AuthProvider'

export function ResponsavelSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  const navItems = [
    { href: '/meu-painel', icon: SquaresFour, label: 'Dashboard' },
    { href: '/meus-filhos', icon: Users, label: 'Rastreamento' },
    { href: '/mensalidades', icon: CurrencyDollar, label: 'Financeiro' },
    { href: '/mensagens', icon: ChatText, label: 'Mensagens' },
    { href: '/configuracoes', icon: Gear, label: 'Configurações' },
  ]

  return (
    <aside className="w-full h-full flex flex-col fixed w-64">
      {/* Brand Logo Area */}
      <div className="mb-10 px-4 py-2">
        <h1 className="text-2xl font-black text-white tracking-wider flex items-center gap-2">
          <span className="text-cyan-400">ELITE</span>
          <span className="font-light text-slate-400">HUD</span>
        </h1>
        <p className="text-[10px] font-bold text-cyan-500/80 mt-1 tracking-[0.2em] uppercase">Gestão Operacional</p>
      </div>

      {/* Slots / Navigation */}
      <nav className="flex-1 space-y-3 px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)
          
          if (isActive) {
            return (
              <Link key={href} href={href} className="group relative flex items-center gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/50 text-cyan-400 font-bold transition-all overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none"></div>
                <Icon size={24} weight="fill" className="relative z-10" />
                <span className="text-sm relative z-10 tracking-wide">{label}</span>
              </Link>
            )
          }

          return (
            <Link key={href} href={href} className="flex items-center gap-4 p-4 rounded-2xl text-slate-400 border border-transparent hover:bg-slate-800/40 hover:border-slate-700/50 hover:text-white transition-all">
              <Icon size={24} weight="regular" />
              <span className="text-sm font-medium tracking-wide">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Area Slots */}
      <div className="mt-auto px-2 pb-6 space-y-3">
        <button className="w-full flex justify-center items-center gap-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-sm font-bold py-4 rounded-2xl hover:bg-indigo-500/20 hover:text-indigo-300 transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)]">
          <Headset size={20} weight="fill" /> 
          <span>Suporte Tático</span>
        </button>
        <button onClick={signOut} className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-transparent transition-all">
          <SignOut size={24} weight="bold" />
          <span className="text-sm font-medium tracking-wide">Desconectar</span>
        </button>
      </div>
    </aside>
  )
}
