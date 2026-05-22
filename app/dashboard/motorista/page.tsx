"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

interface Passenger {
  name: string;
  status: "buscar" | "embarcado" | "ausente";
}

export default function MotoristaPage(): React.JSX.Element {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<"home" | "manifesto" | "perfil">("home");

  // Telemetria e faturamento simulado (Tio Pedro)
  const [isRouteActive, setIsRouteActive] = useState<boolean>(false);
  const [routeProgress, setRouteProgress] = useState<number>(10);
  const [cobrancasEnviadas, setCobrancasEnviadas] = useState<boolean>(false);

  const [passengers, setPassengers] = useState<Passenger[]>([
    { name: "João", status: "buscar" },
    { name: "Maria", status: "buscar" },
    { name: "Carlos", status: "buscar" },
    { name: "Acma", status: "buscar" },
  ]);

  // GPS Simulado
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRouteActive) {
      interval = setInterval(() => {
        setRouteProgress((prev) => {
          if (prev >= 90) return 10;
          return prev + 2.5;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRouteActive]);

  const togglePassenger = (index: number) => {
    const updated = [...passengers];
    updated[index].status = updated[index].status === "buscar" ? "embarcado" : "buscar";
    setPassengers(updated);
  };

  const studentsPresent = passengers.filter(p => p.status === "embarcado").length;
  const studentsTotal = passengers.filter(p => p.status !== "ausente").length;

  return (
    <div style={{ background: "#FAF8F3", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{
        width: "100%",
        maxWidth: "480px",
        minHeight: "100vh",
        background: "#FAF8F3",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 0 30px rgba(15, 27, 36, 0.08)",
        position: "relative",
        overflowX: "hidden"
      }}>
        {/* Status Bar */}
        <div className="smartphone-status-bar" style={{ background: "#A2E8DF", padding: "8px 16px" }}>
          <span style={{ color: "#0F1B24", fontWeight: 700 }}>9:16</span>
          <div style={{ display: "flex", gap: "6px", color: "#0F1B24" }}>📶 🔋</div>
        </div>

        {/* ── SEÇÕES BASEADAS NAS TABS ───────────────────────────────────── */}
        {activeTab === "home" && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {/* Header Menta */}
            <div className="phone-mint-header">
              <div className="phone-mint-header-top">
                <span style={{ fontSize: "1.2rem", cursor: "pointer" }}>☰</span>
                <span style={{ fontSize: "1.2rem", cursor: "pointer" }}>⚙️</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h2 className="phone-mint-title" style={{ flex: 1, margin: 0 }}>Tio Pedro's<br />Painel</h2>
                <span style={{ fontSize: "2rem" }}>🚌</span>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="phone-content" style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, padding: "16px" }}>
              {/* KPI Alunos hoje */}
              <div style={{ background: "#ffffff", border: "1px solid var(--card-border)", borderRadius: "18px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: 750, color: "rgba(15, 27, 36, 0.6)" }}>Alunos Hoje:</span>
                <span style={{ marginLeft: "auto", fontSize: "1.1rem", fontWeight: 850, color: "#0F1B24" }}>
                  {studentsPresent}/{studentsTotal}
                </span>
              </div>

              {/* Botão de Iniciar Rota (Centro) */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", margin: "14px 0" }}>
                <button 
                  onClick={() => setIsRouteActive(!isRouteActive)} 
                  className={`pulse-circle-btn ${isRouteActive ? "active" : ""}`}
                >
                  {isRouteActive ? "Rota\nAtiva" : "Iniciar\nRota"}
                </button>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: isRouteActive ? "#10B981" : "rgba(15, 27, 36, 0.4)", marginTop: "4px" }}>
                  {isRouteActive ? "📡 Transmitindo GPS..." : "Garagem"}
                </span>
              </div>

              {/* Status de Faturamento */}
              <div className="phone-card" style={{ padding: "10px 14px", gap: "4px" }}>
                <span className="phone-card-title">Status de Pagamentos</span>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 750, color: "#0F1B24" }}>18 Recebidos</span>
                    <span style={{ fontSize: "0.72rem", color: "rgba(15, 27, 36, 0.4)" }}>6 Pendentes</span>
                  </div>
                  
                  {/* Mini Donut SVG */}
                  <svg width="40" height="40" style={{ transform: "rotate(-90deg)", marginLeft: "auto" }}>
                    <circle cx="20" cy="20" r="14" fill="transparent" stroke="#FAF8F3" strokeWidth="6" />
                    <circle cx="20" cy="20" r="14" fill="transparent" stroke="#10B981" strokeWidth="6" strokeDasharray="88" strokeDashoffset="22" />
                    <circle cx="20" cy="20" r="14" fill="transparent" stroke="#F5C754" strokeWidth="6" strokeDasharray="88" strokeDashoffset="66" />
                  </svg>
                </div>
                
                <button 
                  onClick={() => setCobrancasEnviadas(true)} 
                  className="phone-btn-yellow" 
                  style={{ width: "100%", padding: "8px", fontSize: "0.78rem", fontWeight: 750, marginTop: "8px" }}
                  disabled={cobrancasEnviadas}
                >
                  {cobrancasEnviadas ? "✓ Cobranças Preventivas Enviadas" : "Enviar Cobranças (Preventivas)"}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "manifesto" && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {/* Header Menta */}
            <div className="phone-mint-header">
              <h2 className="phone-mint-title">Manifesto de Alunos</h2>
            </div>

            {/* Conteúdo */}
            <div className="phone-content" style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, padding: "16px" }}>
              <span style={{ fontSize: "0.75rem", color: "rgba(15, 27, 36, 0.5)", fontWeight: 700 }}>Marque os alunos à medida que entrarem na van:</span>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {passengers.map((p, i) => (
                  <div 
                    key={p.name} 
                    onClick={() => p.status !== "ausente" && togglePassenger(i)} 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "10px", 
                      padding: "10px 14px", 
                      background: p.status === "ausente" ? "rgba(239, 68, 68, 0.05)" : p.status === "embarcado" ? "rgba(16, 185, 129, 0.05)" : "#ffffff", 
                      border: "1px solid var(--card-border)", 
                      borderRadius: "14px", 
                      cursor: p.status === "ausente" ? "default" : "pointer" 
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>
                      {p.status === "ausente" ? "❌" : p.status === "embarcado" ? "✅" : "⬜"}
                    </span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: p.status === "ausente" ? "rgba(15,27,36,0.3)" : "#0F1B24", textDecoration: p.status === "ausente" ? "line-through" : "none" }}>
                      {p.name} {p.status === "ausente" && "(Ausente hoje)"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "perfil" && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {/* Header Menta */}
            <div className="phone-mint-header">
              <h2 className="phone-mint-title">Seu Perfil</h2>
            </div>

            {/* Conteúdo */}
            <div className="phone-content" style={{ display: "flex", flexDirection: "column", gap: "14px", flex: 1, padding: "16px" }}>
              <div className="phone-card" style={{ alignItems: "center", textAlign: "center", padding: "20px" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#A2E8DF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", marginBottom: "8px" }}>
                  👨🏻‍✈️
                </div>
                <span style={{ fontSize: "1.1rem", fontWeight: 850, color: "#0F1B24" }}>Tio Pedro</span>
                <span style={{ fontSize: "0.78rem", color: "rgba(15,27,36,0.5)", fontWeight: 700 }}>Motorista Homologado</span>
              </div>

              <div className="phone-card" style={{ gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(15,27,36,0.05)", paddingBottom: "8px" }}>
                  <span style={{ fontSize: "0.8rem", color: "rgba(15,27,36,0.45)", fontWeight: 700 }}>Placa Van</span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0F1B24" }}>ABC-1234</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(15,27,36,0.05)", paddingBottom: "8px" }}>
                  <span style={{ fontSize: "0.8rem", color: "rgba(15,27,36,0.45)", fontWeight: 700 }}>Capacidade</span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0F1B24" }}>15 Alunos</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.8rem", color: "rgba(15,27,36,0.45)", fontWeight: 700 }}>Asaas Wallet</span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#10B981" }}>Vinculada ✓</span>
                </div>
              </div>

              <Link href="/" className="phone-btn-yellow" style={{ textDecoration: "none", textAlign: "center", padding: "10px", marginTop: "auto", fontSize: "0.8rem" }}>
                🚪 Sair do Aplicativo
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="phone-tab-bar" style={{ position: "sticky", bottom: 0, background: "#ffffff", borderTop: "1px solid var(--card-border)" }}>
          <div className={`phone-tab-item ${activeTab === "home" ? "active" : ""}`} onClick={() => setActiveTab("home")}>
            <span className="phone-tab-icon">🏠</span>
            <span className="phone-tab-label">Home</span>
          </div>
          <div className={`phone-tab-item ${activeTab === "manifesto" ? "active" : ""}`} onClick={() => setActiveTab("manifesto")}>
            <span className="phone-tab-icon">📋</span>
            <span className="phone-tab-label">Manifesto</span>
          </div>
          <div className={`phone-tab-item ${activeTab === "perfil" ? "active" : ""}`} onClick={() => setActiveTab("perfil")}>
            <span className="phone-tab-icon">👤</span>
            <span className="phone-tab-label">Perfil</span>
          </div>
        </div>
      </div>
    </div>
  );
}
