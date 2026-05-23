import React from "react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "@/app/components/LogoutButton";

export default async function AdminConsolePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/");
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Console de Administração Geral (Arapongas)</h1>
          <LogoutButton />
        </div>
      </header>
      
      <main style={styles.main}>
        <div style={styles.card}>
          <h2 style={styles.greeting}>Visão Estratégica</h2>
          <p style={styles.description}>
            Os módulos de Faturamento e Gestão de Motoristas serão implementados neste console nas próximas etapas.
          </p>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#F8FAFC", // Light slate for Admin
    fontFamily: "var(--font-outfit), var(--font-inter), sans-serif",
  },
  header: {
    backgroundColor: "#0F1B24", // Dark premium header
    padding: "16px 24px",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  headerContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#FFFFFF",
    margin: 0,
  },
  main: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "32px 24px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
    border: "1px solid #E2E8F0"
  },
  greeting: {
    fontSize: "1.5rem",
    fontWeight: 800,
    color: "#0F1B24",
    margin: "0 0 12px 0",
  },
  description: {
    fontSize: "1rem",
    color: "#475569",
    margin: 0,
    lineHeight: 1.5,
  }
};
