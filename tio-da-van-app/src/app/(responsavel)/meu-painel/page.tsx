'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/providers/AuthProvider'
import { validarCodigoVan, cadastrarFilhoComVinculo } from '@/lib/actions/alunos'
import { Van, CheckCircle, Clock, UserPlus, QrCode, X, Warning, CalendarBlank, MapPin, NavigationArrow, Receipt } from '@phosphor-icons/react/dist/ssr'
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
  aguardando:    { label: 'Aguardando', icon: <Clock size={16} weight="fill" />,       bg: 'bg-[#fddf9c]', color: 'text-[#744900]' },
  embarcado:     { label: 'Em Trânsito', icon: <Van size={16} weight="fill" />,         bg: 'bg-[#fdba5f]', color: 'text-[#744900]' },
  desembarcado:  { label: 'No Destino',  icon: <CheckCircle size={16} weight="fill" />, bg: 'bg-[#e1e2e4]', color: 'text-[#43474e]' },
}

export default function MeuPainelMobile() {
  const { user, perfil } = useAuth()
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

  const firstName = perfil?.nome?.split(' ')[0] || 'Usuário'

  return (
    <div className="w-full flex flex-col min-h-full pb-8">
      
      {/* Header Page */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#13345b] tracking-tight">Bem-vindo, {firstName}!</h2>
          <p className="text-sm text-[#43474e] mt-1">Acompanhe a rotina de transporte dos seus filhos hoje.</p>
        </div>
        <button 
          onClick={() => setModalVincularOpen(true)}
          className="bg-[#13345b] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#13345b]/90 transition-colors shadow-sm self-start md:self-auto"
        >
          <UserPlus size={20} weight="bold" />
          Vincular novo filho
        </button>
      </div>

      {loading ? (
        <div className="space-y-4 w-full">
          {[1,2].map(i => <div key={i} className="h-40 rounded-xl bg-[#e1e2e4] animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Coluna Principal */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            
            {/* Status Hoje */}
            <div>
              <h3 className="text-lg font-bold text-[#191c1e] mb-4">Status Hoje</h3>
              
              {filhos.length === 0 ? (
                <div className="bg-[#121826] rounded-2xl p-10 shadow-lg flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-5">
                    <Van size={40} className="text-[#fdba5f]" weight="fill" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Nenhum filho vinculado</h3>
                  <p className="text-sm text-[#c3c6cf] mb-8 max-w-sm">Você ainda não possui crianças cadastradas no sistema. Vincule usando o código fornecido pelo motorista.</p>
                  
                  <div className="w-full max-w-xs space-y-3">
                    <button onClick={() => setModalVincularOpen(true)} className="w-full bg-[#13345b] text-white py-3 rounded-lg font-bold shadow-[0_4px_12px_rgba(19,52,91,0.3)] flex items-center justify-center gap-2">
                      <UserPlus size={20} weight="bold" /> Vincular Filho
                    </button>
                    <button onClick={() => setModalQrOpen(true)} className="w-full bg-transparent text-white border-2 border-white/20 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-white/10">
                      <QrCode size={20} weight="bold" /> Crachá QR
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filhos.map(filho => {
                    const cfg = STATUS_CONFIG[filho.status_checkin]
                    return (
                      <div key={filho.id} className="bg-white rounded-xl shadow-sm border border-[#e1e2e4] p-5 flex flex-col relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex gap-3 items-center">
                            <img
                              src={filho.foto_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(filho.nome)}&background=2d4b73&color=fff&size=80`}
                              alt={filho.nome}
                              className="w-12 h-12 rounded-full object-cover border-2 border-[#e1e2e4]"
                            />
                            <div>
                              <h4 className="font-bold text-[#13345b] text-base">{filho.nome}</h4>
                              <div className="flex items-center gap-1 text-xs text-[#43474e]">
                                <MapPin size={12} /> {filho.escola ?? 'Escola Padrão'}
                              </div>
                            </div>
                          </div>
                          
                          <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 ${cfg.bg} ${cfg.color}`}>
                            {cfg.icon}
                            <span className="text-[11px] font-bold tracking-wide">{cfg.label}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-5">
                          <div>
                            <p className="text-[11px] font-medium text-[#74777f] uppercase tracking-wider mb-0.5">Previsão</p>
                            <p className="font-bold text-[#191c1e] text-xl">12:45</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[11px] font-medium text-[#74777f] uppercase tracking-wider mb-0.5">Motorista</p>
                            <p className="font-semibold text-[#43474e] text-sm">Carlos (Van 03)</p>
                          </div>
                        </div>

                        <a href={`/meus-filhos?id=${filho.id}`} className="w-full bg-[#f2f4f6] text-[#13345b] py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#e1e2e4] transition-colors">
                          <NavigationArrow size={18} weight="fill" />
                          Acompanhar Rastreio
                        </a>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Visão Geral do Serviço */}
            {filhos.length > 0 && (
              <div className="mt-2">
                <h3 className="text-lg font-bold text-[#191c1e] mb-4">Visão Geral do Serviço</h3>
                <div className="bg-white rounded-xl shadow-sm border border-[#e1e2e4] p-5 h-64 flex flex-col items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative overflow-hidden group cursor-pointer hover:border-[#13345b]/30 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fb] to-white/80" />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#e1e2e4] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Van size={32} className="text-[#13345b]" weight="fill" />
                    </div>
                    <p className="font-bold text-[#13345b] text-lg">Resumo Semanal</p>
                    <p className="text-sm text-[#43474e]">Visualizar histórico de viagens (Em breve)</p>
                  </div>
                </div>
              </div>
            )}
            
          </div>

          {/* Sidebar Direita */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            
            {/* Avisos Recentes */}
            <div className="bg-white rounded-xl shadow-sm border border-[#e1e2e4] p-5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-[#191c1e] flex items-center gap-2">
                  <Warning size={20} className="text-[#fdba5f]" weight="fill" />
                  Avisos Recentes
                </h3>
              </div>
              
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-[#e1e2e4]">
                {/* Alerta 1 */}
                <div className="relative flex items-start gap-4 mb-6">
                  <div className="absolute left-0 w-6 h-6 rounded-full bg-white border-4 border-[#13345b] flex items-center justify-center z-10 shadow-sm" />
                  <div className="ml-10 bg-[#f8f9fb] p-3 rounded-lg border border-[#e1e2e4] w-full">
                    <p className="font-bold text-[#13345b] text-sm">Atraso devido à chuva</p>
                    <p className="text-xs text-[#43474e] mt-1 leading-relaxed">A rota da Van 03 está com lentidão devido às fortes chuvas na região.</p>
                    <p className="text-[10px] text-[#74777f] font-semibold mt-2">Hoje, 11:30</p>
                  </div>
                </div>
                
                {/* Alerta 2 */}
                <div className="relative flex items-start gap-4 mb-6">
                  <div className="absolute left-0 w-6 h-6 rounded-full bg-white border-4 border-[#c3c6cf] flex items-center justify-center z-10" />
                  <div className="ml-10 bg-white p-3 rounded-lg border border-[#e1e2e4] w-full">
                    <p className="font-bold text-[#191c1e] text-sm">Mensalidade Vencendo</p>
                    <p className="text-xs text-[#43474e] mt-1 leading-relaxed">Lembrete: a mensalidade referente a Maio vence em 2 dias.</p>
                    <p className="text-[10px] text-[#74777f] font-semibold mt-2">Ontem, 09:00</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full text-center text-sm font-bold text-[#13345b] pt-4 hover:underline">
                Ver todos os avisos
              </button>
            </div>

            {/* Fatura Atual */}
            <div className="bg-[#13345b] rounded-xl shadow-lg p-6 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
              <p className="text-[11px] font-bold text-[#abc8f7] uppercase tracking-wider mb-1">Fatura Atual</p>
              <p className="text-3xl font-bold text-white mb-4">R$ 450,00</p>
              
              <div className="flex items-center gap-2 text-[#d4e3ff] text-xs mb-6">
                <CalendarBlank size={16} />
                <span>Vence em 10/06</span>
              </div>
              
              <a href="/mensalidades" className="w-full bg-[#fdba5f] text-[#744900] py-3 rounded-lg font-bold flex items-center justify-center hover:bg-[#fdba5f]/90 transition-colors shadow-sm">
                Pagar Agora
              </a>
            </div>

          </div>

        </div>
      )}

      {/* MODAL VINCULAR FILHO */}
      {modalVincularOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalVincularOpen(false)} />
          <div className="bg-white border border-[#e1e2e4] p-8 rounded-2xl w-full max-w-sm relative z-10 shadow-2xl flex flex-col">
            <button onClick={() => setModalVincularOpen(false)} className="absolute top-4 right-4 text-[#74777f] hover:text-[#191c1e] transition-colors bg-[#f8f9fb] p-2 rounded-full">
              <X size={20} weight="bold" />
            </button>
            <div className="w-12 h-12 bg-[#e1e2e4] text-[#13345b] rounded-xl flex items-center justify-center mb-5">
              <Van size={24} weight="fill" />
            </div>
            <h2 className="text-xl font-bold text-[#13345b] mb-1">Vincular à Van</h2>
            <p className="text-sm text-[#43474e] mb-6">Insira o código fornecido pelo Tio da Van.</p>
            
            <input 
              type="text" 
              placeholder="A7B-9X2"
              value={codigoVan}
              onChange={e => {
                let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                if (val.length > 3) val = val.slice(0,3) + '-' + val.slice(3)
                setCodigoVan(val.slice(0, 7))
              }}
              className="w-full bg-[#f8f9fb] border border-[#c3c6cf] text-[#191c1e] text-center text-3xl font-mono tracking-[0.2em] uppercase rounded-xl py-4 mb-6 focus:outline-none focus:border-[#13345b] focus:ring-2 focus:ring-[#13345b]/20 transition-all placeholder:text-[#c3c6cf]"
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
              className="w-full bg-[#13345b] text-white py-3 rounded-lg font-bold shadow-sm disabled:opacity-50"
            >
              {buscando ? 'Buscando...' : 'Buscar Van'}
            </button>
          </div>
        </div>
      )}

      {/* MODAL CRACHÁ QR CODE */}
      {modalQrOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalQrOpen(false)} />
          <div className="bg-[#13345b] border border-[#2d4b73] p-8 rounded-2xl w-full max-w-sm relative z-10 shadow-2xl flex flex-col items-center text-center">
            <button onClick={() => setModalQrOpen(false)} className="absolute top-4 right-4 text-[#abc8f7] hover:text-white bg-white/10 p-2 rounded-full">
              <X size={20} weight="bold" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Crachá Digital</h2>
            <div className="bg-white p-5 rounded-xl shadow-lg mb-6">
              <QRCodeSVG value={filhos.length > 0 ? filhos[0].id : 'MOCK-QR-CODE'} size={180} />
            </div>
            <p className="text-sm text-[#abc8f7] mb-6">Apresente ao motorista no embarque.</p>
            <button onClick={() => setModalQrOpen(false)} className="w-full bg-white/10 text-white border border-white/20 py-3 rounded-lg font-bold">
              Fechar Crachá
            </button>
          </div>
        </div>
      )}

      {/* MODAL CADASTRO NOVO ALUNO */}
      {modalNovoAlunoOpen && motoristaVinculado && user && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !salvando && setModalNovoAlunoOpen(false)} />
          <div className="bg-white border border-[#e1e2e4] p-6 md:p-8 rounded-2xl w-full max-w-md relative z-10 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#13345b] mb-1">Cadastrar Aluno</h2>
            <p className="text-sm text-[#43474e] mb-6">Vinculando ao Tio: <strong>{motoristaVinculado.nome}</strong></p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#43474e] mb-1 block">Nome Completo *</label>
                <input 
                  type="text" 
                  value={formAluno.nome}
                  onChange={e => setFormAluno({...formAluno, nome: e.target.value})}
                  className="w-full bg-[#f8f9fb] border border-[#c3c6cf] text-[#191c1e] rounded-lg px-4 py-2.5 focus:border-[#13345b] focus:ring-1 focus:ring-[#13345b] outline-none" 
                  placeholder="Nome do aluno" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#43474e] mb-1 block">Escola</label>
                  <input 
                    type="text" 
                    value={formAluno.escola}
                    onChange={e => setFormAluno({...formAluno, escola: e.target.value})}
                    className="w-full bg-[#f8f9fb] border border-[#c3c6cf] text-[#191c1e] rounded-lg px-4 py-2.5 focus:border-[#13345b] focus:ring-1 focus:ring-[#13345b] outline-none" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#43474e] mb-1 block">Série / Ano</label>
                  <input 
                    type="text" 
                    value={formAluno.serie}
                    onChange={e => setFormAluno({...formAluno, serie: e.target.value})}
                    className="w-full bg-[#f8f9fb] border border-[#c3c6cf] text-[#191c1e] rounded-lg px-4 py-2.5 focus:border-[#13345b] focus:ring-1 focus:ring-[#13345b] outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#43474e] mb-1 block">Nascimento</label>
                  <input 
                    type="date" 
                    value={formAluno.data_nascimento}
                    onChange={e => setFormAluno({...formAluno, data_nascimento: e.target.value})}
                    className="w-full bg-[#f8f9fb] border border-[#c3c6cf] text-[#191c1e] rounded-lg px-4 py-2.5 focus:border-[#13345b] focus:ring-1 focus:ring-[#13345b] outline-none" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#43474e] mb-1 block">Turno</label>
                  <select 
                    value={formAluno.turno}
                    onChange={e => setFormAluno({...formAluno, turno: e.target.value})}
                    className="w-full bg-[#f8f9fb] border border-[#c3c6cf] text-[#191c1e] rounded-lg px-4 py-2.5 focus:border-[#13345b] focus:ring-1 focus:ring-[#13345b] outline-none"
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
              <button onClick={() => setModalNovoAlunoOpen(false)} disabled={salvando} className="flex-1 bg-white border border-[#c3c6cf] text-[#43474e] py-3 rounded-lg font-bold">
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
                className="flex-1 bg-[#13345b] text-white py-3 rounded-lg font-bold shadow-sm"
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
