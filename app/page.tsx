import React from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page(): Promise<React.JSX.Element> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  let dbStatus = "Offline / Mock fallback";
  let isDbConnected = false;

  try {
    const { data, error } = await supabase.from("usuarios").select("count", { count: "exact", head: true });
    if (!error) {
      dbStatus = "Supabase Live Conectado";
      isDbConnected = true;
    }
  } catch (err) {
    dbStatus = "Erro na conexão com Supabase";
  }

  const navigationModules = [
    {
      title: "Painel de Controle Master (Admin)",
      path: "/dashboard",
      icon: "🚐",
      description: "Visão unificada do negócio com KPIs em tempo real, receita total consolidada, motoristas ativos e distribuição de status.",
      badge: "WowDash Premium",
      color: "var(--primary)"
    },
    {
      title: "Gestão de Motoristas",
      path: "/dashboard/motoristas",
      icon: "👥",
      description: "Ficha de cadastro de frotas escolares, capacidade máxima de passageiros, controle de status CNH e escolas/bairros cobertos.",
      badge: "Base de Dados Real",
      color: "var(--secondary)"
    },
    {
      title: "Cobranças Preventivas & Pix",
      path: "/dashboard/cobrancas",
      icon: "💸",
      description: "Geração de Pix preventiva (mês futuro D+3), simulação em lote do faturamento e integrador de Webhooks de pagamento.",
      badge: "Mercado Pago Split",
      color: "hsl(var(--success))"
    },
    {
      title: "Faturamento & Splits Comerciais",
      path: "/dashboard/faturamento",
      icon: "📈",
      description: "Divisão automática de pagamentos: taxa de comissão da plataforma (5%) e repasse direto para contas de motoristas (95%).",
      badge: "Fintech Core",
      color: "hsl(var(--danger))"
    }
  ];

  return (
    <main className="app-container" style={{ maxWidth: "680px", margin: "2rem auto", width: "95%" }}>
      <header className="app-header" style={{ marginBottom: "1.5rem" }}>
        <h1 className="app-title" style={{ fontSize: "2.5rem", letterSpacing: "-1px" }}>Tio da Van</h1>
        <p className="app-subtitle" style={{ fontSize: "1.05rem", opacity: 0.8 }}>
          Plataforma Avançada de Logística e Engenharia Financeira Escolar
        </p>
      </header>

      {/* Telemetry Status Bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        fontSize: "0.85rem",
        padding: "0.6rem 1rem",
        borderRadius: "12px",
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        marginBottom: "2rem"
      }}>
        <span style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: isDbConnected ? "hsl(var(--success))" : "hsl(var(--danger))",
          boxShadow: isDbConnected ? "0 0 10px hsl(var(--success))" : "0 0 10px hsl(var(--danger))",
          animation: "pulse 2s infinite ease-in-out"
        }} />
        <span style={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 500 }}>
          Status da Conexão: <span style={{ color: isDbConnected ? "hsl(var(--success))" : "rgba(255, 255, 255, 0.5)" }}>{dbStatus}</span>
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {navigationModules.map((mod) => (
          <Link
            key={mod.path}
            href={mod.path}
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block"
            }}
          >
            <div className="todo-item" style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "0.5rem",
              padding: "1.4rem",
              cursor: "pointer"
            }}>
              {/* Top Row with Badge & Icon */}
              <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>{mod.icon}</span>
                  <h3 style={{
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    margin: 0,
                    letterSpacing: "-0.3px",
                    fontFamily: "var(--font-family-title)",
                    background: `linear-gradient(135deg, #fff 40%, ${mod.color} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}>
                    {mod.title}
                  </h3>
                </div>
                <span style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  padding: "0.25rem 0.6rem",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "rgba(255, 255, 255, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.08)"
                }}>
                  {mod.badge}
                </span>
              </div>

              {/* Description */}
              <p style={{
                margin: "0.25rem 0 0 0",
                fontSize: "0.9rem",
                lineHeight: "1.4",
                color: "rgba(255, 255, 255, 0.65)"
              }}>
                {mod.description}
              </p>

              {/* Action indicator on hover (handled by CSS variables but styled elegantly) */}
              <div style={{
                alignSelf: "flex-end",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: mod.color,
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                marginTop: "0.25rem"
              }}>
                Acessar Módulo &rarr;
              </div>
            </div>
          </Link>
        ))}
      </div>

      <footer style={{
        marginTop: "2.5rem",
        textAlign: "center",
        fontSize: "0.75rem",
        color: "rgba(255, 255, 255, 0.35)",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        paddingTop: "1rem"
      }}>
        Tio da Van &copy; 2026 • Painel Admin Cherry-Picked WowDash • Supabase Backend • Mercado Pago Pix Split
      </footer>
    </main>
  );
}
