import React from "react";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";
import { MotoristasTable } from "@/components/dashboard";
import type { MotoristaComUsuario } from "@/lib/types";

// Inicializa cliente direto para Server Component
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default async function MotoristasPage(): Promise<React.JSX.Element> {
  // 1. Buscar todos os motoristas com dados dos usuários vinculados
  const { data: motoristasDb } = await supabase
    .from("motoristas")
    .select(`
      *,
      usuarios:usuario_id (
        nome_completo,
        email,
        telefone,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false });

  const motoristas: MotoristaComUsuario[] = (motoristasDb || []).map((m: any) => ({
    ...m,
    usuario: m.usuarios,
  }));

  // Contadores dinâmicos
  const totalMotoristas: number = motoristas.length;
  const aprovados: number = motoristas.filter((m) => m.status === "aprovado").length;
  const pendentes: number = motoristas.filter((m) => m.status === "pendente").length;
  const suspensos: number = motoristas.filter((m) => m.status === "suspenso").length;

  return (
    <>
      {/* ── Title ──────────────────────────────────────────── */}
      <div className="page-title-row">
        <div>
          <h1 className="page-title">Gestão de Motoristas</h1>
          <p className="page-subtitle">
            {totalMotoristas} motoristas cadastrados — {aprovados} aprovados, {pendentes} pendentes, {suspensos} suspensos (Conectado ao Supabase)
          </p>
        </div>
      </div>

      {/* ── KPI resumo rápido ──────────────────────────────── */}
      <div className="kpi-grid" id="motoristas-kpi-grid" style={{ marginBottom: 28 }}>
        <div className="kpi-card" data-cor="success">
          <div className="kpi-top-row">
            <div className="kpi-icon">✅</div>
          </div>
          <span className="kpi-label">Aprovados</span>
          <span className="kpi-valor">{aprovados}</span>
        </div>
        <div className="kpi-card" data-cor="warning">
          <div className="kpi-top-row">
            <div className="kpi-icon">⏳</div>
          </div>
          <span className="kpi-label">Pendentes</span>
          <span className="kpi-valor">{pendentes}</span>
        </div>
        <div className="kpi-card" data-cor="danger">
          <div className="kpi-top-row">
            <div className="kpi-icon">🚫</div>
          </div>
          <span className="kpi-label">Suspensos</span>
          <span className="kpi-valor">{suspensos}</span>
        </div>
      </div>

      {/* ── Tabela ─────────────────────────────────────────── */}
      <MotoristasTable motoristas={motoristas} />
    </>
  );
}
