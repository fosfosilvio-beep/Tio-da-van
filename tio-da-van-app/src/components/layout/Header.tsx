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

    </>
  )
}
