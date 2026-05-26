'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/providers/AuthProvider'
import { validarCodigoVan, cadastrarFilhoComVinculo } from '@/lib/actions/alunos'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  UserPlus,
  Bus,
  QrCode,
  MapPin,
  Navigation,
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react'

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

const STATUS_CONFIG: Record<
  FilhoStatus['status_checkin'],
  { label: string; Icon: typeof Clock; variant: 'warning' | 'info' | 'success' }
> = {
  aguardando:   { label: 'Aguardando',  Icon: Clock,          variant: 'warning' },
  embarcado:    { label: 'Em Trânsito', Icon: Bus,            variant: 'info' },
  desembarcado: { label: 'No Destino',  Icon: CheckCircle2,   variant: 'success' },
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
    <div className="w-full space-y-8 pb-8">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Bem-vindo, {firstName}!
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe a rotina de transporte dos seus filhos hoje.
          </p>
        </div>
        <Button onClick={() => setModalVincularOpen(true)} className="self-start md:self-auto">
          <UserPlus className="h-4 w-4" />
          Vincular novo filho
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Main column */}
          <div className="lg:col-span-8 space-y-6">

            {/* Status Hoje */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Status Hoje</h2>

              {filhos.length === 0 ? (
                <Card className="border-dashed bg-muted/30">
                  <CardContent className="flex flex-col items-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                      <Bus className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Nenhum filho vinculado</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                      Você ainda não possui crianças cadastradas. Vincule usando o código fornecido pelo motorista.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 w-full max-w-sm">
                      <Button className="flex-1" onClick={() => setModalVincularOpen(true)}>
                        <UserPlus className="h-4 w-4" /> Vincular Filho
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => setModalQrOpen(true)}>
                        <QrCode className="h-4 w-4" /> Crachá QR
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filhos.map(filho => {
                    const cfg = STATUS_CONFIG[filho.status_checkin]
                    const StatusIcon = cfg.Icon
                    return (
                      <Card key={filho.id}>
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start mb-5 gap-3">
                            <div className="flex gap-3 items-center min-w-0">
                              <img
                                src={filho.foto_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(filho.nome)}&background=13345b&color=fff&size=80`}
                                alt={filho.nome}
                                className="w-12 h-12 rounded-full object-cover border-2 border-border shrink-0"
                              />
                              <div className="min-w-0">
                                <h3 className="font-bold text-foreground truncate">{filho.nome}</h3>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                  <MapPin className="h-3 w-3 shrink-0" />
                                  <span className="truncate">{filho.escola ?? 'Escola Padrão'}</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant={cfg.variant}>
                              <StatusIcon className="h-3 w-3" />
                              {cfg.label}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-5">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Previsão</p>
                              <p className="text-xl font-bold text-foreground">12:45</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Motorista</p>
                              <p className="text-sm font-semibold text-foreground">Carlos (Van 03)</p>
                            </div>
                          </div>

                          <Button asChild variant="secondary" className="w-full">
                            <Link href={`/meus-filhos?id=${filho.id}`}>
                              <Navigation className="h-4 w-4" />
                              Acompanhar Rastreio
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </section>

            {/* Visão Geral */}
            {filhos.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Visão Geral do Serviço</h2>
                <Card className="hover:border-primary/30 transition-colors cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-bold text-foreground">Resumo Semanal</p>
                    <p className="text-sm text-muted-foreground mt-1">Visualizar histórico de viagens (Em breve)</p>
                  </CardContent>
                </Card>
              </section>
            )}
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 space-y-6">

            {/* Avisos */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-5">
                  <AlertTriangle className="h-5 w-5 text-secondary" />
                  <h3 className="font-bold text-foreground">Avisos Recentes</h3>
                </div>

                <div className="space-y-4 relative before:absolute before:left-[10px] before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
                  {[
                    { title: 'Atraso devido à chuva', body: 'A rota da Van 03 está com lentidão devido às fortes chuvas.', time: 'Hoje, 11:30', active: true },
                    { title: 'Mensalidade Vencendo', body: 'Lembrete: a mensalidade de Maio vence em 2 dias.', time: 'Ontem, 09:00', active: false },
                  ].map((aviso, i) => (
                    <div key={i} className="relative flex items-start gap-4">
                      <div className={`w-[20px] h-[20px] rounded-full border-4 border-card z-10 shrink-0 mt-1 ${aviso.active ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
                      <div className={`flex-1 p-3 rounded-lg border ${aviso.active ? 'bg-muted/50 border-border' : 'bg-card border-border/40'}`}>
                        <p className="text-sm font-bold text-foreground">{aviso.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{aviso.body}</p>
                        <p className="text-[11px] text-muted-foreground/80 mt-2">{aviso.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="link" className="w-full mt-4">Ver todos os avisos</Button>
              </CardContent>
            </Card>

            {/* Fatura */}
            <Card className="bg-primary text-primary-foreground border-primary overflow-hidden relative">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <CardContent className="p-6 relative">
                <p className="text-[11px] uppercase tracking-wider opacity-80 mb-1">Fatura Atual</p>
                <p className="text-3xl font-bold mb-4">R$ 450,00</p>
                <div className="flex items-center gap-2 text-sm opacity-90 mb-6">
                  <CalendarDays className="h-4 w-4" />
                  Vence em 10/06
                </div>
                <Button asChild variant="secondary" className="w-full bg-white text-primary hover:bg-white/90">
                  <Link href="/mensalidades">Pagar Agora</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* MODAL: Vincular Filho */}
      <Dialog open={modalVincularOpen} onOpenChange={setModalVincularOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-2">
              <Bus className="h-6 w-6" />
            </div>
            <DialogTitle>Vincular à Van</DialogTitle>
            <DialogDescription>Insira o código fornecido pelo Tio da Van.</DialogDescription>
          </DialogHeader>

          <Input
            type="text"
            placeholder="A7B-9X2"
            value={codigoVan}
            onChange={e => {
              let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
              if (val.length > 3) val = val.slice(0, 3) + '-' + val.slice(3)
              setCodigoVan(val.slice(0, 7))
            }}
            className="text-center text-2xl font-mono tracking-[0.2em] uppercase py-6 h-auto"
            maxLength={7}
          />

          <DialogFooter className="sm:justify-stretch">
            <Button
              className="w-full"
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
            >
              {buscando ? 'Buscando...' : 'Buscar Van'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: Crachá QR */}
      <Dialog open={modalQrOpen} onOpenChange={setModalQrOpen}>
        <DialogContent className="sm:max-w-sm bg-primary text-primary-foreground border-primary">
          <DialogHeader>
            <DialogTitle className="text-center text-primary-foreground">Crachá Digital</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-5">
            <div className="bg-white p-5 rounded-xl shadow-lg">
              <QRCodeSVG value={filhos.length > 0 ? filhos[0].id : 'MOCK-QR-CODE'} size={180} />
            </div>
            <p className="text-sm opacity-90 text-center">Apresente ao motorista no embarque.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: Cadastro Novo Aluno */}
      <Dialog open={modalNovoAlunoOpen} onOpenChange={open => !salvando && setModalNovoAlunoOpen(open)}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastrar Aluno</DialogTitle>
            <DialogDescription>
              Vinculando ao Tio: <strong>{motoristaVinculado?.nome}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formAluno.nome}
                onChange={e => setFormAluno({ ...formAluno, nome: e.target.value })}
                placeholder="Nome do aluno"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="escola">Escola</Label>
                <Input
                  id="escola"
                  value={formAluno.escola}
                  onChange={e => setFormAluno({ ...formAluno, escola: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="serie">Série / Ano</Label>
                <Input
                  id="serie"
                  value={formAluno.serie}
                  onChange={e => setFormAluno({ ...formAluno, serie: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="nasc">Nascimento</Label>
                <Input
                  id="nasc"
                  type="date"
                  value={formAluno.data_nascimento}
                  onChange={e => setFormAluno({ ...formAluno, data_nascimento: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="turno">Turno</Label>
                <select
                  id="turno"
                  value={formAluno.turno}
                  onChange={e => setFormAluno({ ...formAluno, turno: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="manha">Manhã</option>
                  <option value="almoco">Almoço</option>
                  <option value="tarde">Tarde</option>
                  <option value="noite">Noite</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setModalNovoAlunoOpen(false)}
              disabled={salvando}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={async () => {
                if (!formAluno.nome) return alert('Preencha o nome.')
                if (!motoristaVinculado || !user) return
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
            >
              {salvando ? 'Salvando...' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
