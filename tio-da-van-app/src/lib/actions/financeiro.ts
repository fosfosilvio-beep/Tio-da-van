'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/database.types'
import { enviarMensagemWhatsApp } from '@/lib/evolution'
import { createPayment, createOrGetCustomer } from '@/lib/asaas/client'

// ============================================================
// COBRANÇAS
// ============================================================

export async function criarCobranca(data: TablesInsert<'cobrancas'>) {
  const supabase = await createClient()

  // 1. Integrar com Asaas
  const { data: alunoInfo } = await supabase
    .from('alunos')
    .select('nome, perfis!alunos_responsavel_id_fkey(nome)')
    .eq('id', data.aluno_id)
    .single()

  const responsavel = alunoInfo?.perfis as unknown as { nome: string } | null

  // Cria cliente fictício ou real no Asaas
  const customerId = await createOrGetCustomer({
    name: responsavel?.nome ?? 'Responsável Padrão',
    cpfCnpj: '00000000000', // Mock - idealmente viria do perfil
  })

  // Cria cobrança no Asaas
  const asaasPay = await createPayment({
    customer: customerId,
    billingType: 'BOLETO',
    value: data.valor,
    dueDate: data.data_vencimento,
    description: `Mensalidade Tio da Van - ${alunoInfo?.nome ?? ''}`,
  })

  // 2. Inserir no Supabase com vínculos do Asaas
  const cobrancaData = {
    ...data,
    asaas_payment_id: asaasPay.id,
    url_boleto: asaasPay.bankSlipUrl ?? asaasPay.invoiceUrl,
  }

  const { data: cobranca, error } = await supabase
    .from('cobrancas')
    .insert(cobrancaData)
    .select()
    .single()

  if (error) return { error: error.message, data: null }

  revalidatePath('/financeiro')
  return { error: null, data: cobranca }
}

export async function gerarCobrancasMensais(
  rotaId: string,
  valor: number,
  mesReferencia: string,
  dataVencimento: string
) {
  const supabase = await createClient()

  // Buscar todos os alunos ativos da rota
  const { data: alunos, error: erroAlunos } = await supabase
    .from('alunos')
    .select('id, nome, perfis!alunos_responsavel_id_fkey(nome), motoristas_perfil:rotas!inner(motorista_id)')
    .eq('rota_id', rotaId)
    .eq('ativo', true)

  if (erroAlunos || !alunos?.length) return { error: erroAlunos?.message ?? 'Sem alunos', criadas: 0 }

  // Extrair motorista_id da rota
  const { data: rota } = await supabase
    .from('rotas')
    .select('motorista_id')
    .eq('id', rotaId)
    .single()

  if (!rota) return { error: 'Rota não encontrada', criadas: 0 }

  const cobrancas: TablesInsert<'cobrancas'>[] = []

  // Para cada aluno, gera no Asaas e depois insere
  for (const aluno of alunos) {
    const responsavel = aluno.perfis as unknown as { nome: string } | null

    const customerId = await createOrGetCustomer({
      name: responsavel?.nome ?? 'Responsável Padrão',
      cpfCnpj: '00000000000',
    })

    const asaasPay = await createPayment({
      customer: customerId,
      billingType: 'BOLETO',
      value: valor,
      dueDate: dataVencimento,
      description: `Mensalidade Tio da Van - ${aluno.nome} (${mesReferencia})`,
    })

    cobrancas.push({
      aluno_id: aluno.id,
      motorista_id: rota.motorista_id,
      valor,
      mes_referencia: mesReferencia,
      data_vencimento: dataVencimento,
      tipo: 'mensalidade',
      status: 'pendente',
      asaas_payment_id: asaasPay.id,
      url_boleto: asaasPay.bankSlipUrl ?? asaasPay.invoiceUrl,
    })
  }

  const { data: criadas, error } = await supabase
    .from('cobrancas')
    .insert(cobrancas)
    .select()

  if (error) return { error: error.message, criadas: 0 }

  revalidatePath('/financeiro')
  return { error: null, criadas: criadas.length }
}

export async function atualizarStatusCobranca(
  id: string,
  status: 'pago' | 'cancelado',
  dataPagamento?: string
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('cobrancas')
    .update({
      status,
      data_pagamento: dataPagamento ?? null,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/financeiro')
  revalidatePath('/dashboard')
  return { error: null }
}

export async function enviarLembreteCobranca(cobrancaId: string) {
  const supabase = await createClient()

  const { data: cobranca, error } = await supabase
    .from('cobrancas')
    .select(`
      *,
      alunos(nome, responsavel_id, perfis!alunos_responsavel_id_fkey(telefone, nome))
    `)
    .eq('id', cobrancaId)
    .single()

  if (error || !cobranca) return { error: 'Cobrança não encontrada' }

  const aluno = cobranca.alunos as unknown as {
    nome: string
    responsavel_id: string
    perfis: { telefone: string | null; nome: string }
  }

  const vencimento = new Date(cobranca.data_vencimento).toLocaleDateString('pt-BR')
  const valor = cobranca.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  const mensagem = `💰 Olá! Lembrete: a mensalidade de ${aluno.nome} referente a ${cobranca.mes_referencia ?? 'este mês'} vence em ${vencimento}. Valor: ${valor}. Qualquer dúvida, entre em contato!`

  // Notificação interna
  await supabase.from('notificacoes').insert({
    destinatario_id: aluno.responsavel_id,
    tipo: 'cobranca',
    titulo: `Lembrete: mensalidade de ${aluno.nome}`,
    mensagem,
    canal: 'ambos',
  })

  // WhatsApp
  if (aluno.perfis?.telefone) {
    await enviarMensagemWhatsApp(aluno.perfis.telefone, mensagem)
  }

  return { error: null }
}

export async function buscarResumoFinanceiro(mes: string) {
  const supabase = await createClient()

  const [cobrancas, despesas] = await Promise.all([
    supabase
      .from('cobrancas')
      .select('valor, status, tipo, data_vencimento')
      .eq('mes_referencia', mes),
    supabase
      .from('despesas')
      .select('valor, categoria, data_despesa')
      .gte('data_despesa', `${mes}-01`)
      .lte('data_despesa', `${mes}-31`),
  ])

  const receitaTotal = (cobrancas.data ?? [])
    .filter(c => c.status === 'pago')
    .reduce((acc, c) => acc + c.valor, 0)

  const pendente = (cobrancas.data ?? [])
    .filter(c => c.status === 'pendente')
    .reduce((acc, c) => acc + c.valor, 0)

  const vencido = (cobrancas.data ?? [])
    .filter(c => c.status === 'vencido')
    .reduce((acc, c) => acc + c.valor, 0)

  const despesaTotal = (despesas.data ?? [])
    .reduce((acc, d) => acc + d.valor, 0)

  return {
    error: null,
    data: {
      receita: receitaTotal,
      pendente,
      vencido,
      despesas: despesaTotal,
      lucro: receitaTotal - despesaTotal,
      cobrancas: cobrancas.data ?? [],
      despesasPorCategoria: despesas.data ?? [],
    }
  }
}

// ============================================================
// DESPESAS
// ============================================================

export async function criarDespesa(data: TablesInsert<'despesas'>) {
  const supabase = await createClient()

  const { data: despesa, error } = await supabase
    .from('despesas')
    .insert(data)
    .select()
    .single()

  if (error) return { error: error.message, data: null }

  revalidatePath('/financeiro')
  return { error: null, data: despesa }
}

export async function atualizarDespesa(id: string, data: TablesUpdate<'despesas'>) {
  const supabase = await createClient()

  const { data: despesa, error } = await supabase
    .from('despesas')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message, data: null }

  revalidatePath('/financeiro')
  return { error: null, data: despesa }
}

export async function deletarDespesa(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('despesas').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/financeiro')
  return { error: null }
}

export async function buscarDespesas(filtros?: {
  categoria?: string
  mes?: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from('despesas')
    .select('*')
    .order('data_despesa', { ascending: false })

  if (filtros?.categoria) query = query.eq('categoria', filtros.categoria as any)
  if (filtros?.mes) {
    query = query
      .gte('data_despesa', `${filtros.mes}-01`)
      .lte('data_despesa', `${filtros.mes}-31`)
  }

  const { data, error } = await query

  if (error) return { error: error.message, data: null }
  return { error: null, data }
}
