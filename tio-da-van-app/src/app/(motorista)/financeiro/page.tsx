'use client'

import { useState } from 'react'
import { useFinanceiro } from '@/hooks/useFinanceiro'
import { atualizarStatusCobranca, enviarLembreteCobranca, criarDespesa } from '@/lib/actions/financeiro'
import {
  CurrencyDollar, ArrowUp, ArrowDown, TrendUp,
  WhatsappLogo, Check, Plus, Receipt, ChartBar
} from '@phosphor-icons/react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const MESES = ['2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09','2026-10','2026-11','2026-12']
const MES_LABELS: Record<string, string> = { '01':'Jan','02':'Fev','03':'Mar','04':'Abr','05':'Mai','06':'Jun','07':'Jul','08':'Ago','09':'Set','10':'Out','11':'Nov','12':'Dez' }
const CAT_COLORS: Record<string, string> = { combustivel:'#ffd93d', manutencao:'#ff6b6b', seguro:'#6c63ff', multa:'#00d4aa', outros:'#3b82f6' }
const CAT_LABELS: Record<string, string> = { combustivel:'Combustível', manutencao:'Manutenção', seguro:'Seguro', multa:'Multa', outros:'Outros' }

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function FinanceiroPage() {
  const mesAtual = new Date().toISOString().slice(0,7)
  const [mes, setMes] = useState(mesAtual)
  const { resumo, despesas, loading, recarregar, despesasPorCategoria, cobrancasPendentes, cobrancasVencidas, cobrancasPagas, taxaAdimplencia } = useFinanceiro(mes)
  const [tab, setTab] = useState<'cobrancas' | 'despesas'>('cobrancas')
  const [showNovaDespesa, setShowNovaDespesa] = useState(false)
  const [novaDespesa, setNovaDespesa] = useState({ categoria: 'combustivel', valor: '', descricao: '', data_despesa: new Date().toISOString().split('T')[0] })
  const [actionPending, setActionPending] = useState<string | null>(null)

  const pieData = Object.entries(despesasPorCategoria).map(([cat, val]) => ({
    name: CAT_LABELS[cat] ?? cat, value: val, color: CAT_COLORS[cat] ?? '#888'
  }))

  const handleMarcarPago = async (id: string) => {
    setActionPending(id)
    await atualizarStatusCobranca(id, 'pago', new Date().toISOString().split('T')[0])
    await recarregar()
    setActionPending(null)
  }

  const handleLembrete = async (id: string) => {
    setActionPending(id)
    await enviarLembreteCobranca(id)
    setActionPending(null)
  }

  const handleCriarDespesa = async () => {
    if (!novaDespesa.valor || !novaDespesa.descricao) return
    await criarDespesa({ ...novaDespesa, valor: parseFloat(novaDespesa.valor), motorista_id: '' } as any)
    setShowNovaDespesa(false)
    setNovaDespesa({ categoria: 'combustivel', valor: '', descricao: '', data_despesa: new Date().toISOString().split('T')[0] })
    await recarregar()
  }

  const cobrancasAtivas = [...cobrancasVencidas, ...cobrancasPendentes, ...cobrancasPagas]

  return (
    <div className="fin-page">
      {/* Header */}
      <div className="page-header animate-fade-in">
        <div>
          <h1 className="page-title"><CurrencyDollar weight="fill" size={28} /> Financeiro</h1>
          <p className="page-sub">Receitas, despesas e cobranças</p>
        </div>
        <select className="input-dark" style={{ width: 160 }} value={mes} onChange={e => setMes(e.target.value)}>
          {MESES.map(m => <option key={m} value={m}>{MES_LABELS[m.split('-')[1]]} {m.split('-')[0]}</option>)}
        </select>
      </div>

      {/* KPI Cards */}
      <div className="fin-kpis stagger-children">
        {[
          { label:'Receita', value: fmt(resumo.receita), color:'green', icon:<ArrowUp size={22} weight="bold" /> },
          { label:'Despesas', value: fmt(resumo.despesas), color:'red', icon:<ArrowDown size={22} weight="bold" /> },
          { label:'Lucro Líquido', value: fmt(resumo.lucro), color: resumo.lucro >= 0 ? 'green' : 'red', icon:<TrendUp size={22} weight="bold" /> },
          { label:'Adimplência', value: `${taxaAdimplencia}%`, color:'purple', icon:<ChartBar size={22} weight="bold" /> },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className={`fin-kpi glass-card animate-fade-in kpi-${color}`}>
            <div className="kpi-icon">{icon}</div>
            <div className="kpi-value">{value}</div>
            <div className="kpi-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Gráficos + Tabela */}
      <div className="fin-grid">
        {/* Pie chart despesas */}
        <div className="glass-card fin-chart animate-fade-in">
          <h2 className="section-title" style={{ margin:'0 0 16px', fontSize:'0.9rem' }}>Despesas por categoria</h2>
          {pieData.length > 0 ? (
            <>
              <PieChart width={200} height={160}>
                <Pie data={pieData} cx={95} cy={75} innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                  {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v: any) => fmt(v)} contentStyle={{ background:'var(--bg-secondary)', border:'1px solid var(--border-glass)', borderRadius:8, color:'white', fontSize:12 }} />
              </PieChart>
              <div className="pie-legend">
                {pieData.map(d => (
                  <div key={d.name} className="pie-legend-item">
                    <span className="pie-dot" style={{ background: d.color }} />
                    <span>{d.name}</span>
                    <span className="pie-val">{fmt(d.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', textAlign:'center', padding:'20px 0' }}>Sem despesas neste mês</p>}
        </div>

        {/* Tabela cobranças / despesas */}
        <div className="glass-card fin-table animate-fade-in">
          <div className="fin-tabs">
            <button className={`fin-tab ${tab === 'cobrancas' ? 'tab-active' : ''}`} onClick={() => setTab('cobrancas')}>
              <Receipt size={16} /> Cobranças ({cobrancasAtivas.length})
            </button>
            <button className={`fin-tab ${tab === 'despesas' ? 'tab-active' : ''}`} onClick={() => setTab('despesas')}>
              <ArrowDown size={16} /> Despesas ({despesas.length})
            </button>
          </div>

          {tab === 'cobrancas' ? (
            <div className="table-list">
              {cobrancasAtivas.length === 0 && <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', textAlign:'center', padding:'20px 0' }}>Nenhuma cobrança neste mês</p>}
              {cobrancasAtivas.map((cob: any) => (
                <div key={cob.id} className="table-row">
                  <div className="row-info">
                    <span className="row-nome">{cob.alunos?.nome ?? 'Aluno'}</span>
                    <span className="row-sub">Vence {new Date(cob.data_vencimento).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <span className="row-valor">{fmt(cob.valor)}</span>
                  <span className={`pill pill-${cob.status}`} style={{ fontSize:'0.7rem', padding:'2px 8px', borderRadius:99 }}>{cob.status}</span>
                  {cob.status !== 'pago' && (
                    <div className="row-actions">
                      <button className="row-action-btn btn-pay" disabled={actionPending === cob.id} onClick={() => handleMarcarPago(cob.id)} title="Marcar como pago">
                        <Check size={14} weight="bold" />
                      </button>
                      <button className="row-action-btn btn-whats" disabled={actionPending === cob.id} onClick={() => handleLembrete(cob.id)} title="Enviar lembrete WhatsApp">
                        <WhatsappLogo size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="table-list">
              <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:12 }}>
                <button className="btn-primary" style={{ fontSize:'0.82rem', padding:'7px 14px' }} onClick={() => setShowNovaDespesa(true)}>
                  <Plus size={14} /> Nova despesa
                </button>
              </div>
              {despesas.length === 0 && <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', textAlign:'center', padding:'20px 0' }}>Nenhuma despesa neste mês</p>}
              {despesas.map((d: any) => (
                <div key={d.id} className="table-row">
                  <div className="row-cat-dot" style={{ background: CAT_COLORS[d.categoria] ?? '#888' }} />
                  <div className="row-info">
                    <span className="row-nome">{d.descricao}</span>
                    <span className="row-sub">{CAT_LABELS[d.categoria] ?? d.categoria} · {new Date(d.data_despesa).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <span className="row-valor" style={{ color:'var(--accent-warning)' }}>-{fmt(d.valor)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal nova despesa */}
      {showNovaDespesa && (
        <div className="modal-overlay" onClick={() => setShowNovaDespesa(false)}>
          <div className="modal-card glass-card animate-fade-in" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Nova Despesa</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <select className="input-dark" value={novaDespesa.categoria} onChange={e => setNovaDespesa(p => ({ ...p, categoria: e.target.value }))}>
                {Object.entries(CAT_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <input className="input-dark" placeholder="Descrição" value={novaDespesa.descricao} onChange={e => setNovaDespesa(p => ({ ...p, descricao: e.target.value }))} />
              <input className="input-dark" type="number" placeholder="Valor (R$)" step="0.01" value={novaDespesa.valor} onChange={e => setNovaDespesa(p => ({ ...p, valor: e.target.value }))} />
              <input className="input-dark" type="date" value={novaDespesa.data_despesa} onChange={e => setNovaDespesa(p => ({ ...p, data_despesa: e.target.value }))} />
            </div>
            <div style={{ display:'flex', gap:8, marginTop:20 }}>
              <button className="btn-ghost" style={{ flex:1, justifyContent:'center' }} onClick={() => setShowNovaDespesa(false)}>Cancelar</button>
              <button className="btn-primary" style={{ flex:1, justifyContent:'center' }} onClick={handleCriarDespesa}>
                <Plus size={14} /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .fin-page { display:flex; flex-direction:column; gap:20px; max-width:1400px; margin:0 auto; }
        .page-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
        .page-title { font-family:var(--font-display); font-size:1.5rem; font-weight:800; color:var(--text-primary); margin:0 0 4px; display:flex; align-items:center; gap:10px; }
        .page-sub { color:var(--text-muted); font-size:0.875rem; margin:0; }
        .fin-kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
        @media(max-width:1000px) { .fin-kpis { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:500px) { .fin-kpis { grid-template-columns:1fr; } }
        .fin-kpi { padding:18px; cursor:default; }
        .kpi-icon { width:40px; height:40px; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; margin-bottom:12px; }
        .kpi-green .kpi-icon { background:rgba(0,212,170,0.15); color:var(--accent-secondary); }
        .kpi-red .kpi-icon { background:rgba(255,107,107,0.15); color:var(--accent-warning); }
        .kpi-purple .kpi-icon { background:rgba(108,99,255,0.15); color:var(--accent-primary); }
        .kpi-gold .kpi-icon { background:rgba(255,217,61,0.15); color:var(--accent-gold); }
        .kpi-value { font-family:var(--font-display); font-size:1.5rem; font-weight:800; color:var(--text-primary); }
        .kpi-label { font-size:0.78rem; color:var(--text-muted); margin-top:4px; }
        .fin-grid { display:grid; grid-template-columns:280px 1fr; gap:16px; align-items:start; }
        @media(max-width:900px) { .fin-grid { grid-template-columns:1fr; } }
        .fin-chart { padding:20px; }
        .pie-legend { display:flex; flex-direction:column; gap:8px; margin-top:12px; }
        .pie-legend-item { display:flex; align-items:center; gap:8px; font-size:0.8rem; color:var(--text-secondary); }
        .pie-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
        .pie-val { margin-left:auto; font-weight:600; color:var(--text-primary); }
        .fin-table { padding:20px; }
        .fin-tabs { display:flex; gap:4px; margin-bottom:16px; }
        .fin-tab { flex:1; padding:8px 12px; background:var(--glass-bg); border:1px solid var(--border-glass); border-radius:var(--radius-md); color:var(--text-secondary); font-size:0.82rem; font-weight:600; cursor:pointer; transition:var(--transition-smooth); display:flex; align-items:center; gap:6px; justify-content:center; font-family:var(--font-primary); }
        .tab-active { background:rgba(108,99,255,0.15); border-color:var(--accent-primary); color:var(--accent-primary); }
        .table-list { display:flex; flex-direction:column; gap:2px; max-height:420px; overflow-y:auto; }
        .table-row { display:flex; align-items:center; gap:10px; padding:10px 8px; border-radius:var(--radius-md); transition:var(--transition-fast); }
        .table-row:hover { background:var(--glass-bg); }
        .row-cat-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
        .row-info { flex:1; display:flex; flex-direction:column; gap:2px; overflow:hidden; }
        .row-nome { font-size:0.875rem; font-weight:600; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .row-sub { font-size:0.72rem; color:var(--text-muted); }
        .row-valor { font-size:0.875rem; font-weight:700; color:var(--text-primary); white-space:nowrap; }
        .row-actions { display:flex; gap:4px; }
        .row-action-btn { width:28px; height:28px; border:none; border-radius:var(--radius-sm); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:var(--transition-fast); }
        .btn-pay { background:rgba(0,212,170,0.15); color:var(--accent-secondary); }
        .btn-pay:hover { background:rgba(0,212,170,0.3); }
        .btn-whats { background:rgba(0,212,170,0.15); color:#25d366; }
        .btn-whats:hover { background:rgba(0,212,170,0.3); }
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; z-index:200; padding:24px; }
        .modal-card { width:100%; max-width:420px; padding:28px; }
        .modal-title { font-family:var(--font-display); font-size:1.2rem; font-weight:700; color:var(--text-primary); margin:0 0 20px; }
        .section-title { font-family:var(--font-display); font-weight:700; color:var(--text-primary); }
      `}</style>
    </div>
  )
}
