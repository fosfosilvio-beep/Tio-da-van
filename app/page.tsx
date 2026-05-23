"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function CleanSlatePage(): React.JSX.Element {
  const supabase = createClient();
  const [dbStatus, setDbStatus] = useState<"checking" | "online" | "offline">("checking");
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      const start = performance.now();
      try {
        // Query to check connection to the active profiles (perfis) table
        const { error } = await supabase.from("perfis").select("id").limit(1);
        const end = performance.now();
        if (!error) {
          setDbStatus("online");
          setLatency(Math.round(end - start));
        } else {
          console.error("Supabase query error:", error);
          setDbStatus("offline");
        }
      } catch (err) {
        console.error("Connection check failed:", err);
        setDbStatus("offline");
      }
    };

    checkConnection();
  }, [supabase]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Animated Badge */}
        <div style={styles.badgeContainer}>
          <span style={styles.badgePulse}></span>
          <span style={styles.badgeText}>MÓDULO C • ESTADO INICIAL</span>
        </div>

        {/* Floating Icon */}
        <div style={styles.iconWrapper}>
          <span style={styles.icon}>🚐</span>
        </div>

        {/* Title & Subtitle */}
        <div style={styles.textCenter}>
          <h1 style={styles.title}>Tio da Van</h1>
          <p style={styles.subtitle}>
            Painel Administrativo Master e ecossistema de transporte escolar.
          </p>
        </div>

        {/* Separator */}
        <div style={styles.separator} />

        {/* Connection Status Section */}
        <div style={styles.statusSection}>
          <div style={styles.statusLabelRow}>
            <span style={styles.statusLabel}>Banco de Dados (Supabase)</span>
            <span
              style={{
                ...styles.statusValue,
                color:
                  dbStatus === "online"
                    ? "#10B981"
                    : dbStatus === "offline"
                    ? "#EF4444"
                    : "#F5C754",
              }}
            >
              {dbStatus === "online"
                ? "CONECTADO"
                : dbStatus === "offline"
                ? "OFFLINE"
                : "VERIFICANDO..."}
            </span>
          </div>

          <div style={styles.statusBarContainer}>
            <div
              style={{
                ...styles.statusBar,
                width: dbStatus === "online" ? "100%" : dbStatus === "offline" ? "10%" : "50%",
                background:
                  dbStatus === "online"
                    ? "linear-gradient(90deg, #A2E8DF, #10B981)"
                    : dbStatus === "offline"
                    ? "#EF4444"
                    : "#F5C754",
              }}
            />
          </div>

          {dbStatus === "online" && latency !== null && (
            <p style={styles.latencyText}>Latência de conexão: {latency}ms</p>
          )}
        </div>

        {/* Info Box */}
        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>📋 Ponto de Partida Ativado</h3>
          <p style={styles.infoDescription}>
            Todas as rotas antigas foram excluídas com sucesso. O projeto está limpo e pronto para o desenvolvimento das novas telas com o template **WowDash**.
          </p>
        </div>

        {/* Footer info */}
        <div style={styles.footer}>
          <span style={styles.footerText}>Arapongas - PR • 2026</span>
        </div>
      </div>
    </div>
  );
}

// Visual design styles - Sand-beige warm premium vibe matching the guidelines
const styles: Record<string, React.CSSProperties> = {
  container: {
    background: "#FAF8F3", // Warm sand-beige
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    fontFamily: "var(--font-outfit), var(--font-inter), sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "460px",
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.6)",
    borderRadius: "32px",
    padding: "40px 32px 32px 32px",
    boxShadow: "0 20px 40px rgba(15, 27, 36, 0.03), 0 1px 3px rgba(15, 27, 36, 0.02)",
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    position: "relative",
  },
  badgeContainer: {
    position: "absolute",
    top: "-14px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#0F1B24",
    padding: "8px 16px",
    borderRadius: "100px",
    boxShadow: "0 4px 12px rgba(15, 27, 36, 0.15)",
  },
  badgePulse: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#A2E8DF",
    boxShadow: "0 0 8px #A2E8DF",
  },
  badgeText: {
    color: "#ffffff",
    fontSize: "0.68rem",
    fontWeight: 800,
    letterSpacing: "0.08em",
  },
  iconWrapper: {
    alignSelf: "center",
    background: "#A2E8DF",
    width: "64px",
    height: "64px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 20px rgba(162, 232, 223, 0.3)",
  },
  icon: {
    fontSize: "2rem",
  },
  textCenter: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: 900,
    color: "#0F1B24",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "0.85rem",
    color: "rgba(15, 27, 36, 0.6)",
    margin: 0,
    lineHeight: 1.5,
    fontWeight: 500,
  },
  separator: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(15, 27, 36, 0.08), transparent)",
  },
  statusSection: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    background: "rgba(15, 27, 36, 0.02)",
    padding: "16px 20px",
    borderRadius: "20px",
    border: "1px solid rgba(15, 27, 36, 0.03)",
  },
  statusLabelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: "0.78rem",
    color: "#0F1B24",
    fontWeight: 700,
  },
  statusValue: {
    fontSize: "0.75rem",
    fontWeight: 800,
    letterSpacing: "0.02em",
  },
  statusBarContainer: {
    height: "6px",
    background: "rgba(15, 27, 36, 0.06)",
    borderRadius: "10px",
    overflow: "hidden",
  },
  statusBar: {
    height: "100%",
    borderRadius: "10px",
    transition: "width 0.8s ease-in-out, background 0.8s ease",
  },
  latencyText: {
    fontSize: "0.68rem",
    color: "rgba(15, 27, 36, 0.45)",
    margin: "2px 0 0 0",
    fontWeight: 650,
  },
  infoBox: {
    background: "rgba(62, 138, 200, 0.05)",
    border: "1px solid rgba(62, 138, 200, 0.12)",
    borderRadius: "20px",
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  infoTitle: {
    fontSize: "0.8rem",
    color: "#3E8AC8",
    fontWeight: 800,
    margin: 0,
  },
  infoDescription: {
    fontSize: "0.78rem",
    color: "rgba(15, 27, 36, 0.7)",
    margin: 0,
    lineHeight: 1.55,
    fontWeight: 500,
  },
  footer: {
    textAlign: "center",
    marginTop: "8px",
  },
  footerText: {
    fontSize: "0.7rem",
    color: "rgba(15, 27, 36, 0.35)",
    fontWeight: 700,
    letterSpacing: "0.04em",
  },
};
