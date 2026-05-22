/**
 * Tipos de domínio derivados do banco de dados.
 * Camada de abstração que simplifica o uso dos tipos gerados pelo Supabase.
 */
import type { Tables, TablesInsert, TablesUpdate, Enums } from "@/lib/supabase/database.types";

// ── Row types (leitura) ──────────────────────────────────────────────
export type Usuario = Tables<"usuarios">;
export type Motorista = Tables<"motoristas">;
export type Aluno = Tables<"alunos">;
export type Cobranca = Tables<"cobrancas">;
export type PosicaoMotorista = Tables<"posicao_motorista">;

// ── Insert types ─────────────────────────────────────────────────────
export type UsuarioInsert = TablesInsert<"usuarios">;
export type MotoristaInsert = TablesInsert<"motoristas">;
export type AlunoInsert = TablesInsert<"alunos">;
export type CobrancaInsert = TablesInsert<"cobrancas">;
export type PosicaoMotoristaInsert = TablesInsert<"posicao_motorista">;

// ── Update types ─────────────────────────────────────────────────────
export type UsuarioUpdate = TablesUpdate<"usuarios">;
export type MotoristaUpdate = TablesUpdate<"motoristas">;
export type AlunoUpdate = TablesUpdate<"alunos">;
export type CobrancaUpdate = TablesUpdate<"cobrancas">;
export type PosicaoMotoristaUpdate = TablesUpdate<"posicao_motorista">;

// ── Enums ────────────────────────────────────────────────────────────
export type UserRole = Enums<"user_role">;
export type MotoristaStatus = Enums<"motorista_status">;
export type TurnoAluno = Enums<"turno_aluno">;
export type VinculoStatus = Enums<"vinculo_status">;
export type CobrancaStatus = Enums<"cobranca_status">;

// ── Motorista com dados do usuário (JOIN) ────────────────────────────
export interface MotoristaComUsuario extends Motorista {
  usuario: Pick<Usuario, "nome_completo" | "email" | "telefone" | "avatar_url">;
}

// ── Dashboard KPI types ──────────────────────────────────────────────
export interface DashboardKPI {
  label: string;
  valor: string;
  variacao: number; // percentual positivo ou negativo
  icone: string;    // emoji ou nome do ícone
  cor: "primary" | "success" | "danger" | "warning" | "info";
}

export interface ChartDataPoint {
  mes: string;
  receita: number;
  comissao: number;
}

export interface DashboardStats {
  kpis: DashboardKPI[];
  receitaMensal: ChartDataPoint[];
  motoristasPorStatus: Record<MotoristaStatus, number>;
  cobrancasPorStatus: Record<CobrancaStatus, number>;
}

// ── Sidebar navigation types ─────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  children?: NavItem[];
}

export interface SidebarSection {
  title: string;
  items: NavItem[];
}
