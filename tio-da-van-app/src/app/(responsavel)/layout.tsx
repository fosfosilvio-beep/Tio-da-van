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
    <div className="bg-[#f8f9fb] text-[#191c1e] min-h-screen flex">
      <ResponsavelSidebar />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <ResponsavelHeader />
        <main className="flex-1 p-4 md:p-6 pt-24 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
