'use client'

import { useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useAlunos } from '@/hooks/useAlunos'
import { useRotas } from '@/hooks/useRotas'
import { deletarAluno } from '@/lib/actions/alunos'
import {
  Student, Plus, MagnifyingGlass, Funnel,
  Trash, PencilSimple, Van, CheckCircle,
  Clock, UserMinus, Phone, Cake, ShareNetwork, X
} from '@phosphor-icons/react/dist/ssr'

const CHECKIN_CONFIG = {
  aguardando: { label: 'Aguardando', class: 'pill-aguardando' },
  embarcado: { label: 'No trajeto', class: 'pill-embarcado' },
  desembarcado: { label: 'Chegou', class: 'pill-desembarcado' },
}

export default function AlunosPage() {
  const [filtroAtivo, setFiltroAtivo] = useState<boolean | undefined>(true)
  const [filtroRota, setFiltroRota] = useState<string | undefined>(undefined)
  const [busca, setBusca] = useState('')
  const { alunos, loading, recarregar, totalAtivos, totalEmbarcados } = useAlunos({
    ativo: filtroAtivo,
    rota_id: filtroRota,
  })
  const { rotas } = useRotas()

  const { perfil } = useAuth()
  const [modalConvite, setModalConvite] = useState(false)
  const [alunoSelecionado, setAlunoSelecionado] = useState<string | null>(null)

  const codigoConvite = perfil?.id ? perfil.id.replace(/-/g, '').substring(0, 6).toUpperCase() : 'AGUARDE'
  const codigoFormatado = codigoConvite.length === 6 ? `${codigoConvite.slice(0,3)}-${codigoConvite.slice(3)}` : codigoConvite

  const alunosFiltrados = alunos.filter(a =>
    a.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (a.escola ?? '').toLowerCase().includes(busca.toLowerCase())
  )

  const handleDeletar = async (id: string) => {
    if (!confirm('Desativar este aluno?')) return
    await deletarAluno(id)
    await recarregar()
  }

  return (
    <div className="alunos-page">
      {/* Header */}
      <div className="page-header animate-fade-in">
        <div>
          <h1 className="page-title"><Student weight="fill" size={28} /> Alunos</h1>
          <p className="page-sub">{totalAtivos} ativos · {totalEmbarcados} no trajeto agora</p>
        </div>
        <button className="btn btn-primary btn-md" onClick={() => setModalConvite(true)}>
          <ShareNetwork size={18} weight="bold" /> Gerar Código
        </button>
      </div>

      {/* Filtros e busca */}
      <div className="glass-card filtros-bar animate-fade-in">
        <div className="input-wrapper search-wrap">
          <MagnifyingGlass size={16} className="input-icon" />
          <input
            className="input-dark input-with-icon"
            placeholder="Buscar por nome ou escola..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        <div className="filtro-group">
          <button
            className={`filtro-btn ${filtroAtivo === true ? 'filtro-ativo' : ''}`}
            onClick={() => setFiltroAtivo(true)}
          >Ativos</button>
          <button
            className={`filtro-btn ${filtroAtivo === false ? 'filtro-ativo' : ''}`}
            onClick={() => setFiltroAtivo(false)}
          >Inativos</button>
          <button
            className={`filtro-btn ${filtroAtivo === undefined ? 'filtro-ativo' : ''}`}
            onClick={() => setFiltroAtivo(undefined)}
          >Todos</button>
        </div>
        <select
          className="input-dark"
          style={{ maxWidth: 200 }}
          value={filtroRota ?? ''}
          onChange={e => setFiltroRota(e.target.value || undefined)}
        >
          <option value="">Todas as rotas</option>
          {rotas.map(r => <option key={r.id} value={r.id}>{r.nome_rota}</option>)}
        </select>
      </div>

      {/* Grid de alunos */}
      {loading ? (
        <div className="alunos-grid">
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: 140 }} />)}
        </div>
      ) : alunosFiltrados.length === 0 ? (
        <div className="empty-state glass-card">
          <Student size={56} color="var(--text-muted)" weight="thin" />
          <p style={{ color: 'var(--text-muted)' }}>Nenhum aluno encontrado.</p>
          <button className="btn btn-primary btn-md" onClick={() => setModalConvite(true)}>
            <ShareNetwork size={16} /> Enviar Convite
          </button>
        </div>
      ) : (
        <div className="alunos-grid stagger-children">
          {alunosFiltrados.map(aluno => {
            const cfg = CHECKIN_CONFIG[aluno.status_checkin]
            return (
              <div key={aluno.id} className="aluno-card glass-card animate-fade-in">
                <div className="aluno-card-top">
                  <img
                    src={aluno.foto_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(aluno.nome)}&background=6c63ff&color=fff&size=80&bold=true`}
                    alt={aluno.nome}
                    className="aluno-foto-lg"
                  />
                  <div className="aluno-card-info">
                    <span className="aluno-nome">{aluno.nome}</span>
                    <span className="aluno-escola">{aluno.escola ?? 'Escola não informada'}</span>
                    {aluno.serie && <span className="aluno-serie">{aluno.serie}</span>}
                    <span className={`pill ${cfg.class}`} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 99, marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {cfg.label}
                    </span>
                  </div>
                </div>

                <div className="aluno-card-meta">
                  {(aluno.rotas as any)?.nome_rota && (
                    <span><Van size={13} /> {(aluno.rotas as any).nome_rota}</span>
                  )}
                  {aluno.data_nascimento && (
                    <span>
                      <Cake size={13} />
                      {new Date(aluno.data_nascimento + 'T00:00:00').toLocaleDateString('pt-BR', { day:'2-digit', month:'short' })}
                    </span>
                  )}
                </div>

                <div className="aluno-card-actions">
                  <button
                    id={`btn-editar-${aluno.id}`}
                    className="btn btn-ghost btn-sm"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}
                    onClick={() => setAlunoSelecionado(aluno.id)}
                  >
                    <PencilSimple size={14} /> Editar
                  </button>
                  <button
                    id={`btn-deletar-${aluno.id}`}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--accent-warning)' }}
                    onClick={() => handleDeletar(aluno.id)}
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal Convite Pai */}
      {modalConvite && (
        <div className="modal-overlay" onClick={() => setModalConvite(false)}>
          <div className="modal-card glass-card animate-fade-in" onClick={e => e.stopPropagation()} style={{ maxWidth: 400, textAlign: 'center' }}>
            <button onClick={() => setModalConvite(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} weight="bold" />
            </button>
            <div style={{ width: 56, height: 56, background: 'rgba(108,99,255,0.1)', color: 'var(--accent-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Van size={32} weight="fill" />
            </div>
            <h3 className="modal-title" style={{ justifyContent: 'center' }}>Código da sua Van</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.5 }}>
              Compartilhe este código exclusivo com os pais. Eles devem inseri-lo no aplicativo para vincular o filho automaticamente à sua conta.
            </p>
            
            <div style={{ background: '#000', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)', marginBottom: 24 }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '0.2em', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                {codigoFormatado}
              </span>
            </div>

            <button 
              className="btn btn-primary btn-md w-full" 
              style={{ justifyContent: 'center' }}
              onClick={() => {
                navigator.clipboard.writeText(`Baixe o app Tio da Van e use o código para vincular seu filho à minha Van!\nCódigo: ${codigoFormatado}`)
                alert('Código copiado para a área de transferência!')
                setModalConvite(false)
              }}
            >
              Copiar Código e Mensagem
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .alunos-page { display:flex; flex-direction:column; gap:20px; max-width:1400px; margin:0 auto; }
        .page-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
        .page-title { font-family:var(--font-display); font-size:1.5rem; font-weight:800; color:var(--text-primary); margin:0 0 4px; display:flex; align-items:center; gap:10px; }
        .page-sub { color:var(--text-muted); font-size:0.875rem; margin:0; }
        .filtros-bar { padding:16px 20px; display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
        .search-wrap { flex:1; min-width:200px; }
        .filtro-group { display:flex; gap:4px; }
        .filtro-btn { padding:7px 14px; background:var(--glass-bg); border:1px solid var(--border-glass); border-radius:var(--radius-md); color:var(--text-secondary); font-size:0.8rem; font-weight:600; cursor:pointer; transition:var(--transition-smooth); font-family:var(--font-primary); }
        .filtro-ativo { background:rgba(108,99,255,0.15); border-color:var(--accent-primary); color:var(--accent-primary); }
        .alunos-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:14px; }
        .aluno-card { padding:16px; display:flex; flex-direction:column; gap:12px; }
        .aluno-card-top { display:flex; gap:12px; align-items:flex-start; }
        .aluno-foto-lg { width:56px; height:56px; border-radius:var(--radius-lg); object-fit:cover; border:2px solid var(--border-glass); flex-shrink:0; }
        .aluno-card-info { flex:1; display:flex; flex-direction:column; gap:2px; }
        .aluno-nome { font-weight:700; font-size:0.925rem; color:var(--text-primary); line-height:1.3; }
        .aluno-escola { font-size:0.78rem; color:var(--text-muted); }
        .aluno-serie { font-size:0.72rem; color:var(--text-disabled); }
        .aluno-card-meta { display:flex; gap:12px; flex-wrap:wrap; }
        .aluno-card-meta span { display:flex; align-items:center; gap:4px; font-size:0.75rem; color:var(--text-muted); }
        .aluno-card-actions { display:flex; gap:6px; border-top:1px solid var(--border-subtle); padding-top:10px; }
        .empty-state { padding:60px; display:flex; flex-direction:column; align-items:center; gap:16px; text-align:center; }
        .modal-form { display:flex; flex-direction:column; gap:12px; }
        .form-row { display:flex; flex-direction:column; }
        .form-row-2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .form-group { display:flex; flex-direction:column; gap:6px; }
        .form-label { font-size:0.78rem; font-weight:500; color:var(--text-secondary); }
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; z-index:200; padding:24px; }
        .modal-card { width:100%; padding:28px; }
        .modal-title { font-family:var(--font-display); font-size:1.2rem; font-weight:700; color:var(--text-primary); margin:0 0 20px; display:flex; align-items:center; gap:8px; }
      `}</style>
    </div>
  )
}
