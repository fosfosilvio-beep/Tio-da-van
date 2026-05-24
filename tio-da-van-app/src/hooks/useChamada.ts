'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { buscarChamadaDoDia } from '@/lib/actions/chamada'
import { realizarCheckin, marcarAusente } from '@/lib/actions/chamada'
import {
  iniciarMonitoramentoGPS, proximoPonto, estaDentroDoGeofence,
  estimarTempoChegada, obterPosicaoAtual
} from '@/lib/geofencing'
import { enviarAlertaAproximacao } from '@/lib/actions/chamada'
import type { GeoPosition } from '@/types'

type AlunoNaChamada = {
  id: string
  nome: string
  foto_url: string | null
  status_checkin: 'aguardando' | 'embarcado' | 'desembarcado'
  ausente_hoje: boolean
  ultimo_checkin_at: string | null
  escola: string | null
  serie: string | null
  pontos_embarque: { id: string; nome: string; ordem: number; lat: number; lng: number } | null
}

/**
 * Hook: useChamada
 * Motor da chamada: checkin/out em tempo real + geofencing
 * Quarteirão [03XX] — Hooks de Gestão
 */
export function useChamada(rotaId: string | null) {
  const [alunos, setAlunos] = useState<AlunoNaChamada[]>([])
  const [loading, setLoading] = useState(false)
  const [posicaoAtual, setPosicaoAtual] = useState<GeoPosition | null>(null)
  const [rotaAtiva, setRotaAtiva] = useState(false)
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const alertasEnviadosRef = useRef<Set<string>>(new Set())
  const stopGPSRef = useRef<(() => void) | null>(null)
  const supabase = createClient()

  const carregarChamada = useCallback(async () => {
    if (!rotaId) return
    setLoading(true)
    const { data } = await buscarChamadaDoDia(rotaId)
    setAlunos((data ?? []) as AlunoNaChamada[])
    setLoading(false)
  }, [rotaId])

  useEffect(() => {
    carregarChamada()

    if (!rotaId) return
    const channel = supabase
      .channel(`chamada-${rotaId}`)
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'alunos', filter: `rota_id=eq.${rotaId}` },
        carregarChamada
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [rotaId, carregarChamada, supabase])

  // Geofencing: monitora GPS e envia alertas automáticos
  useEffect(() => {
    if (!rotaAtiva || !rotaId) return

    stopGPSRef.current = iniciarMonitoramentoGPS(async (pos) => {
      setPosicaoAtual(pos)

      // Coletar todos os pontos únicos da rota
      const pontos = alunos
        .filter(a => a.pontos_embarque && !a.ausente_hoje && a.status_checkin === 'aguardando')
        .map(a => a.pontos_embarque!)
        .filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i)

      for (const ponto of pontos) {
        if (alertasEnviadosRef.current.has(ponto.id)) continue

        const distancia = await import('@/lib/geofencing').then(m =>
          m.calcularDistancia(pos, { lat: ponto.lat, lng: ponto.lng })
        )

        // Alerta a 500m do ponto
        if (distancia <= 500) {
          alertasEnviadosRef.current.add(ponto.id)
          const minutos = estimarTempoChegada(distancia)
          await enviarAlertaAproximacao(rotaId, ponto.nome, minutos)
        }
      }
    })

    return () => { stopGPSRef.current?.() }
  }, [rotaAtiva, rotaId, alunos])

  const iniciarRota = useCallback(async () => {
    setRotaAtiva(true)
    alertasEnviadosRef.current.clear()
    try {
      const pos = await obterPosicaoAtual()
      setPosicaoAtual(pos)
    } catch { /* GPS pode não estar disponível */ }
  }, [])

  const encerrarRota = useCallback(() => {
    setRotaAtiva(false)
    stopGPSRef.current?.()
    stopGPSRef.current = null
    setPosicaoAtual(null)
  }, [])

  const fazerCheckin = useCallback(async (alunoId: string, tipo: 'embarque' | 'desembarque') => {
    setPendingAction(alunoId)
    await realizarCheckin(alunoId, tipo)
    await carregarChamada()
    setPendingAction(null)
  }, [carregarChamada])

  const alternarAusencia = useCallback(async (alunoId: string, ausente: boolean) => {
    setPendingAction(alunoId)
    await marcarAusente(alunoId, ausente)
    await carregarChamada()
    setPendingAction(null)
  }, [carregarChamada])

  const resumo = {
    total: alunos.length,
    embarcados: alunos.filter(a => a.status_checkin === 'embarcado').length,
    desembarcados: alunos.filter(a => a.status_checkin === 'desembarcado').length,
    aguardando: alunos.filter(a => a.status_checkin === 'aguardando' && !a.ausente_hoje).length,
    ausentes: alunos.filter(a => a.ausente_hoje).length,
  }

  return {
    alunos, loading, posicaoAtual, rotaAtiva, pendingAction, resumo,
    iniciarRota, encerrarRota, fazerCheckin, alternarAusencia, recarregar: carregarChamada,
  }
}
