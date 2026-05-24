'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { buscarNotificacoes, marcarNotificacaoLida, marcarTodasLidas } from '@/lib/actions/ocorrencias-contratos'
import type { Notificacao } from '@/types'

/**
 * Hook: useNotificacoes
 * Notificações em tempo real com badge de não lidas
 * Quarteirão [03XX] — Hooks de Comunicação
 */
export function useNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<Partial<Notificacao>[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const carregar = useCallback(async () => {
    const { data } = await buscarNotificacoes()
    setNotificacoes(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    carregar()

    const channel = supabase
      .channel('notificacoes-realtime')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notificacoes' },
        (payload) => {
          setNotificacoes(prev => [payload.new as Notificacao, ...prev])
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notificacoes' },
        carregar
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [carregar, supabase])

  const marcarLida = useCallback(async (id: string) => {
    await marcarNotificacaoLida(id)
    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n))
  }, [])

  const marcarTodas = useCallback(async () => {
    await marcarTodasLidas()
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })))
  }, [])

  const naoLidas = notificacoes.filter(n => !n.lida).length

  return { notificacoes, loading, naoLidas, marcarLida, marcarTodas, recarregar: carregar }
}
