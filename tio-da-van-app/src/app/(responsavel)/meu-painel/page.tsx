'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/providers/AuthProvider'
import { validarCodigoVan, cadastrarFilhoComVinculo } from '@/lib/actions/alunos'
import { Van, CheckCircle, Clock, UserPlus, QrCode, X } from '@phosphor-icons/react/dist/ssr'
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

const STATUS_CONFIG = {
  aguardando:    { label: 'Aguardando van',    icon: <Clock size={20} weight="fill" />,       color: '#ffd93d', bg: 'rgba(255,217,61,0.15)' },
  embarcado:     { label: 'Na van agora',       icon: <Van size={20} weight="fill" />,         color: '#00d4aa', bg: 'rgba(0,212,170,0.15)' },
  desembarcado:  { label: 'Chegou ao destino', icon: <CheckCircle size={20} weight="fill" />, color: '#2d4b73', bg: 'rgba(45,75,115,0.15)' },
}

export default function MeusPainelMobile() {
  const { user } = useAuth()
  const supabase = createClient()

  const [filhos, setFilhos] = useState<FilhoStatus[]>([])
  const [loading, setLoading] = useState(true)

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
    carregar()

    if (!user) return
    const channel = supabase
      .channel('responsavel-realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'alunos' }, carregar)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [carregar, user, supabase])

  return (
    <div className="w-full bg-white rounded-[24px] border border-zinc-200 shadow-sm flex flex-col text-[#191c1e] min-h-[600px] mb-8 overflow-hidden">
      
      {/* Header do Cartão */}
      <header className="px-8 pt-10 pb-6 text-center border-b border-zinc-100 bg-[#f8f9fb]">
        <h1 className="text-3xl font-bold tracking-tight text-[#13345b] mb-2">Meus Filhos</h1>
        <p className="text-sm text-zinc-500 font-medium">Acompanhamento em tempo real</p>
      </header>

      {/* Conteúdo Central */}
      <div className="flex-1 px-6 py-12 md:px-12 flex flex-col items-center">
        {loading ? (
          <div className="space-y-4 max-w-2xl mx-auto w-full">
            {[1,2].map(i => <div key={i} className="h-32 rounded-2xl bg-zinc-100 animate-pulse" />)}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
            {filhos.length === 0 ? (
              <div className="bg-[#121826] rounded-3xl p-10 md:p-12 shadow-xl flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6">
                  <Van size={48} className="text-[#ffb74d]" weight="fill" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Nenhum filho vinculado</h3>
                <p className="text-base text-zinc-400 mb-10 max-w-md">Você ainda não possui crianças cadastradas no sistema de rotas. Vincule usando o código fornecido pelo seu motorista.</p>
                
                <div className="w-full max-w-sm space-y-4">
                  <button 
                    onClick={() => setModalVincularOpen(true)}
                    className="btn btn-blue w-full py-4 text-base shadow-[0_4px_12px_rgba(19,52,91,0.3)] font-bold rounded-xl"
                  >
                    <UserPlus size={22} weight="bold" />
                    Vincular Filho à Van
                  </button>

                  <button 
                    onClick={() => setModalQrOpen(true)}
                    className="btn w-full py-4 text-base font-bold rounded-xl bg-transparent text-white border-2 border-white/20 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <QrCode size={22} weight="bold" />
                    Gerar Crachá QR Code
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {filhos.map(filho => {
                  const cfg = STATUS_CONFIG[filho.status_checkin]
                  return (
                    <div key={filho.id} className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
                      <div className="relative">
                        <img
                          src={filho.foto_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(filho.nome)}&background=2563eb&color=fff&size=96&bold=true`}
                          alt={filho.nome}
                          className="w-24 h-24 rounded-full object-cover border-4 border-zinc-100"
                        />
                        {filho.ausente_hoje && (
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                            Ausente
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="font-bold text-[#13345b] text-xl mb-1">{filho.nome}</h3>
                        <p className="text-sm text-zinc-500 mb-4">{filho.escola ?? '—'}{filho.serie ? ` · ${filho.serie}` : ''}</p>
                        
                        <div className="inline-flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: cfg.bg }}>
                          <div style={{ color: cfg.color }}>{cfg.icon}</div>
                          <div className="flex flex-col text-left">
                            <span className="text-sm font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                            {filho.ultimo_checkin_at && (
                              <span className="text-xs font-semibold" style={{ color: cfg.color }}>
                                às {new Date(filho.ultimo_checkin_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                <div className="pt-6 flex justify-center">
                  <button 
                    onClick={() => setModalQrOpen(true)}
                    className="btn btn-ghost w-full max-w-sm py-4 text-base font-bold rounded-xl"
                  >
                    <QrCode size={22} weight="bold" />
                    Gerar Crachá QR Code
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL VINCULAR FILHO */}
      {modalVincularOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => setModalVincularOpen(false)} />
          <div className="bg-white border border-zinc-200 p-8 rounded-[2rem] w-full max-w-sm relative z-10 shadow-2xl flex flex-col">
            <button onClick={() => setModalVincularOpen(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-700 transition-colors bg-zinc-100 p-2 rounded-full">
              <X size={20} weight="bold" />
            </button>
            <div className="w-14 h-14 bg-[#13345b]/10 text-[#13345b] rounded-2xl flex items-center justify-center mb-6">
              <Van size={28} weight="fill" />
            </div>
            <h2 className="text-2xl font-bold text-[#13345b] mb-2">Vincular à Van</h2>
            <p className="text-sm text-zinc-500 mb-8 leading-relaxed">Insira o código de 6 dígitos fornecido pelo Tio da Van.</p>
            
            <input 
              type="text" 
              placeholder="A7B-9X2"
              value={codigoVan}
              onChange={e => {
                let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                if (val.length > 3) val = val.slice(0,3) + '-' + val.slice(3)
                setCodigoVan(val.slice(0, 7))
              }}
              className="w-full bg-zinc-50 border border-zinc-300 text-[#191c1e] text-center text-3xl font-mono tracking-[0.2em] uppercase rounded-2xl py-4 mb-8 focus:outline-none focus:border-[#13345b] focus:ring-4 focus:ring-[#13345b]/10 transition-all placeholder:text-zinc-300 shadow-inner"
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
              className="btn btn-primary w-full py-4 text-base rounded-xl font-bold shadow-[0_4px_12px_rgba(255,183,77,0.3)]"
            >
              {buscando ? 'Buscando...' : 'Buscar Van'}
            </button>
          </div>
        </div>
      )}

      {/* MODAL CRACHÁ QR CODE */}
      {modalQrOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => setModalQrOpen(false)} />
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
              className="btn btn-ghost w-full py-4 text-base font-bold rounded-xl text-white border-white/20 hover:bg-white/10"
            >
              Fechar Crachá
            </button>
          </div>
        </div>
      )}

      {/* MODAL CADASTRO NOVO ALUNO */}
      {modalNovoAlunoOpen && motoristaVinculado && user && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => !salvando && setModalNovoAlunoOpen(false)} />
          <div className="bg-white border border-zinc-200 p-6 md:p-8 rounded-[2rem] w-full max-w-md relative z-10 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-xl md:text-2xl font-bold text-[#13345b] mb-1">Cadastrar Aluno</h2>
            <p className="text-sm text-zinc-500 mb-6">Vinculando ao Tio: <strong className="text-[#13345b]">{motoristaVinculado.nome}</strong></p>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-500 font-bold mb-1 block">Nome Completo *</label>
                <input 
                  type="text" 
                  value={formAluno.nome}
                  onChange={e => setFormAluno({...formAluno, nome: e.target.value})}
                  className="w-full bg-zinc-50 border border-zinc-300 text-[#191c1e] rounded-xl px-4 py-3 focus:outline-none focus:border-[#13345b] focus:ring-2 focus:ring-[#13345b]/10" 
                  placeholder="Nome do seu filho(a)" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-500 font-bold mb-1 block">Escola</label>
                  <input 
                    type="text" 
                    value={formAluno.escola}
                    onChange={e => setFormAluno({...formAluno, escola: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-300 text-[#191c1e] rounded-xl px-4 py-3 focus:outline-none focus:border-[#13345b] focus:ring-2 focus:ring-[#13345b]/10" 
                    placeholder="Nome da escola" 
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 font-bold mb-1 block">Série / Ano</label>
                  <input 
                    type="text" 
                    value={formAluno.serie}
                    onChange={e => setFormAluno({...formAluno, serie: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-300 text-[#191c1e] rounded-xl px-4 py-3 focus:outline-none focus:border-[#13345b] focus:ring-2 focus:ring-[#13345b]/10" 
                    placeholder="Ex: 5º Ano A" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-500 font-bold mb-1 block">Nascimento</label>
                  <input 
                    type="date" 
                    value={formAluno.data_nascimento}
                    onChange={e => setFormAluno({...formAluno, data_nascimento: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-300 text-[#191c1e] rounded-xl px-4 py-3 focus:outline-none focus:border-[#13345b] focus:ring-2 focus:ring-[#13345b]/10" 
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 font-bold mb-1 block">Turno</label>
                  <select 
                    value={formAluno.turno}
                    onChange={e => setFormAluno({...formAluno, turno: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-300 text-[#191c1e] rounded-xl px-4 py-3 focus:outline-none focus:border-[#13345b] focus:ring-2 focus:ring-[#13345b]/10"
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
                className="btn btn-ghost flex-1 py-4 text-base font-bold rounded-xl border-zinc-300 text-zinc-600"
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
                className="btn btn-primary flex-1 py-4 text-base font-bold rounded-xl shadow-[0_4px_12px_rgba(255,183,77,0.3)]"
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
