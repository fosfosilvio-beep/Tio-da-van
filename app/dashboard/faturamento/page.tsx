"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface DriverFinancialBreakdown {
  driverId: string;
  driverName: string;
  avatarUrl: string;
  placa: string;
  mpAccount: string;
  alunoCount: number;
  totalVolume: number;
  driverShare: number;
  platformShare: number;
  pendingVolume: number;
}

interface MonthlyChartData {
  mes: string;
  receita: number;
  comissao: number;
}

export default function FaturamentoPage(): React.JSX.Element {
  const supabase = createClient();
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    gmv: 0,
    driverShareTotal: 0,
    platformShareTotal: 0,
    pendingVolumeTotal: 0,
    activePayersCount: 0,
  });
  const [driverBreakdown, setDriverBreakdown] = useState<DriverFinancialBreakdown[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyChartData[]>([]);

  const fetchFinancials = async () => {
    try {
      setLoading(true);

      // 1. Obter cobranças com dados de motoristas e pais
      const { data: cobrancas, error: errorCobrancas } = await supabase
        .from("cobrancas")
        .select(`
          *,
          motoristas (
            id,
            placa,
            mercadopago_account_id,
            usuarios:usuario_id (
              nome_completo,
              avatar_url
            )
          )
        `);

      if (errorCobrancas) throw errorCobrancas;

      // 2. Obter contagem de alunos ativos por motorista
      const { data: alunos, error: errorAlunos } = await supabase
        .from("alunos")
        .select("id, motorista_id")
        .eq("status_vinculo", "ativo");

      if (errorAlunos) throw errorAlunos;

      const items = (cobrancas as any[]) || [];
      const studentsList = (alunos as any[]) || [];

      // Cálculos consolidados
      let gmv = 0;
      let driverShareTotal = 0;
      let platformShareTotal = 0;
      let pendingVolumeTotal = 0;
      const uniqueParents = new Set<string>();

      // Agrupamento por motorista
      const driverMap: Record<string, DriverFinancialBreakdown> = {};

      items.forEach((c) => {
        const total = Number(c.valor_total);
        const platform = Number(c.valor_plataforma);
        const driver = Number(c.valor_motorista);
        const isPaid = c.status === "pago";

        if (isPaid) {
          gmv += total;
          driverShareTotal += driver;
          platformShareTotal += platform;
          uniqueParents.add(c.pai_id);
        } else if (c.status === "pendente" || c.status === "vencido") {
          pendingVolumeTotal += total;
        }

        // Dados do motorista
        const m = c.motoristas;
        if (m) {
          const mId = m.id;
          const driverName = m.usuarios?.nome_completo || "Sem Nome";
          const avatarUrl = m.usuarios?.avatar_url || "";
          const placa = m.placa;
          const mpAccount = m.mercadopago_account_id || "Não Vinculada";

          if (!driverMap[mId]) {
            driverMap[mId] = {
              driverId: mId,
              driverName,
              avatarUrl,
              placa,
              mpAccount,
              alunoCount: studentsList.filter((a) => a.motorista_id === mId).length,
              totalVolume: 0,
              driverShare: 0,
              platformShare: 0,
              pendingVolume: 0,
            };
          }

          if (isPaid) {
            driverMap[mId].totalVolume += total;
            driverMap[mId].driverShare += driver;
            driverMap[mId].platformShare += platform;
          } else if (c.status === "pendente" || c.status === "vencido") {
            driverMap[mId].pendingVolume += total;
          }
        }
      });

      // Agrupamento por mês (Gráfico)
      const monthlyMap: Record<string, { receita: number; comissao: number }> = {};
      items.forEach((c) => {
        if (c.status === "pago") {
          const mes = c.referencia_mes; // ex: "2026-05"
          const total = Number(c.valor_total);
          const platform = Number(c.valor_plataforma);

          if (!monthlyMap[mes]) {
            monthlyMap[mes] = { receita: 0, comissao: 0 };
          }
          monthlyMap[mes].receita += total;
          monthlyMap[mes].comissao += platform;
        }
      });

      // Formatar dados do gráfico
      const formattedMonthly: MonthlyChartData[] = Object.keys(monthlyMap)
        .sort()
        .map((mes) => {
          // Converter "2026-05" para "Mai/26"
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

      // Se o gráfico mensal estiver vazio, coloca um mock padrão
      if (formattedMonthly.length === 0) {
        formattedMonthly.push({ mes: "Mai/26", receita: gmv, comissao: platformShareTotal });
      }

      setStats({
        gmv,
        driverShareTotal,
        platformShareTotal,
        pendingVolumeTotal,
        activePayersCount: uniqueParents.size,
      });

      setDriverBreakdown(Object.values(driverMap));
      setMonthlyData(formattedMonthly);

    } catch (err) {
      console.error("Erro ao carregar faturamento:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancials();
  }, []);

  // Encontra valor máximo para escalonar as barras do gráfico
  const maxRevenue = Math.max(...monthlyData.map((d) => d.receita), 1000);

  return (
    <>
      {/* ── Title Row ──────────────────────────────────────────── */}
      <div className="page-title-row">
        <div>
          <h1 className="page-title">Faturamento & Payouts</h1>
          <p className="page-subtitle">Acompanhamento de fluxo de caixa, conciliação e comissões da plataforma (Split 95/5)</p>
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────── */}
      <div className="kpi-grid">
        <div className="kpi-card" data-cor="primary">
          <div className="kpi-top-row">
            <div className="kpi-icon">💰</div>
            <span className="kpi-variacao positiva">Líquido Pago</span>
          </div>
          <span className="kpi-label">Volume Total Transacionado (GMV)</span>
          <span className="kpi-valor">
            R$ {stats.gmv.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="kpi-card" data-cor="success">
          <div className="kpi-top-row">
            <div className="kpi-icon">🚐</div>
            <span className="kpi-variacao positiva">95% Repasse</span>
          </div>
          <span className="kpi-label">Volume Pago aos Motoristas</span>
          <span className="kpi-valor">
            R$ {stats.driverShareTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="kpi-card" data-cor="info">
          <div className="kpi-top-row">
            <div className="kpi-icon">🛡️</div>
            <span className="kpi-variacao positiva">5% Retido</span>
          </div>
          <span className="kpi-label">Receita Líquida (Plataforma)</span>
          <span className="kpi-valor">
            R$ {stats.platformShareTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="kpi-card" data-cor="warning">
          <div className="kpi-top-row">
            <div className="kpi-icon">⏳</div>
            <span className="kpi-variacao">A receber</span>
          </div>
          <span className="kpi-label">Volume de Inadimplência / Pendente</span>
          <span className="kpi-valor">
            R$ {stats.pendingVolumeTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* ── Charts & Split Model ───────────────────────────────── */}
      <div className="charts-grid">
        {/* CSS Bar Chart */}
        <div className="chart-card">
          <h3 className="chart-card-title">Histórico de Receita Confirmada (R$)</h3>
          <div className="mini-bar-chart" style={{ height: "200px" }}>
            {monthlyData.map((d) => {
              const revenueHeight = (d.receita / maxRevenue) * 100;
              const commissionHeight = (d.comissao / maxRevenue) * 100;
              return (
                <div key={d.mes} className="mini-bar-col">
                  <div style={{ display: "flex", gap: "4px", width: "100%", justifyContent: "center", alignItems: "flex-end", height: "80%" }}>
                    <div
                      className="mini-bar"
                      style={{ height: `${Math.max(revenueHeight, 3)}%` }}
                      title={`Receita Total: R$ ${d.receita.toFixed(2)}`}
                    />
                    <div
                      className="mini-bar comissao"
                      style={{ height: `${Math.max(commissionHeight, 2)}%` }}
                      title={`Comissão: R$ ${d.comissao.toFixed(2)}`}
                    />
                  </div>
                  <span className="mini-bar-label">{d.mes}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: "16px", marginTop: "16px", fontSize: "0.78rem", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "linear-gradient(to top, hsl(263, 83%, 58%), hsl(263, 83%, 68%))" }} />
              <span style={{ color: "rgba(255,255,255,0.6)" }}>Mensalidades Pagas</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "linear-gradient(to top, hsl(190, 90%, 45%), hsl(190, 90%, 55%))" }} />
              <span style={{ color: "rgba(255,255,255,0.6)" }}>Comissão Tio da Van (5%)</span>
            </div>
          </div>
        </div>

        {/* Split info box */}
        <div className="chart-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h3 className="chart-card-title">Regras de Divisão de Receita</h3>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: "1.5", marginBottom: "16px" }}>
              A plataforma <strong>Tio da Van</strong> opera sob um modelo de split automatizado integrado à API do Mercado Pago.
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", padding: "12px", borderRadius: "10px" }}>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600 }}>Parceiros (Motoristas)</span>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "hsl(142, 71%, 55%)", marginTop: "2px" }}>95% Repasse Direto</div>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
                  Depositado na conta Mercado Pago do motorista vinculada ao veículo.
                </p>
              </div>

              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", padding: "12px", borderRadius: "10px" }}>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600 }}>Operação (Tio da Van)</span>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "hsl(190, 90%, 50%)", marginTop: "2px" }}>5% Taxa de Mediação</div>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
                  Retido para arcar com servidores, processamento Pix, e suporte de rastreamento.
                </p>
              </div>
            </div>
          </div>

          <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px", marginTop: "12px" }}>
            Transações efetuadas com liquidação D+0.
          </div>
        </div>
      </div>

      {/* ── Driver Breakdown Table ──────────────────────────────── */}
      <div className="data-card">
        <div className="data-card-header">
          <h2 className="data-card-title">Distribuição por Motorista</h2>
        </div>

        <div style={{ overflowX: "auto" }}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
              Calculando distribuições comerciais...
            </div>
          ) : driverBreakdown.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
              Nenhum dado de repasse ativo.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Motorista</th>
                  <th>MercadoPago ID</th>
                  <th>Alunos Ativos</th>
                  <th>Volume Bruto (GMV)</th>
                  <th>Repasse Motorista (95%)</th>
                  <th>Comissão Retida (5%)</th>
                  <th>Inadimplência / Pendente</th>
                </tr>
              </thead>
              <tbody>
                {driverBreakdown.map((d) => (
                  <tr key={d.driverId}>
                    {/* Nome & Placa */}
                    <td>
                      <div className="user-cell">
                        {d.avatarUrl ? (
                          <img src={d.avatarUrl} alt="" className="user-cell-avatar" />
                        ) : (
                          <div className="user-cell-avatar" style={{ background: "hsl(263, 83%, 58%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>
                            {d.driverName.charAt(0)}
                          </div>
                        )}
                        <div className="user-cell-info">
                          <span className="user-cell-name">{d.driverName}</span>
                          <span className="user-cell-email">Placa: {d.placa}</span>
                        </div>
                      </div>
                    </td>

                    {/* MP ID */}
                    <td>
                      <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", fontFamily: "monospace" }}>
                        {d.mpAccount}
                      </span>
                    </td>

                    {/* Alunos ativos */}
                    <td>
                      <span style={{ fontWeight: 600, color: "white" }}>
                        {d.alunoCount} alunos
                      </span>
                    </td>

                    {/* Volume Bruto */}
                    <td>
                      <span style={{ fontWeight: 600, color: "white" }}>
                        R$ {d.totalVolume.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Share Motorista */}
                    <td>
                      <span style={{ fontWeight: 600, color: "hsl(142, 71%, 55%)" }}>
                        R$ {d.driverShare.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Share Plataforma */}
                    <td>
                      <span style={{ fontWeight: 600, color: "hsl(190, 90%, 50%)" }}>
                        R$ {d.platformShare.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Pendente */}
                    <td>
                      <span style={{ color: d.pendingVolume > 0 ? "hsl(45, 100%, 60%)" : "rgba(255,255,255,0.3)" }}>
                        {d.pendingVolume > 0 
                          ? `R$ ${d.pendingVolume.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                          : "R$ 0,00"
                        }
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
