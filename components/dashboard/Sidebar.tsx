"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { SidebarSection } from "@/lib/types";

// ── Definição da navegação ───────────────────────────────────────────
const sidebarSections: SidebarSection[] = [
  {
    title: "Principal",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: "📊" },
      { label: "Motoristas", href: "/dashboard/motoristas", icon: "🚐", badge: "5" },
      { label: "Alunos", href: "/dashboard/alunos", icon: "🎒" },
    ],
  },
  {
    title: "Financeiro",
    items: [
      { label: "Cobranças", href: "/dashboard/cobrancas", icon: "💳" },
      { label: "Faturamento", href: "/dashboard/faturamento", icon: "💰" },
    ],
  },
  {
    title: "Operações",
    items: [
      { label: "Rastreamento", href: "/dashboard/rastreamento", icon: "📍" },
      { label: "Configurações", href: "/dashboard/configuracoes", icon: "⚙️" },
    ],
  },
];

export default function Sidebar(): React.JSX.Element {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="sidebar" id="sidebar-nav">
      {/* ── Logo ────────────────────────────────────────── */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🚐</div>
        <span className="sidebar-logo-text">Tio da Van</span>
      </div>

      {/* ── Nav Sections ────────────────────────────────── */}
      {sidebarSections.map((section) => (
        <nav key={section.title} className="sidebar-section">
          <p className="sidebar-section-title">{section.title}</p>
          <ul className="sidebar-nav">
            {section.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`sidebar-nav-item ${isActive(item.href) ? "active" : ""}`}
                  id={`nav-${item.href.replace(/\//g, "-").slice(1)}`}
                >
                  <span className="sidebar-nav-icon">{item.icon}</span>
                  {item.label}
                  {item.badge && (
                    <span className="sidebar-nav-badge">{item.badge}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}

      {/* ── User Footer ─────────────────────────────────── */}
      <div className="sidebar-footer">
        <div className="sidebar-user-card" id="sidebar-user-card">
          <div className="sidebar-user-avatar">A</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">Admin Master</span>
            <span className="sidebar-user-role">Administrador</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
