'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sidebar } from '@/components/layout/Sidebar'
import { useAuth } from '@/providers/AuthProvider'
import { List, BellSimple, MagnifyingGlass } from '@phosphor-icons/react'

type HeaderProps = {
  title?: string
}

export function Header({ title }: HeaderProps) {
  const { perfil } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <header className="app-header">
        <div className="header-left">
          <button
            id="btn-sidebar-toggle"
            className="header-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <List size={22} />
          </button>
          {title && <h1 className="header-title">{title}</h1>}
        </div>

        <div className="header-right">
          <button className="header-icon-btn" aria-label="Buscar">
            <MagnifyingGlass size={20} />
          </button>
          <button className="header-icon-btn header-notif-btn" aria-label="Notificações">
            <BellSimple size={20} />
            <span className="notif-badge" aria-label="3 notificações">3</span>
          </button>
          <Link href="/perfil" className="header-avatar" aria-label="Meu perfil">
            {perfil?.avatar_url ? (
              <img src={perfil.avatar_url} alt={perfil.nome} />
            ) : (
              <span>{perfil?.nome?.charAt(0)?.toUpperCase() ?? 'U'}</span>
            )}
          </Link>
        </div>
      </header>

      <style jsx>{`
        .app-header {
          position: fixed;
          top: 0;
          left: var(--sidebar-width);
          right: 0;
          height: var(--header-height);
          background: rgba(10, 10, 15, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          z-index: 30;
          transition: left var(--transition-smooth);
        }

        @media (max-width: 1024px) {
          .app-header { left: 0; }
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-menu-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 8px;
          border-radius: var(--radius-sm);
          display: none;
          transition: var(--transition-fast);
        }

        .header-menu-btn:hover { color: var(--text-primary); background: var(--glass-bg); }

        @media (max-width: 1024px) {
          .header-menu-btn { display: flex; }
        }

        .header-title {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-icon-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 8px;
          border-radius: var(--radius-sm);
          transition: var(--transition-fast);
          position: relative;
          display: flex;
          align-items: center;
        }

        .header-icon-btn:hover { color: var(--text-primary); background: var(--glass-bg); }

        .notif-badge {
          position: absolute;
          top: 4px; right: 4px;
          width: 16px; height: 16px;
          background: var(--accent-warning);
          border-radius: 50%;
          font-size: 0.6rem;
          font-weight: 700;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse-glow 2s infinite;
        }

        .header-avatar {
          width: 36px; height: 36px;
          background: var(--gradient-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
          color: white;
          overflow: hidden;
          text-decoration: none;
          border: 2px solid rgba(108, 99, 255, 0.4);
          transition: var(--transition-fast);
          margin-left: 8px;
        }

        .header-avatar:hover { border-color: var(--accent-primary); }

        .header-avatar img {
          width: 100%; height: 100%;
          object-fit: cover;
        }
      `}</style>
    </>
  )
}
