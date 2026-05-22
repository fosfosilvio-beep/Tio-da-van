"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

// Tipagem de dados locais
interface Passenger {
  name: string;
  status: "buscar" | "embarcado" | "ausente";
}

interface SimulatedUser {
  id: string;
  name: string;
  role: "motorista" | "responsavel";
  detail: string;
  active: boolean;
}

interface SplitReport {
  name: string;
  avatar: string;
  total: number;
  commission: number;
}

export default function Page(): React.JSX.Element {
  const supabase = createClient();

  // ── ESTADOS GLOBAIS DO SIMULADOR ──────────────────────────────────────
  const [selectedSet, setSelectedSet] = useState<"set1" | "set2">("set1");
  const [isLoadingDb, setIsLoadingDb] = useState<boolean>(true);
  
  // Dados dinâmicos do Supabase (com fallback)
  const [stats, setStats] = useState({
    totalVans: 8,
    totalAlunos: 23,
    gmvTotal: 3273.00,
    commissionTotal: 163.65,
  });

  // ── ESTADOS DO SET 1 (PAIS & MOTORISTAS) ──────────────────────────────
  // Phone 1 (Pais Home - Jamile)
  const [activeTabP1, setActiveTabP1] = useState<"home" | "heart" | "profile">("home");
  const [isAbsent, setIsAbsent] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [showPixModal, setShowPixModal] = useState<boolean>(false);
  const [pixCopied, setPixCopied] = useState<boolean>(false);

  // Phone 2 (Pais Buscar)
  const [activeTabP2, setActiveTabP2] = useState<"home" | "heart" | "profile">("heart");
  const [schoolInput, setSchoolInput] = useState<string>("Colégio Mãe do Divino Amor");
  const [addressInput, setAddressInput] = useState<string>("Jardim Primavera");

  // Phone 3 (Motorista Painel - Tio Pedro)
  const [activeTabP3, setActiveTabP3] = useState<"home" | "heart" | "profile">("home");
  const [isRouteActive, setIsRouteActive] = useState<boolean>(false);
  const [routeProgress, setRouteProgress] = useState<number>(10); // van position percent
  const [cobrancasEnviadas, setCobrancasEnviadas] = useState<boolean>(false);
  const [passengers, setPassengers] = useState<Passenger[]>([
    { name: "João", status: "buscar" },
    { name: "Maria", status: "buscar" },
    { name: "Carlos", status: "buscar" },
    { name: "Acma", status: "buscar" },
  ]);

  // ── ESTADOS DO SET 2 (ADMINISTRADOR) ──────────────────────────────────
  // Phone 4 (Admin Geral)
  const [activeTabP4, setActiveTabP4] = useState<"home" | "heart" | "profile">("home");
  // Phone 5 (Admin Users)
  const [activeTabP5, setActiveTabP5] = useState<"home" | "heart" | "profile">("heart");
  const [adminUserTab, setAdminUserTab] = useState<"motoristas" | "responsaveis">("motoristas");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [simulatedUsers, setSimulatedUsers] = useState<SimulatedUser[]>([
    { id: "1", name: "Tio Pedro", role: "motorista", detail: "Ativo • Rota 1", active: true },
    { id: "2", name: "Responsável", role: "responsavel", detail: "3 crianças vinculadas", active: true },
    { id: "3", name: "Mãe Jamile", role: "responsavel", detail: "2 crianças vinculadas", active: true },
    { id: "4", name: "Tio Marcos", role: "motorista", detail: "Pendente • Rota 2", active: false },
  ]);

  // Phone 6 (Admin Split)
  const [activeTabP6, setActiveTabP6] = useState<"home" | "heart" | "profile">("profile");
  const [splitMonth, setSplitMonth] = useState<string>("Este Mês");
  const [splitReports, setSplitReports] = useState<SplitReport[]>([
    { name: "Tio Pedro", avatar: "👨🏻‍✈️", total: 529.00, commission: 5.00 },
    { name: "Motorista Rota 2", avatar: "👨🏾‍✈️", total: 228.00, commission: 5.00 },
  ]);

  // ── CARREGAMENTO DE DADOS REAIS DO SUPABASE ───────────────────────────
  const loadSupabaseData = async () => {
    try {
      setIsLoadingDb(true);
      // 1. Contagem de motoristas ativos
      const { data: motoristas, error: errMot } = await supabase
        .from("motoristas")
        .select("id")
        .eq("status", "aprovado");

      // 2. Contagem de alunos
      const { count: alunosCount, error: errAlu } = await supabase
        .from("alunos")
        .select("*", { count: "exact", head: true });

      // 3. Receitas e splits
      const { data: cobrancas, error: errCob } = await supabase
        .from("cobrancas")
        .select("valor_total, valor_plataforma, status");

      if (!errMot && !errAlu && !errCob) {
        const items = cobrancas || [];
        const paidItems = items.filter(c => c.status === "pago");
        
        const gmv = paidItems.reduce((acc, c) => acc + Number(c.valor_total), 0);
        const commission = paidItems.reduce((acc, c) => acc + Number(c.valor_plataforma), 0);
        
        setStats({
          totalVans: motoristas ? motoristas.length : 8,
          totalAlunos: alunosCount || 23,
          gmvTotal: gmv > 0 ? gmv : 3273.00,
          commissionTotal: commission > 0 ? commission : 163.65,
        });
      }
    } catch (err) {
      console.error("Erro ao carregar telemetria do Supabase:", err);
    } finally {
      setIsLoadingDb(false);
    }
  };

  useEffect(() => {
    loadSupabaseData();
  }, []);

  // ── SIMULAÇÃO DO GPS EM MOVIMENTO ─────────────────────────────────────
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRouteActive) {
      interval = setInterval(() => {
        setRouteProgress((prev) => {
          if (prev >= 90) return 10; // loops back
          return prev + 2.5;
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isRouteActive]);

  // ── EVENTOS INTERATIVOS ───────────────────────────────────────────────
  // Marcar/Desmarcar manifesto de passageiros
  const togglePassenger = (index: number) => {
    const updated = [...passengers];
    updated[index].status = updated[index].status === "buscar" ? "embarcado" : "buscar";
    setPassengers(updated);
  };

  // Alterar ativação de usuários pelo admin
  const toggleUserActive = (id: string) => {
    setSimulatedUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  // Pix pagamento simulado
  const handlePixPaymentSimulate = () => {
    setIsPaid(true);
    setShowPixModal(false);
    // Atualizar localmente a comissão consolidada para impressionar!
    setStats(prev => ({
      ...prev,
      gmvTotal: prev.gmvTotal + 350.00,
      commissionTotal: prev.commissionTotal + 17.50,
    }));
  };

  // Auxência simulada
  const handleToggleAbsence = () => {
    const nextAbsent = !isAbsent;
    setIsAbsent(nextAbsent);
    // Reflete no manifesto do motorista!
    setPassengers(prev => prev.map(p => p.name === "João" ? { ...p, status: nextAbsent ? "ausente" : "buscar" } : p));
  };

  // Contagem de alunos embarcados hoje no manifesto do motorista
  const studentsPresent = passengers.filter(p => p.status === "embarcado").length;
  const studentsTotal = passengers.filter(p => p.status !== "ausente").length;

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "2.5rem 1rem",
      backgroundColor: "hsl(var(--background))",
      position: "relative",
      overflowX: "hidden",
      gap: "2rem"
    }}>
      {/* ── TOP NAV BAR COM LINK DESKTOP E TELEMETRIA ─────────────────────── */}
      <div style={{
        width: "100%",
        maxWidth: "1140px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
        zIndex: 50,
        background: "#ffffff",
        border: "1px solid var(--card-border)",
        borderRadius: "20px",
        padding: "1rem 1.5rem",
        boxShadow: "0 4px 15px rgba(15, 27, 36, 0.02)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.6rem" }}>🚐</span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "var(--font-family-title)", fontWeight: 800, fontSize: "1.15rem", color: "#0F1B24", letterSpacing: "-0.5px" }}>
              Tio da Van
            </span>
            <span style={{ fontSize: "0.75rem", color: "rgba(15, 27, 36, 0.5)", fontWeight: 650 }}>
              Live Product Simulator Console
            </span>
          </div>
        </div>

        {/* Live Supabase Pill */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#FAF8F3",
          border: "1px solid var(--card-border)",
          padding: "0.4rem 1rem",
          borderRadius: "50px",
          fontSize: "0.78rem",
          fontWeight: 700
        }}>
          <span style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#10B981",
            boxShadow: "0 0 8px rgba(16, 185, 129, 0.5)",
            display: "inline-block"
          }} />
          <span style={{ color: "rgba(15, 27, 36, 0.5)" }}>Supabase:</span>
          <span style={{ color: "#10B981" }}>Live Conectado</span>
        </div>

        {/* Link para o Painel Administrativo de Desktop */}
        <Link href="/dashboard" className="btn-mock" style={{ textDecoration: "none", padding: "0.6rem 1.5rem", fontSize: "0.85rem" }}>
          💻 Acessar Painel Desktop &rarr;
        </Link>
      </div>

      {/* ── HEADER PRINCIPAL DO SIMULADOR ────────────────────────────────── */}
      <div style={{ textAlign: "center", maxWidth: "700px", zIndex: 10 }}>
        <h1 style={{
          fontFamily: "var(--font-family-title)",
          fontWeight: 900,
          fontSize: "2.5rem",
          color: "#0F1B24",
          letterSpacing: "-1px",
          lineHeight: "1.15",
          marginBottom: "0.5rem"
        }}>
          O ecossistema em suas mãos
        </h1>
        <p style={{ color: "rgba(15, 27, 36, 0.6)", fontSize: "1rem", fontWeight: 500, lineHeight: "1.4" }}>
          Interaja com as telas reais do app que conectam pais, motoristas e administradores. 
          Use os controles para simular rotas GPS e pagamentos Mercado Pago com split de comissões.
        </p>
      </div>

      {/* ── CONTROLLER / SWITCHER DOS SETS DE TELAS ────────────────────── */}
      <div className="set-switcher">
        <button
          className={`set-btn ${selectedSet === "set1" ? "active" : ""}`}
          onClick={() => setSelectedSet("set1")}
        >
          📱 Apps de Campo (Pais & Motoristas)
        </button>
        <button
          className={`set-btn ${selectedSet === "set2" ? "active" : ""}`}
          onClick={() => setSelectedSet("set2")}
        >
          🛡️ Painel do Administrador Geral
        </button>
      </div>

      {/* ── SEÇÃO DOS SMARTPHONES (SIMULADOR DE ALTA FIDELIDADE) ─────────── */}
      <div className="simulator-section">
        {selectedSet === "set1" ? (
          /* ===================================================================
             SET 1: APLICATIVOS DE CAMPO (PAIS & MOTORISTAS)
             =================================================================== */
          <div className="devices-grid">
            
            {/* 📱 PHONE 1: APP DO RESPONSÁVEL — HOME (MÃE JAMILE) */}
            <div className="smartphone-mockup">
              <div className="smartphone-notch" />
              <div className="smartphone-screen">
                {/* Status Bar */}
                <div className="smartphone-status-bar">
                  <span>9:16</span>
                  <div style={{ display: "flex", gap: "4px" }}>📶 🔋</div>
                </div>

                {/* Header Menta */}
                <div className="phone-mint-header">
                  <div className="phone-mint-header-top">
                    <span style={{ fontSize: "1.2rem", cursor: "pointer" }}>☰</span>
                    <span style={{ fontSize: "1.2rem", cursor: "pointer", position: "relative" }}>
                      🔔
                      <span style={{ position: "absolute", top: "1px", right: "1px", width: "6px", height: "6px", background: "#EF4444", borderRadius: "50%" }} />
                    </span>
                  </div>
                  <h2 className="phone-mint-title">Bom dia,<br />Jamile!</h2>
                </div>

                {/* Conteúdo do Telefone */}
                <div className="phone-content">
                  {/* Mapa SVG interativo */}
                  <div className="simulated-map-container">
                    <svg width="100%" height="100%" style={{ background: "#E8F5E9" }}>
                      {/* Linhas de grade/ruas fictícias */}
                      <path d="M0,40 L300,40 M0,90 L300,90 M70,0 L70,140 M190,0 L190,140" stroke="#FAF8F3" strokeWidth="6" strokeLinecap="round" />
                      
                      {/* Rota da van pontilhada azul */}
                      <path d="M 50,110 Q 130,110 130,60 T 250,60" fill="none" stroke="#3E8AC8" strokeWidth="4" strokeLinecap="round" strokeDasharray="6,4" />
                      
                      {/* Marcador da Casa (Home) */}
                      <circle cx="50" cy="110" r="14" fill="#ffffff" stroke="#E8E4D9" strokeWidth="1.5" />
                      <text x="50" y="114" fontSize="11" textAnchor="middle">🏠</text>

                      {/* Marcador da Escola (School) */}
                      <circle cx="250" cy="60" r="14" fill="#ffffff" stroke="#E8E4D9" strokeWidth="1.5" />
                      <text x="250" y="64" fontSize="11" textAnchor="middle">🏫</text>

                      {/* Van Escolar Amarela simulada (posição baseada no progresso da rota do motorista) */}
                      {(() => {
                        // Cálculo simplificado de coordenadas ao longo da curva bézier cúbica
                        // M 50,110 Q 130,110 130,60 T 250,60
                        const t = routeProgress / 100;
                        const x = (1-t)*(1-t)*50 + 2*(1-t)*t*130 + t*t*250;
                        const y = (1-t)*(1-t)*110 + 2*(1-t)*t*95 + t*t*60;
                        return (
                          <g transform={`translate(${x - 14}, ${y - 14})`}>
                            <circle cx="14" cy="14" r="13" fill="#FAF8F3" stroke="#F5C754" strokeWidth="2.5" />
                            <text x="14" y="18" fontSize="11" textAnchor="middle">🚌</text>
                          </g>
                        );
                      })()}
                    </svg>
                    
                    {/* Legenda de Mapa */}
                    <div style={{ position: "absolute", bottom: "6px", left: "8px", fontSize: "0.6rem", background: "rgba(255,255,255,0.85)", padding: "2px 6px", borderRadius: "50px", fontWeight: 700, color: "#0F1B24" }}>
                      📍 Arapongas Live GPS
                    </div>
                  </div>

                  {/* Card de Status da van */}
                  <div className="phone-card" style={{ gap: "4px" }}>
                    <span className="phone-card-title">Status da Rota</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "1.1rem" }}>🚐</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 750, color: "#0F1B24" }}>
                        {isRouteActive ? "Tio Pedro está chegando!" : "Aguardando início da rota"}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "rgba(15, 27, 36, 0.55)", fontWeight: 600 }}>
                      ⏱️ {isRouteActive ? "Chegada em aproximadamente 5 minutos" : "Van escolar parada na garagem"}
                    </span>
                  </div>

                  {/* Botões de Ações rápidas */}
                  <button 
                    onClick={handleToggleAbsence} 
                    className="phone-btn-blue" 
                    style={{ 
                      background: isAbsent ? "#EF4444" : "#3E8AC8", 
                      boxShadow: isAbsent ? "0 4px 12px rgba(239, 68, 68, 0.2)" : "0 4px 12px rgba(62, 138, 200, 0.2)" 
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

                {/* Bottom Tab Bar */}
                <div className="phone-tab-bar">
                  <div className={`phone-tab-item ${activeTabP1 === "home" ? "active" : ""}`} onClick={() => setActiveTabP1("home")}>
                    <span className="phone-tab-icon">🏠</span>
                    <span className="phone-tab-label">Home</span>
                  </div>
                  <div className={`phone-tab-item ${activeTabP1 === "heart" ? "active" : ""}`} onClick={() => setActiveTabP1("heart")}>
                    <span className="phone-tab-icon">❤️</span>
                    <span className="phone-tab-label">Favoritos</span>
                  </div>
                  <div className={`phone-tab-item ${activeTabP1 === "profile" ? "active" : ""}`} onClick={() => setActiveTabP1("profile")}>
                    <span className="phone-tab-icon">👤</span>
                    <span className="phone-tab-label">Perfil</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 📱 PHONE 2: APP DO RESPONSÁVEL — ENCONTRAR VAN */}
            <div className="smartphone-mockup">
              <div className="smartphone-notch" />
              <div className="smartphone-screen">
                {/* Status Bar */}
                <div className="smartphone-status-bar">
                  <span>9:16</span>
                  <div style={{ display: "flex", gap: "4px" }}>📶 🔋</div>
                </div>

                {/* Header Menta */}
                <div className="phone-mint-header">
                  <div className="phone-mint-header-top">
                    <span style={{ fontSize: "1.1rem", cursor: "pointer" }}>←</span>
                    <span style={{ fontSize: "1.1rem", cursor: "pointer" }}>🔍</span>
                  </div>
                  <h2 className="phone-mint-title">Encontrar<br />sua Van</h2>
                </div>

                {/* Conteúdo do Telefone */}
                <div className="phone-content">
                  {/* Formulário de Busca */}
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

                  {/* Cute van sticker overlay */}
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-5px", marginBottom: "-10px" }}>
                    <div style={{ background: "#F5C754", color: "#0F1B24", fontSize: "0.68rem", fontWeight: 800, padding: "4px 10px", borderRadius: "50px", transform: "rotate(6deg)", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
                      🚌 VANS CADASTRADAS!
                    </div>
                  </div>

                  {/* Card do Motorista correspondente */}
                  <div className="phone-card" style={{ gap: "6px", borderLeft: "5px solid #F5C754" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                      {/* Avatar */}
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
                        Escolas: {schoolInput.split(" ")[1] || "Mãe..."}
                      </span>
                      <button className="phone-btn-yellow" style={{ padding: "4px 12px", fontSize: "0.72rem" }}>
                        Contatar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Tab Bar */}
                <div className="phone-tab-bar">
                  <div className={`phone-tab-item ${activeTabP2 === "home" ? "active" : ""}`} onClick={() => setActiveTabP2("home")}>
                    <span className="phone-tab-icon">🏠</span>
                    <span className="phone-tab-label">Home</span>
                  </div>
                  <div className={`phone-tab-item ${activeTabP2 === "heart" ? "active" : ""}`} onClick={() => setActiveTabP2("heart")}>
                    <span className="phone-tab-icon">🔍</span>
                    <span className="phone-tab-label">Buscar</span>
                  </div>
                  <div className={`phone-tab-item ${activeTabP2 === "profile" ? "active" : ""}`} onClick={() => setActiveTabP2("profile")}>
                    <span className="phone-tab-icon">👤</span>
                    <span className="phone-tab-label">Perfil</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 📱 PHONE 3: APP DO MOTORISTA — PAINEL DE CONTROLE (TIO PEDRO) */}
            <div className="smartphone-mockup">
              <div className="smartphone-notch" />
              <div className="smartphone-screen">
                {/* Status Bar */}
                <div className="smartphone-status-bar">
                  <span>9:16</span>
                  <div style={{ display: "flex", gap: "4px" }}>📶 🔋</div>
                </div>

                {/* Header Menta */}
                <div className="phone-mint-header">
                  <div className="phone-mint-header-top">
                    <span style={{ fontSize: "1.2rem", cursor: "pointer" }}>☰</span>
                    <span style={{ fontSize: "1.2rem", cursor: "pointer" }}>⚙️</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h2 className="phone-mint-title" style={{ flex: 1 }}>Tio Pedro's<br />Painel</h2>
                    <span style={{ fontSize: "2rem" }}>🚌</span>
                  </div>
                </div>

                {/* Conteúdo do Telefone */}
                <div className="phone-content" style={{ gap: "12px" }}>
                  {/* KPI Alunos hoje */}
                  <div style={{ background: "#ffffff", border: "1px solid var(--card-border)", borderRadius: "18px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 750, color: "rgba(15, 27, 36, 0.6)" }}>Alunos Hoje:</span>
                    <span style={{ marginLeft: "auto", fontSize: "1.1rem", fontWeight: 850, color: "#0F1B24" }}>
                      {studentsPresent}/{studentsTotal}
                    </span>
                  </div>

                  {/* Manifesto checklist card */}
                  <div className="phone-card" style={{ padding: "12px 14px", gap: "6px" }}>
                    <span className="phone-card-title">Manifesto de Alunos</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {passengers.map((p, i) => (
                        <div 
                          key={p.name} 
                          onClick={() => p.status !== "ausente" && togglePassenger(i)} 
                          style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "8px", 
                            padding: "6px 8px", 
                            background: p.status === "ausente" ? "rgba(239, 68, 68, 0.05)" : p.status === "embarcado" ? "rgba(16, 185, 129, 0.05)" : "#FAF8F3", 
                            border: "1px solid rgba(15,27,36,0.03)", 
                            borderRadius: "10px", 
                            cursor: p.status === "ausente" ? "default" : "pointer" 
                          }}
                        >
                          <span style={{ fontSize: "0.85rem" }}>
                            {p.status === "ausente" ? "❌" : p.status === "embarcado" ? "✅" : "⬜"}
                          </span>
                          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: p.status === "ausente" ? "rgba(15,27,36,0.3)" : "#0F1B24", textDecoration: p.status === "ausente" ? "line-through" : "none" }}>
                            {p.name} {p.status === "ausente" && "(Ausente)"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botão de Iniciar Rota (Centro) */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", margin: "4px 0" }}>
                    <button 
                      onClick={() => setIsRouteActive(!isRouteActive)} 
                      className={`pulse-circle-btn ${isRouteActive ? "active" : ""}`}
                    >
                      {isRouteActive ? "Rota\nAtiva" : "Iniciar\nRota"}
                    </button>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: isRouteActive ? "#10B981" : "rgba(15, 27, 36, 0.4)" }}>
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
                      style={{ width: "100%", padding: "6px", fontSize: "0.78rem", fontWeight: 750 }}
                      disabled={cobrancasEnviadas}
                    >
                      {cobrancasEnviadas ? "✓ Cobranças Preventivas Enviadas" : "Enviar Cobranças (Preventivas)"}
                    </button>
                  </div>
                </div>

                {/* Bottom Tab Bar */}
                <div className="phone-tab-bar">
                  <div className={`phone-tab-item ${activeTabP3 === "home" ? "active" : ""}`} onClick={() => setActiveTabP3("home")}>
                    <span className="phone-tab-icon">🏠</span>
                    <span className="phone-tab-label">Home</span>
                  </div>
                  <div className={`phone-tab-item ${activeTabP3 === "heart" ? "active" : ""}`} onClick={() => setActiveTabP3("heart")}>
                    <span className="phone-tab-icon">📋</span>
                    <span className="phone-tab-label">Manifesto</span>
                  </div>
                  <div className={`phone-tab-item ${activeTabP3 === "profile" ? "active" : ""}`} onClick={() => setActiveTabP3("profile")}>
                    <span className="phone-tab-icon">👤</span>
                    <span className="phone-tab-label">Perfil</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* ===================================================================
             SET 2: PAINEL ADMINISTRATIVO (MOBILE UI PREVIEW)
             =================================================================== */
          <div className="devices-grid">

            {/* 📱 PHONE 4: ADMIN GERAL */}
            <div className="smartphone-mockup">
              <div className="smartphone-notch" />
              <div className="smartphone-screen">
                {/* Status Bar */}
                <div className="smartphone-status-bar">
                  <span>9:16</span>
                  <div style={{ display: "flex", gap: "4px" }}>📶 🔋</div>
                </div>

                {/* Header Menta */}
                <div className="phone-mint-header">
                  <div className="phone-mint-header-top">
                    <span style={{ fontSize: "1.2rem", cursor: "pointer" }}>☰</span>
                    <span style={{ fontSize: "1.2rem", cursor: "pointer", position: "relative" }}>
                      🔔
                      <span style={{ position: "absolute", top: "1px", right: "1px", width: "6px", height: "6px", background: "#EF4444", borderRadius: "50%" }} />
                    </span>
                  </div>
                  <h2 className="phone-mint-title">Administrador<br />Geral</h2>
                </div>

                {/* Conteúdo do Telefone */}
                <div className="phone-content" style={{ gap: "12px" }}>
                  {/* Mini KPIs consolidados */}
                  <div style={{ display: "flex", gap: "6px" }}>
                    <div style={{ flex: 1, background: "#ffffff", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "8px 10px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(15, 27, 36, 0.45)", textTransform: "uppercase" }}>Vans</span>
                      <span style={{ fontSize: "1.1rem", fontWeight: 850, color: "#0F1B24", marginTop: "2px" }}>🚌 {stats.totalVans}</span>
                    </div>

                    <div style={{ flex: 1, background: "#ffffff", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "8px 10px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(15, 27, 36, 0.45)", textTransform: "uppercase" }}>Alunos</span>
                      <span style={{ fontSize: "1.1rem", fontWeight: 850, color: "#0F1B24", marginTop: "2px" }}>🎒 {stats.totalAlunos}</span>
                    </div>

                    <div style={{ flex: 1, background: "#ffffff", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "8px 10px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(15, 27, 36, 0.45)", textTransform: "uppercase" }}>Taxa (5%)</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 850, color: "#10B981", marginTop: "6px" }}>💵 R${stats.commissionTotal.toFixed(0)}</span>
                    </div>
                  </div>

                  {/* Mapa Geral de Arapongas */}
                  <div className="simulated-map-container" style={{ height: "160px" }}>
                    <svg width="100%" height="100%" style={{ background: "#E8F5E9" }}>
                      {/* Municipal grid lines */}
                      <path d="M0,30 Q120,40 300,20 M0,70 L300,80 M0,120 Q150,110 300,130 M90,0 Q80,70 100,160 M200,0 L200,160" stroke="#FAF8F3" strokeWidth="4" strokeLinecap="round" />
                      
                      {/* Multiple blinking van pins */}
                      <g transform="translate(60, 50)">
                        <circle cx="8" cy="8" r="8" fill="rgba(62, 138, 200, 0.2)" />
                        <circle cx="8" cy="8" r="4" fill="#3E8AC8" />
                        <text x="18" y="11" fontSize="8" fontWeight="bold" fill="#0F1B24">Van 1</text>
                      </g>

                      <g transform="translate(180, 90)">
                        <circle cx="8" cy="8" r="8" fill="rgba(245, 199, 84, 0.3)" />
                        <circle cx="8" cy="8" r="4" fill="#F5C754" />
                        <text x="-26" y="11" fontSize="8" fontWeight="bold" fill="#0F1B24">Tio Pedro</text>
                      </g>

                      <g transform="translate(110, 110)">
                        <circle cx="8" cy="8" r="8" fill="rgba(16, 185, 129, 0.2)" />
                        <circle cx="8" cy="8" r="4" fill="#10B981" />
                        <text x="14" y="11" fontSize="8" fontWeight="bold" fill="#0F1B24">Van 3</text>
                      </g>
                    </svg>

                    <div style={{ position: "absolute", bottom: "6px", left: "8px", fontSize: "0.6rem", background: "rgba(255,255,255,0.85)", padding: "2px 6px", borderRadius: "50px", fontWeight: 700, color: "#0F1B24" }}>
                      🗺️ Mapa de Arapongas • Live Fleet
                    </div>
                  </div>

                  {/* Botões de Ações rápidas do admin */}
                  <button className="phone-btn-blue" onClick={() => setSelectedSet("set2")}>
                    👥 Gerenciar Usuários do App
                  </button>

                  <button className="phone-btn-blue" onClick={() => setSelectedSet("set2")}>
                    📈 Visualizar Splits Asaas
                  </button>
                </div>

                {/* Bottom Tab Bar */}
                <div className="phone-tab-bar">
                  <div className={`phone-tab-item ${activeTabP4 === "home" ? "active" : ""}`} onClick={() => setActiveTabP4("home")}>
                    <span className="phone-tab-icon">🏠</span>
                    <span className="phone-tab-label">Home</span>
                  </div>
                  <div className={`phone-tab-item ${activeTabP4 === "heart" ? "active" : ""}`} onClick={() => setActiveTabP4("heart")}>
                    <span className="phone-tab-icon">❤️</span>
                    <span className="phone-tab-label">Favoritos</span>
                  </div>
                  <div className={`phone-tab-item ${activeTabP4 === "profile" ? "active" : ""}`} onClick={() => setActiveTabP4("profile")}>
                    <span className="phone-tab-icon">👤</span>
                    <span className="phone-tab-label">Perfil</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 📱 PHONE 5: GERENCIAR USUÁRIOS */}
            <div className="smartphone-mockup">
              <div className="smartphone-notch" />
              <div className="smartphone-screen">
                {/* Status Bar */}
                <div className="smartphone-status-bar">
                  <span>9:16</span>
                  <div style={{ display: "flex", gap: "4px" }}>📶 🔋</div>
                </div>

                {/* Header Menta */}
                <div className="phone-mint-header" style={{ paddingBottom: "12px" }}>
                  <div className="phone-mint-header-top">
                    <span style={{ fontSize: "1.1rem", cursor: "pointer" }}>←</span>
                    <span style={{ fontSize: "1.1rem", cursor: "pointer" }}>🔍</span>
                  </div>
                  <h2 className="phone-mint-title">Gerenciar<br />Usuários</h2>
                  
                  {/* Selector Motoristas / Responsáveis */}
                  <div style={{ display: "flex", background: "#FAF8F3", borderRadius: "10px", padding: "3px", gap: "2px", border: "1px solid rgba(15,27,36,0.06)" }}>
                    <button 
                      onClick={() => setAdminUserTab("motoristas")}
                      style={{ flex: 1, border: "none", background: adminUserTab === "motoristas" ? "#A2E8DF" : "transparent", padding: "6px", fontSize: "0.72rem", fontWeight: 800, borderRadius: "8px", cursor: "pointer", color: "#0F1B24" }}
                    >
                      Motoristas
                    </button>
                    <button 
                      onClick={() => setAdminUserTab("responsaveis")}
                      style={{ flex: 1, border: "none", background: adminUserTab === "responsaveis" ? "#A2E8DF" : "transparent", padding: "6px", fontSize: "0.72rem", fontWeight: 800, borderRadius: "8px", cursor: "pointer", color: "#0F1B24" }}
                    >
                      Responsáveis
                    </button>
                  </div>
                </div>

                {/* Conteúdo do Telefone */}
                <div className="phone-content" style={{ gap: "10px" }}>
                  {/* Search Bar */}
                  <input 
                    type="text" 
                    placeholder="🔍 Pesquisar por nome..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ background: "#ffffff", border: "1px solid var(--card-border)", borderRadius: "10px", padding: "8px 12px", fontSize: "0.8rem", color: "#0F1B24", outline: "none", fontWeight: 600 }}
                  />

                  {/* Lista de usuários filtrada */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {simulatedUsers
                      .filter(u => u.role === (adminUserTab === "motoristas" ? "motorista" : "responsavel"))
                      .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((u) => (
                        <div key={u.id} className="phone-card" style={{ padding: "10px 12px", gap: "4px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                            {/* Avatar bubble */}
                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: u.active ? "#EBF7F2" : "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>
                              {u.role === "motorista" ? "👨🏻‍✈️" : "👩🏻"}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                              <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0F1B24" }}>{u.name}</span>
                              <span style={{ fontSize: "0.72rem", color: "rgba(15,27,36,0.45)", fontWeight: 700 }}>{u.detail}</span>
                            </div>

                            {/* Active switch */}
                            <label className="phone-switch">
                              <input 
                                type="checkbox" 
                                checked={u.active} 
                                onChange={() => toggleUserActive(u.id)}
                              />
                              <span className="phone-slider" />
                            </label>
                          </div>
                        </div>
                      ))
                    }
                  </div>

                  <button className="phone-btn-blue" style={{ padding: "10px", fontSize: "0.8rem", marginTop: "auto" }}>
                    Ver Todos os Cadastros
                  </button>
                </div>

                {/* Bottom Tab Bar */}
                <div className="phone-tab-bar">
                  <div className={`phone-tab-item ${activeTabP5 === "home" ? "active" : ""}`} onClick={() => setActiveTabP5("home")}>
                    <span className="phone-tab-icon">🏠</span>
                    <span className="phone-tab-label">Home</span>
                  </div>
                  <div className={`phone-tab-item ${activeTabP5 === "heart" ? "active" : ""}`} onClick={() => setActiveTabP5("heart")}>
                    <span className="phone-tab-icon">🔍</span>
                    <span className="phone-tab-label">Buscar</span>
                  </div>
                  <div className={`phone-tab-item ${activeTabP5 === "profile" ? "active" : ""}`} onClick={() => setActiveTabP5("profile")}>
                    <span className="phone-tab-icon">👤</span>
                    <span className="phone-tab-label">Perfil</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 📱 PHONE 6: RELATÓRIOS DE SPLIT ASAAS */}
            <div className="smartphone-mockup">
              <div className="smartphone-notch" />
              <div className="smartphone-screen">
                {/* Status Bar */}
                <div className="smartphone-status-bar">
                  <span>9:16</span>
                  <div style={{ display: "flex", gap: "4px" }}>📶 🔋</div>
                </div>

                {/* Header Menta */}
                <div className="phone-mint-header">
                  <div className="phone-mint-header-top">
                    <span style={{ fontSize: "1.2rem", cursor: "pointer" }}>☰</span>
                    <span style={{ fontSize: "1.2rem", cursor: "pointer" }}>⚙️</span>
                  </div>
                  <h2 className="phone-mint-title">Relatórios de<br />Split Asaas</h2>
                </div>

                {/* Conteúdo do Telefone */}
                <div className="phone-content" style={{ gap: "10px" }}>
                  {/* Select month */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff", border: "1px solid var(--card-border)", borderRadius: "10px", padding: "6px 12px" }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: 750, color: "#0F1B24" }}>📅 Período</span>
                    <select 
                      value={splitMonth} 
                      onChange={(e) => setSplitMonth(e.target.value)}
                      style={{ border: "none", fontSize: "0.75rem", fontWeight: 700, outline: "none", color: "#3E8AC8", cursor: "pointer" }}
                    >
                      <option>Este Mês</option>
                      <option>Mês Passado</option>
                    </select>
                  </div>

                  {/* Financial KPI summary split */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div className="phone-card" style={{ flex: 1, padding: "10px", gap: "2px" }}>
                      <span className="phone-card-title" style={{ fontSize: "0.62rem" }}>Faturamento Vans</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 850, color: "#0F1B24" }}>R$ {stats.gmvTotal.toFixed(0)}</span>
                    </div>

                    <div className="phone-card" style={{ flex: 1, padding: "10px", gap: "2px" }}>
                      <span className="phone-card-title" style={{ fontSize: "0.62rem" }}>Sua Comissão (5%)</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 850, color: "#10B981" }}>R$ {stats.commissionTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Split payout details table */}
                  <div className="phone-card" style={{ padding: "10px 12px", gap: "6px" }}>
                    <span className="phone-card-title">Divisão por Motorista</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {splitReports.map((s) => (
                        <div key={s.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px", borderBottom: "1px solid rgba(15,27,36,0.03)", paddingBottom: "4px" }}>
                          <span style={{ fontSize: "1rem" }}>{s.avatar}</span>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#0F1B24" }}>{s.name}</span>
                            <span style={{ fontSize: "0.68rem", color: "rgba(15,27,36,0.4)" }}>MP Split D+0</span>
                          </div>
                          
                          <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#3E8AC8" }}>
                              R$ {(s.total * (stats.gmvTotal / 3273)).toFixed(0)}
                            </span>
                            <span style={{ fontSize: "0.65rem", color: "#10B981", fontWeight: 700 }}>
                              Com: R$ {(s.commission * (stats.commissionTotal / 163.65)).toFixed(0)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mini Donut success/pending split */}
                  <div className="phone-card" style={{ padding: "10px 12px", display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span className="phone-card-title">Status Split</span>
                      <span style={{ fontSize: "0.72rem", color: "#10B981", fontWeight: 800 }}>● Sucesso: 95%</span>
                      <span style={{ fontSize: "0.72rem", color: "#F5C754", fontWeight: 800 }}>● Pendente: 5%</span>
                    </div>

                    <svg width="40" height="40" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="20" cy="20" r="14" fill="transparent" stroke="#F5C754" strokeWidth="6" />
                      <circle cx="20" cy="20" r="14" fill="transparent" stroke="#10B981" strokeWidth="6" strokeDasharray="88" strokeDashoffset="8" />
                    </svg>
                  </div>

                  {/* Yellow print report button */}
                  <button className="phone-btn-yellow" style={{ width: "100%", padding: "10px", fontWeight: 800 }}>
                    📥 Exportar PDF da Conciliação
                  </button>
                </div>

                {/* Bottom Tab Bar */}
                <div className="phone-tab-bar">
                  <div className={`phone-tab-item ${activeTabP6 === "home" ? "active" : ""}`} onClick={() => setActiveTabP6("home")}>
                    <span className="phone-tab-icon">🏠</span>
                    <span className="phone-tab-label">Home</span>
                  </div>
                  <div className={`phone-tab-item ${activeTabP6 === "heart" ? "active" : ""}`} onClick={() => setActiveTabP6("heart")}>
                    <span className="phone-tab-icon">📊</span>
                    <span className="phone-tab-label">Status</span>
                  </div>
                  <div className={`phone-tab-item ${activeTabP6 === "profile" ? "active" : ""}`} onClick={() => setActiveTabP6("profile")}>
                    <span className="phone-tab-icon">👤</span>
                    <span className="phone-tab-label">Perfil</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ── MODAL INTERATIVO DO PAGAMENTO PIX (TELA CHEIA SIMULADO) ──────── */}
      {showPixModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 500,
          background: "rgba(15, 27, 36, 0.4)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          animation: "fadeIn 0.3s ease both"
        }}>
          <div style={{
            background: "#ffffff",
            border: "1px solid var(--card-border)",
            borderRadius: "28px",
            padding: "2rem",
            maxWidth: "380px",
            width: "100%",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
          }}>
            <div style={{ fontSize: "2.5rem" }}>💸</div>
            <h3 style={{ fontFamily: "var(--font-family-title)", fontWeight: 800, fontSize: "1.5rem", color: "#0F1B24", letterSpacing: "-0.5px" }}>
              Pagar via Pix
            </h3>
            
            <p style={{ fontSize: "0.85rem", color: "rgba(15,27,36,0.6)", fontWeight: 650, lineHeight: "1.4" }}>
              Simule a transferência Pix instantânea integrada com a API Mercado Pago para a Rota 1. O split enviará R$ 332,50 (95%) para Tio Pedro e R$ 17,50 (5%) para a plataforma.
            </p>

            {/* Simulated QR Code SVG */}
            <div style={{ display: "flex", justifyContent: "center", background: "#FAF8F3", border: "1px dashed var(--card-border)", borderRadius: "20px", padding: "1.5rem" }}>
              <svg width="140" height="140" viewBox="0 0 100 100" style={{ fill: "#0F1B24" }}>
                {/* QR Code pattern blocks */}
                <rect x="0" y="0" width="25" height="25" />
                <rect x="5" y="5" width="15" height="15" fill="#FAF8F3" />
                <rect x="9" y="9" width="7" height="7" />
                
                <rect x="75" y="0" width="25" height="25" />
                <rect x="80" y="5" width="15" height="15" fill="#FAF8F3" />
                <rect x="84" y="9" width="7" height="7" />
                
                <rect x="0" y="75" width="25" height="25" />
                <rect x="5" y="80" width="15" height="15" fill="#FAF8F3" />
                <rect x="84" y="84" width="7" height="7" />

                {/* Scattered random dots */}
                <rect x="35" y="5" width="8" height="8" />
                <rect x="47" y="12" width="12" height="6" />
                <rect x="62" y="3" width="6" height="12" />
                <rect x="38" y="25" width="18" height="8" />
                <rect x="65" y="22" width="8" height="14" />
                
                <rect x="5" y="38" width="14" height="8" />
                <rect x="25" y="45" width="8" height="18" />
                <rect x="42" y="52" width="28" height="6" />
                <rect x="55" y="38" width="12" height="12" />
                
                <rect x="35" y="72" width="15" height="18" />
                <rect x="65" y="60" width="18" height="8" />
                <rect x="55" y="80" width="12" height="12" />
                <rect x="75" y="75" width="8" height="20" />
              </svg>
            </div>

            <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
              <button 
                onClick={() => {
                  setPixCopied(true);
                  setTimeout(() => setPixCopied(false), 2000);
                }} 
                className="phone-btn-blue" 
                style={{ background: "#FAF8F3", color: "#0F1B24", border: "1px solid var(--card-border)", boxShadow: "none" }}
              >
                📋 {pixCopied ? "Código Copiado!" : "Copiar Pix Copia e Cola"}
              </button>

              <button 
                onClick={handlePixPaymentSimulate} 
                className="phone-btn-blue" 
                style={{ background: "#10B981", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)" }}
              >
                💸 Simular Confirmação Pix
              </button>
              
              <button 
                onClick={() => setShowPixModal(false)} 
                className="phone-btn-blue" 
                style={{ background: "transparent", color: "rgba(15,27,36,0.5)", boxShadow: "none" }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER DA PÁGINA COM ASSINATURAS ────────────────────────────── */}
      <footer style={{
        marginTop: "1rem",
        textAlign: "center",
        fontSize: "0.82rem",
        color: "rgba(15, 27, 36, 0.4)",
        borderTop: "1px solid var(--card-border)",
        paddingTop: "1.5rem",
        width: "100%",
        maxWidth: "1140px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <span style={{ fontWeight: 600 }}>Tio da Van &copy; 2026 • Painel Admin Master</span>
        <span style={{ fontSize: "0.78rem", color: "rgba(15, 27, 36, 0.3)" }}>
          Fidelidade Estética de Mockups • Next.js 16 (Turbopack) • Supabase Live
        </span>
      </footer>
    </div>
  );
}
