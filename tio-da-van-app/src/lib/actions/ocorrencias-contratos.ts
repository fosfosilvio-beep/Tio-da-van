'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { TablesInsert } from '@/lib/supabase/database.types'

// ============================================================
// OCORRÊNCIAS
// ============================================================

export async function criarOcorrencia(data: TablesInsert<'ocorrencias'>) {
  const supabase = await createClient()

  const { data: ocorrencia, error } = await supabase
    .from('ocorrencias')
    .insert(data)
    .select()
    .single()

  if (error) return { error: error.message, data: null }

  revalidatePath('/ocorrencias')
  return { error: null, data: ocorrencia }
}

export async function buscarOcorrencias(filtros?: {
  aluno_id?: string
  tipo?: string
  severidade?: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from('ocorrencias')
    .select(`
      *,
      alunos(id, nome, foto_url, escola)
    `)
    .order('created_at', { ascending: false })

  if (filtros?.aluno_id) query = query.eq('aluno_id', filtros.aluno_id)
  if (filtros?.tipo) query = query.eq('tipo', filtros.tipo as any)
  if (filtros?.severidade) query = query.eq('severidade', filtros.severidade as any)

  const { data, error } = await query

  if (error) return { error: error.message, data: null }
  return { error: null, data }
}

// ============================================================
// CONTRATOS
// ============================================================

export async function criarContrato(data: TablesInsert<'contratos'>) {
  const supabase = await createClient()

  const { data: contrato, error } = await supabase
    .from('contratos')
    .insert(data)
    .select()
    .single()

  if (error) return { error: error.message, data: null }

  revalidatePath('/contratos')
  return { error: null, data: contrato }
}

export async function atualizarStatusContrato(
  id: string,
  status: 'ativo' | 'encerrado'
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('contratos')
    .update({ status, data_fim: status === 'encerrado' ? new Date().toISOString().split('T')[0] : null })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/contratos')
  return { error: null }
}

export async function buscarContratos(filtros?: {
  status?: string
  aluno_id?: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from('contratos')
    .select(`
      *,
      alunos(id, nome, foto_url, escola, serie)
    `)
    .order('created_at', { ascending: false })

  if (filtros?.status) query = query.eq('status', filtros.status as any)
  if (filtros?.aluno_id) query = query.eq('aluno_id', filtros.aluno_id)

  const { data, error } = await query

  if (error) return { error: error.message, data: null }
  return { error: null, data }
}

// ============================================================
// NOTIFICAÇÕES
// ============================================================

export async function marcarNotificacaoLida(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('notificacoes')
    .update({ lida: true })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/')
  return { error: null }
}

export async function marcarTodasLidas() {
  const supabase = await createClient()

  const { error } = await supabase
    .from('notificacoes')
    .update({ lida: true })
    .eq('lida', false)

  if (error) return { error: error.message }

  revalidatePath('/')
  return { error: null }
}

export async function buscarNotificacoes(apenasNaoLidas = false) {
  const supabase = await createClient()

  let query = supabase
    .from('notificacoes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (apenasNaoLidas) query = query.eq('lida', false)

  const { data, error } = await query

  if (error) return { error: error.message, data: null }
  return { error: null, data }
}
