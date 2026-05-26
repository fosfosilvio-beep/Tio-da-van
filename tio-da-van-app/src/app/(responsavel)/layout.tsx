import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { ResponsavelHeader } from '@/components/layout/ResponsavelHeader'
import { ResponsavelSidebar } from '@/components/layout/ResponsavelSidebar'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Elite Logistics | Pais & Responsáveis',
}

export default function ResponsavelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ResponsavelSidebar />
      <div className="md:pl-64 flex flex-col min-h-screen">
        <ResponsavelHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
