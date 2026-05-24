'use client'

import { useAuth } from '@/providers/AuthProvider'
import { mockDashboardStats, mockAlunos, mockCobrancas } from '@/lib/mocks'
import {
  UsersFour, CurrencyDollar, ArrowUp, ArrowDown,
  Van, Warning, CheckCircle, Clock, Cake
} from '@phosphor-icons/react'
import type { Metadata } from 'next'

// ---- KPI Card ----
type StatCardProps = {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'purple' | 'green' | 'red' | 'gold'
}

function StatCard({ title, value, subtitle, icon, trend, trendValue, color = 'purple' }: StatCardProps) {
  const colorMap = {
    purple: { bg: 'rgba(108,99,255,0.12)', glow: 'shadow-glow-purple', text: '#6c63ff' },
    green: { bg: 'rgba(0,212,170,0.12)', glow: 'shadow-glow-green', text: '#00d4aa' },
    red: { bg: 'rgba(255,107,107,0.12)', glow: 'shadow-glow-red', text: '#ff6b6b' },
    gold: { bg: 'rgba(255,217,61,0.12)', glow: 'shadow-glow-gold', text: '#ffd93d' },
  }
  const c = colorMap[color]

  return (
    <div className="stat-card glass-card animate-fade-in">
      <div className="stat-card-header">
        <div className="stat-icon" style={{ background: c.bg }}>
          <span style={{ color: c.text }}>{icon}</span>
        </div>
        {trend && trendValue && (
          <span className={`stat-trend trend-${trend}`}>
            {trend === 'up' ? <ArrowUp size={12} weight="bold" /> : <ArrowDown size={12} weight="bold" />}
            {trendValue}
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}

      <style jsx>{`
        .stat-card {
          padding: 20px;
          cursor: default;
        }
        .stat-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .stat-icon {
          width: 44px; height: 44px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-trend {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: var(--radius-full);
        }
        .trend-up { color: #00d4aa; background: rgba(0,212,170,0.12); }
        .trend-down { color: #ff6b6b; background: rgba(255,107,107,0.12); }
        .stat-value {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .stat-title {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .stat-subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 4px;
        }
      `}</style>
    </div>
  )
}

// ---- Status badge de aluno ----
function CheckinBadge({ status }: { status: string }) {
  return (
    <span className={`pill pill-${status}`} style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '99px' }}>
      {status === 'embarcado' ? '🚐 No trajeto' : status === 'desembarcado' ? '✅ Chegou' : '⏳ Aguardando'}
    </span>
  )
}

export default function DashboardPage() {
  const { perfil } = useAuth()
  const stats = mockDashboardStats
  const alunos = mockAlunos.slice(0, 5)
  const cobrancas = mockCobrancas

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="dashboard-page">
      {/* Saudação */}
      <div className="dashboard-greeting animate-fade-in">
        <div>
          <h1 className="greeting-title">
            Bom dia, {perfil?.nome?.split(' ')[0] ?? 'Motorista'} 👋
          </h1>
          <p className="greeting-subtitle">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <button className="btn-primary">
          <Van size={18} weight="fill" />
          Iniciar rota
        </button>
      </div>

      {/* KPI Grid */}
      <section className="stats-grid stagger-children">
        <StatCard
          title="Alunos Ativos"
          value={stats.total_alunos}
          subtitle={`${stats.alunos_embarcados} no trajeto agora`}
          icon={<UsersFour size={22} weight="fill" />}
          trend="up"
          trendValue="+2 esse mês"
          color="purple"
        />
        <StatCard
          title="Receita do Mês"
          value={formatCurrency(stats.receita_mes)}
          subtitle={`${stats.cobrancas_pendentes} cobranças pendentes`}
          icon={<ArrowUp size={22} weight="bold" />}
          trend="up"
          trendValue="+8%"
          color="green"
        />
        <StatCard
          title="Despesas do Mês"
          value={formatCurrency(stats.despesas_mes)}
          icon={<ArrowDown size={22} weight="bold" />}
          trend="down"
          trendValue="-5%"
          color="red"
        />
        <StatCard
          title="Lucro Líquido"
          value={formatCurrency(stats.lucro_mes)}
          subtitle="Meta: R$ 4.000"
          icon={<CurrencyDollar size={22} weight="fill" />}
          color="gold"
        />
      </section>

      {/* Grid inferior */}
      <div className="dashboard-bottom">
        {/* Chamada rápida */}
        <section className="glass-card section-card animate-fade-in">
          <div className="section-header">
            <h2 className="section-title">Chamada de hoje</h2>
            <a href="/chamada" className="section-link">Ver tudo →</a>
          </div>
          <div className="alunos-list">
            {alunos.map((aluno) => (
              <div key={aluno.id} className="aluno-row">
                <img
                  src={aluno.foto_url ?? `https://ui-avatars.com/api/?name=${aluno.nome}&background=6c63ff&color=fff&size=40`}
                  alt={aluno.nome}
                  className="aluno-avatar"
                />
                <div className="aluno-info">
                  <span className="aluno-nome">{aluno.nome}</span>
                  <span className="aluno-escola">{aluno.escola}</span>
                </div>
                <CheckinBadge status={aluno.status_checkin ?? 'aguardando'} />
              </div>
            ))}
          </div>
        </section>

        {/* Cobranças pendentes */}
        <section className="glass-card section-card animate-fade-in">
          <div className="section-header">
            <h2 className="section-title">Cobranças</h2>
            <a href="/financeiro/cobrancas" className="section-link">Ver tudo →</a>
          </div>
          <div className="cobrancas-list">
            {cobrancas.map((cob) => {
              const aluno = mockAlunos.find(a => a.id === cob.aluno_id)
              return (
                <div key={cob.id} className="cobranca-row">
                  <div className="cobranca-info">
                    <span className="cobranca-nome">{aluno?.nome ?? 'Aluno'}</span>
                    <span className="cobranca-data">
                      {cob.status === 'pago'
                        ? `Pago em ${new Date(cob.data_pagamento!).toLocaleDateString('pt-BR')}`
                        : `Vence ${new Date(cob.data_vencimento!).toLocaleDateString('pt-BR')}`
                      }
                    </span>
                  </div>
                  <div className="cobranca-right">
                    <span className="cobranca-valor">
                      {(cob.valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <span className={`pill pill-${cob.status}`} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 99 }}>
                      {cob.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Alertas */}
        <section className="glass-card section-card animate-fade-in">
          <div className="section-header">
            <h2 className="section-title">Alertas</h2>
          </div>
          <div className="alertas-list">
            {stats.cobrancas_vencidas > 0 && (
              <div className="alerta-row alerta-danger">
                <Warning size={18} weight="fill" />
                <span>{stats.cobrancas_vencidas} cobrança(s) vencida(s)</span>
              </div>
            )}
            {stats.cobrancas_pendentes > 0 && (
              <div className="alerta-row alerta-warning">
                <Clock size={18} weight="fill" />
                <span>{stats.cobrancas_pendentes} cobrança(s) pendente(s)</span>
              </div>
            )}
            <div className="alerta-row alerta-success">
              <CheckCircle size={18} weight="fill" />
              <span>Rota da manhã concluída ✓</span>
            </div>
            <div className="alerta-row alerta-info">
              <Cake size={18} weight="fill" />
              <span>2 aniversariantes esta semana 🎂</span>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-greeting {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .greeting-title {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 4px;
        }

        .greeting-subtitle {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin: 0;
          text-transform: capitalize;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .stats-grid { grid-template-columns: 1fr; } }

        .dashboard-bottom {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 16px;
          align-items: start;
        }

        @media (max-width: 1100px) {
          .dashboard-bottom { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 700px) {
          .dashboard-bottom { grid-template-columns: 1fr; }
        }

        .section-card { padding: 20px; }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .section-title {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .section-link {
          font-size: 0.8rem;
          color: var(--accent-primary);
          text-decoration: none;
          transition: var(--transition-fast);
        }

        .section-link:hover { opacity: 0.7; }

        /* Alunos */
        .alunos-list { display: flex; flex-direction: column; gap: 12px; }

        .aluno-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .aluno-avatar {
          width: 38px; height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--border-glass);
        }

        .aluno-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow: hidden;
        }

        .aluno-nome {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .aluno-escola {
          font-size: 0.75rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Cobranças */
        .cobrancas-list { display: flex; flex-direction: column; gap: 12px; }

        .cobranca-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 10px 0;
          border-bottom: 1px solid var(--border-subtle);
        }

        .cobranca-row:last-child { border-bottom: none; padding-bottom: 0; }

        .cobranca-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .cobranca-nome {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .cobranca-data {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .cobranca-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .cobranca-valor {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        /* Alertas */
        .alertas-list { display: flex; flex-direction: column; gap: 10px; }

        .alerta-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          font-size: 0.825rem;
          font-weight: 500;
        }

        .alerta-danger { background: rgba(255,107,107,0.1); color: #ff6b6b; border: 1px solid rgba(255,107,107,0.2); }
        .alerta-warning { background: rgba(255,217,61,0.1); color: #ffd93d; border: 1px solid rgba(255,217,61,0.2); }
        .alerta-success { background: rgba(0,212,170,0.1); color: #00d4aa; border: 1px solid rgba(0,212,170,0.2); }
        .alerta-info { background: rgba(108,99,255,0.1); color: #6c63ff; border: 1px solid rgba(108,99,255,0.2); }
      `}</style>
    </div>
  )
}
