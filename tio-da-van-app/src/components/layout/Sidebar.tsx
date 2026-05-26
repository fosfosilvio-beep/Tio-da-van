'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import {
  Van, House, MapPin, UsersFour, CurrencyDollar,
  ClipboardText, FileText, Cake, BellSimple,
  SignOut, X
} from '@phosphor-icons/react'

const navItems = [
  { href: '/dashboard', icon: House, label: 'Dashboard' },
  { href: '/rotas', icon: MapPin, label: 'Rotas' },
  { href: '/chamada', icon: Van, label: 'Chamada' },
  { href: '/alunos', icon: UsersFour, label: 'Alunos' },
  { href: '/financeiro', icon: CurrencyDollar, label: 'Financeiro' },
  { href: '/ocorrencias', icon: ClipboardText, label: 'Ocorrências' },
  { href: '/contratos', icon: FileText, label: 'Contratos' },
  { href: '/aniversariantes', icon: Cake, label: 'Aniversariantes' },
]

type SidebarProps = {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { perfil, signOut } = useAuth()

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`} role="navigation" aria-label="Menu principal">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Van size={24} weight="fill" color="white" />
          </div>
          <span className="sidebar-logo-text">Tio da Van</span>
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Perfil do motorista */}
        {perfil && (
          <div className="sidebar-profile">
            <div className="sidebar-avatar">
              {perfil.avatar_url ? (
                <img src={perfil.avatar_url} alt={perfil.nome} />
              ) : (
                <span>{perfil.nome.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="sidebar-profile-info">
              <span className="sidebar-profile-name">{perfil.nome}</span>
              <span className="sidebar-profile-role">Motorista</span>
            </div>
          </div>
        )}

        {/* Divisor */}
        <div className="sidebar-divider" />

        {/* Navegação */}
        <nav className="sidebar-nav">
          <p className="sidebar-nav-label">Menu</p>
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={href}
                href={href}
                className={`sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
                <span>{label}</span>
                {isActive && <div className="sidebar-nav-indicator" />}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-divider" />
          <button
            id="btn-sidebar-signout"
            className="sidebar-signout"
            onClick={signOut}
          >
            <SignOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

    </>
  )
}
