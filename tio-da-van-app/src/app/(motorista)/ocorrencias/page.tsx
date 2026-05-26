'use client'

import { useState } from 'react'
import { useOcorrencias } from '@/hooks/useOcorrencias'
import { criarOcorrencia } from '@/lib/actions/ocorrencias-contratos'
import { useAlunos } from '@/hooks/useAlunos'
import { Warning, Plus, SealWarning, Info, Fire } from '@phosphor-icons/react'

const TIPO_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  acidente:    { icon: <Fire size={16} weight="fill" />,       label: 'Acidente',   color: '#ff6b6b' },
  atraso:      { icon: <Warning size={16} weight="fill" />,    label: 'Atraso',     color: '#ffd93d' },
  falta:       { icon: <Info size={16} weight="fill" />,       label: 'Falta',      color: '#3b82f6' },
  comportamento:{ icon: <SealWarning size={16} weight="fill" />,label: 'Comportamento', color: '#f59e0b' },
  outro:       { icon: <Info size={16} weight="fill" />,       label: 'Outro',      color: '#6c63ff' },
}

const SEV_CONFIG: Record<string, { label: string; class: string }> = {
  baixa: { label: 'Baixa',  class: 'sev-baixa' },
  media: { label: 'Média',  class: 'sev-media' },
  alta:  { label: 'Alta',   class: 'sev-alta'  },
}

export default function OcorrenciasPage() {
  const { ocorrencias, loading, porSeveridade, recarregar } = useOcorrencias()
  const { alunos } = useAlunos({ ativo: true })
  const [showModal, setShowModal] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [filtroTipo, setFiltroTipo] = useState('')
  const [form, setForm] = useState({
    aluno_id: '', tipo: 'atraso', severidade: 'baixa',
    titulo: '', descricao: '', data_ocorrencia: new Date().toISOString().split('T')[0]
  })

  const ocorrenciasFiltradas = filtroTipo
    ? ocorrencias.filter(o => o.tipo === filtroTipo)
    : ocorrencias

  const handleCriar = async () => {
    if (!form.aluno_id || !form.titulo) return
    setSalvando(true)
    await criarOcorrencia({
      aluno_id: form.aluno_id,
      motorista_id: '',
      tipo: form.tipo as any,
      severidade: form.severidade as any,
      titulo: form.titulo,
      descricao: form.descricao || null,
      data_ocorrencia: form.data_ocorrencia,
    } as any)
    setShowModal(false)
    setForm({ aluno_id: '', tipo: 'atraso', severidade: 'baixa', titulo: '', descricao: '', data_ocorrencia: new Date().toISOString().split('T')[0] })
    await recarregar()
    setSalvando(false)
  }

  return (
    <div className="oco-page">
      {/* Header */}
      <div className="page-header animate-fade-in">
        <div>
          <h1 className="page-title"><Warning weight="fill" size={28} /> Ocorrências</h1>
          <p className="page-sub">Registro de incidentes e anotações</p>
        </div>
        <button className="btn btn-primary btn-md" onClick={() => setShowModal(true)}>
          <Plus size={18} weight="bold" /> Nova ocorrência
        </button>
      </div>

      {/* KPIs de severidade */}
      <div className="sev-kpis stagger-children">
        {[
          { label: 'Baixa severidade', value: porSeveridade.baixa, class: 'sev-card-baixa', icon: <Info size={20} /> },
          { label: 'Média severidade', value: porSeveridade.media, class: 'sev-card-media', icon: <Warning size={20} /> },
          { label: 'Alta severidade',  value: porSeveridade.alta,  class: 'sev-card-alta',  icon: <Fire size={20} /> },
        ].map(({ label, value, class: cls, icon }) => (
          <div key={label} className={`sev-card glass-card animate-fade-in ${cls}`}>
            <div className="sev-icon">{icon}</div>
            <div className="sev-value">{value}</div>
            <div className="sev-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="glass-card filtros-bar animate-fade-in">
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginRight: 8 }}>Filtrar por:</span>
        {['', ...Object.keys(TIPO_CONFIG)].map(tipo => (
          <button
            key={tipo}
            className={`filtro-btn ${filtroTipo === tipo ? 'filtro-ativo' : ''}`}
            onClick={() => setFiltroTipo(tipo)}
          >
            {tipo ? TIPO_CONFIG[tipo].label : 'Todos'}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 90 }} />)}
        </div>
      ) : ocorrenciasFiltradas.length === 0 ? (
        <div className="empty-state glass-card animate-fade-in">
          <Warning size={56} color="var(--text-muted)" weight="thin" />
          <p style={{ color: 'var(--text-muted)' }}>Nenhuma ocorrência registrada.</p>
        </div>
      ) : (
        <div className="oco-list stagger-children">
          {ocorrenciasFiltradas.map(oco => {
            const tipoConf = TIPO_CONFIG[oco.tipo ?? 'outro']
            const sevConf  = SEV_CONFIG[oco.severidade ?? 'baixa']
            const aluno = oco.alunos as any
            return (
              <div key={oco.id} className="oco-card glass-card animate-fade-in">
                <div className="oco-left" style={{ borderLeftColor: tipoConf.color }}>
                  <div className="oco-tipo-icon" style={{ background: `${tipoConf.color}22`, color: tipoConf.color }}>
                    {tipoConf.icon}
                  </div>
                </div>
                <div className="oco-content">
                  <div className="oco-header-row">
                    <span className="oco-titulo">{oco.titulo}</span>
                    <span className={`sev-badge ${sevConf.class}`}>{sevConf.label}</span>
                    <span className="oco-data">
                      {oco.data_ocorrencia ? new Date(oco.data_ocorrencia + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}
                    </span>
                  </div>
                  {aluno && (
                    <div className="oco-aluno">
                      <img
                        src={aluno.foto_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(aluno.nome)}&background=6c63ff&color=fff&size=32`}
                        alt={aluno.nome}
                        style={{ width: 22, height: 22, borderRadius: '50%' }}
                      />
                      <span>{aluno.nome} · {aluno.escola ?? '—'}</span>
                    </div>
                  )}
                  {oco.descricao && <p className="oco-desc">{oco.descricao}</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card glass-card animate-fade-in" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <h3 className="modal-title"><Warning size={20} /> Nova Ocorrência</h3>
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
                  <label className="form-label">Tipo</label>
                  <select className="input-dark" value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}>
                    {Object.entries(TIPO_CONFIG).map(([v,c]) => <option key={v} value={v}>{c.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Severidade</label>
                  <select className="input-dark" value={form.severidade} onChange={e => setForm(p => ({ ...p, severidade: e.target.value }))}>
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Título *</label>
                <input className="input-dark" placeholder="Resumo da ocorrência" value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea className="input-dark" rows={3} placeholder="Detalhes..." value={form.descricao}
                  onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))}
                  style={{ resize: 'vertical', fontFamily: 'var(--font-primary)' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Data</label>
                <input className="input-dark" type="date" value={form.data_ocorrencia} onChange={e => setForm(p => ({ ...p, data_ocorrencia: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button className="btn btn-ghost btn-md" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary btn-md" style={{ flex: 1, justifyContent: 'center' }} onClick={handleCriar} disabled={salvando}>
                {salvando ? 'Salvando...' : <><Plus size={16} /> Registrar</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .oco-page { display:flex; flex-direction:column; gap:20px; max-width:1400px; margin:0 auto; }
        .page-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
        .page-title { font-family:var(--font-display); font-size:1.5rem; font-weight:800; color:var(--text-primary); margin:0 0 4px; display:flex; align-items:center; gap:10px; }
        .page-sub { color:var(--text-muted); font-size:0.875rem; margin:0; }
        .sev-kpis { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
        @media(max-width:600px) { .sev-kpis { grid-template-columns:1fr; } }
        .sev-card { padding:18px; display:flex; align-items:center; gap:14px; }
        .sev-icon { width:40px; height:40px; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .sev-card-baixa .sev-icon { background:rgba(59,130,246,0.15); color:#3b82f6; }
        .sev-card-media .sev-icon { background:rgba(245,158,11,0.15); color:#f59e0b; }
        .sev-card-alta  .sev-icon { background:rgba(255,107,107,0.15); color:#ff6b6b; }
        .sev-value { font-family:var(--font-display); font-size:1.8rem; font-weight:800; color:var(--text-primary); }
        .sev-label { font-size:0.75rem; color:var(--text-muted); margin-top:2px; }
        .filtros-bar { padding:14px 20px; display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
        .filtro-btn { padding:6px 14px; background:var(--glass-bg); border:1px solid var(--border-glass); border-radius:var(--radius-md); color:var(--text-secondary); font-size:0.78rem; font-weight:600; cursor:pointer; transition:var(--transition-smooth); font-family:var(--font-primary); }
        .filtro-ativo { background:rgba(108,99,255,0.15); border-color:var(--accent-primary); color:var(--accent-primary); }
        .oco-list { display:flex; flex-direction:column; gap:10px; }
        .oco-card { padding:0; display:flex; overflow:hidden; }
        .oco-left { width:4px; border-left:4px solid; flex-shrink:0; }
        .oco-tipo-icon { width:44px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .oco-content { flex:1; padding:14px 16px 14px 0; }
        .oco-header-row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:6px; }
        .oco-titulo { font-weight:700; font-size:0.9rem; color:var(--text-primary); flex:1; }
        .oco-data { font-size:0.72rem; color:var(--text-muted); margin-left:auto; }
        .sev-badge { padding:2px 8px; border-radius:99px; font-size:0.68rem; font-weight:700; }
        .sev-baixa { background:rgba(59,130,246,0.15); color:#3b82f6; }
        .sev-media { background:rgba(245,158,11,0.15); color:#f59e0b; }
        .sev-alta  { background:rgba(255,107,107,0.15); color:#ff6b6b; }
        .oco-aluno { display:flex; align-items:center; gap:6px; font-size:0.78rem; color:var(--text-muted); margin-bottom:6px; }
        .oco-desc { font-size:0.82rem; color:var(--text-secondary); margin:0; line-height:1.5; }
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
