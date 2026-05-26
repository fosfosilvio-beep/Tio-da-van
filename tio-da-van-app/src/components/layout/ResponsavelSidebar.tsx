'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  MapPinned,
  Wallet,
  MessageSquare,
  Settings,
  Headset,
  LogOut,
  Truck,
} from 'lucide-react'

const navItems = [
  { href: '/meu-painel',    Icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/meus-filhos',   Icon: MapPinned,       label: 'Rastreamento' },
  { href: '/mensalidades',  Icon: Wallet,          label: 'Financeiro' },
  { href: '/mensagens',     Icon: MessageSquare,   label: 'Mensagens' },
  { href: '/configuracoes', Icon: Settings,        label: 'Configurações' },
]

export function ResponsavelSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <aside className="hidden md:flex flex-col h-screen border-r border-sidebar-border bg-sidebar text-sidebar-foreground fixed left-0 top-0 w-64 z-40">

      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
          <Truck className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base font-bold text-sidebar-foreground leading-tight">Elite Logistics</h1>
          <p className="text-xs text-muted-foreground leading-tight">Transporte Escolar</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* Footer */}
      <div className="p-3 space-y-1">
        <Button className="w-full" size="sm">
          <Headset className="h-4 w-4" />
          Suporte
        </Button>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  )
}
