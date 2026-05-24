'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import {
  ShieldCheck, PresentationChart, UsersThree, CurrencyDollar,
  ShieldWarning, SignOut, Van
} from '@phosphor-icons/react/dist/ssr'

const adminNavItems = [
  { href: '/admin', icon: PresentationChart, label: 'Dashboard' },
  { href: '/admin/usuarios', icon: UsersThree, label: 'Gestão de Motoristas' },
  { href: '/admin/financeiro', icon: CurrencyDollar, label: 'Financeiro & Split' },
  { href: '/admin/auditoria', icon: ShieldWarning, label: 'Auditoria de Sistema' },
]

type AdminSidebarProps = {
  open: boolean
  onClose: () => void
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`w-64 h-screen fixed left-0 top-0 bg-[#060913] border-r border-white/5 flex flex-col z-50 shadow-2xl transition-transform duration-300 ${
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      {/* Logo e Branding */}
      <div className="flex items-center gap-3 p-6 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--accent-primary)] to-[#8c52ff] flex items-center justify-center shadow-[0_0_15px_rgba(108,99,255,0.4)]">
          <ShieldCheck size={24} weight="fill" color="#fff" />
        </div>
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg text-white leading-tight">Painel Master</h1>
          <p className="text-[0.65rem] text-[var(--accent-primary)] uppercase tracking-widest font-bold">Admin Console</p>
        </div>
        {/* Botão de Fechar no Mobile */}
        <button
          className="lg:hidden p-1 text-white/50 hover:text-white bg-white/5 rounded-md"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
          </svg>
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
        <p className="text-[0.65rem] text-white/40 uppercase tracking-widest font-bold mb-2 px-2">Comando</p>
        
        {adminNavItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden group ${
                isActive 
                  ? 'text-white bg-white/10 border border-white/5 shadow-inner' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon 
                size={20} 
                weight={isActive ? "fill" : "regular"} 
                className={isActive ? 'text-[var(--accent-primary)]' : 'group-hover:text-white transition-colors'} 
              />
              <span className="relative z-10">{label}</span>
              
              {/* Indicador de ativo */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--accent-primary)] rounded-r-md shadow-[0_0_10px_var(--accent-primary)]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Status da Plataforma */}
      <div className="p-4 mx-4 mb-4 rounded-xl bg-[#0B0F19] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-success)] opacity-10 blur-2xl rounded-full" />
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[var(--accent-success)] shadow-[0_0_8px_var(--accent-success)] animate-pulse" />
          <p className="text-xs font-bold text-white">Sistemas Operacionais</p>
        </div>
        <p className="text-[0.65rem] text-white/50">Todos os serviços online.</p>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-white/50 hover:text-[var(--accent-danger)] hover:bg-[var(--accent-danger)]/10 rounded-lg transition-colors font-medium"
        >
          <SignOut size={20} />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </aside>
    </>
  )
}
