/**
 * Mock data rigorosamente tipado para o Dashboard Master.
 * Será substituído por queries reais ao Supabase na Fase 3.
 */
import type {
  DashboardKPI,
  ChartDataPoint,
  MotoristaComUsuario,
  Cobranca,
  DashboardStats,
} from "@/lib/types";

// ── KPIs do Dashboard ────────────────────────────────────────────────
export const mockKPIs: DashboardKPI[] = [
  {
    label: "Receita Total",
    valor: "R$ 47.850,00",
    variacao: 12.5,
    icone: "💰",
    cor: "primary",
  },
  {
    label: "Motoristas Ativos",
    valor: "34",
    variacao: 8.3,
    icone: "🚐",
    cor: "success",
  },
  {
    label: "Alunos Cadastrados",
    valor: "412",
    variacao: 15.2,
    icone: "🎒",
    cor: "info",
  },
  {
    label: "Cobranças Vencidas",
    valor: "7",
    variacao: -23.1,
    icone: "⚠️",
    cor: "danger",
  },
];

// ── Receita Mensal (últimos 6 meses) ─────────────────────────────────
export const mockReceitaMensal: ChartDataPoint[] = [
  { mes: "Dez/25", receita: 38200, comissao: 1910 },
  { mes: "Jan/26", receita: 41500, comissao: 2075 },
  { mes: "Fev/26", receita: 39800, comissao: 1990 },
  { mes: "Mar/26", receita: 44300, comissao: 2215 },
  { mes: "Abr/26", receita: 46100, comissao: 2305 },
  { mes: "Mai/26", receita: 47850, comissao: 2392.5 },
];

// ── Motoristas mock (com JOIN do usuário) ────────────────────────────
export const mockMotoristas: MotoristaComUsuario[] = [
  {
    id: "m-001",
    usuario_id: "u-001",
    placa: "BRA2E19",
    modelo_van: "Fiat Ducato 2023",
    capacidade: 16,
    cnh_numero: "04587612340",
    cnh_categoria: "D",
    cnh_validade: "2027-08-15",
    bairros_atendidos: ["Centro", "Jardim América", "Vila Nova"],
    escolas_atendidas: ["Colégio São José", "Escola Municipal Monteiro Lobato"],
    mercadopago_account_id: null,
    status: "aprovado",
    created_at: "2026-01-15T10:30:00Z",
    updated_at: "2026-05-20T14:00:00Z",
    usuario: {
      nome_completo: "Carlos Eduardo Silva",
      email: "carlos.motorista@email.com",
      telefone: "(11) 98765-4321",
      avatar_url: "https://ui-avatars.com/api/?name=Carlos+Silva&background=6C5CE7&color=fff",
    },
  },
  {
    id: "m-002",
    usuario_id: "u-002",
    placa: "MER4K52",
    modelo_van: "Mercedes Sprinter 2024",
    capacidade: 20,
    cnh_numero: "07894561230",
    cnh_categoria: "D",
    cnh_validade: "2028-03-10",
    bairros_atendidos: ["Bela Vista", "Moema", "Itaim Bibi"],
    escolas_atendidas: ["Colégio Bandeirantes", "Anglo São Paulo"],
    mercadopago_account_id: "mp_acc_002",
    status: "aprovado",
    created_at: "2026-02-01T08:00:00Z",
    updated_at: "2026-05-18T09:30:00Z",
    usuario: {
      nome_completo: "Ana Paula Ferreira",
      email: "ana.ferreira@email.com",
      telefone: "(11) 97654-3210",
      avatar_url: "https://ui-avatars.com/api/?name=Ana+Ferreira&background=00CEC9&color=fff",
    },
  },
  {
    id: "m-003",
    usuario_id: "u-003",
    placa: "RIO5B88",
    modelo_van: "Renault Master 2022",
    capacidade: 14,
    cnh_numero: "03216549870",
    cnh_categoria: "D",
    cnh_validade: "2026-11-25",
    bairros_atendidos: ["Pinheiros", "Butantã"],
    escolas_atendidas: ["Escola Estadual Prof. João"],
    mercadopago_account_id: null,
    status: "pendente",
    created_at: "2026-05-10T12:00:00Z",
    updated_at: "2026-05-10T12:00:00Z",
    usuario: {
      nome_completo: "Roberto Almeida Santos",
      email: "roberto.santos@email.com",
      telefone: "(11) 91234-5678",
      avatar_url: "https://ui-avatars.com/api/?name=Roberto+Santos&background=FDCB6E&color=333",
    },
  },
  {
    id: "m-004",
    usuario_id: "u-004",
    placa: "SAO1A23",
    modelo_van: "Iveco Daily 2023",
    capacidade: 18,
    cnh_numero: "06543219870",
    cnh_categoria: "D",
    cnh_validade: "2026-06-01",
    bairros_atendidos: ["Santana", "Tucuruvi", "Mandaqui"],
    escolas_atendidas: ["Colégio Objetivo Santana"],
    mercadopago_account_id: "mp_acc_004",
    status: "suspenso",
    created_at: "2025-11-20T16:00:00Z",
    updated_at: "2026-04-30T11:00:00Z",
    usuario: {
      nome_completo: "Marcos Vinícius Oliveira",
      email: "marcos.oliveira@email.com",
      telefone: "(11) 95555-1234",
      avatar_url: "https://ui-avatars.com/api/?name=Marcos+Oliveira&background=E17055&color=fff",
    },
  },
];

// ── Cobranças recentes mock ──────────────────────────────────────────
export const mockCobrancas: Partial<Cobranca>[] = [
  {
    id: "cob-001",
    motorista_id: "m-001",
    pai_id: "u-010",
    aluno_id: "a-001",
    valor_total: 450.0,
    valor_plataforma: 22.5,
    valor_motorista: 427.5,
    status: "pago",
    vencimento: "2026-05-10",
    pago_em: "2026-05-09T14:30:00Z",
    referencia_mes: "2026-05",
  },
  {
    id: "cob-002",
    motorista_id: "m-002",
    pai_id: "u-011",
    aluno_id: "a-002",
    valor_total: 520.0,
    valor_plataforma: 26.0,
    valor_motorista: 494.0,
    status: "pendente",
    vencimento: "2026-05-25",
    referencia_mes: "2026-05",
  },
  {
    id: "cob-003",
    motorista_id: "m-001",
    pai_id: "u-012",
    aluno_id: "a-003",
    valor_total: 380.0,
    valor_plataforma: 19.0,
    valor_motorista: 361.0,
    status: "vencido",
    vencimento: "2026-05-05",
    referencia_mes: "2026-05",
  },
  {
    id: "cob-004",
    motorista_id: "m-002",
    pai_id: "u-013",
    aluno_id: "a-004",
    valor_total: 490.0,
    valor_plataforma: 24.5,
    valor_motorista: 465.5,
    status: "pago",
    vencimento: "2026-05-10",
    pago_em: "2026-05-08T10:15:00Z",
    referencia_mes: "2026-05",
  },
];

// ── Dashboard Stats agregado ─────────────────────────────────────────
export const mockDashboardStats: DashboardStats = {
  kpis: mockKPIs,
  receitaMensal: mockReceitaMensal,
  motoristasPorStatus: {
    pendente: 5,
    aprovado: 34,
    suspenso: 2,
  },
  cobrancasPorStatus: {
    pendente: 18,
    pago: 389,
    vencido: 7,
    cancelado: 3,
  },
};
