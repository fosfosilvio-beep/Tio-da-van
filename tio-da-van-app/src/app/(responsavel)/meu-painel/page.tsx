'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/providers/AuthProvider'
import { validarCodigoVan, cadastrarFilhoComVinculo } from '@/lib/actions/alunos'
import { QRCodeSVG } from 'qrcode.react'

type FilhoStatus = {
  id: string
  nome: string
  foto_url: string | null
  escola: string | null
  serie: string | null
  status_checkin: 'aguardando' | 'embarcado' | 'desembarcado'
  ausente_hoje: boolean
  ultimo_checkin_at: string | null
  rotas: { nome_rota: string; turno: string; horario_inicio: string } | null
}

export default function MeuPainelResponsavel() {
  const { user, perfil } = useAuth()
  const supabase = createClient()

  const [filhos, setFilhos] = useState<FilhoStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // Modais State
  const [modalVincularOpen, setModalVincularOpen] = useState(false)
  const [modalQrOpen, setModalQrOpen] = useState(false)
  const [modalNovoAlunoOpen, setModalNovoAlunoOpen] = useState(false)
  const [codigoVan, setCodigoVan] = useState('')
  const [buscando, setBuscando] = useState(false)
  
  // Estado de Cadastro
  const [motoristaVinculado, setMotoristaVinculado] = useState<{id: string, nome: string} | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [formAluno, setFormAluno] = useState({
    nome: '', escola: '', serie: '', data_nascimento: '', turno: 'manha'
  })

  const carregar = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const filhosRes = await supabase
        .from('alunos')
        .select(`
          id, nome, foto_url, escola, serie, status_checkin,
          ausente_hoje, ultimo_checkin_at,
          rotas(nome_rota, turno, horario_inicio)
        `)
        .eq('responsavel_id', user.id)
        .eq('ativo', true)

    setFilhos((filhosRes.data ?? []) as FilhoStatus[])
    setLoading(false)
  }, [user, supabase])

  useEffect(() => {
    setIsMounted(true)
    carregar()
    if (!user) return
    const channel = supabase
      .channel('responsavel-realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'alunos' }, carregar)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [carregar, user, supabase])

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const renderDate = () => {
    if (!isMounted) return '...'
    return new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  const firstName = perfil?.nome?.split(' ')[0] || 'Usuário'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1400, margin: '0 auto', fontFamily: 'Manrope, sans-serif', position: 'relative' }}>
      
      {/* ===== AVISO NENHUM FILHO ===== */}
      {!loading && filhos.length === 0 && (
        <div style={{ background: '#fffbf0', border: '1px solid #ffb74d', borderLeft: '4px solid #ffb74d', borderRadius: 8, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>
              <span style={{ fontWeight: 700, color: '#1a1c1e', fontSize: '0.9rem' }}>Nenhum filho vinculado — </span>
              <span style={{ color: '#4a5568', fontSize: '0.9rem' }}>Vincule seus filhos para acompanhar o transporte em tempo real.</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setModalVincularOpen(true)} style={{ padding: '10px 20px', background: '#ffb74d', borderRadius: 8, color: '#1a1c1e', fontWeight: 700, fontSize: '0.875rem', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Vincular Agora
            </button>
          </div>
        </div>
      )}

      {/* ===== SAUDAÇÃO ===== */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.6rem', color: '#1a1c1e', margin: '0 0 4px' }}>
            Bom dia, {firstName} 👋
          </h1>
          <p style={{ color: '#718096', fontSize: '0.875rem', margin: 0, textTransform: 'capitalize' }}>
            {renderDate()}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setModalQrOpen(true)} style={{ padding: '10px 20px', background: 'transparent', color: '#2d4b73', border: '1px solid #2d4b73', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: 'Manrope, sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}>
            📱 Crachá QR
          </button>
          <button onClick={() => setModalVincularOpen(true)} style={{ padding: '10px 20px', background: '#2d4b73', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: 'Manrope, sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}>
            ➕ Novo Filho
          </button>
        </div>
      </div>

      {/* ===== KPI CARDS ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(200px, 1fr))', gap: 16 }}>
        {[
          { label: 'Filhos Vinculados', value: filhos.length.toString(), sub: 'Ativos na plataforma', color: '#2d4b73', bg: '#eef3fa', icon: '👦' },
          { label: 'Mensalidade Atual', value: formatCurrency(450), sub: 'Vence em 10/06', color: '#e74c3c', bg: '#fdf0ef', icon: '💰' },
          { label: 'Viagens Hoje', value: filhos.length.toString(), sub: 'Monitoramento ativo', color: '#2ecc71', bg: '#eafaf1', icon: '🚐' },
          { label: 'Avisos', value: '2', sub: 'Não lidos', color: '#f39c12', bg: '#fffbf0', icon: '🔔' },
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
        {/* Status Hoje */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(45,75,115,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1c1e', margin: 0 }}>Status de Transporte Hoje</h2>
            <Link href="/meus-filhos" style={{ fontSize: '0.8rem', color: '#2d4b73', textDecoration: 'none', fontWeight: 600 }}>Acompanhar no mapa →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filhos.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#718096', fontSize: '0.9rem' }}>
                Nenhum filho para acompanhar hoje.
              </div>
            )}
            {filhos.map(filho => (
              <div key={filho.id} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 10, borderBottom: '1px solid #eef0f4' }}>
                <img src={filho.foto_url ?? `https://ui-avatars.com/api/?name=${filho.nome}&background=2d4b73&color=fff&size=40`} alt={filho.nome} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1c1e' }}>{filho.nome}</div>
                  <div style={{ fontSize: '0.75rem', color: '#718096' }}>{filho.escola ?? 'Escola Elite'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700, background: filho.status_checkin === 'embarcado' ? '#eafaf1' : filho.status_checkin === 'desembarcado' ? '#f8f9fb' : '#fffbf0', color: filho.status_checkin === 'embarcado' ? '#2ecc71' : filho.status_checkin === 'desembarcado' ? '#718096' : '#f39c12' }}>
                    {filho.status_checkin === 'embarcado' ? '🚐 Em Trânsito' : filho.status_checkin === 'desembarcado' ? '✅ No Destino' : '⏳ Aguardando'}
                  </span>
                  <div style={{ fontSize: '0.7rem', color: '#718096', marginTop: 4 }}>Previsão: 12:45</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Avisos Recentes */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(45,75,115,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1c1e', margin: 0 }}>Avisos Recentes</h2>
            <span style={{ fontSize: '0.8rem', color: '#2d4b73', fontWeight: 600, cursor: 'pointer' }}>Ver tudo →</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { id: 1, title: 'Atraso devido à chuva', time: 'Hoje, 11:30', urgent: true },
              { id: 2, title: 'Mensalidade Vencendo', time: 'Ontem, 09:00', urgent: false },
            ].map(aviso => (
              <div key={aviso.id} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, borderBottom: '1px solid #eef0f4' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: aviso.urgent ? '#e74c3c' : '#718096' }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1c1e' }}>{aviso.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#718096' }}>{aviso.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MODAIS ===== */}
      {/* Modal Vincular Filho */}
      {modalVincularOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 400, width: '90%', position: 'relative' }}>
            <button onClick={() => setModalVincularOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#718096' }}>✕</button>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, background: '#eef3fa', color: '#2d4b73', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>🚐</div>
              <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1a1c1e', margin: '0 0 8px' }}>Vincular à Van</h2>
              <p style={{ color: '#718096', fontSize: '0.875rem', margin: 0 }}>Insira o código fornecido pelo Tio da Van.</p>
            </div>
            
            <input 
              type="text" 
              placeholder="A7B-9X2"
              value={codigoVan}
              onChange={e => {
                let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                if (val.length > 3) val = val.slice(0,3) + '-' + val.slice(3)
                setCodigoVan(val.slice(0, 7))
              }}
              style={{ width: '100%', background: '#f8f9fb', border: '1px solid #dde1e7', textAlign: 'center', fontSize: '1.5rem', fontFamily: 'monospace', letterSpacing: '0.2em', textTransform: 'uppercase', borderRadius: 12, padding: '16px', marginBottom: 24, outline: 'none' }}
              maxLength={7}
            />
            
            <button 
              onClick={async () => {
                if (codigoVan.length < 6) return
                setBuscando(true)
                const { data, error } = await validarCodigoVan(codigoVan)
                setBuscando(false)
                if (error || !data) return alert(error || 'Código inválido')
                setMotoristaVinculado(data)
                setModalVincularOpen(false)
                setCodigoVan('')
                setModalNovoAlunoOpen(true)
              }}
              disabled={buscando || codigoVan.length < 6}
              style={{ width: '100%', background: '#2d4b73', color: '#fff', padding: '14px', borderRadius: 8, fontWeight: 700, border: 'none', cursor: buscando || codigoVan.length < 6 ? 'not-allowed' : 'pointer', opacity: buscando || codigoVan.length < 6 ? 0.5 : 1 }}
            >
              {buscando ? 'Buscando...' : 'Buscar Van'}
            </button>
          </div>
        </div>
      )}

      {/* Modal Crachá QR Code */}
      {modalQrOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#2d4b73', borderRadius: 16, padding: 32, maxWidth: 360, width: '90%', position: 'relative', textAlign: 'center' }}>
            <button onClick={() => setModalQrOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', fontSize: 16, color: '#fff', width: 32, height: 32, borderRadius: '50%' }}>✕</button>
            <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#fff', margin: '0 0 24px' }}>Crachá Digital</h2>
            
            <div style={{ background: '#fff', padding: 20, borderRadius: 16, display: 'inline-block', marginBottom: 24 }}>
              <QRCodeSVG value={filhos.length > 0 ? filhos[0].id : 'MOCK-QR-CODE'} size={180} />
            </div>
            
            <p style={{ color: '#abc8f7', fontSize: '0.875rem', margin: '0 0 24px' }}>Apresente ao motorista no embarque.</p>
            
            <button onClick={() => setModalQrOpen(false)} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '14px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
              Fechar Crachá
            </button>
          </div>
        </div>
      )}

      {/* Modal Cadastro Novo Aluno */}
      {modalNovoAlunoOpen && motoristaVinculado && user && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 480, width: '90%', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1a1c1e', margin: '0 0 8px' }}>Cadastrar Aluno</h2>
            <p style={{ color: '#718096', fontSize: '0.875rem', margin: '0 0 24px' }}>Vinculando ao Tio: <strong>{motoristaVinculado.nome}</strong></p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#4a5568', marginBottom: 4 }}>Nome Completo *</label>
                <input 
                  type="text" 
                  value={formAluno.nome}
                  onChange={e => setFormAluno({...formAluno, nome: e.target.value})}
                  style={{ width: '100%', background: '#f8f9fb', border: '1px solid #dde1e7', padding: '10px 14px', borderRadius: 8, outline: 'none', fontFamily: 'inherit' }} 
                  placeholder="Nome do aluno" 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#4a5568', marginBottom: 4 }}>Escola</label>
                  <input 
                    type="text" 
                    value={formAluno.escola}
                    onChange={e => setFormAluno({...formAluno, escola: e.target.value})}
                    style={{ width: '100%', background: '#f8f9fb', border: '1px solid #dde1e7', padding: '10px 14px', borderRadius: 8, outline: 'none', fontFamily: 'inherit' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#4a5568', marginBottom: 4 }}>Série / Ano</label>
                  <input 
                    type="text" 
                    value={formAluno.serie}
                    onChange={e => setFormAluno({...formAluno, serie: e.target.value})}
                    style={{ width: '100%', background: '#f8f9fb', border: '1px solid #dde1e7', padding: '10px 14px', borderRadius: 8, outline: 'none', fontFamily: 'inherit' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#4a5568', marginBottom: 4 }}>Nascimento</label>
                  <input 
                    type="date" 
                    value={formAluno.data_nascimento}
                    onChange={e => setFormAluno({...formAluno, data_nascimento: e.target.value})}
                    style={{ width: '100%', background: '#f8f9fb', border: '1px solid #dde1e7', padding: '10px 14px', borderRadius: 8, outline: 'none', fontFamily: 'inherit' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#4a5568', marginBottom: 4 }}>Turno</label>
                  <select 
                    value={formAluno.turno}
                    onChange={e => setFormAluno({...formAluno, turno: e.target.value})}
                    style={{ width: '100%', background: '#f8f9fb', border: '1px solid #dde1e7', padding: '10px 14px', borderRadius: 8, outline: 'none', fontFamily: 'inherit' }}
                  >
                    <option value="manha">Manhã</option>
                    <option value="almoco">Almoço</option>
                    <option value="tarde">Tarde</option>
                    <option value="noite">Noite</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <button onClick={() => setModalNovoAlunoOpen(false)} disabled={salvando} style={{ flex: 1, background: '#fff', border: '1px solid #dde1e7', color: '#4a5568', padding: '12px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                Cancelar
              </button>
              <button 
                onClick={async () => {
                  if (!formAluno.nome) return alert('Preencha o nome.')
                  setSalvando(true)
                  const { error } = await cadastrarFilhoComVinculo({...formAluno, responsavel_id: user.id} as any, motoristaVinculado.id)
                  setSalvando(false)
                  if (error) alert('Erro: ' + error)
                  else { setModalNovoAlunoOpen(false); carregar() }
                }}
                disabled={salvando}
                style={{ flex: 1, background: '#2d4b73', color: '#fff', border: 'none', padding: '12px', borderRadius: 8, fontWeight: 700, cursor: salvando ? 'not-allowed' : 'pointer' }}
              >
                {salvando ? 'Salvando...' : 'Cadastrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
