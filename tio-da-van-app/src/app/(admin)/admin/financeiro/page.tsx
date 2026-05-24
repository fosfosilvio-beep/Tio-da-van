'use client'

import { CurrencyDollar, WhatsappLogo, WarningCircle, Receipt, ArrowUpRight } from '@phosphor-icons/react/dist/ssr'

export default function FinanceiroAdminPage() {
  
  // Mock Financeiro do Admin
  const repasses = [
    { id: 'mot-001', nome: 'Marcos Silva', ttv: 4500.00, comissao: 225.00, status: 'pago' },
    { id: 'mot-002', nome: 'Roberto Souza', ttv: 3200.00, comissao: 160.00, status: 'pago' },
    { id: 'mot-004', nome: 'Julio Cesar', ttv: 5100.00, comissao: 255.00, status: 'bloqueado_asaas' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-display font-bold flex items-center gap-3 text-white">
          <CurrencyDollar className="text-[var(--accent-success)]" weight="fill" />
          Financeiro & Split Asaas
        </h1>
        <p className="text-white/50 mt-1">
          Monitoramento do faturamento bruto da rede e recolhimento das comissões de 5%.
        </p>
      </header>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#060913] to-white/5 p-6 rounded-2xl border border-[var(--accent-success)]/30 shadow-[0_0_30px_rgba(46,204,113,0.1)] relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-xs font-bold text-[var(--accent-success)] uppercase tracking-wider">Receita Líquida Tio da Van</h3>
              <p className="text-4xl font-bold text-white mt-1">R$ 640,00</p>
              <p className="text-xs text-white/50 mt-1">Recolhido automaticamente via Split (Mês Atual)</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[var(--accent-success)]/20 flex items-center justify-center border border-[var(--accent-success)]/30">
              <Receipt size={24} className="text-[var(--accent-success)]" weight="fill" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">TTV (Total Transaction Volume)</h3>
              <p className="text-4xl font-bold text-white mt-1">R$ 12.800,00</p>
              <p className="text-xs text-white/50 mt-1">Movimentado pelos Motoristas na Plataforma</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
              <ArrowUpRight size={24} className="text-white/70" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Inadimplência e Repasses */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Status de Repasse por Motorista</h2>
        <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#060913] border-b border-white/5 text-[0.65rem] uppercase tracking-widest text-white/50">
                <th className="p-5 font-bold">Motorista</th>
                <th className="p-5 font-bold">Faturamento (Dele)</th>
                <th className="p-5 font-bold">Sua Comissão (5%)</th>
                <th className="p-5 font-bold">Status do Asaas</th>
                <th className="p-5 font-bold text-right">Cobrança/Alerta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {repasses.map(r => (
                <tr key={r.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-5 font-bold text-sm text-white">{r.nome}</td>
                  <td className="p-5 text-sm text-white/70">R$ {r.ttv.toFixed(2)}</td>
                  <td className="p-5 text-sm font-bold text-[var(--accent-success)]">R$ {r.comissao.toFixed(2)}</td>
                  <td className="p-5">
                    {r.status === 'pago' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider bg-[var(--accent-success)]/10 text-[var(--accent-success)] border border-[var(--accent-success)]/20">
                        Liquidado Automático
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider bg-[var(--accent-danger)]/10 text-[var(--accent-danger)] border border-[var(--accent-danger)]/20 shadow-[0_0_10px_rgba(255,107,107,0.2)]">
                        <WarningCircle weight="fill" /> Falha no Split / Bloqueado
                      </span>
                    )}
                  </td>
                  <td className="p-5 text-right">
                    {r.status !== 'pago' ? (
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-xs font-bold rounded-lg border border-[#25D366]/30 transition-all shadow-[0_0_15px_rgba(37,211,102,0.15)]">
                        <WhatsappLogo size={16} weight="fill" /> Notificar Pendência
                      </button>
                    ) : (
                      <span className="text-xs text-white/30 italic">Tudo Certo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
