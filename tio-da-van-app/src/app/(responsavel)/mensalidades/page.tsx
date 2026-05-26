'use client'

import { useState } from 'react'
import { Receipt, CheckCircle, Copy, FileText, QrCode } from '@phosphor-icons/react/dist/ssr'

export default function FinanceiroPaiPage() {
  const [copied, setCopied] = useState(false)

  // Mocks
  const faturaAtual = {
    mes: 'Maio / 2026',
    valor: 250.00,
    vencimento: '10/05/2026',
    status: 'aberta', // aberta, paga
    codigoPix: '00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***63041A2B'
  }

  const historico = [
    { mes: 'Abril / 2026', valor: 250.00, status: 'paga', dataPgto: '05/04/2026' },
    { mes: 'Março / 2026', valor: 250.00, status: 'paga', dataPgto: '10/03/2026' },
  ]

  const handleCopyPix = () => {
    navigator.clipboard.writeText(faturaAtual.codigoPix)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">
          <Receipt className="text-[var(--accent-primary)]" weight="fill" />
          Financeiro
        </h1>
        <p className="text-[var(--text-muted)] mt-1">Gestão de mensalidades do transporte.</p>
      </header>

      {/* Fatura Atual */}
      <section className="glass-card p-6 md:p-8 rounded-2xl relative overflow-hidden border border-[var(--border-color)]">
        {/* Decoração bg */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--accent-primary)] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Fatura Atual</h2>
            <p className="text-4xl font-bold text-[var(--text-primary)]">R$ {faturaAtual.valor.toFixed(2)}</p>
            <p className="text-sm mt-2 font-medium">Referência: <span className="text-[var(--text-primary)]">{faturaAtual.mes}</span></p>
            <p className="text-sm mt-1 font-medium text-[var(--accent-warning)]">Vencimento: {faturaAtual.vencimento}</p>
          </div>

          <div className="w-full md:w-auto flex flex-col gap-3">
            <button 
              onClick={handleCopyPix}
              className="btn btn-blue w-full py-3 px-6 text-base"
            >
              {copied ? <CheckCircle size={20} weight="bold" /> : <QrCode size={20} weight="bold" />}
              {copied ? 'Código Pix Copiado!' : 'Copiar Pix (Copia e Cola)'}
            </button>
            <button className="btn btn-ghost w-full py-3 px-6 text-base">
              <FileText size={20} weight="bold" />
              Baixar Boleto PDF
            </button>
          </div>
        </div>
      </section>

      {/* Histórico */}
      <section>
        <h3 className="text-lg font-bold mb-4">Histórico de Pagamentos</h3>
        <div className="glass-card rounded-2xl overflow-hidden border border-[var(--border-color)]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] text-xs uppercase tracking-wider text-[var(--text-muted)]">
                <th className="p-4 font-bold">Mês</th>
                <th className="p-4 font-bold">Valor</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Recibo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {historico.map((item, idx) => (
                <tr key={idx} className="hover:bg-[var(--bg-tertiary)] transition-colors">
                  <td className="p-4 font-medium">{item.mes}</td>
                  <td className="p-4 text-[var(--text-muted)]">R$ {item.valor.toFixed(2)}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-[var(--accent-success)]/10 text-[var(--accent-success)] border border-[var(--accent-success)]/20">
                      <CheckCircle weight="fill" /> Pago em {item.dataPgto}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="btn btn-ghost p-2">
                      <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
