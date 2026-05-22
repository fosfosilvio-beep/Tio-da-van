"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function WelcomeLoginPage(): React.JSX.Element {
  const router = useRouter();
  const supabase = createClient();

  // Connection state
  const [dbStatus, setDbStatus] = useState<"live" | "offline">("offline");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Form inputs for real credentials login
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    // Check connection status
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from("perfis").select("id").limit(1);
        if (!error) {
          setDbStatus("live");
        } else {
          setDbStatus("offline");
        }
      } catch {
        setDbStatus("offline");
      }
    };
    checkConnection();
  }, []);

  // Handle simulation redirects (Quick access)
  const handleSimulationAccess = (role: "pai" | "motorista" | "admin") => {
    setLoading(true);
    setTimeout(() => {
      if (role === "pai") {
        router.push("/dashboard/pai");
      } else if (role === "motorista") {
        router.push("/dashboard/motorista");
      } else {
        router.push("/admin");
      }
    }, 600);
  };

  // Handle authenticating and dynamic redirect
  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(false);
    setErrorMessage("");
    
    // Simulate real flow with database lookups for defined mock accounts or live users
    try {
      setLoading(true);
      
      // Perform Supabase Auth attempt
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Safe fallback logic for simulation testing:
        // If users type 'jamile@example.com', 'pedro@example.com' or 'admin@example.com', allow bypass even without active internet connection.
        const mockEmails: Record<string, string> = {
          "jamile@example.com": "/dashboard/pai",
          "pedro@example.com": "/dashboard/motorista",
          "admin@example.com": "/admin",
        };

        if (mockEmails[email.toLowerCase()]) {
          setTimeout(() => {
            router.push(mockEmails[email.toLowerCase()]);
          }, 800);
          return;
        }

        throw new Error(authError.message);
      }

      if (authData?.user) {
        // Query perfis database table to get the matching dynamic routing destination
        const { data: profile, error: profileError } = await supabase
          .from("perfis")
          .select("rota_destino")
          .eq("id", authData.user.id)
          .single();

        if (profileError || !profile) {
          throw new Error("Perfil não encontrado no banco de dados.");
        }

        router.push(profile.rota_destino);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Erro na autenticação. Verifique suas credenciais.");
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#FAF8F3", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "16px" }}>
      <div style={{
        width: "100%",
        maxWidth: "420px",
        background: "#ffffff",
        border: "1px solid rgba(15, 27, 36, 0.08)",
        borderRadius: "28px",
        padding: "32px 24px",
        boxShadow: "0 10px 30px rgba(15, 27, 36, 0.04)",
        display: "flex",
        flexDirection: "column",
        gap: "24px"
      }}>
        {/* Logo and Greeting */}
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-flex", background: "#A2E8DF", width: "56px", height: "56px", borderRadius: "18px", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", marginBottom: "12px", boxShadow: "0 4px 10px rgba(162, 232, 223, 0.25)" }}>
            🚐
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0F1B24", margin: 0 }}>Tio da Van</h1>
          <p style={{ fontSize: "0.82rem", color: "rgba(15, 27, 36, 0.55)", margin: "4px 0 0 0", fontWeight: 650 }}>
            Transporte escolar seguro e inteligente em Arapongas-PR
          </p>
        </div>

        {/* Database Status Indicator */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          background: "#FAF8F3",
          padding: "8px 16px",
          borderRadius: "50px",
          border: "1px solid rgba(15, 27, 36, 0.04)"
        }}>
          <span style={{
            width: "8px",
            height: "8px",
            background: dbStatus === "live" ? "#10B981" : "#EF4444",
            borderRadius: "50%",
            boxShadow: dbStatus === "live" ? "0 0 8px #10B981" : "0 0 8px #EF4444"
          }} />
          <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#0F1B24" }}>
            Conexão Supabase: {dbStatus === "live" ? "ONLINE" : "SIMULADO"}
          </span>
        </div>

        {/* Real credentials Form */}
        <form onSubmit={handleCredentialsLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 855, color: "#0F1B24" }}>Login Corporativo</span>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <input
              type="email"
              placeholder="Email (Ex: jamile@example.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                background: "#FAF8F3",
                border: "1px solid rgba(15, 27, 36, 0.08)",
                borderRadius: "14px",
                padding: "12px 16px",
                fontSize: "0.85rem",
                outline: "none",
                color: "#0F1B24",
                fontWeight: 600
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <input
              type="password"
              placeholder="Senha de acesso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                background: "#FAF8F3",
                border: "1px solid rgba(15, 27, 36, 0.08)",
                borderRadius: "14px",
                padding: "12px 16px",
                fontSize: "0.85rem",
                outline: "none",
                color: "#0F1B24",
                fontWeight: 600
              }}
            />
          </div>

          {errorMessage && (
            <div style={{ fontSize: "0.72rem", color: "#EF4444", fontWeight: 700, textAlign: "center" }}>
              ⚠️ {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#3E8AC8",
              color: "#ffffff",
              border: "none",
              borderRadius: "14px",
              padding: "12px",
              fontSize: "0.85rem",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(62, 138, 200, 0.2)",
              transition: "opacity 0.2s"
            }}
          >
            {loading ? "Entrando..." : "Entrar no Aplicativo"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "4px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(15,27,36,0.06)" }} />
          <span style={{ fontSize: "0.7rem", color: "rgba(15,27,36,0.4)", fontWeight: 700 }}>OU ACESSO RÁPIDO</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(15,27,36,0.06)" }} />
        </div>

        {/* Quick simulation entry buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          
          <button
            onClick={() => handleSimulationAccess("pai")}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#ffffff",
              border: "1px solid rgba(15, 27, 36, 0.08)",
              borderRadius: "16px",
              padding: "12px 16px",
              cursor: "pointer",
              textAlign: "left",
              transition: "transform 0.15s, border-color 0.15s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#A2E8DF";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(15, 27, 36, 0.08)";
              e.currentTarget.style.transform = "none";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "1.4rem" }}>👩🏻</span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0F1B24" }}>Entrar como Mãe Jamile</span>
                <span style={{ fontSize: "0.7rem", color: "rgba(15, 27, 36, 0.45)", fontWeight: 650 }}>Painel de Responsável</span>
              </div>
            </div>
            <span style={{ fontSize: "0.9rem", color: "rgba(15,27,36,0.3)" }}>→</span>
          </button>

          <button
            onClick={() => handleSimulationAccess("motorista")}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#ffffff",
              border: "1px solid rgba(15, 27, 36, 0.08)",
              borderRadius: "16px",
              padding: "12px 16px",
              cursor: "pointer",
              textAlign: "left",
              transition: "transform 0.15s, border-color 0.15s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#F5C754";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(15, 27, 36, 0.08)";
              e.currentTarget.style.transform = "none";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "1.4rem" }}>👨🏻‍✈️</span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0F1B24" }}>Entrar como Tio Pedro</span>
                <span style={{ fontSize: "0.7rem", color: "rgba(15, 27, 36, 0.45)", fontWeight: 650 }}>Painel de Motorista</span>
              </div>
            </div>
            <span style={{ fontSize: "0.9rem", color: "rgba(15,27,36,0.3)" }}>→</span>
          </button>

          <button
            onClick={() => handleSimulationAccess("admin")}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#ffffff",
              border: "1px solid rgba(15, 27, 36, 0.08)",
              borderRadius: "16px",
              padding: "12px 16px",
              cursor: "pointer",
              textAlign: "left",
              transition: "transform 0.15s, border-color 0.15s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#3E8AC8";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(15, 27, 36, 0.08)";
              e.currentTarget.style.transform = "none";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "1.4rem" }}>🏢</span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0F1B24" }}>Entrar como Administrador</span>
                <span style={{ fontSize: "0.7rem", color: "rgba(15, 27, 36, 0.45)", fontWeight: 650 }}>Central de Controle Master</span>
              </div>
            </div>
            <span style={{ fontSize: "0.9rem", color: "rgba(15,27,36,0.3)" }}>→</span>
          </button>

        </div>

      </div>
    </div>
  );
}
