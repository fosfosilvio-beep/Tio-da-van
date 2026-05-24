'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { buscarResumoFinanceiro, buscarDespesas } from '@/lib/actions/financeiro'
import type { Cobranca, Despesa } from '@/types'

/**
 * Hook: useFinanceiro
 * Painel financeiro: receitas, despesas, lucro e cobranças
 * Quarteirão [03XX] — Hooks de Gestão
 */
export function useFinanceiro(mes?: string) {
  const mesAtual = mes ?? new Date().toISOString().slice(0, 7) // 'YYYY-MM'

  const [resumo, setResumo] = useState({
    receita: 0, pendente: 0, vencido: 0, despesas: 0, lucro: 0,
    cobrancas: [] as Partial<Cobranca>[],
    despesasPorCategoria: [] as Partial<Despesa>[],
  })
  const [despesas, setDespesas] = useState<Partial<Despesa>[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const carregar = useCallback(async () => {
    setLoading(true)
    const [resumoRes, despesasRes] = await Promise.all([
      buscarResumoFinanceiro(mesAtual),
      buscarDespesas({ mes: mesAtual }),
    ])
    if (resumoRes.data) setResumo(resumoRes.data)
    if (despesasRes.data) setDespesas(despesasRes.data)
    setLoading(false)
  }, [mesAtual])

  useEffect(() => {
    carregar()

    const channel = supabase
      .channel('financeiro-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cobrancas' }, carregar)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'despesas' }, carregar)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [carregar, supabase])

  // Gráfico: despesas agrupadas por categoria
  const despesasPorCategoria = despesas.reduce((acc, d) => {
    const cat = d.categoria ?? 'outros'
    acc[cat] = (acc[cat] ?? 0) + (d.valor ?? 0)
    return acc
  }, {} as Record<string, number>)

  const cobrancasPendentes = resumo.cobrancas.filter(c => c.status === 'pendente')
  const cobrancasVencidas = resumo.cobrancas.filter(c => c.status === 'vencido')
  const cobrancasPagas = resumo.cobrancas.filter(c => c.status === 'pago')

  return {
    resumo, despesas, loading, mesAtual, recarregar: carregar,
    despesasPorCategoria,
    cobrancasPendentes, cobrancasVencidas, cobrancasPagas,
    taxaAdimplencia: resumo.cobrancas.length > 0
      ? Math.round((cobrancasPagas.length / resumo.cobrancas.length) * 100)
      : 0,
  }
}
