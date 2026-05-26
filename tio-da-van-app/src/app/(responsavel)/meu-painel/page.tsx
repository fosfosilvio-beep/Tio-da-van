'use client'

import { useState, useEffect, useCallback } from 'react'
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

const STATUS_CONFIG = {
  aguardando:   { label: 'Aguardando',  icon: 'schedule',       bg: 'bg-tertiary-fixed',     color: 'text-secondary' },
  embarcado:    { label: 'Em Trânsito', icon: 'directions_bus', bg: 'bg-secondary-container', color: 'text-on-secondary-container' },
  desembarcado: { label: 'No Destino',  icon: 'check_circle',   bg: 'bg-surface-container',   color: 'text-on-surface-variant' },
}

export default function MeuPainelPage() {
  const { user, perfil } = useAuth()
  const supabase = createClient()

  const [filhos, setFilhos] = useState<FilhoStatus[]>([])
  const [loading, setLoading] = useState(true)

  const [modalVincularOpen, setModalVincularOpen] = useState(false)
  const [modalQrOpen, setModalQrOpen] = useState(false)
  const [modalNovoAlunoOpen, setModalNovoAlunoOpen] = useState(false)
  const [codigoVan, setCodigoVan] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [motoristaVinculado, setMotoristaVinculado] = useState<{ id: string; nome: string } | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [formAluno, setFormAluno] = useState({
    nome: '', escola: '', serie: '', data_nascimento: '', turno: 'manha',
  })

  const carregar = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const res = await supabase
      .from('alunos')
      .select('id, nome, foto_url, escola, serie, status_checkin, ausente_hoje, ultimo_checkin_at, rotas(nome_rota, turno, horario_inicio)')
      .eq('responsavel_id', user.id)
      .eq('ativo', true)
    setFilhos((res.data ?? []) as FilhoStatus[])
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

  const firstName = perfil?.nome?.split(' ')[0] ?? 'Usuário'

  return (
    <div className="w-full flex flex-col min-h-full pb-8">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-headline-lg font-bold text-on-surface tracking-tight">
            Bem-vindo, {firstName}!
          </h2>
          <p className="text-body-md text-on-surface-variant mt-1">
            Acompanhe a rotina de transporte dos seus filhos hoje.
          </p>
        </div>
        <button
          onClick={() => setModalVincularOpen(true)}
          className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-label-lg flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm self-start md:self-auto active:scale-95 duration-150"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Vincular novo filho
        </button>
      </div>

      {loading ? (
        <div className="space-y-4 w-full">
          {[1, 2].map(i => (
            <div key={i} className="h-40 rounded-xl bg-surface-container animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Coluna Principal */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Status Hoje */}
            <section>
              <h3 className="text-headline-sm font-bold text-on-surface mb-4">Status Hoje</h3>

              {filhos.length === 0 ? (
                <div className="bg-primary-container rounded-xl p-10 shadow-sm flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-on-primary/10 rounded-full flex items-center justify-center mb-5">
                    <span
                      className="material-symbols-outlined text-[40px] text-secondary-container"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      directions_bus
                    </span>
                  </div>
                  <h3 className="text-headline-md font-bold text-on-primary-container mb-2">
                    Nenhum filho vinculado
                  </h3>
                  <p className="text-body-md text-on-primary-container/70 mb-8 max-w-sm">
                    Você ainda não possui crianças cadastradas. Vincule usando o código fornecido pelo motorista.
                  </p>
                  <div className="w-full max-w-xs space-y-3">
                    <button
                      onClick={() => setModalVincularOpen(true)}
                      className="w-full bg-primary text-on-primary py-3 rounded-lg text-label-lg flex items-center justify-center gap-2 shadow-sm hover:bg-primary/90 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">person_add</span>
                      Vincular Filho
                    </button>
                    <button
                      onClick={() => setModalQrOpen(true)}
                      className="w-full bg-transparent text-on-primary-container border-2 border-on-primary-container/30 py-3 rounded-lg text-label-lg flex items-center justify-center gap-2 hover:bg-on-primary/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                      Crachá QR
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filhos.map(filho => {
                    const cfg = STATUS_CONFIG[filho.status_checkin]
                    return (
                      <div
                        key={filho.id}
                        className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(19,52,91,0.04)] border border-outline-variant/30 p-5 flex flex-col"
                      >
                        <div className="flex justify-between items-start mb-5">
                          <div className="flex gap-3 items-center">
                            <img
                              src={filho.foto_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(filho.nome)}&background=2d4b73&color=fff&size=80`}
                              alt={filho.nome}
                              className="w-12 h-12 rounded-full object-cover border-2 border-outline-variant"
                            />
                            <div>
                              <h4 className="text-headline-sm font-bold text-primary">{filho.nome}</h4>
                              <div className="flex items-center gap-1 text-label-md text-on-surface-variant mt-0.5">
                                <span className="material-symbols-outlined text-[14px]">location_on</span>
                                {filho.escola ?? 'Escola Padrão'}
                              </div>
                            </div>
                          </div>
                          <span className={`px-3 py-1.5 rounded-full text-label-md font-bold flex items-center gap-1.5 ${cfg.bg} ${cfg.color}`}>
                            <span
                              className="material-symbols-outlined text-[14px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              {cfg.icon}
                            </span>
                            {cfg.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-5">
                          <div>
                            <p className="text-label-md text-on-surface-variant uppercase tracking-wider mb-0.5">Previsão</p>
                            <p className="text-headline-md font-bold text-on-surface">12:45</p>
                          </div>
                          <div className="text-right">
                            <p className="text-label-md text-on-surface-variant uppercase tracking-wider mb-0.5">Motorista</p>
                            <p className="text-body-md font-semibold text-on-surface-variant">Carlos (Van 03)</p>
                          </div>
                        </div>

                        <a
                          href={`/meus-filhos?id=${filho.id}`}
                          className="w-full bg-surface-container-low text-primary py-2.5 rounded-lg text-label-lg font-bold flex items-center justify-center gap-2 hover:bg-surface-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">navigation</span>
                          Acompanhar Rastreio
                        </a>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            {/* Visão Geral */}
            {filhos.length > 0 && (
              <section>
                <h3 className="text-headline-sm font-bold text-on-surface mb-4">Visão Geral do Serviço</h3>
                <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(19,52,91,0.04)] border border-outline-variant/30 p-5 h-56 flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 transition-colors group">
                  <div className="w-14 h-14 bg-surface-container rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span
                      className="material-symbols-outlined text-[30px] text-primary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      directions_bus
                    </span>
                  </div>
                  <p className="text-headline-sm font-bold text-primary">Resumo Semanal</p>
                  <p className="text-body-md text-on-surface-variant mt-1">Visualizar histórico de viagens (Em breve)</p>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Direita */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* Avisos Recentes */}
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(19,52,91,0.04)] border border-outline-variant/30 p-5">
              <div className="flex items-center gap-2 mb-5">
                <span
                  className="material-symbols-outlined text-[20px] text-secondary-container"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  warning
                </span>
                <h3 className="text-headline-sm font-bold text-on-surface">Avisos Recentes</h3>
              </div>

              <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant">
                {[
                  {
                    title: 'Atraso devido à chuva',
                    body: 'A rota da Van 03 está com lentidão devido às fortes chuvas.',
                    time: 'Hoje, 11:30',
                    active: true,
                  },
                  {
                    title: 'Mensalidade Vencendo',
                    body: 'Lembrete: a mensalidade de Maio vence em 2 dias.',
                    time: 'Ontem, 09:00',
                    active: false,
                  },
                ].map((aviso, i) => (
                  <div key={i} className="relative flex items-start gap-4">
                    <div className={`w-[22px] h-[22px] rounded-full border-4 border-surface-container-lowest z-10 shrink-0 mt-0.5 ${aviso.active ? 'bg-primary' : 'bg-outline-variant'}`} />
                    <div className={`flex-1 p-3 rounded-lg border ${aviso.active ? 'bg-surface-container-low border-outline-variant/30' : 'bg-surface-container-lowest border-outline-variant/20'}`}>
                      <p className="text-label-lg font-bold text-on-surface">{aviso.title}</p>
                      <p className="text-label-md text-on-surface-variant mt-1 leading-relaxed">{aviso.body}</p>
                      <p className="text-label-md text-outline mt-2">{aviso.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full text-center text-label-lg font-bold text-primary pt-5 hover:underline">
                Ver todos os avisos
              </button>
            </div>

            {/* Fatura Atual */}
            <div className="bg-primary rounded-xl shadow-lg p-6 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <p className="text-label-md text-primary-fixed-dim uppercase tracking-wider mb-1">Fatura Atual</p>
              <p className="text-3xl font-bold text-on-primary mb-4">R$ 450,00</p>
              <div className="flex items-center gap-2 text-primary-fixed text-label-md mb-6">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                Vence em 10/06
              </div>
              <a
                href="/mensalidades"
                className="w-full bg-secondary-container text-on-secondary-container py-3 rounded-lg text-label-lg font-bold flex items-center justify-center hover:bg-secondary-container/90 transition-colors shadow-sm"
              >
                Pagar Agora
              </a>
            </div>

          </div>
        </div>
      )}

      {/* ── MODAL: Vincular Filho ── */}
      {modalVincularOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalVincularOpen(false)} />
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-8 rounded-xl w-full max-w-sm relative z-10 shadow-2xl flex flex-col">
            <button
              onClick={() => setModalVincularOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface bg-surface-container p-1.5 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <div className="w-12 h-12 bg-surface-container text-primary rounded-xl flex items-center justify-center mb-5">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>directions_bus</span>
            </div>
            <h2 className="text-headline-sm font-bold text-primary mb-1">Vincular à Van</h2>
            <p className="text-body-md text-on-surface-variant mb-6">Insira o código fornecido pelo Tio da Van.</p>
            <input
              type="text"
              placeholder="A7B-9X2"
              value={codigoVan}
              onChange={e => {
                let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                if (val.length > 3) val = val.slice(0, 3) + '-' + val.slice(3)
                setCodigoVan(val.slice(0, 7))
              }}
              className="w-full bg-surface-container border border-outline-variant text-on-surface text-center text-3xl font-mono tracking-[0.2em] uppercase rounded-xl py-4 mb-6 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant"
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
              className="w-full bg-primary text-on-primary py-3 rounded-lg text-label-lg font-bold shadow-sm disabled:opacity-50 hover:bg-primary/90 transition-colors"
            >
              {buscando ? 'Buscando...' : 'Buscar Van'}
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: Crachá QR ── */}
      {modalQrOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalQrOpen(false)} />
          <div className="bg-primary border border-primary-container p-8 rounded-xl w-full max-w-sm relative z-10 shadow-2xl flex flex-col items-center text-center">
            <button
              onClick={() => setModalQrOpen(false)}
              className="absolute top-4 right-4 text-primary-fixed-dim hover:text-on-primary bg-on-primary/10 p-1.5 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <h2 className="text-headline-sm font-bold text-on-primary mb-6">Crachá Digital</h2>
            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-lg mb-6">
              <QRCodeSVG value={filhos.length > 0 ? filhos[0].id : 'MOCK-QR-CODE'} size={180} />
            </div>
            <p className="text-body-md text-primary-fixed-dim mb-6">Apresente ao motorista no embarque.</p>
            <button
              onClick={() => setModalQrOpen(false)}
              className="w-full bg-on-primary/10 text-on-primary border border-on-primary/20 py-3 rounded-lg text-label-lg font-bold hover:bg-on-primary/20 transition-colors"
            >
              Fechar Crachá
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: Cadastro Novo Aluno ── */}
      {modalNovoAlunoOpen && motoristaVinculado && user && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !salvando && setModalNovoAlunoOpen(false)} />
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-6 md:p-8 rounded-xl w-full max-w-md relative z-10 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
            <h2 className="text-headline-sm font-bold text-primary mb-1">Cadastrar Aluno</h2>
            <p className="text-body-md text-on-surface-variant mb-6">
              Vinculando ao Tio: <strong>{motoristaVinculado.nome}</strong>
            </p>
            <div className="space-y-4">
              {[
                { label: 'Nome Completo *', key: 'nome', type: 'text', placeholder: 'Nome do aluno', full: true },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="text-label-md font-bold text-on-surface-variant mb-1 block">{label}</label>
                  <input
                    type={type}
                    value={(formAluno as any)[key]}
                    onChange={e => setFormAluno({ ...formAluno, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-4 py-2.5 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                {(['escola', 'serie'] as const).map(key => (
                  <div key={key}>
                    <label className="text-label-md font-bold text-on-surface-variant mb-1 block capitalize">{key === 'serie' ? 'Série / Ano' : 'Escola'}</label>
                    <input
                      type="text"
                      value={formAluno[key]}
                      onChange={e => setFormAluno({ ...formAluno, [key]: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-4 py-2.5 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-label-md font-bold text-on-surface-variant mb-1 block">Nascimento</label>
                  <input
                    type="date"
                    value={formAluno.data_nascimento}
                    onChange={e => setFormAluno({ ...formAluno, data_nascimento: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-4 py-2.5 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-label-md font-bold text-on-surface-variant mb-1 block">Turno</label>
                  <select
                    value={formAluno.turno}
                    onChange={e => setFormAluno({ ...formAluno, turno: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-4 py-2.5 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
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
                className="flex-1 bg-surface-container-lowest border border-outline-variant text-on-surface-variant py-3 rounded-lg text-label-lg font-bold hover:bg-surface-container-low transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (!formAluno.nome) return alert('Preencha o nome.')
                  setSalvando(true)
                  const { error } = await cadastrarFilhoComVinculo(
                    { ...formAluno, responsavel_id: user.id } as any,
                    motoristaVinculado.id
                  )
                  setSalvando(false)
                  if (error) alert('Erro: ' + error)
                  else { setModalNovoAlunoOpen(false); carregar() }
                }}
                disabled={salvando}
                className="flex-1 bg-primary text-on-primary py-3 rounded-lg text-label-lg font-bold shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
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
