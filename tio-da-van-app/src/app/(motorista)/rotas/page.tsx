'use client'

import { useState } from 'react'
import { useRotas } from '@/hooks/useRotas'
import { criarRota, deletarRota, criarPonto, deletarPonto } from '@/lib/actions/rotas'
import {
  MapPin, Plus, Trash, PencilSimple, CheckCircle,
  Clock, Van, DotsThree, MapTrifold
} from '@phosphor-icons/react'
import type { Rota, PontoEmbarque } from '@/types'

const TURNO_LABELS = { manha: '🌅 Manhã', almoco: '☀️ Almoço', tarde: '🌇 Tarde', noite: '🌙 Noite' }
const TURNO_COLORS = {
  manha: { bg: 'rgba(255,217,61,0.12)', text: '#ffd93d', border: 'rgba(255,217,61,0.3)' },
  almoco: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
  tarde: { bg: 'rgba(108,99,255,0.12)', text: '#6c63ff', border: 'rgba(108,99,255,0.3)' },
  noite: { bg: 'rgba(0,212,170,0.12)', text: '#00d4aa', border: 'rgba(0,212,170,0.3)' },
}

export default function RotasPage() {
  const { rotas, loading, recarregar } = useRotas()
  const [rotaSelecionada, setRotaSelecionada] = useState<string | null>(null)
  const [showNovaRota, setShowNovaRota] = useState(false)
  const [novaRota, setNovaRota] = useState({ nome_rota: '', turno: 'manha' as Rota['turno'], horario_inicio: '06:30', dias_semana: ['seg','ter','qua','qui','sex'] })
  const [novoPonto, setNovoPonto] = useState({ nome: '', lat: '', lng: '', raio: '100' })
  const [salvando, setSalvando] = useState(false)

  const rotaDetalhe = rotas.find(r => r.id === rotaSelecionada)

  const handleCriarRota = async () => {
    if (!novaRota.nome_rota) return
    setSalvando(true)
    await criarRota({ ...novaRota, motorista_id: '' } as any)
    setShowNovaRota(false)
    setNovaRota({ nome_rota: '', turno: 'manha', horario_inicio: '06:30', dias_semana: ['seg','ter','qua','qui','sex'] })
    await recarregar()
    setSalvando(false)
  }

  const handleDeletarRota = async (id: string) => {
    if (!confirm('Deseja excluir esta rota?')) return
    await deletarRota(id)
    if (rotaSelecionada === id) setRotaSelecionada(null)
    await recarregar()
  }

  const handleCriarPonto = async () => {
    if (!rotaSelecionada || !novoPonto.nome || !novoPonto.lat || !novoPonto.lng) return
    setSalvando(true)
    await criarPonto({
      rota_id: rotaSelecionada,
      nome: novoPonto.nome,
      lat: parseFloat(novoPonto.lat),
      lng: parseFloat(novoPonto.lng),
      raio_geofence_metros: parseInt(novoPonto.raio),
      ordem: (rotaDetalhe?.pontos_embarque?.length ?? 0) + 1,
    })
    setNovoPonto({ nome: '', lat: '', lng: '', raio: '100' })
    await recarregar()
    setSalvando(false)
  }

  return (
    <div className="rotas-page">
      {/* Header da página */}
      <div className="page-header animate-fade-in">
        <div>
          <h1 className="page-title"><MapPin weight="fill" size={28} /> Gestão de Rotas</h1>
          <p className="page-sub">Gerencie suas rotas e pontos de embarque</p>
        </div>
        <button className="btn-primary" onClick={() => setShowNovaRota(true)}>
          <Plus size={18} weight="bold" /> Nova rota
        </button>
      </div>

      <div className="rotas-grid">
        {/* Lista de rotas */}
        <div className="rotas-list-col">
          {loading ? (
            <div className="skeleton-list">
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 90, marginBottom: 12 }} />)}
            </div>
          ) : rotas.length === 0 ? (
            <div className="empty-state glass-card">
              <MapTrifold size={48} color="var(--text-muted)" />
              <p>Nenhuma rota cadastrada.</p>
              <button className="btn-primary" onClick={() => setShowNovaRota(true)}>
                <Plus size={16} /> Criar primeira rota
              </button>
            </div>
          ) : (
            <div className="rotas-cards stagger-children">
              {rotas.map(rota => {
                const c = TURNO_COLORS[rota.turno]
                const isSelected = rotaSelecionada === rota.id
                return (
                  <div
                    key={rota.id}
                    className={`rota-card glass-card animate-fade-in ${isSelected ? 'rota-card-selected' : ''}`}
                    onClick={() => setRotaSelecionada(isSelected ? null : rota.id)}
                  >
                    <div className="rota-card-header">
                      <div className="rota-info">
                        <span className="rota-nome">{rota.nome_rota}</span>
                        <span className="rota-turno-badge" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                          {TURNO_LABELS[rota.turno]}
                        </span>
                      </div>
                      <button
                        className="rota-delete-btn"
                        onClick={e => { e.stopPropagation(); handleDeletarRota(rota.id) }}
                        aria-label="Excluir rota"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                    <div className="rota-meta">
                      <span><Clock size={13} /> {rota.horario_inicio}</span>
                      <span><MapPin size={13} /> {(rota.pontos_embarque as any[])?.length ?? 0} pontos</span>
                      <span><Van size={13} /> {(rota.alunos as any[])?.length ?? 0} alunos</span>
                    </div>
                    <div className="rota-dias">
                      {['seg','ter','qua','qui','sex','sab','dom'].map(dia => (
                        <span
                          key={dia}
                          className={`dia-pill ${rota.dias_semana?.includes(dia) ? 'dia-ativo' : 'dia-inativo'}`}
                        >{dia}</span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Detalhe da rota selecionada */}
        {rotaDetalhe && (
          <div className="rota-detalhe glass-card animate-fade-in">
            <h2 className="detalhe-title">
              <MapPin weight="fill" size={18} color="var(--accent-primary)" />
              {rotaDetalhe.nome_rota}
            </h2>

            {/* Lista de pontos */}
            <div className="pontos-section">
              <p className="pontos-label">Pontos de embarque</p>
              {(rotaDetalhe.pontos_embarque as PontoEmbarque[] | undefined)?.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nenhum ponto cadastrado.</p>
              ) : (
                <div className="pontos-list">
                  {((rotaDetalhe.pontos_embarque as PontoEmbarque[]) ?? [])
                    .sort((a, b) => a.ordem - b.ordem)
                    .map((ponto, idx) => (
                      <div key={ponto.id} className="ponto-item">
                        <div className="ponto-ordem">{idx + 1}</div>
                        <div className="ponto-info">
                          <span className="ponto-nome">{ponto.nome}</span>
                          <span className="ponto-coords">{ponto.lat.toFixed(4)}, {ponto.lng.toFixed(4)} · {ponto.raio_geofence_metros}m</span>
                        </div>
                        <button
                          className="ponto-delete"
                          onClick={() => deletarPonto(ponto.id).then(recarregar)}
                          aria-label="Remover ponto"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Formulário novo ponto */}
            <div className="novo-ponto-form">
              <p className="pontos-label">Adicionar ponto</p>
              <input
                className="input-dark" placeholder="Nome do ponto" style={{ marginBottom: 8 }}
                value={novoPonto.nome} onChange={e => setNovoPonto(p => ({ ...p, nome: e.target.value }))}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                <input className="input-dark" placeholder="Latitude" type="number" step="any"
                  value={novoPonto.lat} onChange={e => setNovoPonto(p => ({ ...p, lat: e.target.value }))} />
                <input className="input-dark" placeholder="Longitude" type="number" step="any"
                  value={novoPonto.lng} onChange={e => setNovoPonto(p => ({ ...p, lng: e.target.value }))} />
              </div>
              <input className="input-dark" placeholder="Raio geofence (metros)" type="number" style={{ marginBottom: 12 }}
                value={novoPonto.raio} onChange={e => setNovoPonto(p => ({ ...p, raio: e.target.value }))} />
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleCriarPonto} disabled={salvando}>
                <Plus size={16} /> Adicionar ponto
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal nova rota */}
      {showNovaRota && (
        <div className="modal-overlay" onClick={() => setShowNovaRota(false)}>
          <div className="modal-card glass-card animate-fade-in" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Nova Rota</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input className="input-dark" placeholder="Nome da rota (ex: Manhã Centro)"
                value={novaRota.nome_rota} onChange={e => setNovaRota(p => ({ ...p, nome_rota: e.target.value }))} />
              <select className="input-dark" value={novaRota.turno}
                onChange={e => setNovaRota(p => ({ ...p, turno: e.target.value as any }))}>
                {Object.entries(TURNO_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <input className="input-dark" type="time" value={novaRota.horario_inicio}
                onChange={e => setNovaRota(p => ({ ...p, horario_inicio: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowNovaRota(false)}>Cancelar</button>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleCriarRota} disabled={salvando}>
                {salvando ? 'Criando...' : <><Plus size={16} /> Criar rota</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .rotas-page { display:flex; flex-direction:column; gap:24px; max-width:1400px; margin:0 auto; }
        .page-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
        .page-title { font-family:var(--font-display); font-size:1.5rem; font-weight:800; color:var(--text-primary); margin:0 0 4px; display:flex; align-items:center; gap:10px; }
        .page-sub { color:var(--text-muted); font-size:0.875rem; margin:0; }
        .rotas-grid { display:grid; grid-template-columns:1fr 380px; gap:20px; align-items:start; }
        @media(max-width:1100px) { .rotas-grid { grid-template-columns:1fr; } }
        .rotas-cards { display:flex; flex-direction:column; gap:12px; }
        .rota-card { padding:16px 20px; cursor:pointer; border:1px solid var(--border-subtle); transition:var(--transition-smooth); }
        .rota-card:hover { border-color:var(--border-accent); }
        .rota-card-selected { border-color:var(--accent-primary) !important; background:rgba(108,99,255,0.08) !important; }
        .rota-card-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:10px; }
        .rota-info { display:flex; flex-direction:column; gap:6px; }
        .rota-nome { font-family:var(--font-display); font-weight:700; font-size:1rem; color:var(--text-primary); }
        .rota-turno-badge { padding:3px 10px; border-radius:99px; font-size:0.75rem; font-weight:600; display:inline-block; }
        .rota-delete-btn { background:none; border:none; color:var(--text-muted); cursor:pointer; padding:4px; border-radius:var(--radius-sm); transition:var(--transition-fast); }
        .rota-delete-btn:hover { color:var(--accent-warning); background:rgba(255,107,107,0.12); }
        .rota-meta { display:flex; gap:14px; font-size:0.78rem; color:var(--text-muted); margin-bottom:10px; }
        .rota-meta span { display:flex; align-items:center; gap:4px; }
        .rota-dias { display:flex; gap:4px; }
        .dia-pill { padding:2px 6px; border-radius:4px; font-size:0.7rem; font-weight:600; text-transform:uppercase; }
        .dia-ativo { background:rgba(108,99,255,0.2); color:var(--accent-primary); }
        .dia-inativo { background:rgba(255,255,255,0.05); color:var(--text-disabled); }
        .rota-detalhe { padding:24px; }
        .detalhe-title { font-family:var(--font-display); font-size:1.1rem; font-weight:700; color:var(--text-primary); margin:0 0 20px; display:flex; align-items:center; gap:8px; }
        .pontos-section { margin-bottom:20px; }
        .pontos-label { font-size:0.75rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-muted); margin:0 0 10px; }
        .pontos-list { display:flex; flex-direction:column; gap:8px; }
        .ponto-item { display:flex; align-items:center; gap:10px; padding:10px 12px; background:var(--glass-bg); border:1px solid var(--border-subtle); border-radius:var(--radius-md); }
        .ponto-ordem { width:24px; height:24px; background:var(--gradient-primary); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.72rem; font-weight:700; color:white; flex-shrink:0; }
        .ponto-info { flex:1; display:flex; flex-direction:column; gap:2px; }
        .ponto-nome { font-size:0.875rem; font-weight:600; color:var(--text-primary); }
        .ponto-coords { font-size:0.72rem; color:var(--text-muted); }
        .ponto-delete { background:none; border:none; color:var(--text-muted); cursor:pointer; padding:4px; border-radius:var(--radius-sm); transition:var(--transition-fast); }
        .ponto-delete:hover { color:var(--accent-warning); }
        .novo-ponto-form { border-top:1px solid var(--border-subtle); padding-top:20px; }
        .empty-state { padding:40px; display:flex; flex-direction:column; align-items:center; gap:16px; color:var(--text-muted); text-align:center; }
        .skeleton-list { display:flex; flex-direction:column; gap:12px; }
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; z-index:200; padding:24px; }
        .modal-card { width:100%; max-width:420px; padding:28px; }
        .modal-title { font-family:var(--font-display); font-size:1.2rem; font-weight:700; color:var(--text-primary); margin:0 0 20px; }
      `}</style>
    </div>
  )
}
