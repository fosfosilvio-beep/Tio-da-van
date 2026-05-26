import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { ResponsavelHeader } from '@/components/layout/ResponsavelHeader'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Meu Painel | Tio da Van',
}

export default function ResponsavelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <ResponsavelHeader />
      <main className="max-w-4xl mx-auto p-4 md:p-6 pb-24">
        {children}
      </main>
    </div>
  )
}
