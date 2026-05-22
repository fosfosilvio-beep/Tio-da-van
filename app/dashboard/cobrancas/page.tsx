"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Cobranca } from "@/lib/types";

interface CobrancaComRelacoes extends Cobranca {
  alunos: {
    nome: string;
    escola: string;
    usuarios: {
      nome_completo: string;
      email: string;
    };
  };
  motoristas: {
    placa: string;
    usuarios: {
      nome_completo: string;
      avatar_url: string;
    };
  };
}

export default function CobrancasPage(): React.JSX.Element {
  const supabase = createClient();
  const [cobrancas, setCobrancas] = useState<CobrancaComRelacoes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [isSimulatingCron, setIsSimulatingCron] = useState<boolean>(false);
  const [simulatingPaymentId, setSimulatingPaymentId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch cobranças com JOINS do Supabase
  const fetchCobrancas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("cobrancas")
        .select(`
          *,
          alunos (
            nome,
            escola,
            usuarios:pai_id (
              nome_completo,
              email
            )
          ),
          motoristas (
            placa,
            usuarios:usuario_id (
              nome_completo,
              avatar_url
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCobrancas((data as any) || []);
    } catch (err: any) {
      showNotification("error", `Erro ao carregar cobranças: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCobrancas();
  }, []);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Simular execução preventiva do Cron
  const handleTriggerCron = async () => {
    try {
      setIsSimulatingCron(true);
      const response = await fetch("/api/cobrancas/cron", { method: "POST" });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Erro na simulação do Cron");
      
      showNotification(
        "success",
        `Cron Executado! ${data.criadas?.length || 0} novas mensalidades preventivas geradas com split 95/5.`
      );
      fetchCobrancas();
    } catch (err: any) {
      showNotification("error", err.message);
    } finally {
      setIsSimulatingCron(false);
    }
  };

  // Simular confirmação de pagamento do webhook do Mercado Pago
  const handleSimulateWebhook = async (paymentId: string) => {
    try {
      setSimulatingPaymentId(paymentId);
      const response = await fetch("/api/webhooks/mercadopago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_id: paymentId, status: "approved" }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Erro na simulação do Webhook");

      showNotification(
        "success",
        `Webhook Processado! Cobrança liquidada via Pix e split de comissão gravado.`
      );
      fetchCobrancas();
    } catch (err: any) {
      showNotification("error", err.message);
    } finally {
      setSimulatingPaymentId(null);
    }
  };

  // Cálculos dinâmicos dos KPIs baseados no banco real
  const totalPago = cobrancas
    .filter((c) => c.status === "pago")
    .reduce((sum, c) => sum + Number(c.valor_total), 0);

  const totalComissao = cobrancas
    .filter((c) => c.status === "pago")
    .reduce((sum, c) => sum + Number(c.valor_plataforma), 0);

  const pendentesCount = cobrancas.filter((c) => c.status === "pendente").length;
  const vencidasCount = cobrancas.filter((c) => c.status === "vencido").length;

  // Filtros de busca
  const filteredCobrancas = cobrancas.filter((c) => {
    const matchesSearch =
      c.alunos?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.motoristas?.usuarios?.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mercadopago_payment_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "todos" || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {/* ── Notification Alert ───────────────────────────────────── */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 1000,
            padding: "16px 24px",
            borderRadius: "12px",
            background: notification.type === "success" ? "rgba(16, 185, 129, 0.95)" : "rgba(239, 68, 68, 0.95)",
            color: "white",
            fontWeight: 600,
            fontSize: "0.9rem",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
            animation: "fadeInUp 0.3s ease both",
          }}
        >
          {notification.type === "success" ? "✅" : "❌"} {notification.message}
        </div>
      )}

      {/* ── Title Row ──────────────────────────────────────────── */}
      <div className="page-title-row">
        <div>
          <h1 className="page-title">Gestão Financeira</h1>
          <p className="page-subtitle">Rastreamento de cobranças, splits e simulação de conciliação Mercado Pago</p>
        </div>
        <div className="data-card-actions">
          <button
            onClick={handleTriggerCron}
            className="btn-primary-sm"
            disabled={isSimulatingCron}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            {isSimulatingCron ? "Executando..." : "⚡ Simular Cron Preventivo"}
          </button>
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────── */}
      <div className="kpi-grid">
        <div className="kpi-card" data-cor="primary">
          <div className="kpi-top-row">
            <div className="kpi-icon">💰</div>
            <span className="kpi-variacao positiva">Banco Ativo</span>
          </div>
          <span className="kpi-label">Faturamento Total Pago</span>
          <span className="kpi-valor">
            R$ {totalPago.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="kpi-card" data-cor="success">
          <div className="kpi-top-row">
            <div className="kpi-icon">📈</div>
            <span className="kpi-variacao positiva">5% taxa</span>
          </div>
          <span className="kpi-label">Comissões da Plataforma</span>
          <span className="kpi-valor">
            R$ {totalComissao.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="kpi-card" data-cor="warning">
          <div className="kpi-top-row">
            <div className="kpi-icon">⏳</div>
            <span className="kpi-variacao">A vencer</span>
          </div>
          <span className="kpi-label">Cobranças Pendentes</span>
          <span className="kpi-valor">{pendentesCount}</span>
        </div>

        <div className="kpi-card" data-cor="danger">
          <div className="kpi-top-row">
            <div className="kpi-icon">⚠️</div>
            <span className="kpi-variacao negativa">Atraso</span>
          </div>
          <span className="kpi-label">Cobranças Vencidas</span>
          <span className="kpi-valor">{vencidasCount}</span>
        </div>
      </div>

      {/* ── Main Data Card ─────────────────────────────────────── */}
      <div className="data-card">
        <div className="data-card-header" style={{ flexWrap: "wrap", gap: "16px" }}>
          <h2 className="data-card-title">Faturas de Mensalidades</h2>
          
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {/* Search Input */}
            <input
              type="text"
              placeholder="Buscar aluno, motorista ou id..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "6px 12px",
                color: "white",
                fontSize: "0.85rem",
                outline: "none",
                minWidth: "220px",
              }}
            />

            {/* Filter select */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "6px 12px",
                color: "white",
                fontSize: "0.85rem",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="todos">Todos os Status</option>
              <option value="pago">Pagas</option>
              <option value="pendente">Pendentes</option>
              <option value="vencido">Vencidas</option>
            </select>
          </div>
        </div>

        {/* ── Cobrancas Table ────────────────────────────────────── */}
        <div style={{ overflowX: "auto" }}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
              Carregando dados financeiros em tempo real...
            </div>
          ) : filteredCobrancas.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
              Nenhuma cobrança encontrada com os filtros selecionados.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Referência/ID</th>
                  <th>Aluno / Escola</th>
                  <th>Motorista</th>
                  <th>Valor Total</th>
                  <th>Repasse Split (95/5)</th>
                  <th>Vencimento</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Ações de Teste</th>
                </tr>
              </thead>
              <tbody>
                {filteredCobrancas.map((c) => (
                  <tr key={c.id}>
                    {/* Referência e MP Payment ID */}
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 600, color: "white" }}>Ref: {c.referencia_mes}</span>
                        <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)" }}>
                          {c.mercadopago_payment_id || "Sem ID"}
                        </span>
                      </div>
                    </td>

                    {/* Aluno e Escola */}
                    <td>
                      <div className="user-cell-info">
                        <span className="user-cell-name">{c.alunos?.nome}</span>
                        <span className="user-cell-email">{c.alunos?.escola}</span>
                      </div>
                    </td>

                    {/* Motorista */}
                    <td>
                      <div className="user-cell">
                        {c.motoristas?.usuarios?.avatar_url ? (
                          <img
                            src={c.motoristas.usuarios.avatar_url}
                            alt=""
                            className="user-cell-avatar"
                          />
                        ) : (
                          <div className="user-cell-avatar" style={{ background: "hsl(263, 83%, 58%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>
                            {c.motoristas?.usuarios?.nome_completo?.charAt(0)}
                          </div>
                        )}
                        <div className="user-cell-info">
                          <span className="user-cell-name">{c.motoristas?.usuarios?.nome_completo}</span>
                          <span className="user-cell-email">Van: {c.motoristas?.placa}</span>
                        </div>
                      </div>
                    </td>

                    {/* Valor Total */}
                    <td>
                      <span style={{ fontWeight: 600, color: "white" }}>
                        R$ {Number(c.valor_total).toFixed(2)}
                      </span>
                    </td>

                    {/* Split details */}
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", fontSize: "0.8rem" }}>
                        <span style={{ color: "hsl(142, 71%, 55%)" }}>
                          Van: R$ {Number(c.valor_motorista).toFixed(2)}
                        </span>
                        <span style={{ color: "hsl(190, 90%, 50%)" }}>
                          Plat: R$ {Number(c.valor_plataforma).toFixed(2)}
                        </span>
                      </div>
                    </td>

                    {/* Vencimento ou Data do pagamento */}
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span>{new Date(c.vencimento + "T00:00:00").toLocaleDateString("pt-BR")}</span>
                        {c.pago_em && (
                          <span style={{ fontSize: "0.72rem", color: "rgba(16, 185, 129, 0.7)" }}>
                            Pago em: {new Date(c.pago_em).toLocaleDateString("pt-BR")}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status badge */}
                    <td>
                      <span className={`status-badge ${c.status}`}>{c.status}</span>
                    </td>

                    {/* Simulated payment button */}
                    <td style={{ textAlign: "right" }}>
                      {c.status === "pendente" || c.status === "vencido" ? (
                        <button
                          onClick={() => handleSimulateWebhook(c.mercadopago_payment_id || "")}
                          disabled={simulatingPaymentId === c.mercadopago_payment_id || !c.mercadopago_payment_id}
                          className="btn-sm"
                          style={{
                            background: "rgba(16, 185, 129, 0.15)",
                            borderColor: "rgba(16, 185, 129, 0.3)",
                            color: "hsl(142, 71%, 55%)",
                            cursor: "pointer",
                          }}
                        >
                          {simulatingPaymentId === c.mercadopago_payment_id ? "Liquidando..." : "💸 Pagar Pix"}
                        </button>
                      ) : (
                        <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>✓ Liquidada</span>
                      )}
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
