'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { buscarAlunos } from '@/lib/actions/alunos'
import type { AlunoComRota } from '@/types'

/**
 * Hook: useAlunos
 * Carrega e filtra alunos do motorista autenticado
 * Quarteirão [03XX] — Hooks de Gestão
 */
export function useAlunos(filtros?: { ativo?: boolean; rota_id?: string; escola?: string }) {
  const [alunos, setAlunos] = useState<AlunoComRota[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const carregar = useCallback(async () => {
    setLoading(true)
    const { data, error } = await buscarAlunos(filtros)
    if (error) {
      setError(error)
    } else {
      setAlunos((data ?? []) as AlunoComRota[])
    }
    setLoading(false)
  }, [filtros?.ativo, filtros?.rota_id, filtros?.escola])

  useEffect(() => {
    carregar()

    const channel = supabase
      .channel('alunos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alunos' }, carregar)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [carregar, supabase])

  const totalAtivos = alunos.filter(a => a.ativo).length
  const totalEmbarcados = alunos.filter(a => a.status_checkin === 'embarcado').length
  const totalAusentes = alunos.filter(a => a.ausente_hoje).length

  return { alunos, loading, error, recarregar: carregar, totalAtivos, totalEmbarcados, totalAusentes }
}
