'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { mockDashboardStats, mockAlunos, mockCobrancas } from '@/lib/mocks'
import Link from 'next/link'

// Simulação: troque para true para ver o estado "cadastro completo"
const SIMULAR_CADASTRO_COMPLETO = false

export default function DashboardPage() {
  const { perfil } = useAuth()
  const stats = mockDashboardStats
  const alunos = mockAlunos.slice(0, 5)
  const cobrancas = mockCobrancas

  // Estado do onboarding (em produção: leria perfis.status_onboarding do Supabase)
  const [showPopup, setShowPopup] = useState(!SIMULAR_CADASTRO_COMPLETO)
  const cadastroCompleto = SIMULAR_CADASTRO_COMPLETO
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  // formata data de forma segura no client side
  const renderDate = () => {
    if (!isMounted) return 'Carregando data...'
    return new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  const renderCobDate = (cob: any) => {
    if (!isMounted) return '...'
    return cob.status === 'pago' 
      ? `Pago em ${new Date(cob.data_pagamento!).toLocaleDateString('pt-BR')}` 
      : `Vence ${new Date(cob.data_vencimento!).toLocaleDateString('pt-BR')}`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1400, margin: '0 auto', fontFamily: 'Manrope, sans-serif', position: 'relative' }}>

      {/* ===== POPUP ONBOARDING (1ª VISITA) ===== */}
      {showPopup && !cadastroCompleto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 40, maxWidth: 560, width: '90%', boxShadow: '0 24px 48px rgba(0,0,0,0.2)', position: 'relative' }}>
            <button onClick={() => setShowPopup(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#718096' }}>✕</button>

            {/* Ícone + Título */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 36 }}>🚐</div>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#2d4b73', margin: '0 0 8px' }}>Bem-vindo ao Tio da Van!</h2>
              <p style={{ color: '#718096', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>Para começar a receber alunos, complete seu cadastro profissional. Leva menos de 5 minutos.</p>
            </div>

            {/* Barra de progresso */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.8rem', color: '#718096' }}>Progresso do cadastro</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffb74d' }}>0 de 3 etapas</span>
              </div>
              <div style={{ height: 8, background: '#eef0f4', borderRadius: 99 }}>
                <div style={{ height: '100%', width: '5%', background: '#ffb74d', borderRadius: 99 }} />
              </div>
            </div>

            {/* Etapas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {[
                { num: 1, label: 'Dados Pessoais e Profissionais', step: '1' },
                { num: 2, label: 'Documentos (RG, CPF, CNH)', step: '2' },
                { num: 3, label: 'Configuração de Pagamento (Pix)', step: '3' },
              ].map(item => (
                <div key={item.num} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #dde1e7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', color: '#718096', flexShrink: 0 }}>{item.num}</div>
                  <span style={{ color: '#4a5568', fontSize: '0.9rem' }}>{item.label}</span>
                </div>
              ))}
            </div>

            <Link href="/dashboard/cadastro?step=1" style={{ display: 'block', textAlign: 'center', padding: '14px', background: '#ffb74d', borderRadius: 8, color: '#1a1c1e', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', marginBottom: 12 }}>
              Começar Meu Cadastro →
            </Link>
            <button onClick={() => setShowPopup(false)} style={{ display: 'block', width: '100%', background: 'none', border: 'none', color: '#718096', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Manrope, sans-serif' }}>
              ✕ Fechar e fazer depois
            </button>
          </div>
        </div>
      )}

      {/* ===== BANNER DE AVISO (persiste mesmo após fechar popup) ===== */}
      {!cadastroCompleto && (
        <div style={{ background: '#fffbf0', border: '1px solid #ffb74d', borderLeft: '4px solid #ffb74d', borderRadius: 8, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>
              <span style={{ fontWeight: 700, color: '#1a1c1e', fontSize: '0.9rem' }}>Cadastro incompleto — </span>
              <span style={{ color: '#4a5568', fontSize: '0.9rem' }}>Complete seu perfil para aparecer nas buscas das famílias.</span>
              <div style={{ fontSize: '0.78rem', color: '#718096', marginTop: 2 }}>Este aviso desaparece após o cadastro completo</div>
            </div>
          </div>
          <Link href="/dashboard/cadastro?step=1" style={{ padding: '10px 20px', background: '#ffb74d', borderRadius: 8, color: '#1a1c1e', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Completar Agora
          </Link>
        </div>
      )}

      {/* ===== CARD CTA ADICIONAR VAN (aparece após cadastro completo) ===== */}
      {cadastroCompleto && (
        <div style={{ background: '#fff', border: '2px dashed #ffb74d', borderRadius: 12, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#2d4b73', marginBottom: 4 }}>🚐 Cadastre sua Van ou Frota</div>
            <div style={{ color: '#718096', fontSize: '0.875rem' }}>Adicione seu veículo e apareça nas buscas das famílias</div>
          </div>
          <Link href="/dashboard/frota/nova" style={{ padding: '12px 24px', background: '#ffb74d', borderRadius: 8, color: '#1a1c1e', fontWeight: 700, textDecoration: 'none' }}>
            ➕ Adicionar Van ou Frota
          </Link>
        </div>
      )}

      {/* ===== SAUDAÇÃO ===== */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.6rem', color: '#1a1c1e', margin: '0 0 4px' }}>
            Bom dia, {perfil?.nome?.split(' ')[0] ?? 'Motorista'} 👋
          </h1>
          <p style={{ color: '#718096', fontSize: '0.875rem', margin: 0, textTransform: 'capitalize' }}>
            {renderDate()}
          </p>
        </div>
        <button style={{ padding: '10px 20px', background: '#2d4b73', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: 'Manrope, sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}>
          🚐 Iniciar rota
        </button>
      </div>

      {/* ===== KPI CARDS ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Alunos Ativos', value: stats.total_alunos, sub: `${stats.alunos_embarcados} no trajeto`, color: '#2d4b73', bg: '#eef3fa', icon: '👨‍👧' },
          { label: 'Receita do Mês', value: formatCurrency(stats.receita_mes), sub: `${stats.cobrancas_pendentes} pendentes`, color: '#2ecc71', bg: '#eafaf1', icon: '💰' },
          { label: 'Despesas', value: formatCurrency(stats.despesas_mes), color: '#e74c3c', bg: '#fdf0ef', icon: '📉' },
          { label: 'Lucro Líquido', value: formatCurrency(stats.lucro_mes), sub: 'Meta: R$ 4.000', color: '#f39c12', bg: '#fffbf0', icon: '🏆' },
        ].map(card => (
          <div key={card.label} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(45,75,115,0.06)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 12 }}>{card.icon}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a1c1e', marginBottom: 4 }}>{card.value}</div>
            <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 500 }}>{card.label}</div>
            {card.sub && <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: 2 }}>{card.sub}</div>}
          </div>
        ))}
      </div>

      {/* ===== GRADE INFERIOR ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Chamada do dia */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(45,75,115,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1c1e', margin: 0 }}>Chamada de hoje</h2>
            <Link href="/chamada" style={{ fontSize: '0.8rem', color: '#2d4b73', textDecoration: 'none', fontWeight: 600 }}>Ver tudo →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {alunos.map(aluno => (
              <div key={aluno.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={aluno.foto_url ?? `https://ui-avatars.com/api/?name=${aluno.nome}&background=2d4b73&color=fff&size=40`} alt={aluno.nome} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1c1e' }}>{aluno.nome}</div>
                  <div style={{ fontSize: '0.75rem', color: '#718096' }}>{aluno.escola}</div>
                </div>
                <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700, background: aluno.status_checkin === 'embarcado' ? '#eafaf1' : '#f8f9fb', color: aluno.status_checkin === 'embarcado' ? '#2ecc71' : '#718096' }}>
                  {aluno.status_checkin === 'embarcado' ? '🚐 No trajeto' : aluno.status_checkin === 'desembarcado' ? '✅ Chegou' : '⏳ Aguardando'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cobranças */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(45,75,115,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1c1e', margin: 0 }}>Cobranças</h2>
            <Link href="/financeiro" style={{ fontSize: '0.8rem', color: '#2d4b73', textDecoration: 'none', fontWeight: 600 }}>Ver tudo →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {cobrancas.slice(0, 4).map(cob => {
              const aluno = mockAlunos.find(a => a.id === cob.aluno_id)
              return (
                <div key={cob.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid #eef0f4' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1c1e' }}>{aluno?.nome ?? 'Aluno'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                      {renderCobDate(cob)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1c1e' }}>{(cob.valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                    <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700, background: cob.status === 'pago' ? '#eafaf1' : '#fffbf0', color: cob.status === 'pago' ? '#2ecc71' : '#f39c12' }}>{cob.status}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
