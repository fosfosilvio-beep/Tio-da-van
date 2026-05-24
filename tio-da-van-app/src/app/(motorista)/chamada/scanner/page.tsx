'use client'

import { useState } from 'react'
import { QRCodeScanner } from '@/components/qrcode/QRCodeScanner'
import { CheckCircle, X, Student, Camera } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

export default function ScannerPage() {
  const [scannedAlunos, setScannedAlunos] = useState<string[]>([])
  const [lastScan, setLastScan] = useState<{ id: string, time: string, status: 'success' | 'error' } | null>(null)

  const handleScanSuccess = (decodedText: string) => {
    // Evita duplicatas nos últimos segundos
    if (scannedAlunos.includes(decodedText)) return
    
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    
    // Simulando consulta ao banco para pegar nome do aluno
    setLastScan({ id: decodedText, time: now, status: 'success' })
    setScannedAlunos(prev => [decodedText, ...prev])
    
    // Aqui seria chamada a API para dar baixa no aluno e disparar notificação ao pai
    console.log(`Baixa do aluno ${decodedText} efetuada às ${now}`)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Camera weight="fill" className="text-[var(--accent-primary)]" />
            Embarque Expresso
          </h1>
          <p className="text-[var(--text-muted)] text-sm">Escaneie o crachá para dar baixa instantânea</p>
        </div>
        <Link 
          href="/chamada"
          className="px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg text-sm font-medium border border-[var(--border-color)] transition-colors"
        >
          Lista Manual
        </Link>
      </header>

      {/* Área do Scanner */}
      <div className="mt-8">
        <QRCodeScanner onScanSuccess={handleScanSuccess} />
      </div>

      {/* Feedback do último bip */}
      {lastScan && lastScan.status === 'success' && (
        <div className="glass-card bg-[var(--accent-success)]/10 border-[var(--accent-success)]/30 p-4 rounded-xl flex items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-[var(--accent-success)]/20 flex items-center justify-center text-[var(--accent-success)]">
            <CheckCircle weight="fill" size={28} />
          </div>
          <div>
            <h3 className="font-bold text-[var(--accent-success)]">Aluno Embarcado!</h3>
            <p className="text-sm text-[var(--text-primary)]">ID: {lastScan.id} — Registrado às {lastScan.time}</p>
          </div>
        </div>
      )}

      {/* Log de embarcados */}
      <div className="mt-8">
        <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">
          Últimos Embarques
        </h3>
        
        {scannedAlunos.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-[var(--border-color)] rounded-xl">
            <p className="text-[var(--text-muted)]">Aguardando o primeiro bip...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scannedAlunos.slice(0, 5).map((id, idx) => (
              <div key={idx} className="glass-card p-4 rounded-xl flex justify-between items-center animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
                    <Student size={20} className="text-[var(--text-secondary)]" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Aluno {id.substring(0, 5)}...</p>
                    <p className="text-xs text-[var(--accent-success)] flex items-center gap-1">
                      <CheckCircle weight="fill" /> Confirmado
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
