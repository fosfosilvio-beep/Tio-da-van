'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/database.types'

// ============================================================
// ALUNOS
// ============================================================

export async function criarAluno(data: TablesInsert<'alunos'>) {
  const supabase = await createClient()

  const { data: aluno, error } = await supabase
    .from('alunos')
    .insert(data)
    .select()
    .single()

  if (error) return { error: error.message, data: null }

  revalidatePath('/alunos')
  revalidatePath('/dashboard')
  return { error: null, data: aluno }
}

export async function atualizarAluno(id: string, data: TablesUpdate<'alunos'>) {
  const supabase = await createClient()

  const { data: aluno, error } = await supabase
    .from('alunos')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message, data: null }

  revalidatePath('/alunos')
  revalidatePath('/chamada')
  return { error: null, data: aluno }
}

export async function deletarAluno(id: string) {
  const supabase = await createClient()

  // Soft delete: marcar como inativo ao invés de deletar
  const { error } = await supabase
    .from('alunos')
    .update({ ativo: false })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/alunos')
  revalidatePath('/dashboard')
  return { error: null }
}

export async function buscarAlunos(filtros?: {
  ativo?: boolean
  rota_id?: string
  escola?: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from('alunos')
    .select(`
      *,
      rotas(id, nome_rota, turno, horario_inicio),
      pontos_embarque(id, nome, lat, lng)
    `)
    .order('nome', { ascending: true })

  if (filtros?.ativo !== undefined) query = query.eq('ativo', filtros.ativo)
  if (filtros?.rota_id) query = query.eq('rota_id', filtros.rota_id)
  if (filtros?.escola) query = query.ilike('escola', `%${filtros.escola}%`)

  const { data, error } = await query

  if (error) return { error: error.message, data: null }
  return { error: null, data }
}

export async function buscarAlunoById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('alunos')
    .select(`
      *,
      rotas(*),
      pontos_embarque(*)
    `)
    .eq('id', id)
    .single()

  if (error) return { error: error.message, data: null }
  return { error: null, data }
}

export async function buscarAniversariantes() {
  const supabase = await createClient()

  // Alunos ativos com data de nascimento no mês atual ou próximo
  const hoje = new Date()
  const mesAtual = hoje.getMonth() + 1
  const mesProximo = mesAtual === 12 ? 1 : mesAtual + 1

  const { data, error } = await supabase
    .from('alunos')
    .select('id, nome, foto_url, data_nascimento, escola, serie')
    .eq('ativo', true)
    .not('data_nascimento', 'is', null)
    .or(
      `data_nascimento.gte.${hoje.getFullYear()}-${String(mesAtual).padStart(2,'0')}-01,` +
      `data_nascimento.lte.${hoje.getFullYear()}-${String(mesProximo).padStart(2,'0')}-28`
    )
    .order('data_nascimento', { ascending: true })

  if (error) return { error: error.message, data: null }
  return { error: null, data }
}

export async function vincularAlunoARota(
  alunoId: string,
  rotaId: string,
  pontoId?: string
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('alunos')
    .update({ rota_id: rotaId, ponto_embarque_id: pontoId ?? null })
    .eq('id', alunoId)

  if (error) return { error: error.message }

  revalidatePath('/alunos')
  revalidatePath('/rotas')
  return { error: null }
}

export async function validarCodigoVan(codigo: string) {
  const supabase = await createClient()
  const codLimpo = codigo.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()

  if (codLimpo.length < 6) return { error: 'Código inválido', data: null }

  // Solução segura para MVP: busca motoristas e filtra pelo prefixo do UUID
  const { data: motoristas, error } = await supabase
    .from('motoristas_perfil')
    .select('id, perfis(nome)')
    .eq('ativo', true)

  if (error) return { error: error.message, data: null }

  const motorista = motoristas.find(m => m.id.replace(/-/g, '').toLowerCase().startsWith(codLimpo))

  if (!motorista) return { error: 'Código de Van não encontrado.', data: null }

  return {
    error: null,
    data: {
      id: motorista.id,
      nome: (motorista.perfis as any)?.nome || 'Motorista'
    }
  }
}

export async function cadastrarFilhoComVinculo(
  dados: TablesInsert<'alunos'>,
  motorista_id: string
) {
  const supabase = await createClient()

  // 1. Cria o Aluno
  const { data: aluno, error: erroAluno } = await supabase
    .from('alunos')
    .insert(dados)
    .select()
    .single()

  if (erroAluno) return { error: erroAluno.message, data: null }

  // 2. Cria o Contrato (que é a tabela associativa entre motorista e aluno no schema)
  const { error: erroContrato } = await supabase
    .from('contratos')
    .insert({
      aluno_id: aluno.id,
      motorista_id: motorista_id,
      data_inicio: new Date().toISOString().split('T')[0],
      status: 'ativo',
      valor_mensal: 0,
      dia_vencimento: 5
    })

  if (erroContrato) {
    console.error('Falha ao criar o contrato de vínculo:', erroContrato.message)
  }

  revalidatePath('/meu-painel')
  return { error: null, data: aluno }
}
