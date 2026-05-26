'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MapPin, Info, Phone, CalendarX, Home, Bus, School, CheckCircle2 } from 'lucide-react'

type TimelineStep = {
  status: 'done' | 'current' | 'pending'
  Icon: typeof Home
  title: string
  subtitle: string
  meta?: string
}

const TIMELINE: TimelineStep[] = [
  { status: 'done',    Icon: Home,         title: 'Casa',                  subtitle: 'R. das Flores, 123', meta: '07:10' },
  { status: 'current', Icon: Bus,          title: 'Na Van (Em trânsito)',  subtitle: 'Chegada prevista',   meta: '07:45' },
  { status: 'pending', Icon: School,       title: 'Escola Elite',          subtitle: 'Av. Principal, 1000' },
]

export default function MeusFilhosPage() {
  return (
    <div className="w-full space-y-6 pb-8">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Rastreamento em Tempo Real</h1>
        <p className="text-sm text-muted-foreground mt-1">Acompanhe a localização e o status atual do transporte.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left — Map + Info */}
        <div className="lg:col-span-8 space-y-4">

          <Card className="overflow-hidden">
            <div className="relative h-[440px] bg-muted">
              <div
                className="absolute inset-0 opacity-60 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://maps.googleapis.com/maps/api/staticmap?center=-23.5505,-46.6333&zoom=14&size=800x500&maptype=roadmap')",
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <Card className="bg-background/95 backdrop-blur shadow-lg">
                  <CardContent className="px-5 py-4 flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm font-bold text-foreground">Slot do Google Maps</p>
                    <p className="text-xs text-muted-foreground">Será integrado na próxima fase</p>
                  </CardContent>
                </Card>
              </div>

              {/* Status overlay top */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <Badge variant="info" className="shadow-sm">
                  <Bus className="h-3.5 w-3.5" />
                  Van em movimento
                </Badge>
                <Badge variant="outline" className="bg-background/95 backdrop-blur shadow-sm">
                  Atualizado há 12s
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="flex items-center gap-3 p-4">
              <Info className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm text-foreground">O sinal do GPS é atualizado a cada 30 segundos para maior precisão.</p>
            </CardContent>
          </Card>
        </div>

        {/* Right — Student + Timeline + Actions */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-border">
                <AvatarImage src="https://ui-avatars.com/api/?name=Lucas+Oliveira&background=13345b&color=fff&size=80" alt="Lucas Oliveira" />
                <AvatarFallback className="bg-primary text-primary-foreground">LO</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg">Lucas Oliveira</CardTitle>
                <Badge variant="info" className="w-fit">
                  <Bus className="h-3 w-3" />
                  Embarcado às 07:15
                </Badge>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6 space-y-6">
            {/* Timeline */}
            <ol className="relative space-y-6 ml-2">
              <div className="absolute top-3 bottom-3 left-[9px] w-0.5 bg-border" />

              {TIMELINE.map((step, i) => (
                <li key={i} className="relative flex gap-4">
                  <div className={
                    step.status === 'done'    ? 'w-5 h-5 rounded-full bg-primary border-4 border-card z-10 mt-0.5 shrink-0' :
                    step.status === 'current' ? 'w-5 h-5 rounded-full bg-card border-[5px] border-secondary z-10 mt-0.5 shrink-0' :
                                                'w-5 h-5 rounded-full bg-muted border-4 border-card z-10 mt-0.5 shrink-0'
                  } />
                  <div className="flex-1 min-w-0">
                    <p className={
                      step.status === 'pending' ? 'text-sm font-bold text-muted-foreground' :
                      step.status === 'current' ? 'text-sm font-bold text-primary' :
                                                  'text-sm font-bold text-foreground'
                    }>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {step.subtitle}{step.meta ? ` · ${step.meta}` : ''}
                    </p>
                  </div>
                  {step.status === 'done' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-1" />
                  ) : null}
                </li>
              ))}
            </ol>

            <Separator />

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full">
                <Phone className="h-4 w-4" />
                Contatar Motorista
              </Button>
              <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/5">
                <CalendarX className="h-4 w-4" />
                Informar Ausência Amanhã
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
