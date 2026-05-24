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

      <style jsx>{`
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 40;
          display: none;
        }

        @media (max-width: 1024px) {
          .sidebar-overlay { display: block; }
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--gradient-sidebar);
          border-right: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          z-index: 50;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
          overflow-x: hidden;
        }

        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%);
            box-shadow: var(--shadow-xl);
          }
          .sidebar.sidebar-open {
            transform: translateX(0);
          }
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 20px 16px;
        }

        .sidebar-logo-icon {
          width: 40px; height: 40px;
          background: var(--gradient-primary);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-glow-purple);
          flex-shrink: 0;
        }

        .sidebar-logo-text {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 800;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          flex: 1;
        }

        .sidebar-close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: none;
          padding: 4px;
          border-radius: var(--radius-sm);
          transition: var(--transition-fast);
        }

        .sidebar-close-btn:hover { color: var(--text-primary); }

        @media (max-width: 1024px) {
          .sidebar-close-btn { display: flex; }
        }

        .sidebar-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          margin: 4px 12px 0;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
        }

        .sidebar-avatar {
          width: 38px; height: 38px;
          background: var(--gradient-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
          color: white;
          flex-shrink: 0;
          overflow: hidden;
        }

        .sidebar-avatar img {
          width: 100%; height: 100%;
          object-fit: cover;
        }

        .sidebar-profile-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow: hidden;
        }

        .sidebar-profile-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-profile-role {
          font-size: 0.75rem;
          color: var(--accent-primary);
          font-weight: 500;
        }

        .sidebar-divider {
          height: 1px;
          background: var(--border-subtle);
          margin: 16px 20px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 0 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-nav-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          padding: 0 8px;
          margin: 0 0 8px;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: var(--transition-smooth);
          position: relative;
          overflow: hidden;
        }

        .sidebar-nav-item:hover {
          background: var(--glass-bg);
          color: var(--text-primary);
        }

        .sidebar-nav-item-active {
          background: rgba(108, 99, 255, 0.15);
          color: var(--accent-primary);
          border: 1px solid rgba(108, 99, 255, 0.2);
        }

        .sidebar-nav-item-active:hover {
          background: rgba(108, 99, 255, 0.2);
          color: var(--accent-primary);
        }

        .sidebar-nav-indicator {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: var(--accent-primary);
          border-radius: 3px 0 0 3px;
        }

        .sidebar-footer {
          padding: 0 0 16px;
        }

        .sidebar-signout {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 24px;
          width: 100%;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition-smooth);
          font-family: var(--font-primary);
        }

        .sidebar-signout:hover {
          color: var(--accent-warning);
        }
      `}</style>
    </>
  )
}
