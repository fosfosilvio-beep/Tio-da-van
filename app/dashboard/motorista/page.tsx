import React from "react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "@/app/components/LogoutButton";

export default async function DashboardMotoristaPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/");
  }

  const { data: perfil } = await supabase
    .from("perfis")
    .select("nome_completo")
    .eq("id", user.id)
    .single();

  const nome = perfil?.nome_completo || "Motorista";

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Painel do Tio da Van</h1>
          <LogoutButton />
        </div>
      </header>
      
      <main style={styles.main}>
        <div style={styles.card}>
          <h2 style={styles.greeting}>Bem-vindo, Tio(a) {nome}</h2>
          <p style={styles.description}>
            Sua lista de passageiros e status de embarque aparecerão aqui em breve.
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
    backgroundColor: "#F0FDF4", // Light green tint for Driver
    fontFamily: "var(--font-outfit), var(--font-inter), sans-serif",
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderBottom: "1px solid #D1FAE5",
    padding: "16px 24px",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#065F46", // Dark green
    margin: 0,
  },
  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 24px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  },
  greeting: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#064E3B",
    margin: "0 0 12px 0",
  },
  description: {
    fontSize: "1rem",
    color: "#4B5563",
    margin: 0,
    lineHeight: 1.5,
  }
};
