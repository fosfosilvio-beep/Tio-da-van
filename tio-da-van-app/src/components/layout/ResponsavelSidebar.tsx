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
    { href: '/meus-filhos', icon: Users, label: 'Meus Filhos' },
    { href: '/mensalidades', icon: CurrencyDollar, label: 'Financeiro' },
    { href: '/mensagens', icon: ChatText, label: 'Mensagens' },
    { href: '/configuracoes', icon: Gear, label: 'Configurações' },
  ]

  return (
    <aside className="hidden md:flex flex-col p-4 h-full border-r border-[#e1e2e4] bg-white fixed left-0 top-0 w-64 shadow-sm z-40 pt-20">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-[#13345b]">Elite Logistics</h1>
        <p className="text-[12px] font-medium text-[#74777f] mt-1">Gestão de Transporte</p>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)
          
          if (isActive) {
            return (
              <Link key={href} href={href} className="flex items-center gap-3 p-3 rounded-lg bg-[#fdba5f] text-[#744900] font-bold transition-all">
                <Icon size={24} weight="fill" />
                <span className="text-sm">{label}</span>
              </Link>
            )
          }

          return (
            <Link key={href} href={href} className="flex items-center gap-3 p-3 rounded-lg text-[#43474e] hover:bg-[#f2f4f6] transition-all">
              <Icon size={24} weight="regular" />
              <span className="text-sm font-semibold">{label}</span>
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
  )
}
