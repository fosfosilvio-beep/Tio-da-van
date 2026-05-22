# Painel Administrativo — Dashboard

## Rota
`/dashboard`

## Propósito
Tela principal do **Módulo C (Painel Master)** — exibe KPIs globais, gráficos de faturamento mensal, distribuição de motoristas por status e tabela de motoristas recentes.

## Componentes Utilizados
| Componente | Caminho | Responsabilidade |
|---|---|---|
| `Sidebar` | `components/dashboard/Sidebar.tsx` | Navegação lateral com seções e active-state |
| `Header` | `components/dashboard/Header.tsx` | Barra superior com breadcrumb e botões de ação |
| `KpiCard` | `components/dashboard/KpiCard.tsx` | Card de KPI com ícone, variação e cor dinâmica |
| `RevenueChart` | `components/dashboard/RevenueChart.tsx` | Gráfico de barras CSS-only de receita mensal |
| `DriverStatusDonut` | `components/dashboard/DriverStatusDonut.tsx` | Donut chart CSS-only com conic-gradient dinâmico |
| `MotoristasTable` | `components/dashboard/MotoristasTable.tsx` | Tabela com avatar, status badge, tag pills |

## Mocks Atrelados
- `lib/mocks/dashboard.ts` → `mockKPIs`, `mockReceitaMensal`, `mockMotoristas`, `mockDashboardStats`

## Hooks
- Nenhum no momento (Server Component puro com mocks). Na Fase 3, conectará via Server Actions ao Supabase.

## Tipagem
- `lib/types/index.ts` → `DashboardKPI`, `ChartDataPoint`, `MotoristaComUsuario`, `DashboardStats`
- `lib/supabase/database.types.ts` → Tipos gerados automaticamente pelo Supabase MCP

## Layout
- `app/dashboard/layout.tsx` → Grid CSS: sidebar (260px) + header (64px) + main (restante)
- `app/dashboard/dashboard.css` → Design system completo com dark theme premium e glassmorphism

## Sub-rotas
- `/dashboard/motoristas` → Gestão de motoristas com KPIs de status e tabela completa
