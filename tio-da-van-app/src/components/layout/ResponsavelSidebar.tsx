'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'

const navItems = [
  { href: '/meu-painel',    icon: 'dashboard',   label: 'Dashboard' },
  { href: '/meus-filhos',   icon: 'child_care',  label: 'Meus Filhos' },
  { href: '/mensalidades',  icon: 'payments',    label: 'Financeiro' },
  { href: '/mensagens',     icon: 'chat',        label: 'Mensagens' },
  { href: '/configuracoes', icon: 'settings',    label: 'Configurações' },
]

export function ResponsavelSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <aside className="hidden md:flex flex-col p-card-padding h-full border-r border-outline-variant bg-surface-container-lowest fixed left-0 top-0 w-64 shadow-sm z-40 pt-20">

      {/* Brand */}
      <div className="mb-8 px-1">
        <h1 className="text-headline-md font-bold text-primary">Elite Logistics</h1>
        <p className="text-label-md text-on-surface-variant mt-0.5">Gestão de Transporte</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px] shrink-0"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {icon}
              </span>
              <span className="text-label-lg">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="pt-4 border-t border-outline-variant space-y-1">
        <button className="w-full flex justify-center items-center gap-2 bg-primary text-on-primary text-label-lg py-3 rounded-lg hover:bg-primary/90 transition-colors">
          <span className="material-symbols-outlined text-[18px]">headset_mic</span>
          Suporte
        </button>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all"
        >
          <span className="material-symbols-outlined text-[22px]">logout</span>
          <span className="text-label-lg">Sair</span>
        </button>
      </div>
    </aside>
  )
}
