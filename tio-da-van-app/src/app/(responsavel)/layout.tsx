import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { ResponsavelHeader } from '@/components/layout/ResponsavelHeader'
import { ResponsavelSidebar } from '@/components/layout/ResponsavelSidebar'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tio da Van | Central do Responsável',
}

export default function ResponsavelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#f8f9fa] text-slate-800 min-h-screen flex font-sans antialiased selection:bg-blue-500/20 selection:text-blue-900">
      
      {/* Sidebar Hub Container */}
      <div className="hidden md:block w-72 h-screen fixed left-0 top-0 z-20 border-r border-slate-200 bg-white">
        <ResponsavelSidebar />
      </div>

      <div className="flex-1 flex flex-col min-h-screen relative z-10 w-full md:ml-72">
        <ResponsavelHeader />
        
        <main className="flex-1 p-6 lg:p-8 pt-24 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
