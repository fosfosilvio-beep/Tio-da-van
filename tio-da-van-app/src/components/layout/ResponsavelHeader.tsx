'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import { House, Users, CurrencyDollar, BellSimple, SignOut, List, X, Van } from '@phosphor-icons/react'

export function ResponsavelHeader() {
  const { perfil, signOut } = useAuth()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { href: '/meu-painel', icon: House, label: 'Painel' },
    { href: '/meus-filhos', icon: Users, label: 'Meus Filhos' },
    { href: '/mensalidades', icon: CurrencyDollar, label: 'Financeiro' },
  ]

  return (
    <>
      <header className="responsavel-header">
        <div className="header-container">
          <Link href="/meu-painel" className="header-logo">
            <div className="logo-icon">
              <Van size={20} weight="fill" color="white" />
            </div>
            <span className="logo-text">Tio da Van</span>
          </Link>

          {/* Navegação Desktop */}
          <nav className="header-nav-desktop">
            {navItems.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <Link key={href} href={href} className={`nav-link ${isActive ? 'active' : ''}`}>
                  <Icon size={18} weight={isActive ? 'fill' : 'regular'} />
                  <span>{label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="header-actions">
            <Link href="/meu-painel/avisos" className="action-btn notif-btn">
              <BellSimple size={20} />
              <span className="notif-badge">2</span>
            </Link>

            <button className="action-btn menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <List size={24} />}
            </button>

            <div className="avatar-wrapper desktop-only">
              {perfil?.avatar_url ? (
                <img src={perfil.avatar_url} alt={perfil.nome} className="avatar-img" />
              ) : (
                <div className="avatar-fallback">{perfil?.nome?.charAt(0)?.toUpperCase() ?? 'U'}</div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Menu Mobile */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-profile">
          <div className="avatar-wrapper">
             {perfil?.avatar_url ? (
                <img src={perfil.avatar_url} alt={perfil.nome} className="avatar-img" />
              ) : (
                <div className="avatar-fallback">{perfil?.nome?.charAt(0)?.toUpperCase() ?? 'U'}</div>
              )}
          </div>
          <div className="profile-info">
            <span className="profile-name">{perfil?.nome}</span>
            <span className="profile-role">Responsável</span>
          </div>
        </div>

        <nav className="mobile-nav">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link key={href} href={href} className={`mobile-nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>

        <button className="mobile-signout" onClick={signOut}>
          <SignOut size={20} />
          <span>Sair da conta</span>
        </button>
      </div>

      <style jsx>{`
        .responsavel-header {
          background: #ffffff;
          border-bottom: 1px solid #dde1e7;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: #2d4b73;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          font-family: 'Manrope', sans-serif;
          font-weight: 800;
          font-size: 1.1rem;
          color: #2d4b73;
        }

        .header-nav-desktop {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        @media (max-width: 768px) {
          .header-nav-desktop { display: none; }
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          color: #718096;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .nav-link:hover { color: #2d4b73; }
        .nav-link.active { color: #2d4b73; }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .action-btn {
          background: none;
          border: none;
          color: #4a5568;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .action-btn:hover { background: #f8f9fb; }

        .notif-btn { position: relative; }
        .notif-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 14px;
          height: 14px;
          background: #e74c3c;
          border-radius: 50%;
          font-size: 8px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .menu-toggle { display: none; }
        @media (max-width: 768px) {
          .menu-toggle { display: flex; }
        }

        .avatar-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          background: #2d4b73;
        }

        .avatar-img { width: 100%; height: 100%; object-fit: cover; }
        .avatar-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
        }

        .desktop-only { display: block; }
        @media (max-width: 768px) {
          .desktop-only { display: none; }
        }

        /* Menu Mobile */
        .mobile-menu {
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          bottom: 0;
          background: #ffffff;
          z-index: 40;
          transform: translateY(-100%);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          padding: 20px;
        }

        .mobile-menu.open {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        .mobile-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 20px;
          border-bottom: 1px solid #dde1e7;
          margin-bottom: 20px;
        }

        .profile-info { display: flex; flex-direction: column; }
        .profile-name { font-weight: 700; color: #1a1c1e; }
        .profile-role { font-size: 0.8rem; color: #718096; }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          text-decoration: none;
          color: #4a5568;
          font-weight: 600;
        }

        .mobile-nav-link.active {
          background: #f8f9fb;
          color: #2d4b73;
        }

        .mobile-signout {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: none;
          border: none;
          color: #e74c3c;
          font-weight: 600;
          cursor: pointer;
          margin-top: auto;
        }
      `}</style>
    </>
  )
}
