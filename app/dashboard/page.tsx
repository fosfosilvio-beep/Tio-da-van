import React from "react";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";
import { KpiCard, MotoristasTable, RevenueChart, DriverStatusDonut } from "@/components/dashboard";
import type { DashboardKPI, ChartDataPoint, MotoristaComUsuario } from "@/lib/types";

// Inicializa cliente direto para Server Component
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default async function DashboardPage(): Promise<React.JSX.Element> {
  // 1. Buscar dados de motoristas com JOIN de usuário
  const { data: motoristasDb } = await supabase
    .from("motoristas")
    .select(`
      *,
      usuarios:usuario_id (
        nome_completo,
        email,
        telefone,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false });

  const motoristas: MotoristaComUsuario[] = (motoristasDb || []).map((m: any) => ({
    ...m,
    usuario: m.usuarios,
  }));

  // 2. Buscar cobranças
  const { data: cobrancas } = await supabase
    .from("cobrancas")
    .select("*");

  const cobrancasItems = cobrancas || [];

  // 3. Buscar total de alunos
  const { count: alunosCount } = await supabase
    .from("alunos")
    .select("*", { count: "exact", head: true });

  // ── Cálculos dinâmicos dos KPIs ──────────────────────────────────────
  const gmv = cobrancasItems
    .filter((c) => c.status === "pago")
    .reduce((sum, c) => sum + Number(c.valor_total), 0);

  const motoristasAtivos = motoristas.filter((m) => m.status === "aprovado").length;
  const cobrancasVencidas = cobrancasItems.filter((c) => c.status === "vencido").length;

  const dynamicKPIs: DashboardKPI[] = [
    {
      label: "Receita Total Paga",
      valor: `R$ ${gmv.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      variacao: 12.5,
      icone: "💰",
      cor: "primary",
    },
    {
      label: "Motoristas Ativos",
      valor: String(motoristasAtivos),
      variacao: 8.3,
      icone: "🚐",
      cor: "success",
    },
    {
      label: "Alunos Cadastrados",
      valor: String(alunosCount || 0),
      variacao: 15.2,
      icone: "🎒",
      cor: "info",
    },
    {
      label: "Cobranças Vencidas",
      valor: String(cobrancasVencidas),
      variacao: -23.1,
      icone: "⚠️",
      cor: "danger",
    },
  ];

  // ── Distribuição de status para o Donut chart ────────────────────────
  const motoristasPorStatus = {
    pendente: motoristas.filter((m) => m.status === "pendente").length,
    aprovado: motoristas.filter((m) => m.status === "aprovado").length,
    suspenso: motoristas.filter((m) => m.status === "suspenso").length,
  };

  // ── Agrupamento mensal para o Revenue Chart ──────────────────────────
  const monthlyMap: Record<string, { receita: number; comissao: number }> = {};
  cobrancasItems.forEach((c) => {
    if (c.status === "pago") {
      const mes = c.referencia_mes;
      const total = Number(c.valor_total);
      const platform = Number(c.valor_plataforma);

      if (!monthlyMap[mes]) {
        monthlyMap[mes] = { receita: 0, comissao: 0 };
      }
      monthlyMap[mes].receita += total;
      monthlyMap[mes].comissao += platform;
    }
  });

  const formattedRevenue: ChartDataPoint[] = Object.keys(monthlyMap)
    .sort()
    .map((mes) => {
      const parts = mes.split("-");
      const ano = parts[0].substring(2);
      const mesNum = parts[1];
      const mesesMap: Record<string, string> = {
        "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr", "05": "Mai", "06": "Jun",
        "07": "Jul", "08": "Ago", "09": "Set", "10": "Out", "11": "Nov", "12": "Dez"
      };
      return {
        mes: `${mesesMap[mesNum] || mesNum}/${ano}`,
        receita: monthlyMap[mes].receita,
        comissao: monthlyMap[mes].comissao,
      };
    });

  // Fallback se não houver pagamentos confirmados no gráfico
  if (formattedRevenue.length === 0) {
    formattedRevenue.push({ mes: "Mai/26", receita: gmv, comissao: gmv * 0.05 });
  }

  return (
    <>
      {/* ── Title Row ──────────────────────────────────────────── */}
      <div className="page-title-row">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Visão geral em tempo real conectada ao Supabase</p>
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────── */}
      <div className="kpi-grid" id="kpi-grid">
        {dynamicKPIs.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      {/* ── Charts Row ─────────────────────────────────────────── */}
      <div className="charts-grid" id="charts-grid">
        <RevenueChart data={formattedRevenue} />
        <DriverStatusDonut statusCounts={motoristasPorStatus} />
      </div>

      {/* ── Motoristas Table ───────────────────────────────────── */}
      <MotoristasTable motoristas={motoristas.slice(0, 5)} />
    </>
  );
}
