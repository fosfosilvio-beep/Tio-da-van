# Gestão de Motoristas

## Rota
`/dashboard/motoristas`

## Propósito
Tela de gestão de motoristas com visão resumida de status (aprovados, pendentes, suspensos) e tabela detalhada com informações do veículo, CNH, bairros atendidos e ações de aprovação.

## Componentes Utilizados
| Componente | Caminho | Responsabilidade |
|---|---|---|
| `KpiCard` | `components/dashboard/KpiCard.tsx` | Cards de resumo por status (inline) |
| `MotoristasTable` | `components/dashboard/MotoristasTable.tsx` | Tabela completa com avatar, placa, CNH, tags |

## Mocks
- `lib/mocks/dashboard.ts` → `mockMotoristas: MotoristaComUsuario[]`

## Hooks
- Nenhum (Server Component). Na Fase 3, será conectado via Server Actions ao Supabase.

## Tipagem
- `MotoristaComUsuario` (extends `Motorista` com `usuario: Pick<Usuario>`)
- `MotoristaStatus` (enum: pendente | aprovado | suspenso)

## Features
- Alerta visual de CNH vencendo (< 60 dias)
- Tag pills para bairros atendidos (máx. 3 + contador)
- Status badge colorido por estado
