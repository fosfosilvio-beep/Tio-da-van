/**
 * lib/geofencing.ts
 * Lógica de Geofencing para alertas de aproximação
 * Quarteirão [03XX] — Integração Google Maps
 */

import type { GeoPosition } from '@/types'

/** Calcula distância em metros entre dois pontos GPS (fórmula Haversine) */
export function calcularDistancia(
  ponto1: GeoPosition,
  ponto2: GeoPosition
): number {
  const R = 6371000 // raio da Terra em metros
  const lat1Rad = (ponto1.lat * Math.PI) / 180
  const lat2Rad = (ponto2.lat * Math.PI) / 180
  const deltaLat = ((ponto2.lat - ponto1.lat) * Math.PI) / 180
  const deltaLng = ((ponto2.lng - ponto1.lng) * Math.PI) / 180

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/** Verifica se uma posição está dentro do raio de um ponto de embarque */
export function estaDentroDoGeofence(
  posicaoAtual: GeoPosition,
  pontoCentro: GeoPosition,
  raioMetros: number
): boolean {
  const distancia = calcularDistancia(posicaoAtual, pontoCentro)
  return distancia <= raioMetros
}

/** Estima tempo de chegada em minutos com base na velocidade média */
export function estimarTempoChegada(
  distanciaMetros: number,
  velocidadeKmh = 40
): number {
  const velocidadeMs = (velocidadeKmh * 1000) / 3600
  return Math.ceil(distanciaMetros / velocidadeMs / 60)
}

/** Verifica qual o próximo ponto de embarque da rota */
export function proximoPonto<T extends { lat: number; lng: number; ordem: number }>(
  posicaoAtual: GeoPosition,
  pontos: T[]
): { ponto: T; distanciaMetros: number } | null {
  if (!pontos.length) return null

  const pontosOrdenados = [...pontos].sort((a, b) => a.ordem - b.ordem)
  let menorDistancia = Infinity
  let ponteMaisProximo = pontosOrdenados[0]

  for (const ponto of pontosOrdenados) {
    const dist = calcularDistancia(posicaoAtual, { lat: ponto.lat, lng: ponto.lng })
    if (dist < menorDistancia) {
      menorDistancia = dist
      ponteMaisProximo = ponto
    }
  }

  return { ponto: ponteMaisProximo, distanciaMetros: menorDistancia }
}

/** Monitora posição GPS continuamente e dispara callbacks */
export function iniciarMonitoramentoGPS(
  onPosicao: (pos: GeoPosition) => void,
  onErro?: (erro: GeolocationPositionError) => void,
  opcoes?: PositionOptions
): () => void {
  if (!navigator.geolocation) {
    console.warn('[Geofencing] Geolocalização não suportada neste dispositivo.')
    return () => {}
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      onPosicao({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      })
    },
    onErro,
    {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 15000,
      ...opcoes,
    }
  )

  // Retorna função para parar o monitoramento
  return () => navigator.geolocation.clearWatch(watchId)
}

/** Obtém posição atual uma única vez */
export function obterPosicaoAtual(): Promise<GeoPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        }),
      reject,
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })
}
