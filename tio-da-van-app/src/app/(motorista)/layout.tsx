import { Header } from '@/components/layout/Header'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: { default: 'Painel', template: '%s | Tio da Van' },
}

export default function MotoristaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
