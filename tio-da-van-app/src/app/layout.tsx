import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/providers/AuthProvider'

export const metadata: Metadata = {
  title: {
    default: 'Tio da Van — Gestão Profissional de Transporte Escolar',
    template: '%s | Tio da Van',
  },
  description: 'Plataforma completa para gestão de rotas, alunos, cobranças e comunicação com responsáveis no transporte escolar.',
  keywords: ['transporte escolar', 'van escolar', 'gestão de rotas', 'chamada escolar'],
  authors: [{ name: 'Tio da Van' }],
  robots: 'noindex, nofollow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
