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
    <div className="flex flex-col gap-6 relative w-full h-full">
      
      {/* ===== AVISO NENHUM FILHO ===== */}
      {!loading && filhos.length === 0 && (
        <div className="bg-amber-500/10 border border-amber-500/50 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <div className="flex items-center gap-4">
            <span className="text-2xl">⚠️</span>
            <div>
              <span className="font-bold text-amber-400 text-sm tracking-wide">ALERTA DO SISTEMA: Nenhum perfil vinculado — </span>
              <span className="text-amber-400/80 text-sm">Vincule os passageiros para iniciar o monitoramento em tempo real.</span>
            </div>
          </div>
          <button onClick={() => setModalVincularOpen(true)} className="px-5 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 rounded-xl text-amber-400 font-bold text-sm transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            INICIAR VÍNCULO
          </button>
        </div>
      )}

      {/* ===== SAUDAÇÃO ===== */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
        <div>
          <h1 className="font-black text-2xl md:text-3xl text-white tracking-wide mb-1 flex items-center gap-3">
            BEM-VINDO, {firstName.toUpperCase()}
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] animate-pulse"></span>
          </h1>
          <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">
            {renderDate()} // SYNC: ONLINE
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setModalQrOpen(true)} className="px-5 py-2.5 bg-slate-800/80 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800 text-cyan-400 rounded-xl font-bold flex items-center gap-2 transition-all backdrop-blur-md">
            <span>📱</span> CRACHÁ QR
          </button>
          <button onClick={() => setModalVincularOpen(true)} className="px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <span>➕</span> ADICIONAR
          </button>
        </div>
      </div>

      {/* ===== KPI CARDS (HUD STYLE) ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'PASSAGEIROS', value: filhos.length.toString(), sub: 'ATIVOS NA REDE', color: 'text-cyan-400', bgGlow: 'shadow-[0_0_20px_rgba(34,211,238,0.15)]', border: 'border-cyan-500/30', icon: '👦' },
          { label: 'FATURA ATUAL', value: formatCurrency(450), sub: 'VENCE EM 10/06', color: 'text-rose-400', bgGlow: 'shadow-[0_0_20px_rgba(244,63,94,0.15)]', border: 'border-rose-500/30', icon: '💳' },
          { label: 'VIAGENS HOJE', value: filhos.length.toString(), sub: 'MONITORAMENTO', color: 'text-emerald-400', bgGlow: 'shadow-[0_0_20px_rgba(52,211,153,0.15)]', border: 'border-emerald-500/30', icon: '🚐' },
          { label: 'ALERTAS', value: '2', sub: 'NÃO LIDOS', color: 'text-amber-400', bgGlow: 'shadow-[0_0_20px_rgba(251,191,36,0.15)]', border: 'border-amber-500/30', icon: '🔔' },
        ].map(card => (
          <div key={card.label} className={`bg-slate-800/60 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 relative overflow-hidden group hover:${card.border} transition-colors ${card.bgGlow}`}>
            {/* Background Gradient */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 bg-current opacity-10 rounded-full blur-2xl ${card.color}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700/50 flex items-center justify-center text-xl shadow-inner">
                {card.icon}
              </div>
              <span className={`text-[10px] font-bold tracking-widest uppercase ${card.color}`}>{card.label}</span>
            </div>
            <div className="text-2xl font-black text-white mb-1 tracking-tight">{card.value}</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* ===== GRADE INFERIOR ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Hoje */}
        <div className="lg:col-span-2 bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-6 border-b border-slate-700/50 pb-4">
            <h2 className="font-bold text-sm tracking-widest uppercase text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
              Rastreamento Ativo
            </h2>
            <Link href="/meus-filhos" className="text-xs text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider transition-colors">Abrir Mapa</Link>
          </div>
          
          <div className="flex flex-col gap-4">
            {filhos.length === 0 && (
              <div className="py-8 text-center text-slate-500 font-mono text-xs uppercase tracking-wider">
                -- Nenhum alvo detectado na área --
              </div>
            )}
            {filhos.map(filho => (
              <div key={filho.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/30 hover:border-cyan-500/30 transition-all group">
                <img src={filho.foto_url ?? `https://ui-avatars.com/api/?name=${filho.nome}&background=0f172a&color=22d3ee&size=40`} alt={filho.nome} className="w-10 h-10 rounded-lg object-cover border border-slate-700 group-hover:border-cyan-500/50 transition-colors" />
                <div className="flex-1">
                  <div className="font-bold text-sm text-slate-200 uppercase tracking-wide">{filho.nome}</div>
                  <div className="text-[10px] font-mono text-slate-500 mt-1 uppercase">LOC: {filho.escola ?? 'ESCOLA ELITE'}</div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border
                    ${filho.status_checkin === 'embarcado' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 
                      filho.status_checkin === 'desembarcado' ? 'bg-slate-800 text-slate-400 border-slate-700' : 
                      'bg-amber-500/10 text-amber-400 border-amber-500/30'}
                  `}>
                    {filho.status_checkin === 'embarcado' ? 'EM TRÂNSITO' : filho.status_checkin === 'desembarcado' ? 'NO DESTINO' : 'AGUARDANDO'}
                  </span>
                  <div className="text-[10px] font-mono text-slate-500 mt-2">ETA: 12:45</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Avisos Recentes */}
        <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <div className="flex justify-between items-center mb-6 border-b border-slate-700/50 pb-4">
            <h2 className="font-bold text-sm tracking-widest uppercase text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              Transmissões
            </h2>
            <span className="text-xs text-slate-400 hover:text-white font-bold uppercase tracking-wider cursor-pointer">Ver Log</span>
          </div>
          
          <div className="flex flex-col gap-4">
            {[
              { id: 1, title: 'ATRASO DE ROTA (CHUVA)', time: 'T-00:30', urgent: true },
              { id: 2, title: 'FATURA PENDENTE', time: 'T-24:00', urgent: false },
            ].map(aviso => (
              <div key={aviso.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/30 border border-slate-700/30">
                <div className={`mt-1 w-1.5 h-1.5 rounded-full ${aviso.urgent ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-slate-500'}`}></div>
                <div className="flex-1">
                  <div className="font-bold text-xs text-slate-300 uppercase tracking-wide">{aviso.title}</div>
                  <div className="text-[10px] font-mono text-slate-500 mt-1">{aviso.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MODAIS (HUD Style) ===== */}
      {/* Modal Vincular */}
      {modalVincularOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/80">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-indigo-500"></div>
            <button onClick={() => setModalVincularOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white">✕</button>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-4 text-3xl shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                🔗
              </div>
              <h2 className="font-black text-xl text-white tracking-widest uppercase">Vincular Módulo</h2>
              <p className="text-slate-400 text-xs mt-2 font-mono uppercase">Insira a chave de acesso do motorista</p>
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
              className="w-full bg-slate-950 border border-slate-700 text-center text-3xl font-mono text-cyan-400 tracking-[0.3em] uppercase rounded-xl p-5 mb-8 outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all placeholder:text-slate-700"
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
              className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${
                buscando || codigoVan.length < 6 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-cyan-500 text-slate-900 hover:bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
              }`}
            >
              {buscando ? 'BUSCANDO DADOS...' : 'AUTENTICAR'}
            </button>
          </div>
        </div>
      )}

      {/* Modal QR */}
      {modalQrOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/80">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-sm w-full relative shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center">
            <button onClick={() => setModalQrOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white">✕</button>
            <h2 className="font-black text-xl text-white tracking-widest uppercase mb-6">Identificador</h2>
            
            <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <QRCodeSVG value={filhos.length > 0 ? filhos[0].id : 'MOCK-QR'} size={200} />
            </div>
            
            <p className="text-cyan-400 text-xs font-mono uppercase mb-8 tracking-widest">Scanner Autorizado</p>
            
            <button onClick={() => setModalQrOpen(false)} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold uppercase tracking-widest transition-all">
              FECHAR PAINEL
            </button>
          </div>
        </div>
      )}

      {/* Modal Novo Aluno HUD */}
      {modalNovoAlunoOpen && motoristaVinculado && user && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/80">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-lg w-full relative shadow-[0_0_50px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-indigo-500"></div>
             <h2 className="font-black text-xl text-white tracking-widest uppercase mb-1">Registro de Alvo</h2>
             <p className="text-slate-400 text-xs font-mono uppercase mb-8">Vínculo Mestre: <strong className="text-cyan-400">{motoristaVinculado.nome}</strong></p>

             <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Designação Completa *</label>
                <input 
                  type="text" 
                  value={formAluno.nome}
                  onChange={e => setFormAluno({...formAluno, nome: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(34,211,238,0.1)] transition-all font-mono text-sm placeholder:text-slate-600" 
                  placeholder="Nome do passageiro" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Setor (Escola)</label>
                  <input 
                    type="text" 
                    value={formAluno.escola}
                    onChange={e => setFormAluno({...formAluno, escola: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 outline-none focus:border-cyan-500 font-mono text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nível (Série)</label>
                  <input 
                    type="text" 
                    value={formAluno.serie}
                    onChange={e => setFormAluno({...formAluno, serie: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 outline-none focus:border-cyan-500 font-mono text-sm" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Criação (Nasc.)</label>
                  <input 
                    type="date" 
                    value={formAluno.data_nascimento}
                    onChange={e => setFormAluno({...formAluno, data_nascimento: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 outline-none focus:border-cyan-500 font-mono text-sm [color-scheme:dark]" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Ciclo (Turno)</label>
                  <select 
                    value={formAluno.turno}
                    onChange={e => setFormAluno({...formAluno, turno: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 outline-none focus:border-cyan-500 font-mono text-sm appearance-none"
                  >
                    <option value="manha">Matutino</option>
                    <option value="almoco">Intermediário</option>
                    <option value="tarde">Vespertino</option>
                    <option value="noite">Noturno</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setModalNovoAlunoOpen(false)} disabled={salvando} className="flex-1 py-4 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all">
                ABORTAR
              </button>
              <button 
                onClick={async () => {
                  if (!formAluno.nome) return alert('Designação obrigatória.')
                  setSalvando(true)
                  const { error } = await cadastrarFilhoComVinculo({...formAluno, responsavel_id: user.id} as any, motoristaVinculado.id)
                  setSalvando(false)
                  if (error) alert('Falha: ' + error)
                  else { setModalNovoAlunoOpen(false); carregar() }
                }}
                disabled={salvando}
                className="flex-1 py-4 bg-cyan-500 text-slate-900 hover:bg-cyan-400 rounded-xl font-bold uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all"
              >
                {salvando ? 'PROCESSANDO...' : 'CONFIRMAR'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
