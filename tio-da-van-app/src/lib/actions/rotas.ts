'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/database.types'

// ============================================================
// ROTAS
// ============================================================

export async function criarRota(data: TablesInsert<'rotas'>) {
  const supabase = await createClient()

  const { data: rota, error } = await supabase
    .from('rotas')
    .insert(data)
    .select()
    .single()

  if (error) return { error: error.message, data: null }

  revalidatePath('/rotas')
  return { error: null, data: rota }
}

export async function atualizarRota(id: string, data: TablesUpdate<'rotas'>) {
  const supabase = await createClient()

  const { data: rota, error } = await supabase
    .from('rotas')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message, data: null }

  revalidatePath('/rotas')
  return { error: null, data: rota }
}

export async function deletarRota(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('rotas')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/rotas')
  return { error: null }
}

export async function buscarRotasDoMotorista() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('rotas')
    .select(`
      *,
      pontos_embarque(*)
    `)
    .order('turno', { ascending: true })
    .order('nome_rota', { ascending: true })

  if (error) return { error: error.message, data: null }
  return { error: null, data }
}

// ============================================================
// PONTOS DE EMBARQUE
// ============================================================

export async function criarPonto(data: TablesInsert<'pontos_embarque'>) {
  const supabase = await createClient()

  const { data: ponto, error } = await supabase
    .from('pontos_embarque')
    .insert(data)
    .select()
    .single()

  if (error) return { error: error.message, data: null }

  revalidatePath('/rotas')
  return { error: null, data: ponto }
}

export async function atualizarPonto(id: string, data: TablesUpdate<'pontos_embarque'>) {
  const supabase = await createClient()

  const { data: ponto, error } = await supabase
    .from('pontos_embarque')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message, data: null }

  revalidatePath('/rotas')
  return { error: null, data: ponto }
}

export async function deletarPonto(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('pontos_embarque')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/rotas')
  return { error: null }
}

export async function reordenarPontos(pontos: { id: string; ordem: number }[]) {
  const supabase = await createClient()

  const updates = pontos.map(({ id, ordem }) =>
    supabase.from('pontos_embarque').update({ ordem }).eq('id', id)
  )

  const results = await Promise.all(updates)
  const erros = results.filter(r => r.error)

  if (erros.length > 0) return { error: 'Erro ao reordenar pontos' }

  revalidatePath('/rotas')
  return { error: null }
}
