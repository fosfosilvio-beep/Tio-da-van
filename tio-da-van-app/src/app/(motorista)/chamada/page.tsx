'use client'

import { useState } from 'react'
import { useChamada } from '@/hooks/useChamada'
import { useRotas } from '@/hooks/useRotas'
import {
  Van, Play, Stop, CheckCircle, Clock, UserMinus,
  WhatsappLogo, Warning, Siren, Camera
} from '@phosphor-icons/react'
import Link from 'next/link'

export default function ChamadaPage() {
  const { rotas } = useRotas()
  const [rotaId, setRotaId] = useState<string | null>(null)

  const {
    alunos, loading, rotaAtiva, pendingAction, resumo,
    iniciarRota, encerrarRota, fazerCheckin, alternarAusencia
  } = useChamada(rotaId)

  const STATUS_CONFIG = {
    aguardando: { icon: <Clock size={16} weight="fill" />, label: 'Aguardando', class: 'pill-aguardando' },
    embarcado: { icon: <Van size={16} weight="fill" />, label: 'No trajeto', class: 'pill-embarcado' },
    desembarcado: { icon: <CheckCircle size={16} weight="fill" />, label: 'Chegou', class: 'pill-desembarcado' },
  }

  return (
    <div className="chamada-page">
      {/* Header */}
      <div className="page-header animate-fade-in">
        <div>
          <h1 className="page-title"><Van weight="fill" size={28} /> Chamada Diária</h1>
          <p className="page-sub">Check-in e check-out dos alunos em tempo real</p>
        </div>
        <Link href="/chamada/scanner" className="btn btn-primary btn-md" style={{ textDecoration: 'none', background: 'var(--gradient-primary)' }}>
          <Camera size={20} weight="fill" /> Embarque Expresso (Scanner)
        </Link>
      </div>

      {/* Seletor de rota */}
      <div className="glass-card rota-selector animate-fade-in">
        <div className="rota-selector-inner">
          <select
            className="input-dark rota-select"
            value={rotaId ?? ''}
            onChange={e => { setRotaId(e.target.value || null) }}
            disabled={rotaAtiva}
          >
            <option value="">Selecione uma rota...</option>
            {rotas.map(r => (
              <option key={r.id} value={r.id}>{r.nome_rota} — {r.turno}</option>
            ))}
          </select>

          {rotaId && (
            <button
              id={`btn-rota-${rotaAtiva ? 'encerrar' : 'iniciar'}`}
              className={rotaAtiva ? 'btn btn-danger btn-md' : 'btn btn-primary btn-md'}
              onClick={rotaAtiva ? encerrarRota : iniciarRota}
            >
              {rotaAtiva ? <><Stop size={18} weight="fill" /> Encerrar rota</> : <><Play size={18} weight="fill" /> Iniciar rota</>}
            </button>
          )}
        </div>

        {/* Resumo KPI */}
        {rotaId && (
          <div className="chamada-resumo">
            {[
              { label: 'Total', value: resumo.total, color: 'var(--text-secondary)' },
              { label: 'Embarcados', value: resumo.embarcados, color: 'var(--accent-secondary)' },
              { label: 'Chegaram', value: resumo.desembarcados, color: 'var(--accent-primary)' },
              { label: 'Aguardando', value: resumo.aguardando, color: 'var(--accent-gold)' },
              { label: 'Ausentes', value: resumo.ausentes, color: 'var(--accent-warning)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="resumo-item">
                <span className="resumo-value" style={{ color }}>{value}</span>
                <span className="resumo-label">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lista de alunos */}
      {!rotaId ? (
        <div className="empty-state glass-card animate-fade-in">
          <Van size={56} color="var(--text-muted)" weight="thin" />
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Selecione uma rota para iniciar a chamada</p>
        </div>
      ) : loading ? (
        <div className="alunos-chamada-grid">
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: 100 }} />)}
        </div>
      ) : (
        <div className="alunos-chamada-grid stagger-children">
          {alunos.map(aluno => {
            const cfg = STATUS_CONFIG[aluno.status_checkin]
            const isPending = pendingAction === aluno.id
            const isAusente = aluno.ausente_hoje

            return (
              <div
                key={aluno.id}
                className={`aluno-chamada-card glass-card animate-fade-in ${isAusente ? 'card-ausente' : ''}`}
              >
                <div className="aluno-card-top">
                  <div className="aluno-avatar-wrap">
                    <img
                      src={aluno.foto_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(aluno.nome)}&background=6c63ff&color=fff&size=80`}
                      alt={aluno.nome}
                      className="aluno-foto"
                    />
                    {isAusente && <div className="ausente-badge">Ausente</div>}
                  </div>
                  <div className="aluno-card-info">
                    <span className="aluno-card-nome">{aluno.nome}</span>
                    <span className="aluno-card-escola">{aluno.escola ?? '—'} {aluno.serie ? `· ${aluno.serie}` : ''}</span>
                    {aluno.pontos_embarque && (
                      <span className="aluno-card-ponto">📍 {(aluno.pontos_embarque as any).nome}</span>
                    )}
                  </div>
                  <span className={`pill ${cfg.class} status-pill`}>
                    {cfg.icon} {cfg.label}
                  </span>
                </div>

                {/* Ações */}
                {!isAusente && (
                  <div className="aluno-card-acoes">
                    {aluno.status_checkin === 'aguardando' && (
                      <button
                        id={`btn-embarque-${aluno.id}`}
                        className="btn btn-primary btn-sm acao-btn"
                        onClick={() => fazerCheckin(aluno.id, 'embarque')}
                        disabled={isPending}
                      >
                        <Van size={16} weight="fill" /> {isPending ? '...' : 'Embarcar'}
                      </button>
                    )}
                    {aluno.status_checkin === 'embarcado' && (
                      <button
                        id={`btn-desembarque-${aluno.id}`}
                        className="btn btn-primary btn-sm acao-btn"
                        style={{ background: 'var(--gradient-primary)' }}
                        onClick={() => fazerCheckin(aluno.id, 'desembarque')}
                        disabled={isPending}
                      >
                        <CheckCircle size={16} weight="fill" /> {isPending ? '...' : 'Desembarcar'}
                      </button>
                    )}
                    {aluno.status_checkin === 'desembarcado' && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>
                        ✓ Concluído
                      </span>
                    )}
                  </div>
                )}

                <div className="aluno-card-footer">
                  <button
                    className={`ausencia-toggle ${isAusente ? 'ausencia-ativo' : ''}`}
                    onClick={() => alternarAusencia(aluno.id, !isAusente)}
                    disabled={isPending}
                  >
                    <UserMinus size={14} /> {isAusente ? 'Desfazer ausência' : 'Marcar ausente'}
                  </button>
                  {aluno.ultimo_checkin_at && (
                    <span className="ultimo-checkin">
                      {new Date(aluno.ultimo_checkin_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <style jsx>{`
        .chamada-page { display:flex; flex-direction:column; gap:20px; max-width:1400px; margin:0 auto; }
        .page-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
        .page-title { font-family:var(--font-display); font-size:1.5rem; font-weight:800; color:var(--text-primary); margin:0 0 4px; display:flex; align-items:center; gap:10px; }
        .page-sub { color:var(--text-muted); font-size:0.875rem; margin:0; }
        .rota-selector { padding:20px; }
        .rota-selector-inner { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
        .rota-select { flex:1; min-width:240px; }
        .btn-danger { background:var(--gradient-danger); color:white; border:none; border-radius:var(--radius-md); padding:10px 20px; font-weight:600; cursor:pointer; font-family:var(--font-primary); display:inline-flex; align-items:center; gap:8px; transition:var(--transition-smooth); }
        .btn-danger:hover { opacity:0.9; box-shadow:var(--shadow-glow-red); }
        .chamada-resumo { display:flex; gap:24px; margin-top:16px; flex-wrap:wrap; border-top:1px solid var(--border-subtle); padding-top:16px; }
        .resumo-item { display:flex; flex-direction:column; align-items:center; gap:2px; }
        .resumo-value { font-family:var(--font-display); font-size:1.6rem; font-weight:800; }
        .resumo-label { font-size:0.72rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; }
        .alunos-chamada-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:14px; }
        .aluno-chamada-card { padding:16px; display:flex; flex-direction:column; gap:12px; transition:var(--transition-smooth); }
        .card-ausente { opacity:0.55; }
        .aluno-card-top { display:flex; align-items:flex-start; gap:12px; }
        .aluno-avatar-wrap { position:relative; flex-shrink:0; }
        .aluno-foto { width:48px; height:48px; border-radius:50%; object-fit:cover; border:2px solid var(--border-glass); }
        .ausente-badge { position:absolute; bottom:-4px; left:50%; transform:translateX(-50%); background:var(--accent-warning); color:white; font-size:0.6rem; font-weight:700; padding:1px 6px; border-radius:99px; white-space:nowrap; }
        .aluno-card-info { flex:1; display:flex; flex-direction:column; gap:3px; overflow:hidden; }
        .aluno-card-nome { font-weight:700; font-size:0.9rem; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .aluno-card-escola { font-size:0.75rem; color:var(--text-muted); }
        .aluno-card-ponto { font-size:0.72rem; color:var(--text-muted); }
        .status-pill { font-size:0.72rem; padding:3px 8px; border-radius:99px; display:flex; align-items:center; gap:4px; white-space:nowrap; flex-shrink:0; }
        .aluno-card-acoes { display:flex; gap:8px; }
        .acao-btn { flex:1; justify-content:center; padding:8px 12px; font-size:0.82rem; }
        .aluno-card-footer { display:flex; align-items:center; justify-content:space-between; border-top:1px solid var(--border-subtle); padding-top:10px; }
        .ausencia-toggle { background:none; border:none; color:var(--text-muted); font-size:0.78rem; cursor:pointer; display:flex; align-items:center; gap:4px; padding:4px 6px; border-radius:var(--radius-sm); transition:var(--transition-fast); font-family:var(--font-primary); }
        .ausencia-toggle:hover { color:var(--accent-warning); background:rgba(255,107,107,0.1); }
        .ausencia-ativo { color:var(--accent-warning); }
        .ultimo-checkin { font-size:0.72rem; color:var(--text-muted); }
        .empty-state { padding:60px; display:flex; flex-direction:column; align-items:center; gap:16px; text-align:center; }
      `}</style>
    </div>
  )
}
