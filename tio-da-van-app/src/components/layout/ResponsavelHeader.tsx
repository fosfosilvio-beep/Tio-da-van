'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Bell,
  Menu,
  X,
  LayoutDashboard,
  MapPinned,
  Wallet,
  MessageSquare,
  Settings,
  Headset,
  LogOut,
  User,
  Truck,
} from 'lucide-react'

const navItems = [
  { href: '/meu-painel',    Icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/meus-filhos',   Icon: MapPinned,       label: 'Rastreamento' },
  { href: '/mensalidades',  Icon: Wallet,          label: 'Financeiro' },
  { href: '/mensagens',     Icon: MessageSquare,   label: 'Mensagens' },
  { href: '/configuracoes', Icon: Settings,        label: 'Configurações' },
]

export function ResponsavelHeader() {
  const { perfil, signOut } = useAuth()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const currentTitle =
    navItems.find(n => pathname === n.href || pathname.startsWith(`${n.href}/`))?.label ?? 'Elite Logistics'

  const initials = perfil?.nome
    ?.split(' ')
    .map(s => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? 'U'

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 px-4 md:px-6 md:left-64">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-bold tracking-tight text-foreground truncate">{currentTitle}</h2>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Notificações">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full p-1 hover:bg-accent transition-colors">
                <Avatar className="h-8 w-8">
                  {perfil?.avatar_url ? <AvatarImage src={perfil.avatar_url} alt={perfil.nome ?? ''} /> : null}
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold truncate">{perfil?.nome ?? 'Usuário'}</span>
                  <span className="text-xs text-muted-foreground font-normal truncate">{perfil?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/configuracoes" className="cursor-pointer">
                  <User className="h-4 w-4" /> Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/configuracoes" className="cursor-pointer">
                  <Settings className="h-4 w-4" /> Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-sidebar text-sidebar-foreground flex flex-col shadow-2xl">
            <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-sidebar-border">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <Truck className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base font-bold leading-tight">Elite Logistics</h1>
                  <p className="text-xs text-muted-foreground leading-tight">Transporte Escolar</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)} aria-label="Fechar menu">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map(({ href, Icon, label }) => {
                const isActive = pathname === href || pathname.startsWith(`${href}/`)
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
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

            <div className="p-3 space-y-1">
              <Button className="w-full" size="sm">
                <Headset className="h-4 w-4" />
                Suporte
              </Button>
              <button
                onClick={() => { setMenuOpen(false); signOut() }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent transition-colors"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                Sair
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  )
}
