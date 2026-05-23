"use client";

import React, { useTransition } from "react";
import { logOut } from "@/app/login/actions";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logOut();
    });
  };

  return (
    <button 
      onClick={handleLogout} 
      disabled={isPending}
      style={styles.button}
    >
      {isPending ? "Saindo..." : "Sair"}
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  button: {
    padding: "8px 16px",
    backgroundColor: "#EF4444", // Red for destructive action
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  }
};
