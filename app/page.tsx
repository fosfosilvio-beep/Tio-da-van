import React from "react";
import LoginForm from "@/app/components/LoginForm";

export default function UnifiedLoginPage() {
  return (
    <div style={styles.container}>
      {/* Background Decorative Elements */}
      <div style={styles.bgCircle1} />
      <div style={styles.bgCircle2} />

      <main style={styles.card}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>🚐</div>
          <h1 style={styles.title}>Tio da Van</h1>
          <p style={styles.subtitle}>Gestão Inteligente de Transporte Escolar</p>
        </div>

        <div style={styles.formContainer}>
          <LoginForm />
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Ainda não tem conta?{" "}
            <a href="#" style={styles.link}>
              Fale com a administração
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

// Minimalist Design System - Inline Styles based on the user specifications
const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF8F3", // Warm sand/beige
    position: "relative",
    overflow: "hidden",
    fontFamily: "var(--font-outfit), var(--font-inter), sans-serif",
  },
  bgCircle1: {
    position: "absolute",
    top: "-10%",
    right: "-5%",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(62, 138, 200, 0.1), rgba(62, 138, 200, 0))",
    filter: "blur(60px)",
    zIndex: 0,
  },
  bgCircle2: {
    position: "absolute",
    bottom: "-15%",
    left: "-10%",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(245, 199, 84, 0.15), rgba(245, 199, 84, 0))", // Subtle yellow accents
    filter: "blur(80px)",
    zIndex: 0,
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    borderRadius: "28px",
    padding: "48px 40px",
    boxShadow: "0 25px 50px rgba(15, 27, 36, 0.04), 0 1px 3px rgba(15, 27, 36, 0.02)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 1,
    margin: "24px",
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "32px",
    textAlign: "center",
  },
  logoIcon: {
    fontSize: "3rem",
    marginBottom: "12px",
    backgroundColor: "#E0F2FE", // Light blue backdrop for the icon
    width: "80px",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "24px",
    boxShadow: "0 8px 16px rgba(62, 138, 200, 0.15)",
  },
  title: {
    fontSize: "1.85rem",
    fontWeight: 800,
    color: "#0F1B24",
    margin: "0 0 8px 0",
    letterSpacing: "-0.03em",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#4B5563",
    margin: 0,
    fontWeight: 500,
  },
  formContainer: {
    width: "100%",
  },
  footer: {
    marginTop: "32px",
    paddingTop: "24px",
    borderTop: "1px solid rgba(15, 27, 36, 0.06)",
    width: "100%",
    textAlign: "center",
  },
  footerText: {
    fontSize: "0.85rem",
    color: "#6B7280",
    margin: 0,
    fontWeight: 500,
  },
  link: {
    color: "#3E8AC8",
    textDecoration: "none",
    fontWeight: 700,
  },
};
