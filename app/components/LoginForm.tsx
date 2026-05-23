"use client";

import React, { useState, useTransition } from "react";
import { logIn } from "@/app/login/actions";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const response = await logIn(formData);
      if (response?.error) {
        setError(response.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {error && (
        <div style={styles.errorAlert}>
          <span style={styles.errorIcon}>⚠</span>
          <p style={styles.errorText}>{error}</p>
        </div>
      )}

      <div style={styles.inputGroup}>
        <label htmlFor="email" style={styles.label}>
          Endereço de E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="exemplo@email.com"
          style={styles.input}
          disabled={isPending}
        />
      </div>

      <div style={styles.inputGroup}>
        <div style={styles.labelRow}>
          <label htmlFor="password" style={styles.label}>
            Senha
          </label>
          <a href="#" style={styles.forgotPassword}>
            Esqueceu a senha?
          </a>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          style={styles.input}
          disabled={isPending}
        />
      </div>

      <button type="submit" style={styles.button} disabled={isPending}>
        {isPending ? (
          <div style={styles.spinnerContainer}>
            <span style={styles.spinner}></span>
            Autenticando...
          </div>
        ) : (
          "Entrar no Sistema"
        )}
      </button>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
  },
  errorAlert: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    backgroundColor: "#FEF2F2",
    border: "1px solid #FCA5A5",
    borderRadius: "12px",
  },
  errorIcon: {
    color: "#EF4444",
    fontSize: "1.1rem",
  },
  errorText: {
    color: "#B91C1C",
    fontSize: "0.85rem",
    fontWeight: 500,
    margin: 0,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#374151",
  },
  forgotPassword: {
    fontSize: "0.75rem",
    color: "#3E8AC8",
    textDecoration: "none",
    fontWeight: 600,
  },
  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    backgroundColor: "#F9FAFB",
    fontSize: "0.95rem",
    color: "#111827",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },
  button: {
    marginTop: "8px",
    padding: "16px",
    backgroundColor: "#3E8AC8", // Pastel blue requested by user
    color: "#FFFFFF",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "background-color 0.2s ease, transform 0.1s ease",
    boxShadow: "0 4px 12px rgba(62, 138, 200, 0.2)",
  },
  spinnerContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  spinner: {
    width: "18px",
    height: "18px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};
