# 🚐 Tio da Van 2.0 Elite — Plano Arquitetural

> **Versão:** 2.0 Final | **Data:** 2026-05-24
> **Documento de referência:** Este é o plano mestre do projeto.

## Decisões de Arquitetura

| Decisão | Escolha |
|---------|---------|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript (strict) |
| Estilização | Tailwind CSS v4 + CSS custom (Dark Premium Glassmorfismo) |
| Backend | Supabase (PostgreSQL 17 + Auth + Storage + Realtime) |
| Projeto Supabase | `xexxnfhukprktdzkhnhi` (Org: Tio da van) |
| WhatsApp | Evolution API (self-hosted) |
| Mapas | Google Maps API |
| Pagamentos | Asaas API (última fase) |
| Deploy | Vercel |
| Template Base | WowDash (componentes adaptados para TSX + Tailwind) |

## Tabelas do Banco (10)

1. `perfis` — Usuários (motorista/responsável/admin)
2. `motoristas_perfil` — Dados específicos do motorista
3. `rotas` — Rotas nomeadas com turno
4. `pontos_embarque` — Pontos GPS vinculados a rotas
5. `alunos` — Alunos com check-in/status
6. `cobrancas` — Cobranças (Asaas integrado)
7. `despesas` — Despesas do motorista
8. `ocorrencias` — Registro de ocorrências
9. `contratos` — Contratos em PDF
10. `notificacoes` — Sistema de notificações

## Fases de Implementação

- **Fase 1:** Infraestrutura (SQL + Auth + Tipos)
- **Fase 2:** Motor de Gestão (Server Actions + Integrações)
- **Fase 3:** Interface Dark Premium (Telas + Asaas)

> Consulte o plano completo em: `implementation_plan.md` no artifact directory.
