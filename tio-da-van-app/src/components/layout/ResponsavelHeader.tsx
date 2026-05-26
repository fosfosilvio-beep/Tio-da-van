'use client'

import { useState } from 'react'
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

export function ResponsavelHeader() {
  const { perfil, signOut } = useAuth()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const pageTitle =
    navItems.find(n => pathname === n.href || pathname.startsWith(`${n.href}/`))?.label
    ?? 'Elite Logistics'

  return (
    <>
      <header className="bg-primary text-on-primary fixed top-0 w-full z-50 shadow-md flex justify-between items-center px-gutter py-base md:w-[calc(100%-16rem)] md:left-64 h-16">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-on-primary active:scale-95 duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="text-headline-md font-bold text-white md:hidden">Elite Logistics</span>
          <span className="text-headline-md font-bold text-white hidden md:block">{pageTitle}</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-primary-container/50 transition-colors active:scale-95 duration-200">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 rounded-full hover:bg-primary-container/50 transition-colors active:scale-95 duration-200 hidden md:block">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center overflow-hidden border-2 border-primary-container cursor-pointer">
            {perfil?.avatar_url ? (
              <img src={perfil.avatar_url} alt={perfil.nome} className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-primary text-[20px]">person</span>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[60] transform transition-transform duration-300 md:hidden ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
        <aside className="absolute left-0 top-0 bottom-0 w-64 bg-surface-container-lowest flex flex-col p-card-padding shadow-xl z-50">
          <div className="flex justify-between items-center mb-8 px-1">
            <div>
              <h1 className="text-headline-sm font-bold text-primary">Elite Logistics</h1>
              <p className="text-label-md text-on-surface-variant mt-0.5">Gestão de Transporte</p>
            </div>
            <button onClick={() => setMenuOpen(false)} className="text-on-surface-variant p-1">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map(({ href, icon, label }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
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

          <div className="pt-4 border-t border-outline-variant space-y-1">
            <button className="w-full flex justify-center items-center gap-2 bg-primary text-on-primary text-label-lg py-3 rounded-lg hover:bg-primary/90 transition-colors">
              <span className="material-symbols-outlined text-[18px]">headset_mic</span>
              Suporte
            </button>
            <button
              onClick={() => { setMenuOpen(false); signOut() }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all"
            >
              <span className="material-symbols-outlined text-[22px]">logout</span>
              <span className="text-label-lg">Sair</span>
            </button>
          </div>
        </aside>
      </div>
    </>
  )
}
