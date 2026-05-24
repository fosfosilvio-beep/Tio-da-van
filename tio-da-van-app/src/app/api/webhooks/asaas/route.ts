import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    // Instanciar dentro do handler para evitar erros de build estático
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Credenciais do Supabase ausentes no Webhook')
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const ASAAS_WEBHOOK_SECRET = process.env.ASAAS_WEBHOOK_SECRET
    // Validação básica do token de webhook (se configurado)
    if (ASAAS_WEBHOOK_SECRET) {
      const token = req.headers.get('asaas-access-token')
      if (token !== ASAAS_WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const payload = await req.json()
    console.log('🔔 Asaas Webhook recebido:', payload.event)

    const paymentId = payload.payment?.id
    const status = payload.payment?.status

    if (!paymentId) return NextResponse.json({ success: true })

    // Mapeamento de status Asaas -> Nosso DB
    let novoStatus: 'pendente' | 'pago' | 'vencido' | 'cancelado' | null = null

    switch (status) {
      case 'RECEIVED':
      case 'CONFIRMED':
        novoStatus = 'pago'
        break
      case 'OVERDUE':
        novoStatus = 'vencido'
        break
      case 'REFUNDED':
      case 'DELETED':
        novoStatus = 'cancelado'
        break
    }

    if (novoStatus) {
      // 1. Atualizar banco de dados
      const { data: cobranca, error } = await supabase
        .from('cobrancas')
        .update({
          status: novoStatus,
          data_pagamento: novoStatus === 'pago' ? payload.payment.paymentDate ?? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('asaas_payment_id', paymentId)
        .select('*, alunos(nome)')
        .single()

      if (error) {
        console.error('Erro ao atualizar cobrança:', error)
      } else if (cobranca && novoStatus === 'pago') {
        // 2. Se foi pago, criar notificação para o motorista/responsável
        await supabase.from('notificacoes').insert({
          destinatario_id: cobranca.motorista_id, // Ex: notificar o motorista que pagou
          tipo: 'cobranca',
          titulo: 'Pagamento Recebido!',
          mensagem: `A cobrança de ${(cobranca.alunos as any)?.nome} (R$ ${cobranca.valor}) foi paga com sucesso.`,
          canal: 'app'
        })
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erro no webhook Asaas:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
