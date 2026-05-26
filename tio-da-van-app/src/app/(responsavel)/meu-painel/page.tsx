'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/providers/AuthProvider'
import { validarCodigoVan, cadastrarFilhoComVinculo } from '@/lib/actions/alunos'
import { QRCodeSVG } from 'qrcode.react'
import { Plus, QrCode, WarningCircle, CaretRight } from '@phosphor-icons/react/dist/ssr'

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
    const date = new Date()
    return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(date)
  }

  const firstName = perfil?.nome?.split(' ')[0] || 'Usuário'

  return (
    <div className="flex flex-col gap-6 relative w-full h-full">
      
      {/* ===== AVISO NENHUM FILHO ===== */}
      {!loading && filhos.length === 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              <WarningCircle size={24} weight="fill" />
            </div>
            <div>
              <h3 className="font-bold text-orange-800 text-sm">Nenhum passageiro vinculado</h3>
              <p className="text-orange-700/80 text-sm mt-0.5">Vincule os passageiros usando o código da Van para iniciar o rastreamento.</p>
            </div>
          </div>
          <button onClick={() => setModalVincularOpen(true)} className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm">
            Vincular Passageiro
          </button>
        </div>
      )}

      {/* ===== SAUDAÇÃO ===== */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-bold text-2xl md:text-3xl text-slate-800 mb-1">
            Olá, {firstName} 👋
          </h1>
          <p className="text-slate-500 text-sm capitalize">
            {renderDate()}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setModalQrOpen(true)} className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-sm text-sm">
            <QrCode size={18} weight="bold" /> CRACHÁ QR
          </button>
          <button onClick={() => setModalVincularOpen(true)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-all shadow-sm shadow-blue-500/20 text-sm">
            <Plus size={18} weight="bold" /> ADICIONAR
          </button>
        </div>
      </div>

      {/* ===== KPI CARDS (HUB STYLE) ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Passageiros', value: filhos.length.toString(), sub: 'Vínculos ativos', color: 'text-blue-600', bgIcon: 'bg-blue-50', icon: '👦' },
          { label: 'Fatura Atual', value: formatCurrency(450), sub: 'Vencimento em 10/06', color: 'text-indigo-600', bgIcon: 'bg-indigo-50', icon: '💳' },
          { label: 'Rastreios', value: filhos.length.toString(), sub: 'Monitoramento de hoje', color: 'text-emerald-600', bgIcon: 'bg-emerald-50', icon: '🚐' },
          { label: 'Notificações', value: '2', sub: 'Avisos não lidos', color: 'text-orange-500', bgIcon: 'bg-orange-50', icon: '🔔' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${card.bgIcon}`}>
                {card.icon}
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-1">{card.value}</div>
            <div className="font-semibold text-slate-600 text-sm">{card.label}</div>
            <div className="text-xs text-slate-400 mt-1">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* ===== GRADE INFERIOR ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Hoje */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-slate-800">Rastreamento Hoje</h2>
            <Link href="/meus-filhos" className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition-colors">
              Ver mapa completo <CaretRight size={14} weight="bold" />
            </Link>
          </div>
          
          <div className="flex flex-col gap-4">
            {filhos.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-sm">
                Nenhum vínculo ativo para exibir o rastreamento.
              </div>
            )}
            {filhos.map(filho => (
              <div key={filho.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group">
                <img src={filho.foto_url ?? `https://ui-avatars.com/api/?name=${filho.nome}&background=f8f9fa&color=2563eb&size=40`} alt={filho.nome} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                <div className="flex-1">
                  <div className="font-bold text-slate-800">{filho.nome}</div>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">{filho.escola ?? 'Escola Padrão'}</div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    filho.status_checkin === 'embarcado' ? 'bg-emerald-50 text-emerald-600' : 
                    filho.status_checkin === 'desembarcado' ? 'bg-slate-100 text-slate-600' : 
                    'bg-orange-50 text-orange-600'
                  }`}>
                    {filho.status_checkin === 'embarcado' ? 'Em trânsito' : filho.status_checkin === 'desembarcado' ? 'No Destino' : 'Aguardando'}
                  </span>
                  <div className="text-xs font-medium text-slate-400 mt-2">Prev: 12:45</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Avisos Recentes */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-slate-800">Alertas Recentes</h2>
            <span className="text-sm text-slate-400 hover:text-slate-600 font-semibold cursor-pointer transition-colors">Ver todos</span>
          </div>
          
          <div className="flex flex-col gap-5">
            {[
              { id: 1, title: 'Atraso devido à chuva', time: 'Hoje, 11:30', urgent: true },
              { id: 2, title: 'Mensalidade de Novembro', time: 'Ontem, 09:00', urgent: false },
            ].map(aviso => (
              <div key={aviso.id} className="flex items-start gap-3">
                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${aviso.urgent ? 'bg-orange-500' : 'bg-slate-300'}`}></div>
                <div>
                  <div className="font-semibold text-sm text-slate-800 leading-tight">{aviso.title}</div>
                  <div className="text-xs font-medium text-slate-500 mt-1">{aviso.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MODAIS (Wowdash Hub Style) ===== */}
      {/* Modal Vincular */}
      {modalVincularOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/40">
          <div className="bg-white rounded-[24px] p-8 max-w-md w-full relative shadow-2xl">
            <button onClick={() => setModalVincularOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">✕</button>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 text-3xl">
                🚐
              </div>
              <h2 className="font-bold text-xl text-slate-800">Vincular à Van</h2>
              <p className="text-slate-500 text-sm mt-2">Insira o código de acesso fornecido pelo motorista escolar.</p>
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
              className="w-full bg-slate-50 border border-slate-200 text-center text-3xl font-mono text-slate-800 tracking-[0.2em] uppercase rounded-xl p-5 mb-8 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300"
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
              className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${
                buscando || codigoVan.length < 6 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
              }`}
            >
              {buscando ? 'Buscando...' : 'Autenticar Código'}
            </button>
          </div>
        </div>
      )}

      {/* Modal QR */}
      {modalQrOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/40">
          <div className="bg-white rounded-[24px] p-8 max-w-sm w-full relative shadow-2xl text-center">
            <button onClick={() => setModalQrOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">✕</button>
            <h2 className="font-bold text-xl text-slate-800 mb-6">Crachá Digital</h2>
            
            <div className="bg-white p-4 rounded-2xl inline-block mb-6 border border-slate-100 shadow-sm">
              <QRCodeSVG value={filhos.length > 0 ? filhos[0].id : 'MOCK-QR'} size={200} />
            </div>
            
            <p className="text-slate-500 text-sm mb-8">Apresente este código para o motorista no momento do embarque.</p>
            
            <button onClick={() => setModalQrOpen(false)} className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all">
              Fechar Crachá
            </button>
          </div>
        </div>
      )}

      {/* Modal Novo Aluno Hub */}
      {modalNovoAlunoOpen && motoristaVinculado && user && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/40">
          <div className="bg-white rounded-[24px] p-8 max-w-lg w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
             <h2 className="font-bold text-xl text-slate-800 mb-1">Cadastrar Passageiro</h2>
             <p className="text-slate-500 text-sm mb-8">Vinculando à van de: <strong className="text-slate-800 font-semibold">{motoristaVinculado.nome}</strong></p>

             <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Nome Completo *</label>
                <input 
                  type="text" 
                  value={formAluno.nome}
                  onChange={e => setFormAluno({...formAluno, nome: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3.5 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all text-sm placeholder:text-slate-400" 
                  placeholder="Nome do passageiro" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Escola / Setor</label>
                  <input 
                    type="text" 
                    value={formAluno.escola}
                    onChange={e => setFormAluno({...formAluno, escola: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3.5 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Série / Nível</label>
                  <input 
                    type="text" 
                    value={formAluno.serie}
                    onChange={e => setFormAluno({...formAluno, serie: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3.5 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Nascimento</label>
                  <input 
                    type="date" 
                    value={formAluno.data_nascimento}
                    onChange={e => setFormAluno({...formAluno, data_nascimento: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3.5 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Turno</label>
                  <select 
                    value={formAluno.turno}
                    onChange={e => setFormAluno({...formAluno, turno: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3.5 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                  >
                    <option value="manha">Manhã</option>
                    <option value="almoco">Almoço</option>
                    <option value="tarde">Tarde</option>
                    <option value="noite">Noite</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setModalNovoAlunoOpen(false)} disabled={salvando} className="flex-1 py-4 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl font-bold text-sm transition-all">
                Cancelar
              </button>
              <button 
                onClick={async () => {
                  if (!formAluno.nome) return alert('Nome é obrigatório.')
                  setSalvando(true)
                  const { error } = await cadastrarFilhoComVinculo({...formAluno, responsavel_id: user.id} as any, motoristaVinculado.id)
                  setSalvando(false)
                  if (error) alert('Falha: ' + error)
                  else { setModalNovoAlunoOpen(false); carregar() }
                }}
                disabled={salvando}
                className="flex-1 py-4 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 transition-all"
              >
                {salvando ? 'Salvando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
