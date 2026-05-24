'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { enviarMensagemWhatsApp } from '@/lib/evolution'
import type { Database } from '@/lib/supabase/database.types'

type StatusCheckin = Database['public']['Enums']['status_checkin']

// ============================================================
// CHAMADA / CHECK-IN / CHECK-OUT
// ============================================================

export async function realizarCheckin(
  alunoId: string,
  tipo: 'embarque' | 'desembarque'
) {
  const supabase = await createClient()

  const novoStatus: StatusCheckin = tipo === 'embarque' ? 'embarcado' : 'desembarcado'

  const { data: aluno, error: erroBusca } = await supabase
    .from('alunos')
    .select('id, nome, responsavel_id, perfis!alunos_responsavel_id_fkey(telefone, nome)')
    .eq('id', alunoId)
    .single()

  if (erroBusca || !aluno) return { error: 'Aluno não encontrado' }

  // Atualizar status no banco
  const { error: erroUpdate } = await supabase
    .from('alunos')
    .update({
      status_checkin: novoStatus,
      ultimo_checkin_at: new Date().toISOString(),
    })
    .eq('id', alunoId)

  if (erroUpdate) return { error: erroUpdate.message }

  // Inserir notificação no sistema
  const titulo = tipo === 'embarque'
    ? `${aluno.nome} embarcou 🚐`
    : `${aluno.nome} desembarcou ✅`

  const mensagem = tipo === 'embarque'
    ? `Seu filho(a) ${aluno.nome} acabou de embarcar na van. Boa viagem!`
    : `Seu filho(a) ${aluno.nome} chegou ao destino com segurança.`

  await supabase.from('notificacoes').insert({
    destinatario_id: aluno.responsavel_id,
    tipo: tipo === 'embarque' ? 'embarque' : 'desembarque',
    titulo,
    mensagem,
    canal: 'ambos',
  })

  // Enviar WhatsApp ao responsável se tiver telefone
  const responsavelArray = aluno.perfis as unknown as { telefone: string | null }[]
  const responsavel = Array.isArray(responsavelArray) ? responsavelArray[0] : aluno.perfis as unknown as { telefone: string | null }
  if (responsavel?.telefone) {
    await enviarMensagemWhatsApp(responsavel.telefone, mensagem).catch(() => {
      // Não bloqueia a operação se o WhatsApp falhar
    })
  }

  revalidatePath('/chamada')
  revalidatePath('/dashboard')
  return { error: null }
}

export async function marcarAusente(alunoId: string, ausente: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('alunos')
    .update({ ausente_hoje: ausente })
    .eq('id', alunoId)

  if (error) return { error: error.message }

  revalidatePath('/chamada')
  return { error: null }
}

export async function buscarChamadaDoDia(rotaId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('alunos')
    .select(`
      id, nome, foto_url, status_checkin, ausente_hoje,
      ultimo_checkin_at, escola, serie,
      pontos_embarque(id, nome, ordem, lat, lng)
    `)
    .eq('rota_id', rotaId)
    .eq('ativo', true)
    .order('nome', { ascending: true })

  if (error) return { error: error.message, data: null }
  return { error: null, data }
}

export async function resetarChamadaDoDia(rotaId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('alunos')
    .update({
      status_checkin: 'aguardando',
      ausente_hoje: false,
    })
    .eq('rota_id', rotaId)
    .eq('ativo', true)

  if (error) return { error: error.message }

  revalidatePath('/chamada')
  return { error: null }
}

export async function enviarAlertaAproximacao(
  rotaId: string,
  pontoNome: string,
  minutosEstimados: number
) {
  const supabase = await createClient()

  // Buscar alunos do ponto + seus responsáveis
  const { data: alunos, error } = await supabase
    .from('alunos')
    .select(`
      id, nome, responsavel_id,
      pontos_embarque(nome),
      perfis!alunos_responsavel_id_fkey(telefone, nome)
    `)
    .eq('rota_id', rotaId)
    .eq('ativo', true)
    .eq('ausente_hoje', false)
    .eq('status_checkin', 'aguardando')

  if (error || !alunos?.length) return { error: error?.message ?? 'Sem alunos', enviados: 0 }

  let enviados = 0
  const mensagem = `🚐 A van está a aproximadamente ${minutosEstimados} min do ponto "${pontoNome}". Fique pronto!`

  for (const aluno of alunos) {
    await supabase.from('notificacoes').insert({
      destinatario_id: aluno.responsavel_id,
      tipo: 'aproximacao',
      titulo: `Van se aproximando do ponto`,
      mensagem,
      canal: 'ambos',
    })

    const responsavelData = aluno.perfis as unknown as { telefone: string | null }[]
    const resp = Array.isArray(responsavelData) ? responsavelData[0] : aluno.perfis as unknown as { telefone: string | null }
    if (resp?.telefone) {
      await enviarMensagemWhatsApp(resp.telefone, mensagem).catch(() => {})
      enviados++
    }
  }

  return { error: null, enviados }
}
