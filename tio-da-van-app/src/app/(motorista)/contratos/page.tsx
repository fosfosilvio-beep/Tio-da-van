'use client'

import { useState } from 'react'
import { useContratos } from '@/hooks/useOcorrencias'
import { criarContrato, atualizarStatusContrato } from '@/lib/actions/ocorrencias-contratos'
import { useAlunos } from '@/hooks/useAlunos'
import { FileText, Plus, Check, X, Clock } from '@phosphor-icons/react'

const STATUS_CONFIG: Record<string, { label: string; class: string; icon: React.ReactNode }> = {
  ativo:     { label: 'Ativo',     class: 'pill-embarcado',    icon: <Check size={13} weight="bold" /> },
  encerrado: { label: 'Encerrado', class: 'pill-desembarcado', icon: <X size={13} weight="bold" /> },
  pendente:  { label: 'Pendente',  class: 'pill-aguardando',   icon: <Clock size={13} weight="fill" /> },
}

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function ContratosPage() {
  const [filtroStatus, setFiltroStatus] = useState('')
  const { contratos, loading, recarregar } = useContratos({ status: filtroStatus || undefined })
  const { alunos } = useAlunos({ ativo: true })
  const [showModal, setShowModal] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [form, setForm] = useState({
    aluno_id: '', valor_mensal: '', data_inicio: new Date().toISOString().split('T')[0], data_fim: '',
    dia_vencimento: '10', observacoes: '',
  })

  const handleCriar = async () => {
    if (!form.aluno_id || !form.valor_mensal) return
    setSalvando(true)
    await criarContrato({
      aluno_id: form.aluno_id,
      motorista_id: '',
      valor_mensal: parseFloat(form.valor_mensal),
      data_inicio: form.data_inicio,
      data_fim: form.data_fim || null,
      dia_vencimento: parseInt(form.dia_vencimento),
      observacoes: form.observacoes || null,
      status: 'ativo',
    } as any)
    setShowModal(false)
    setForm({ aluno_id: '', valor_mensal: '', data_inicio: new Date().toISOString().split('T')[0], data_fim: '', dia_vencimento: '10', observacoes: '' })
    await recarregar()
    setSalvando(false)
  }

  const handleEncerrar = async (id: string) => {
    if (!confirm('Encerrar este contrato?')) return
    await atualizarStatusContrato(id, 'encerrado')
    await recarregar()
  }

  const totalAtivos = contratos.filter(c => c.status === 'ativo').length
  const receitaMensal = contratos
    .filter(c => c.status === 'ativo')
    .reduce((acc, c) => acc + (c.valor_mensal ?? 0), 0)

  return (
    <div className="contratos-page">
      {/* Header */}
      <div className="page-header animate-fade-in">
        <div>
          <h1 className="page-title"><FileText weight="fill" size={28} /> Contratos</h1>
          <p className="page-sub">{totalAtivos} ativos · Receita mensal: {fmt(receitaMensal)}</p>
        </div>
        <button className="btn btn-primary btn-md" onClick={() => setShowModal(true)}>
          <Plus size={18} weight="bold" /> Novo contrato
        </button>
      </div>

      {/* Filtros */}
      <div className="glass-card filtros-bar animate-fade-in">
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Status:</span>
        {['', 'ativo', 'pendente', 'encerrado'].map(s => (
          <button key={s} className={`filtro-btn ${filtroStatus === s ? 'filtro-ativo' : ''}`}
            onClick={() => setFiltroStatus(s)}>
            {s ? STATUS_CONFIG[s].label : 'Todos'}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100 }} />)}
        </div>
      ) : contratos.length === 0 ? (
        <div className="empty-state glass-card animate-fade-in">
          <FileText size={56} color="var(--text-muted)" weight="thin" />
          <p style={{ color: 'var(--text-muted)' }}>Nenhum contrato cadastrado.</p>
          <button className="btn btn-primary btn-md" onClick={() => setShowModal(true)}><Plus size={16} /> Criar contrato</button>
        </div>
      ) : (
        <div className="contratos-list stagger-children">
          {contratos.map(contrato => {
            const aluno = (contrato as any).alunos
            const cfg = STATUS_CONFIG[contrato.status ?? 'ativo']
            return (
              <div key={contrato.id} className="contrato-card glass-card animate-fade-in">
                <div className="contrato-left">
                  <div className="contrato-avatar">
                    {aluno ? (
                      <img
                        src={aluno.foto_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(aluno.nome)}&background=6c63ff&color=fff&size=48`}
                        alt={aluno.nome}
                        style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                      />
                    ) : <div style={{ width: 44, height: 44, background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)' }} />}
                  </div>
                </div>
                <div className="contrato-content">
                  <div className="contrato-header">
                    <span className="contrato-nome">{aluno?.nome ?? '—'}</span>
                    <span className={`pill ${cfg.class}`} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 99, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {cfg.icon} {cfg.label}
                    </span>
                  </div>
                  <span className="contrato-escola">{aluno?.escola ?? '—'} {aluno?.serie ? `· ${aluno.serie}` : ''}</span>
                  <div className="contrato-meta">
                    <span>💰 {fmt(contrato.valor_mensal ?? 0)}/mês</span>
                    <span>📅 Vence dia {contrato.dia_vencimento}</span>
                    <span>🗓 Início: {contrato.data_inicio ? new Date(contrato.data_inicio + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}</span>
                    {contrato.data_fim && <span>Término: {new Date(contrato.data_fim + 'T00:00:00').toLocaleDateString('pt-BR')}</span>}
                  </div>
                </div>
                {contrato.status === 'ativo' && (
                  <button
                    className="btn btn-ghost btn-sm contrato-encerrar"
                    onClick={() => handleEncerrar(contrato.id!)}
                    title="Encerrar contrato"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card glass-card animate-fade-in" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <h3 className="modal-title"><FileText size={20} /> Novo Contrato</h3>
            <div className="modal-form">
              <div className="form-group">
                <label className="form-label">Aluno *</label>
                <select className="input-dark" value={form.aluno_id} onChange={e => setForm(p => ({ ...p, aluno_id: e.target.value }))}>
                  <option value="">Selecione...</option>
                  {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Valor mensal (R$) *</label>
                  <input className="input-dark" type="number" step="0.01" placeholder="Ex: 350.00"
                    value={form.valor_mensal} onChange={e => setForm(p => ({ ...p, valor_mensal: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Dia de vencimento</label>
                  <input className="input-dark" type="number" min="1" max="28"
                    value={form.dia_vencimento} onChange={e => setForm(p => ({ ...p, dia_vencimento: e.target.value }))} />
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Data de início</label>
                  <input className="input-dark" type="date" value={form.data_inicio}
                    onChange={e => setForm(p => ({ ...p, data_inicio: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Data de término (opcional)</label>
                  <input className="input-dark" type="date" value={form.data_fim}
                    onChange={e => setForm(p => ({ ...p, data_fim: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Observações</label>
                <textarea className="input-dark" rows={2} placeholder="Detalhes adicionais..."
                  value={form.observacoes} onChange={e => setForm(p => ({ ...p, observacoes: e.target.value }))}
                  style={{ resize: 'vertical', fontFamily: 'var(--font-primary)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button className="btn btn-ghost btn-md" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary btn-md" style={{ flex: 1, justifyContent: 'center' }} onClick={handleCriar} disabled={salvando}>
                {salvando ? 'Salvando...' : <><Plus size={16} /> Criar contrato</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .contratos-page { display:flex; flex-direction:column; gap:20px; max-width:1400px; margin:0 auto; }
        .page-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
        .page-title { font-family:var(--font-display); font-size:1.5rem; font-weight:800; color:var(--text-primary); margin:0 0 4px; display:flex; align-items:center; gap:10px; }
        .page-sub { color:var(--text-muted); font-size:0.875rem; margin:0; }
        .filtros-bar { padding:14px 20px; display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
        .filtro-btn { padding:6px 14px; background:var(--glass-bg); border:1px solid var(--border-glass); border-radius:var(--radius-md); color:var(--text-secondary); font-size:0.78rem; font-weight:600; cursor:pointer; transition:var(--transition-smooth); font-family:var(--font-primary); }
        .filtro-ativo { background:rgba(108,99,255,0.15); border-color:var(--accent-primary); color:var(--accent-primary); }
        .contratos-list { display:flex; flex-direction:column; gap:10px; }
        .contrato-card { padding:16px 20px; display:flex; align-items:center; gap:14px; }
        .contrato-left { flex-shrink:0; }
        .contrato-content { flex:1; display:flex; flex-direction:column; gap:4px; overflow:hidden; }
        .contrato-header { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
        .contrato-nome { font-weight:700; font-size:0.95rem; color:var(--text-primary); }
        .contrato-escola { font-size:0.78rem; color:var(--text-muted); }
        .contrato-meta { display:flex; gap:14px; flex-wrap:wrap; font-size:0.78rem; color:var(--text-muted); margin-top:4px; }
        .contrato-encerrar { padding:8px; color:var(--accent-warning); }
        .empty-state { padding:60px; display:flex; flex-direction:column; align-items:center; gap:16px; text-align:center; }
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; z-index:200; padding:24px; }
        .modal-card { width:100%; padding:28px; }
        .modal-title { font-family:var(--font-display); font-size:1.2rem; font-weight:700; color:var(--text-primary); margin:0 0 20px; display:flex; align-items:center; gap:8px; }
        .modal-form { display:flex; flex-direction:column; gap:12px; }
        .form-row-2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .form-group { display:flex; flex-direction:column; gap:6px; }
        .form-label { font-size:0.78rem; font-weight:500; color:var(--text-secondary); }
      `}</style>
    </div>
  )
}
