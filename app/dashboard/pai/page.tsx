"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function PaiPage(): React.JSX.Element {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<"home" | "buscar" | "perfil">("home");

  // Telemetria e status simulado (Pai/Mãe Jamile)
  const [isAbsent, setIsAbsent] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [showPixModal, setShowPixModal] = useState<boolean>(false);
  const [pixCopied, setPixCopied] = useState<boolean>(false);

  // Busca de vans
  const [schoolInput, setSchoolInput] = useState<string>("Colégio Mãe do Divino Amor");
  const [addressInput, setAddressInput] = useState<string>("Jardim Primavera");

  // GPS Simulado de Van
  const [isRouteActive, setIsRouteActive] = useState<boolean>(true);
  const [routeProgress, setRouteProgress] = useState<number>(35);

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

  const handleToggleAbsence = () => {
    setIsAbsent(!isAbsent);
  };

  const handlePixPaymentSimulate = () => {
    setIsPaid(true);
    setShowPixModal(false);
  };

  // Cálculo de coordenadas SVG da van ao longo da rota
  const t = routeProgress / 100;
  const vanX = (1 - t) * (1 - t) * 50 + 2 * (1 - t) * t * 130 + t * t * 250;
  const vanY = (1 - t) * (1 - t) * 110 + 2 * (1 - t) * t * 95 + t * t * 60;

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
        <div className="smartphone-status-bar" style={{ background: activeTab === "home" ? "#A2E8DF" : "#A2E8DF", padding: "8px 16px" }}>
          <span style={{ color: "#0F1B24", fontWeight: 700 }}>9:16</span>
          <div style={{ display: "flex", gap: "6px", color: "#0F1B24" }}>📶 🔋</div>
        </div>

        {/* ── SEÇÕES BASEADO NAS TABS ───────────────────────────────────── */}
        {activeTab === "home" && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {/* Header Menta */}
            <div className="phone-mint-header">
              <div className="phone-mint-header-top">
                <Link href="/" style={{ textDecoration: "none", fontSize: "1.2rem", color: "#0F1B24" }}>👤</Link>
                <span style={{ fontSize: "1.2rem", cursor: "pointer", position: "relative" }}>
                  🔔
                  <span style={{ position: "absolute", top: "1px", right: "1px", width: "6px", height: "6px", background: "#EF4444", borderRadius: "50%" }} />
                </span>
              </div>
              <h2 className="phone-mint-title">Bom dia,<br />Jamile!</h2>
            </div>

            {/* Conteúdo */}
            <div className="phone-content" style={{ display: "flex", flexDirection: "column", gap: "14px", flex: 1, padding: "16px" }}>
              {/* Mapa SVG */}
              <div className="simulated-map-container" style={{ height: "200px" }}>
                <svg width="100%" height="100%" style={{ background: "#E8F5E9" }}>
                  <path d="M0,40 L300,40 M0,90 L300,90 M70,0 L70,140 M190,0 L190,140" stroke="#FAF8F3" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 50,110 Q 130,110 130,60 T 250,60" fill="none" stroke="#3E8AC8" strokeWidth="4" strokeLinecap="round" strokeDasharray="6,4" />
                  
                  {/* Home */}
                  <circle cx="50" cy="110" r="14" fill="#ffffff" stroke="#E8E4D9" strokeWidth="1.5" />
                  <text x="50" y="114" fontSize="11" textAnchor="middle">🏠</text>

                  {/* School */}
                  <circle cx="250" cy="60" r="14" fill="#ffffff" stroke="#E8E4D9" strokeWidth="1.5" />
                  <text x="250" y="64" fontSize="11" textAnchor="middle">🏫</text>

                  {/* Moving Van */}
                  <g transform={`translate(${vanX - 14}, ${vanY - 14})`}>
                    <circle cx="14" cy="14" r="13" fill="#FAF8F3" stroke="#F5C754" strokeWidth="2.5" />
                    <text x="14" y="18" fontSize="11" textAnchor="middle">🚌</text>
                  </g>
                </svg>
                <div style={{ position: "absolute", bottom: "6px", left: "8px", fontSize: "0.65rem", background: "rgba(255,255,255,0.9)", padding: "2px 8px", borderRadius: "50px", fontWeight: 700, color: "#0F1B24" }}>
                  📍 Arapongas Live GPS
                </div>
              </div>

              {/* Status Rota Card */}
              <div className="phone-card" style={{ gap: "4px" }}>
                <span className="phone-card-title">Status da Rota</span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "1.1rem" }}>🚐</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 750, color: "#0F1B24" }}>
                    {isRouteActive ? "Tio Pedro está chegando!" : "Aguardando início da rota"}
                  </span>
                </div>
                <span style={{ fontSize: "0.75rem", color: "rgba(15, 27, 36, 0.55)", fontWeight: 600 }}>
                  ⏱️ Chegada em aproximadamente 5 minutos
                </span>
              </div>

              {/* Ações */}
              <button 
                onClick={handleToggleAbsence} 
                className="phone-btn-blue" 
                style={{ 
                  background: isAbsent ? "#EF4444" : "#3E8AC8", 
                  boxShadow: isAbsent ? "0 4px 12px rgba(239, 68, 68, 0.2)" : "0 4px 12px rgba(62, 138, 200, 0.2)",
                  marginTop: "8px"
                }}
              >
                🙋‍♂️ {isAbsent ? "Ausência Confirmada!" : "Informar Ausência do Filho"}
              </button>

              <button 
                onClick={() => isPaid ? null : setShowPixModal(true)} 
                className="phone-btn-blue" 
                style={{ 
                  background: isPaid ? "#10B981" : "#3E8AC8",
                  boxShadow: isPaid ? "0 4px 12px rgba(16, 185, 129, 0.2)" : "0 4px 12px rgba(62, 138, 200, 0.2)",
                  cursor: isPaid ? "default" : "pointer"
                }}
              >
                💳 {isPaid ? "Mensalidade Paga • R$ 350" : "Pagar Mensalidade Escolar"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "buscar" && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {/* Header Menta */}
            <div className="phone-mint-header">
              <div className="phone-mint-header-top">
                <span style={{ fontSize: "1.1rem", cursor: "pointer" }} onClick={() => setActiveTab("home")}>←</span>
                <span style={{ fontSize: "1.1rem" }}>🔍</span>
              </div>
              <h2 className="phone-mint-title">Encontrar<br />sua Van</h2>
            </div>

            {/* Conteúdo */}
            <div className="phone-content" style={{ display: "flex", flexDirection: "column", gap: "14px", flex: 1, padding: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "rgba(15, 27, 36, 0.6)" }}>Onde seu filho estuda?</span>
                  <input 
                    type="text" 
                    value={schoolInput} 
                    onChange={(e) => setSchoolInput(e.target.value)}
                    style={{ background: "#ffffff", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "10px 14px", fontSize: "0.85rem", color: "#0F1B24", outline: "none", fontWeight: 600 }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "rgba(15, 27, 36, 0.6)" }}>Onde vocês moram?</span>
                  <input 
                    type="text" 
                    value={addressInput} 
                    onChange={(e) => setAddressInput(e.target.value)}
                    style={{ background: "#ffffff", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "10px 14px", fontSize: "0.85rem", color: "#0F1B24", outline: "none", fontWeight: 600 }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "5px" }}>
                <div style={{ background: "#F5C754", color: "#0F1B24", fontSize: "0.68rem", fontWeight: 800, padding: "4px 10px", borderRadius: "50px", transform: "rotate(6deg)", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
                  🚌 VANS CADASTRADAS!
                </div>
              </div>

              {/* Card de van */}
              <div className="phone-card" style={{ gap: "6px", borderLeft: "5px solid #F5C754" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#A2E8DF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
                    👨🏻‍✈️
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0F1B24" }}>Tio Pedro - Rota 1</span>
                    <span style={{ fontSize: "0.75rem", color: "#F5C754", fontWeight: 700 }}>⭐⭐⭐⭐⭐ (5.0)</span>
                  </div>
                </div>

                <p style={{ fontSize: "0.75rem", color: "rgba(15, 27, 36, 0.6)", lineHeight: "1.3", fontWeight: 600 }}>
                  Segurança, pontualidade e carinho com seu filho. Veículo cadastrado com vistorias preventivas em dia.
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                  <span style={{ fontSize: "0.7rem", color: "rgba(15, 27, 36, 0.45)", fontWeight: 700 }}>
                    Bairro: {addressInput}
                  </span>
                  <button className="phone-btn-yellow" style={{ padding: "4px 12px", fontSize: "0.72rem" }}>
                    Contatar
                  </button>
                </div>
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
                  👩🏻
                </div>
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F1B24" }}>Mãe Jamile</span>
                <span style={{ fontSize: "0.78rem", color: "rgba(15,27,36,0.5)", fontWeight: 700 }}>Responsável Cadastrada</span>
              </div>

              <div className="phone-card" style={{ gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(15,27,36,0.05)", paddingBottom: "8px" }}>
                  <span style={{ fontSize: "0.8rem", color: "rgba(15,27,36,0.45)", fontWeight: 700 }}>Filho(a)</span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0F1B24" }}>João Jamile</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(15,27,36,0.05)", paddingBottom: "8px" }}>
                  <span style={{ fontSize: "0.8rem", color: "rgba(15,27,36,0.45)", fontWeight: 700 }}>Escola</span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0F1B24" }}>Divino Amor</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.8rem", color: "rgba(15,27,36,0.45)", fontWeight: 700 }}>Motorista</span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0F1B24" }}>Tio Pedro</span>
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
          <div className={`phone-tab-item ${activeTab === "buscar" ? "active" : ""}`} onClick={() => setActiveTab("buscar")}>
            <span className="phone-tab-icon">🔍</span>
            <span className="phone-tab-label">Buscar</span>
          </div>
          <div className={`phone-tab-item ${activeTab === "perfil" ? "active" : ""}`} onClick={() => setActiveTab("perfil")}>
            <span className="phone-tab-icon">👤</span>
            <span className="phone-tab-label">Perfil</span>
          </div>
        </div>

        {/* Pix modal overlay */}
        {showPixModal && (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            background: "rgba(15, 27, 36, 0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px"
          }}>
            <div style={{
              background: "#ffffff",
              border: "1px solid var(--card-border)",
              borderRadius: "24px",
              padding: "24px 16px",
              width: "100%",
              maxWidth: "340px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
            }}>
              <div style={{ fontSize: "2rem" }}>💸</div>
              <h3 style={{ fontWeight: 800, fontSize: "1.2rem", color: "#0F1B24", margin: 0 }}>Pagar via Pix</h3>
              <p style={{ fontSize: "0.78rem", color: "rgba(15,27,36,0.6)", fontWeight: 600, lineHeight: "1.4", margin: 0 }}>
                Pague a mensalidade da Rota 1. R$ 332,50 serão repassados ao Tio Pedro e R$ 17,50 (5%) à plataforma.
              </p>

              <div style={{ display: "flex", justifyContent: "center", background: "#FAF8F3", border: "1px dashed var(--card-border)", borderRadius: "16px", padding: "12px" }}>
                <svg width="100" height="100" viewBox="0 0 100 100" style={{ fill: "#0F1B24" }}>
                  <rect x="0" y="0" width="25" height="25" />
                  <rect x="5" y="5" width="15" height="15" fill="#FAF8F3" />
                  <rect x="9" y="9" width="7" height="7" />
                  <rect x="75" y="0" width="25" height="25" />
                  <rect x="80" y="5" width="15" height="15" fill="#FAF8F3" />
                  <rect x="0" y="75" width="25" height="25" />
                  <rect x="5" y="80" width="15" height="15" fill="#FAF8F3" />
                  <rect x="35" y="5" width="8" height="8" />
                  <rect x="47" y="12" width="12" height="6" />
                  <rect x="38" y="25" width="18" height="8" />
                  <rect x="5" y="38" width="14" height="8" />
                  <rect x="25" y="45" width="8" height="18" />
                  <rect x="55" y="38" width="12" height="12" />
                  <rect x="35" y="72" width="15" height="18" />
                  <rect x="55" y="80" width="12" height="12" />
                </svg>
              </div>

              <div style={{ display: "flex", gap: "6px", flexDirection: "column" }}>
                <button 
                  onClick={() => {
                    setPixCopied(true);
                    setTimeout(() => setPixCopied(false), 2000);
                  }} 
                  className="phone-btn-blue" 
                  style={{ background: "#FAF8F3", color: "#0F1B24", border: "1px solid var(--card-border)", boxShadow: "none", padding: "8px", fontSize: "0.78rem" }}
                >
                  📋 {pixCopied ? "Copiado!" : "Copiar Pix"}
                </button>
                <button 
                  onClick={handlePixPaymentSimulate} 
                  className="phone-btn-blue" 
                  style={{ background: "#10B981", padding: "8px", fontSize: "0.78rem" }}
                >
                  💸 Simular Pagamento Pix
                </button>
                <button 
                  onClick={() => setShowPixModal(false)} 
                  className="phone-btn-blue" 
                  style={{ background: "transparent", color: "rgba(15,27,36,0.5)", boxShadow: "none", padding: "4px" }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
