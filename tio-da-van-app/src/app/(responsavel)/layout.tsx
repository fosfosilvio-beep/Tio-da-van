import { ReactNode } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meu Painel | Tio da Van',
}

export default function ResponsavelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-0 md:p-6">
      {children}
    </div>
  )
}
