import React from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page(): Promise<React.JSX.Element> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  let dbStatus = "Offline / Fallback Ativo";
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
      title: "Painel Master (Admin)",
      path: "/dashboard",
      icon: "🚐",
      description: "Visão consolidada do negócio. KPIs de faturamento, gráficos de receita compostos e distribuição de transportadores.",
      badge: "WowDash Premium",
      color: "hsl(263, 83%, 68%)",
      glowColor: "rgba(139, 92, 246, 0.15)",
      borderColor: "rgba(139, 92, 246, 0.25)"
    },
    {
      title: "Gestão de Motoristas",
      path: "/dashboard/motoristas",
      icon: "👥",
      description: "Controle cadastral de frotas escolares, capacidade máxima de passageiros, controle de status CNH e áreas cobertas.",
      badge: "Base Relacional",
      color: "hsl(190, 90%, 55%)",
      glowColor: "rgba(6, 182, 212, 0.15)",
      borderColor: "rgba(6, 182, 212, 0.25)"
    },
    {
      title: "Cobranças & Pix Sim",
      path: "/dashboard/cobrancas",
      icon: "💸",
      description: "Faturamento preventivo automatizado com D+3 de vencimento. Simuladores de webhooks Mercado Pago e Pix.",
      badge: "Mercado Pago Split",
      color: "hsl(142, 71%, 55%)",
      glowColor: "rgba(16, 185, 129, 0.15)",
      borderColor: "rgba(16, 185, 129, 0.25)"
    },
    {
      title: "Faturamento & Splits",
      path: "/dashboard/faturamento",
      icon: "📈",
      description: "Divisão de receitas inteligente: taxa de comissão da plataforma (5%) e repasse para contas de motoristas (95%).",
      badge: "Fintech Engine",
      color: "hsl(0, 84%, 68%)",
      glowColor: "rgba(239, 68, 68, 0.15)",
      borderColor: "rgba(239, 68, 68, 0.25)"
    }
  ];

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
      position: "relative"
    }}>
      {/* Decorative Blur Orbs */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "15%",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "hsla(263, 83%, 58%, 0.15)",
        filter: "blur(80px)",
        pointerEvents: "none",
        zIndex: 0
      }} />
      <div style={{
        position: "absolute",
        bottom: "10%",
        right: "15%",
        width: "350px",
        height: "350px",
        borderRadius: "50%",
        background: "hsla(190, 90%, 50%, 0.12)",
        filter: "blur(90px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <main style={{
        width: "100%",
        maxWidth: "920px",
        background: "rgba(10, 15, 30, 0.45)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.07)",
        borderRadius: "32px",
        padding: "3.5rem 3rem",
        boxShadow: "0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        position: "relative",
        zIndex: 1,
        animation: "fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
      }}>
        {/* Top Header Section */}
        <header style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "linear-gradient(135deg, hsla(263, 83%, 58%, 0.2), hsla(190, 90%, 50%, 0.1))",
            border: "1px solid hsla(263, 83%, 58%, 0.25)",
            padding: "0.35rem 1rem",
            borderRadius: "50px",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "hsl(263, 83%, 80%)",
            marginBottom: "1rem"
          }}>
            ⚡ Console de Controle Master
          </div>
          <h1 style={{
            fontSize: "3.2rem",
            fontWeight: 800,
            margin: 0,
            letterSpacing: "-1.5px",
            fontFamily: "var(--font-family-title)",
            background: "linear-gradient(135deg, #ffffff 20%, hsl(263, 83%, 72%) 70%, hsl(190, 90%, 50%) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 4px 20px rgba(139, 92, 246, 0.15)"
          }}>
            Tio da Van
          </h1>
          <p style={{
            color: "rgba(255, 255, 255, 0.65)",
            fontSize: "1.15rem",
            marginTop: "0.5rem",
            fontWeight: 400,
            lineHeight: "1.4"
          }}>
            Engenharia Financeira, Gestão de Frotas e Logística Escolar em Tempo Real
          </p>
        </header>

        {/* Supabase Status Pill */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "3rem"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            padding: "0.5rem 1.25rem",
            borderRadius: "14px",
            fontSize: "0.85rem",
            fontWeight: 500,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)"
          }}>
            <span style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: isDbConnected ? "hsl(142, 71%, 55%)" : "hsl(0, 84%, 60%)",
              boxShadow: isDbConnected ? "0 0 10px hsl(142, 71%, 55%)" : "0 0 10px hsl(0, 84%, 60%)",
              display: "inline-block"
            }} />
            <span style={{ color: "rgba(255, 255, 255, 0.45)" }}>Telemetria Supabase:</span>
            <span style={{ color: isDbConnected ? "hsl(142, 71%, 55%)" : "rgba(255, 255, 255, 0.7)", fontWeight: 600 }}>
              {dbStatus}
            </span>
          </div>
        </div>

        {/* 2x2 Launch Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2.5rem"
        }}>
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
              <div
                className="todo-item"
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: `1px solid rgba(255, 255, 255, 0.05)`,
                  borderLeft: `4px solid ${mod.color}`,
                  borderRadius: "20px",
                  padding: "1.8rem",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Glow Overlay behind cards on hover (triggers dynamically using CSS inside app-container) */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: `radial-gradient(circle at 100% 0%, ${mod.glowColor}, transparent 60%)`,
                  opacity: 0.5,
                  pointerEvents: "none",
                  zIndex: 0
                }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                  {/* Icon & Title Header Row */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem"
                  }}>
                    <div style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      background: `rgba(255, 255, 255, 0.03)`,
                      border: `1px solid rgba(255, 255, 255, 0.06)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.6rem",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.15)"
                    }}>
                      {mod.icon}
                    </div>
                    <span style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      padding: "0.3rem 0.75rem",
                      borderRadius: "8px",
                      background: "rgba(255, 255, 255, 0.04)",
                      color: "rgba(255, 255, 255, 0.5)",
                      border: "1px solid rgba(255, 255, 255, 0.07)",
                      letterSpacing: "0.5px"
                    }}>
                      {mod.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 style={{
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    margin: "0 0 0.6rem 0",
                    letterSpacing: "-0.4px",
                    fontFamily: "var(--font-family-title)",
                    color: "#ffffff"
                  }}>
                    {mod.title}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: "0.92rem",
                    lineHeight: "1.5",
                    color: "rgba(255, 255, 255, 0.6)"
                  }}>
                    {mod.description}
                  </p>
                </div>

                {/* Arrow CTA */}
                <div style={{
                  position: "relative",
                  zIndex: 1,
                  alignSelf: "flex-end",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: mod.color,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  marginTop: "1.5rem"
                }}>
                  Entrar no Módulo
                  <span style={{ transition: "transform 0.2s" }} className="cta-arrow">&rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Global Footer */}
        <footer style={{
          marginTop: "3rem",
          textAlign: "center",
          fontSize: "0.8rem",
          color: "rgba(255, 255, 255, 0.3)",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          paddingTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <span>Tio da Van &copy; 2026 • Painel Admin Master</span>
          <span style={{
            fontSize: "0.75rem",
            color: "rgba(255, 255, 255, 0.2)"
          }}>
            WowDash High-Fidelity Conversion • Next.js 16 (Turbopack)
          </span>
        </footer>
      </main>
    </div>
  );
}
