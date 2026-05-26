'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Wallet,
  Copy,
  FileDown,
  ListFilter,
  ReceiptText,
  CheckCircle2,
  CalendarDays,
} from 'lucide-react'

const HISTORICO = [
  { mes: 'Outubro 2023',  data: '08/10/2023', valor: 'R$ 450,00' },
  { mes: 'Setembro 2023', data: '09/09/2023', valor: 'R$ 450,00' },
  { mes: 'Agosto 2023',   data: '10/08/2023', valor: 'R$ 450,00' },
  { mes: 'Julho 2023',    data: '07/07/2023', valor: 'R$ 450,00' },
]

export default function MensalidadesPage() {
  return (
    <div className="w-full space-y-6 pb-8">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Histórico Financeiro</h1>
        <p className="text-sm text-muted-foreground mt-1">Acompanhe seus pagamentos e mensalidades.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Card — Mensalidade Atual */}
        <Card className="lg:col-span-5 flex flex-col">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <Wallet className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <CardTitle>Mensalidade Atual</CardTitle>
                  <CardDescription className="mt-0.5 flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" /> Vencimento: 10/11/2023
                  </CardDescription>
                </div>
              </div>
              <Badge variant="warning">Pendente</Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col justify-between gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Valor a pagar</p>
              <p className="text-4xl font-bold text-primary tracking-tight leading-none">R$ 450,00</p>
              <p className="text-xs text-muted-foreground mt-2">
                Referente a: Transporte Escolar — Novembro
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button className="flex-1">
                <Copy className="h-4 w-4" />
                Copiar Código Pix
              </Button>
              <Button variant="outline" className="flex-1">
                <FileDown className="h-4 w-4" />
                Baixar Boleto
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card — Resumo */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Resumo do Ano</CardTitle>
            <CardDescription>Visão geral dos pagamentos em 2023.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border border-border p-4">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Total Pago</p>
                <p className="text-2xl font-bold text-foreground mt-1">R$ 4.500</p>
                <Badge variant="success" className="mt-2">
                  <CheckCircle2 className="h-3 w-3" /> 10 meses
                </Badge>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Pendente</p>
                <p className="text-2xl font-bold text-foreground mt-1">R$ 450</p>
                <Badge variant="warning" className="mt-2">1 mês</Badge>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Próx. Vencimento</p>
                <p className="text-2xl font-bold text-foreground mt-1">10/11</p>
                <p className="text-xs text-muted-foreground mt-2">Em 5 dias</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Histórico */}
        <Card className="lg:col-span-12">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <CardDescription>Todos os pagamentos confirmados.</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              <ListFilter className="h-4 w-4" />
              Filtrar
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês/Referência</TableHead>
                  <TableHead>Data do Pagamento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {HISTORICO.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium text-foreground">{item.mes}</TableCell>
                    <TableCell className="text-muted-foreground">{item.data}</TableCell>
                    <TableCell className="font-semibold text-foreground">{item.valor}</TableCell>
                    <TableCell>
                      <Badge variant="success">
                        <CheckCircle2 className="h-3 w-3" />
                        Pago
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" title="Ver Recibo">
                        <ReceiptText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
