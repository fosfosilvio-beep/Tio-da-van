'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/providers/AuthProvider'
import { validarCodigoVan, cadastrarFilhoComVinculo } from '@/lib/actions/alunos'
import {
  Van, CheckCircle, Clock, Bell, BellSlash,
  CurrencyDollar, Warning, UserPlus, QrCode, X
} from '@phosphor-icons/react/dist/ssr'
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

type NotifItem = {
  id: string
  titulo: string
  mensagem: string
  tipo: string
  lida: boolean
  created_at: string
}

const STATUS_CONFIG = {
  aguardando:    { label: 'Aguardando van',    icon: <Clock size={20} weight="fill" />,       color: '#ffd93d', bg: 'rgba(255,217,61,0.15)' },
  embarcado:     { label: 'Na van agora',       icon: <Van size={20} weight="fill" />,         color: '#00d4aa', bg: 'rgba(0,212,170,0.15)' },
  desembarcado:  { label: 'Chegou ao destino', icon: <CheckCircle size={20} weight="fill" />, color: '#2d4b73', bg: 'rgba(45,75,115,0.15)' },
}

const TIPO_ICON: Record<string, string> = {
  embarque: '🚐', desembarque: '✅', aproximacao: '⏰',
  cobranca: '💰', ocorrencia: '⚠️', contrato: '📋', aviso: '📢',
}

export default function MeusPainelMobile() {
  const { user } = useAuth()
  const supabase = createClient()

  const [filhos, setFilhos] = useState<FilhoStatus[]>([])
  const [notifs, setNotifs] = useState<NotifItem[]>([])
  const [cobrancas, setCobrancas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState<'filhos' | 'notifs' | 'financeiro'>('filhos')

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

    const [filhosRes, notifsRes, cobRes] = await Promise.all([
      supabase
        .from('alunos')
        .select(`
          id, nome, foto_url, escola, serie, status_checkin,
          ausente_hoje, ultimo_checkin_at,
          rotas(nome_rota, turno, horario_inicio)
        `)
        .eq('responsavel_id', user.id)
        .eq('ativo', true),

      supabase
        .from('notificacoes')
        .select('id, titulo, mensagem, tipo, lida, created_at')
        .eq('destinatario_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30),

      supabase
        .from('cobrancas')
        .select(`
          id, valor, status, data_vencimento, mes_referencia, tipo,
          alunos(nome)
        `)
        .in('aluno_id',
          (await supabase.from('alunos').select('id').eq('responsavel_id', user.id).eq('ativo', true)).data?.map(a => a.id) ?? []
        )
        .order('data_vencimento', { ascending: true }),
    ])

    setFilhos((filhosRes.data ?? []) as FilhoStatus[])
    setNotifs((notifsRes.data ?? []) as NotifItem[])
    setCobrancas(cobRes.data ?? [])
    setLoading(false)
  }, [user, supabase])

  useEffect(() => {
    carregar()

    if (!user) return
    const channel = supabase
      .channel('responsavel-realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'alunos' }, carregar)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notificacoes' }, carregar)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [carregar, user, supabase])

  const marcarLida = async (id: string) => {
    await supabase.from('notificacoes').update({ lida: true }).eq('id', id)
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n))
  }

  const naoLidas = notifs.filter(n => !n.lida).length
  const totalPendente = cobrancas
    .filter(c => c.status === 'pendente' || c.status === 'vencido')
    .reduce((a, c) => a + (c.valor ?? 0), 0)

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="max-w-md mx-auto w-full min-h-[100vh] md:min-h-[800px] md:h-[800px] bg-[#121826] rounded-none md:rounded-[32px] border-0 md:border border-zinc-800 shadow-2xl relative flex flex-col overflow-hidden text-white">
      
      {/* Header Fixo Mobile */}
      <header className="px-6 pt-10 pb-4 bg-gradient-to-b from-[#161F30] to-transparent sticky top-0 z-20">
        <h1 className="text-2xl font-bold tracking-tight">
          {abaAtiva === 'filhos' && 'Meus Filhos'}
          {abaAtiva === 'notifs' && 'Notificações'}
          {abaAtiva === 'financeiro' && 'Financeiro'}
        </h1>
        {abaAtiva === 'filhos' && <p className="text-sm text-zinc-400 mt-1">Acompanhamento em tempo real</p>}
      </header>

      {/* Conteúdo Rolável */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-6 scrollbar-hide">
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-28 rounded-2xl bg-zinc-800/50 animate-pulse" />)}
          </div>
        ) : (
          <>
            {/* ABA: Filhos */}
            {abaAtiva === 'filhos' && (
              <div className="space-y-4">
                {filhos.length === 0 ? (
                  <div className="bg-zinc-800/30 backdrop-blur-md rounded-2xl p-8 border border-zinc-800/50 flex flex-col items-center text-center shadow-lg mt-8">
                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                      <Van size={32} className="text-zinc-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Nenhum filho vinculado</h3>
                    <p className="text-sm text-zinc-400 mb-6">Você ainda não possui crianças cadastradas no sistema de rotas.</p>
                    
                    <button 
                      onClick={() => setModalVincularOpen(true)}
                      className="btn btn-primary w-full py-3.5"
                    >
                      <UserPlus size={20} weight="bold" />
                      Vincular Filho à Van
                    </button>
                    <p className="text-xs text-zinc-500 mt-3">
                      Insira o Código da Van fornecido pelo motorista
                    </p>

                    <button 
                      onClick={() => setModalQrOpen(true)}
                      className="btn btn-ghost w-full py-3.5 mt-6"
                    >
                      <QrCode size={20} weight="bold" />
                      Gerar Crachá QR Code
                    </button>
                  </div>
                ) : (
                  <>
                    {filhos.map(filho => {
                      const cfg = STATUS_CONFIG[filho.status_checkin]
                      return (
                        <div key={filho.id} className="bg-zinc-800/40 rounded-2xl p-5 border border-zinc-700/50 shadow-md">
                          <div className="flex gap-4 items-start">
                            <div className="relative">
                              <img
                                src={filho.foto_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(filho.nome)}&background=2563eb&color=fff&size=80&bold=true`}
                                alt={filho.nome}
                                className="w-14 h-14 rounded-full object-cover border-2 border-zinc-700"
                              />
                              {filho.ausente_hoje && (
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-full">
                                  Ausente
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-white text-lg">{filho.nome}</h3>
                              <p className="text-xs text-zinc-400">{filho.escola ?? '—'}{filho.serie ? ` · ${filho.serie}` : ''}</p>
                            </div>
                          </div>

                          <div className="mt-4 p-3 rounded-xl flex items-center gap-3" style={{ backgroundColor: cfg.bg }}>
                            <div style={{ color: cfg.color }}>{cfg.icon}</div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                              {filho.ultimo_checkin_at && (
                                <span className="text-xs text-zinc-400">
                                  às {new Date(filho.ultimo_checkin_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    
                    {/* Botão extra para quem já tem filho */}
                    <button 
                      onClick={() => setModalQrOpen(true)}
                      className="btn btn-ghost w-full py-3.5 mt-6"
                    >
                      <QrCode size={20} weight="bold" />
                      Gerar Crachá QR Code
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ABA: Notificações */}
            {abaAtiva === 'notifs' && (
              <div className="space-y-3">
                {notifs.length === 0 ? (
                  <div className="text-center py-12">
                    <BellSlash size={48} className="mx-auto text-zinc-600 mb-4" />
                    <p className="text-zinc-400 text-sm">Nenhuma notificação recebida.</p>
                  </div>
                ) : notifs.map(n => (
                  <div
                    key={n.id}
                    onClick={() => !n.lida && marcarLida(n.id)}
                    className={`p-4 rounded-xl flex gap-4 items-start transition-colors ${!n.lida ? 'bg-blue-600/10 border border-blue-500/30' : 'bg-zinc-800/30 border border-zinc-800'}`}
                  >
                    <div className="text-2xl">{TIPO_ICON[n.tipo] ?? '📢'}</div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white">{n.titulo}</h4>
                      <p className="text-xs text-zinc-400 mt-1">{n.mensagem}</p>
                      <p className="text-[0.65rem] text-zinc-500 mt-2">
                        {new Date(n.created_at).toLocaleString('pt-BR', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}
                      </p>
                    </div>
                    {!n.lida && <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />}
                  </div>
                ))}
              </div>
            )}

            {/* ABA: Financeiro */}
            {abaAtiva === 'financeiro' && (
              <div className="space-y-4">
                {totalPendente > 0 && (
                  <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-center gap-4">
                    <Warning size={28} className="text-amber-500" weight="fill" />
                    <div>
                      <p className="text-xs text-zinc-400">Total em aberto</p>
                      <p className="text-xl font-bold text-amber-500">{fmt(totalPendente)}</p>
                    </div>
                  </div>
                )}
                
                {cobrancas.length === 0 ? (
                  <div className="text-center py-12">
                    <CurrencyDollar size={48} className="mx-auto text-zinc-600 mb-4" />
                    <p className="text-zinc-400 text-sm">Nenhuma mensalidade gerada.</p>
                  </div>
                ) : cobrancas.map((c: any) => (
                  <div key={c.id} className="bg-zinc-800/40 p-4 rounded-xl border border-zinc-700/50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-white">{c.alunos?.nome ?? 'Mensalidade'}</h4>
                        <p className="text-xs text-zinc-400">Ref: {c.mes_referencia}</p>
                      </div>
                      <span className={`text-[0.65rem] font-bold uppercase px-2 py-0.5 rounded-full ${c.status === 'pago' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                      <p className="text-xs text-zinc-500">Venc. {new Date(c.data_vencimento).toLocaleDateString('pt-BR')}</p>
                      <p className="text-lg font-bold text-white">{fmt(c.valor)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Navegação Inferior (Bottom Tab Bar) */}
      <nav className="absolute bottom-0 w-full bg-[#161F30]/90 backdrop-blur-md border-t border-zinc-800 flex justify-around p-3 pb-6 md:pb-3 z-50">
        <button 
          onClick={() => setAbaAtiva('filhos')}
          className={`flex flex-col items-center gap-1 w-20 transition-colors ${abaAtiva === 'filhos' ? 'text-blue-500' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Van size={24} weight={abaAtiva === 'filhos' ? 'fill' : 'regular'} />
          <span className="text-[0.65rem] font-bold">Início</span>
        </button>

        <button 
          onClick={() => setAbaAtiva('notifs')}
          className={`relative flex flex-col items-center gap-1 w-20 transition-colors ${abaAtiva === 'notifs' ? 'text-blue-500' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <div className="relative">
            <Bell size={24} weight={abaAtiva === 'notifs' ? 'fill' : 'regular'} />
            {naoLidas > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 border-2 border-[#161F30] rounded-full"></span>
            )}
          </div>
          <span className="text-[0.65rem] font-bold">Avisos</span>
        </button>

        <button 
          onClick={() => setAbaAtiva('financeiro')}
          className={`flex flex-col items-center gap-1 w-20 transition-colors ${abaAtiva === 'financeiro' ? 'text-blue-500' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <CurrencyDollar size={24} weight={abaAtiva === 'financeiro' ? 'fill' : 'regular'} />
          <span className="text-[0.65rem] font-bold">Finanças</span>
        </button>
      </nav>

      {/* MODAL VINCULAR FILHO */}
      {modalVincularOpen && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setModalVincularOpen(false)} />
          <div className="bg-[#121826] border border-zinc-800 p-8 rounded-[2rem] w-full max-w-sm relative z-10 shadow-2xl flex flex-col">
            <button onClick={() => setModalVincularOpen(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors bg-zinc-800/50 p-2 rounded-full">
              <X size={20} weight="bold" />
            </button>
            <div className="w-14 h-14 bg-blue-600/20 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
              <Van size={28} weight="fill" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Vincular à Van</h2>
            <p className="text-sm text-zinc-400 mb-8 leading-relaxed">Insira o código de 6 dígitos fornecido pelo Tio da Van.</p>
            
            <input 
              type="text" 
              placeholder="A7B-9X2"
              value={codigoVan}
              onChange={e => {
                let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                if (val.length > 3) val = val.slice(0,3) + '-' + val.slice(3)
                setCodigoVan(val.slice(0, 7))
              }}
              className="w-full bg-zinc-900 border border-zinc-700 text-white text-center text-3xl font-mono tracking-[0.2em] uppercase rounded-2xl py-4 mb-8 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all placeholder:text-zinc-800 shadow-inner"
              maxLength={7}
            />
            
            <button 
              onClick={async () => {
                if (codigoVan.length < 6) return
                setBuscando(true)
                const { data, error } = await validarCodigoVan(codigoVan)
                setBuscando(false)
                
                if (error || !data) {
                  alert(error || 'Código inválido')
                  return
                }
                
                // Sucesso!
                setMotoristaVinculado(data)
                setModalVincularOpen(false)
                setCodigoVan('')
                setModalNovoAlunoOpen(true)
              }}
              disabled={buscando || codigoVan.length < 6}
              className="btn btn-primary w-full py-4 text-base"
            >
              {buscando ? 'Buscando...' : 'Buscar Van'}
            </button>
          </div>
        </div>
      )}

      {/* MODAL CRACHÁ QR CODE */}
      {modalQrOpen && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setModalQrOpen(false)} />
          <div className="bg-[#121826] border border-zinc-800 p-8 rounded-[2rem] w-full max-w-sm relative z-10 shadow-2xl flex flex-col items-center text-center">
            <button onClick={() => setModalQrOpen(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors bg-zinc-800/50 p-2 rounded-full">
              <X size={20} weight="bold" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-8">Seu Crachá Digital</h2>
            
            <div className="bg-white p-6 rounded-[2rem] shadow-[0_0_40px_rgba(255,255,255,0.1)] mb-8">
              <QRCodeSVG 
                value={filhos.length > 0 ? filhos[0].id : 'MOCK-QR-CODE-12345'} 
                size={200} 
                bgColor="#ffffff"
                fgColor="#121826"
                level="Q"
              />
            </div>
            
            <p className="text-sm text-zinc-400 mb-8 leading-relaxed">Apresente este código ao motorista no momento do embarque.</p>
            
            <button 
              onClick={() => setModalQrOpen(false)}
              className="btn btn-ghost w-full py-4 text-base"
            >
              Fechar Crachá
            </button>
          </div>
        </div>
      )}

      {/* MODAL CADASTRO NOVO ALUNO */}
      {modalNovoAlunoOpen && motoristaVinculado && user && (
        <div className="absolute inset-0 z-[110] flex items-center justify-center p-4 md:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !salvando && setModalNovoAlunoOpen(false)} />
          <div className="bg-[#121826] border border-zinc-800 p-6 md:p-8 rounded-[2rem] w-full max-w-md relative z-10 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Cadastrar Aluno</h2>
            <p className="text-sm text-zinc-400 mb-6">Vinculando ao Tio: <strong className="text-blue-400">{motoristaVinculado.nome}</strong></p>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 font-bold mb-1 block">Nome Completo *</label>
                <input 
                  type="text" 
                  value={formAluno.nome}
                  onChange={e => setFormAluno({...formAluno, nome: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" 
                  placeholder="Nome do seu filho(a)" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 font-bold mb-1 block">Escola</label>
                  <input 
                    type="text" 
                    value={formAluno.escola}
                    onChange={e => setFormAluno({...formAluno, escola: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" 
                    placeholder="Nome da escola" 
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-bold mb-1 block">Série / Ano</label>
                  <input 
                    type="text" 
                    value={formAluno.serie}
                    onChange={e => setFormAluno({...formAluno, serie: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" 
                    placeholder="Ex: 5º Ano A" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 font-bold mb-1 block">Nascimento</label>
                  <input 
                    type="date" 
                    value={formAluno.data_nascimento}
                    onChange={e => setFormAluno({...formAluno, data_nascimento: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-bold mb-1 block">Turno</label>
                  <select 
                    value={formAluno.turno}
                    onChange={e => setFormAluno({...formAluno, turno: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                  >
                    <option value="manha">Manhã</option>
                    <option value="almoco">Almoço</option>
                    <option value="tarde">Tarde</option>
                    <option value="noite">Noite</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setModalNovoAlunoOpen(false)}
                disabled={salvando}
                className="btn btn-ghost flex-1 py-4 text-base"
              >
                Cancelar
              </button>
              <button 
                onClick={async () => {
                  if (!formAluno.nome) {
                    alert('Preencha o nome do aluno.')
                    return
                  }
                  setSalvando(true)
                  const { error } = await cadastrarFilhoComVinculo({
                    nome: formAluno.nome,
                    responsavel_id: user.id,
                    escola: formAluno.escola || null,
                    serie: formAluno.serie || null,
                    data_nascimento: formAluno.data_nascimento || null,
                    // Turno e Ponto de Embarque não entram na tabela alunos nativamente ainda sem Rota
                  } as any, motoristaVinculado.id)
                  
                  setSalvando(false)
                  if (error) {
                    alert('Erro: ' + error)
                  } else {
                    setModalNovoAlunoOpen(false)
                    carregar()
                  }
                }}
                disabled={salvando}
                className="btn btn-primary flex-1 py-4 text-base"
              >
                {salvando ? 'Salvando...' : 'Cadastrar Aluno'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
