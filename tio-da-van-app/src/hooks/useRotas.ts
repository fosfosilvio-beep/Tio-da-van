'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { buscarRotasDoMotorista } from '@/lib/actions/rotas'
import type { RotaComPontos } from '@/types'

/**
 * Hook: useRotas
 * Carrega e gerencia rotas do motorista autenticado
 * Quarteirão [03XX] — Hooks de Gestão
 */
export function useRotas() {
  const [rotas, setRotas] = useState<RotaComPontos[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const carregar = useCallback(async () => {
    setLoading(true)
    const { data, error } = await buscarRotasDoMotorista()
    if (error) {
      setError(error)
    } else {
      setRotas((data ?? []) as RotaComPontos[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    carregar()

    // Realtime: atualiza ao mudar rotas
    const channel = supabase
      .channel('rotas-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rotas' }, carregar)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [carregar, supabase])

  return { rotas, loading, error, recarregar: carregar }
}
