'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { buscarOcorrencias } from '@/lib/actions/ocorrencias-contratos'
import { buscarContratos } from '@/lib/actions/ocorrencias-contratos'
import type { OcorrenciaComAluno, Contrato } from '@/types'

/**
 * Hook: useOcorrencias
 */
export function useOcorrencias(filtros?: { aluno_id?: string; tipo?: string }) {
  const [ocorrencias, setOcorrencias] = useState<Partial<OcorrenciaComAluno>[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const carregar = useCallback(async () => {
    setLoading(true)
    const { data } = await buscarOcorrencias(filtros)
    setOcorrencias((data ?? []) as Partial<OcorrenciaComAluno>[])
    setLoading(false)
  }, [filtros?.aluno_id, filtros?.tipo])

  useEffect(() => {
    carregar()
    const channel = supabase
      .channel('ocorrencias-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ocorrencias' }, carregar)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [carregar, supabase])

  const porSeveridade = {
    baixa: ocorrencias.filter(o => o.severidade === 'baixa').length,
    media: ocorrencias.filter(o => o.severidade === 'media').length,
    alta: ocorrencias.filter(o => o.severidade === 'alta').length,
  }

  return { ocorrencias, loading, porSeveridade, recarregar: carregar }
}

/**
 * Hook: useContratos
 */
export function useContratos(filtros?: { status?: string }) {
  const [contratos, setContratos] = useState<Partial<Contrato>[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const carregar = useCallback(async () => {
    setLoading(true)
    const { data } = await buscarContratos(filtros)
    setContratos((data ?? []) as Partial<Contrato>[])
    setLoading(false)
  }, [filtros?.status])

  useEffect(() => {
    carregar()
    const channel = supabase
      .channel('contratos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contratos' }, carregar)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [carregar, supabase])

  return { contratos, loading, recarregar: carregar }
}

/**
 * Hook: useAniversariantes
 * Alunos aniversariantes no mês atual e próximo
 */
export function useAniversariantes() {
  const [aniversariantes, setAniversariantes] = useState<{
    id: string; nome: string; foto_url: string | null
    data_nascimento: string; escola: string | null; diasAteAniversario: number
  }[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const calcularDias = (dataNascimento: string) => {
    const hoje = new Date()
    const aniversario = new Date(dataNascimento)
    aniversario.setFullYear(hoje.getFullYear())
    if (aniversario < hoje) aniversario.setFullYear(hoje.getFullYear() + 1)
    const diff = Math.ceil((aniversario.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const carregar = useCallback(async () => {
    setLoading(true)
    const { buscarAniversariantes } = await import('@/lib/actions/alunos')
    const { data } = await buscarAniversariantes()
    const enriched = (data ?? []).map(a => ({
      ...a,
      diasAteAniversario: a.data_nascimento ? calcularDias(a.data_nascimento) : 999,
    }))
    enriched.sort((a, b) => a.diasAteAniversario - b.diasAteAniversario)
    setAniversariantes(enriched as any)
    setLoading(false)
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const hoje = aniversariantes.filter(a => a.diasAteAniversario === 0)
  const estaSemana = aniversariantes.filter(a => a.diasAteAniversario > 0 && a.diasAteAniversario <= 7)
  const esteMes = aniversariantes.filter(a => a.diasAteAniversario > 7)

  return { aniversariantes, loading, hoje, estaSemana, esteMes, recarregar: carregar }
}
