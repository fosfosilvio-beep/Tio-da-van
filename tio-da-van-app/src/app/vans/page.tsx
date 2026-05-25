'use client'
import { useState } from 'react'
import Link from 'next/link'
import { mockMotoristasPublicos, gerarLinkWhatsApp, type MotoristaPublico } from '@/lib/mocks/landing'

export default function ListaVansPage() {
  const [escola, setEscola] = useState('')
  const [bairro, setBairro] = useState('')

  const motoristas: MotoristaPublico[] = mockMotoristasPublicos

  return (
    <div style={{ fontFamily: 'Manrope, sans-serif', background: '#f8f9fb', minHeight: '100vh', color: '#1a1c1e' }}>

      {/* NAVBAR */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #dde1e7', boxShadow: '0 2px 8px rgba(45,75,115,0.06)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ fontSize: 28 }}>🚐</span>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#2d4b73' }}>Tio da Van</span>
          </Link>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/login" style={{ padding: '8px 16px', border: '1.5px solid #2d4b73', borderRadius: 8, color: '#2d4b73', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>Entrar</Link>
            <Link href="/" style={{ padding: '8px 16px', background: '#ffb74d', borderRadius: 8, color: '#1a1c1e', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>← Início</Link>
          </div>
        </div>
      </nav>

      {/* FILTRO */}
      <div style={{ background: '#fff', borderBottom: '1px solid #dde1e7', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: 12 }}>
            <Link href="/" style={{ color: '#2d4b73', textDecoration: 'none' }}>Início</Link> › Buscar Vans
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🏫</span>
              <input
                value={escola}
                onChange={e => setEscola(e.target.value)}
                placeholder="Escola"
                style={{ width: '100%', padding: '10px 10px 10px 38px', border: '1.5px solid #dde1e7', borderRadius: 8, fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>📍</span>
              <input
                value={bairro}
                onChange={e => setBairro(e.target.value)}
                placeholder="Bairro"
                style={{ width: '100%', padding: '10px 10px 10px 38px', border: '1.5px solid #dde1e7', borderRadius: 8, fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
            </div>
            <button style={{ padding: '10px 20px', background: '#ffb74d', borderRadius: 8, border: 'none', fontWeight: 700, cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem' }}>
              Atualizar Busca
            </button>
          </div>
          <div style={{ marginTop: 10, fontSize: '0.85rem', color: '#718096' }}>
            <strong style={{ color: '#2d4b73' }}>{motoristas.length} motoristas</strong> encontrados para sua região
          </div>
        </div>
      </div>

      {/* GRID DE CARDS */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {motoristas.map(m => (
            <div key={m.id} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(45,75,115,0.08)', display: 'flex', flexDirection: 'column' }}>
              {/* Foto da van */}
              <img src={m.foto_van_url} alt={`Van — ${m.nome}`} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
              <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Driver row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={m.foto_perfil_url} alt={m.nome} style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1c1e' }}>{m.nome}</div>
                    <div style={{ color: '#f39c12', fontWeight: 600, fontSize: '0.8rem' }}>⭐ {m.avaliacao} ({m.total_avaliacoes} avaliações)</div>
                  </div>
                </div>

                {/* Escolas */}
                <div style={{ fontSize: '0.85rem', color: '#4a5568' }}>
                  <strong>🏫</strong> {m.escolas_atendidas.join(', ')}
                </div>

                {/* Bairros */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {m.bairros.map(b => (
                    <span key={b} style={{ padding: '3px 10px', background: '#eef3fa', color: '#2d4b73', borderRadius: 99, fontSize: '0.78rem', fontWeight: 500 }}>{b}</span>
                  ))}
                </div>

                {/* Horário */}
                <div style={{ fontSize: '0.85rem', color: '#4a5568' }}>
                  🕐 Manhã: <strong>{m.horario_manha}</strong> &nbsp;|&nbsp; Tarde: <strong>{m.horario_tarde}</strong>
                </div>

                {/* Vagas + Valor */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: m.vagas_disponiveis > 0 ? '#eafaf1' : '#fdf0ef', color: m.vagas_disponiveis > 0 ? '#2ecc71' : '#e74c3c', padding: '4px 10px', borderRadius: 99, fontSize: '0.8rem', fontWeight: 700 }}>
                    {m.vagas_disponiveis > 0 ? `${m.vagas_disponiveis} vagas disponíveis` : 'Sem vagas'}
                  </span>
                  <span style={{ color: '#2d4b73', fontWeight: 700, fontSize: '0.95rem' }}>R$ {m.valor_mensalidade}/mês</span>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid #eef0f4' }} />

                {/* CTA WhatsApp */}
                <a
                  href={gerarLinkWhatsApp(m, escola || undefined, bairro || undefined)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'block', textAlign: 'center', padding: '12px', background: '#25D366', borderRadius: 8, color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}
                >
                  💬 Negociar no WhatsApp
                </a>
                <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#718096', margin: 0 }}>
                  Mensagem automática enviada ao motorista
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Paginação */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 40 }}>
          <button style={{ padding: '8px 16px', border: '1px solid #dde1e7', borderRadius: 8, background: '#fff', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', color: '#4a5568' }}>← Anterior</button>
          {[1, 2, 3].map(n => (
            <button key={n} style={{ padding: '8px 14px', border: '1px solid', borderRadius: 8, cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: n === 1 ? 700 : 400, background: n === 1 ? '#2d4b73' : '#fff', color: n === 1 ? '#fff' : '#4a5568', borderColor: n === 1 ? '#2d4b73' : '#dde1e7' }}>{n}</button>
          ))}
          <button style={{ padding: '8px 16px', border: '1px solid #dde1e7', borderRadius: 8, background: '#fff', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', color: '#4a5568' }}>Próxima →</button>
        </div>
      </div>
    </div>
  )
}
