import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { ResponsavelHeader } from '@/components/layout/ResponsavelHeader'
import { ResponsavelSidebar } from '@/components/layout/ResponsavelSidebar'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Elite Logistics | Pais & Responsáveis (Wowdash)',
}

export default function ResponsavelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#0f172a] text-slate-200 min-h-screen flex font-sans antialiased selection:bg-cyan-500/30">
      {/* Background Decorative Glow */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Sidebar Slot Container */}
      <div className="hidden md:block w-72 p-4 relative z-20">
        <ResponsavelSidebar />
      </div>

      <div className="flex-1 flex flex-col min-h-screen relative z-10 w-full">
        <ResponsavelHeader />
        <main className="flex-1 p-4 md:p-6 md:pt-6 pt-24 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
