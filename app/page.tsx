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
      description: "Visão unificada do negócio. KPIs de faturamento, gráficos de receita compostos e distribuição de transportadores.",
      badge: "Mockup Style",
      color: "hsl(172, 58%, 57%)", /* Mint Teal */
      glowColor: "rgba(162, 232, 223, 0.1)",
      textColor: "hsl(var(--foreground))"
    },
    {
      title: "Gestão de Motoristas",
      path: "/dashboard/motoristas",
      icon: "👥",
      description: "Controle cadastral de frotas escolares, capacidade máxima de passageiros, controle de status CNH e áreas cobertas.",
      badge: "Base Relacional",
      color: "hsl(206, 58%, 51%)", /* Ocean Blue */
      glowColor: "rgba(62, 138, 200, 0.08)",
      textColor: "hsl(var(--foreground))"
    },
    {
      title: "Cobranças & Pix Sim",
      path: "/dashboard/cobrancas",
      icon: "💸",
      description: "Faturamento preventivo automatizado com D+3 de vencimento. Simuladores de webhooks Mercado Pago e Pix.",
      badge: "Mercado Pago Split",
      color: "hsl(142, 71%, 45%)", /* Green */
      glowColor: "rgba(16, 185, 129, 0.08)",
      textColor: "hsl(var(--foreground))"
    },
    {
      title: "Faturamento & Splits",
      path: "/dashboard/faturamento",
      icon: "📈",
      description: "Divisão de receitas inteligente: taxa de comissão da plataforma (5%) e repasse para contas de motoristas (95%).",
      badge: "Fintech Engine",
      color: "hsl(0, 84%, 60%)", /* Red */
      glowColor: "rgba(239, 68, 68, 0.08)",
      textColor: "hsl(var(--foreground))"
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
      position: "relative",
      zIndex: 1
    }}>
      {/* Decorative Warm Blur Orbs */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "15%",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "rgba(162, 232, 223, 0.25)",
        filter: "blur(90px)",
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
        background: "rgba(62, 138, 200, 0.15)",
        filter: "blur(100px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <main style={{
        width: "100%",
        maxWidth: "920px",
        background: "#ffffff",
        border: "1px solid var(--card-border)",
        borderRadius: "32px",
        padding: "3.5rem 3rem",
        boxShadow: "0 25px 55px rgba(15, 27, 36, 0.06), 0 5px 15px rgba(15, 27, 36, 0.02)",
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
            background: "rgba(162, 232, 223, 0.25)",
            border: "1px solid rgba(162, 232, 223, 0.4)",
            padding: "0.4rem 1.25rem",
            borderRadius: "50px",
            fontSize: "0.78rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "rgba(15, 27, 36, 0.8)",
            marginBottom: "1rem"
          }}>
            ⚡ Console de Controle Master
          </div>
          <h1 style={{
            fontSize: "3.2rem",
            fontWeight: 850,
            margin: 0,
            letterSpacing: "-1.5px",
            fontFamily: "var(--font-family-title)",
            color: "hsl(var(--foreground))"
          }}>
            Tio da Van
          </h1>
          <p style={{
            color: "rgba(15, 27, 36, 0.6)",
            fontSize: "1.15rem",
            marginTop: "0.5rem",
            fontWeight: 500,
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
            background: "#FAF8F3",
            border: "1px solid var(--card-border)",
            padding: "0.5rem 1.25rem",
            borderRadius: "14px",
            fontSize: "0.85rem",
            fontWeight: 600,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)"
          }}>
            <span style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: isDbConnected ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)",
              boxShadow: isDbConnected ? "0 0 10px rgba(16, 185, 129, 0.5)" : "0 0 10px rgba(239, 68, 68, 0.5)",
              display: "inline-block"
            }} />
            <span style={{ color: "rgba(15, 27, 36, 0.5)" }}>Telemetria Supabase:</span>
            <span style={{ color: isDbConnected ? "#10B981" : "#EF4444", fontWeight: 700 }}>
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
                  background: "#ffffff",
                  border: `1px solid var(--card-border)`,
                  borderLeft: `5px solid ${mod.color}`,
                  borderRadius: "22px",
                  padding: "1.8rem",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(15, 27, 36, 0.015)"
                }}
              >
                {/* Glow Overlay behind cards on hover */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: `radial-gradient(circle at 100% 0%, ${mod.glowColor}, transparent 60%)`,
                  opacity: 0.8,
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
                      background: `#FAF8F3`,
                      border: `1px solid var(--card-border)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.6rem",
                      boxShadow: "0 3px 8px rgba(0,0,0,0.03)"
                    }}>
                      {mod.icon}
                    </div>
                    <span style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      padding: "0.3rem 0.75rem",
                      borderRadius: "8px",
                      background: "rgba(15, 27, 36, 0.03)",
                      color: "rgba(15, 27, 36, 0.5)",
                      border: "1px solid var(--card-border)",
                      letterSpacing: "0.5px"
                    }}>
                      {mod.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 style={{
                    fontSize: "1.35rem",
                    fontWeight: 800,
                    margin: "0 0 0.6rem 0",
                    letterSpacing: "-0.4px",
                    fontFamily: "var(--font-family-title)",
                    color: "hsl(var(--foreground))"
                  }}>
                    {mod.title}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: "0.92rem",
                    lineHeight: "1.5",
                    color: "rgba(15, 27, 36, 0.65)"
                  }}>
                    {mod.description}
                  </p>
                </div>

                {/* Arrow CTA */}
                <div style={{
                  position: "relative",
                  zIndex: 1,
                  alignSelf: "flex-end",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: mod.color === "hsl(172, 58%, 57%)" ? "hsl(206, 58%, 51%)" : mod.color, /* fallback teal to blue for high contrast text */
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
          fontSize: "0.82rem",
          color: "rgba(15, 27, 36, 0.4)",
          borderTop: "1px solid var(--card-border)",
          paddingTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <span style={{ fontWeight: 600 }}>Tio da Van &copy; 2026 • Painel Admin Master</span>
          <span style={{
            fontSize: "0.78rem",
            color: "rgba(15, 27, 36, 0.3)"
          }}>
            Mockup Palette Integration • Next.js 16 (Turbopack)
          </span>
        </footer>
      </main>
    </div>
  );
}
