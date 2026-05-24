import { ReactNode } from 'react'
import { AdminHeader } from '@/components/layout/AdminHeader'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-[var(--text-primary)] flex">
      {/* Header com Sidebar Mobile/Desktop embutida */}
      <AdminHeader />

      {/* Conteúdo Principal compensando a largura da Sidebar apenas no Desktop (lg:ml-64 = 16rem = 256px) */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        
        {/* Área renderizada das páginas */}
        <div className="p-4 lg:p-8 pb-20">
          {children}
        </div>
      </main>
    </div>
  )
}
