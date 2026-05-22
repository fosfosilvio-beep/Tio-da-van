# Tela de Gestão de Cobranças

## Rota
`/dashboard/cobrancas`

## Propósito
Exibir e controlar todas as mensalidades preventivas e vencidas geradas no sistema, com suporte a filtros dinâmicos por aluno/motorista/status e ações interativas de simulação para validação de fluxos.

## Componentes Utilizados
- Predefinidos no design system (`app/dashboard/dashboard.css`):
  - KPI Cards Grid para resumos consolidados.
  - Tabela responsiva com formatação HSL.
  - Badges coloridos dinâmicos por status de cobrança (`pendente`, `pago`, `vencido`).

## Fluxos de Simulação Disponíveis
1. **⚡ Simular Cron Preventivo**:
   - Dispara uma requisição `POST` para a API `/api/cobrancas/cron`.
   - Consulta alunos ativos, calcula splits, gera novas faturas no banco com status `pendente` e `vencimento` para D+3, registrando os splits (95% para motorista e 5% para comissão).
2. **💸 Pagar Pix (Simular Webhook)**:
   - Dispara uma requisição `POST` para a API `/api/webhooks/mercadopago`.
   - Simula a notificação instantânea do Mercado Pago para o pagamento correspondente, liquidando a cobrança (status para `pago`, `pago_em` com data atual) e confirmando o split de valores em tempo real.

## Conexão com o Banco de Dados
- Realizado no lado do cliente utilizando o helper `createClient` de `@/utils/supabase/client`.
- Integração em tempo real com a tabela `cobrancas` com JOINS das tabelas `alunos` e `motoristas`.

## Tipagem Utilizada
- `Cobranca` (derivado de `Database["public"]["Tables"]["cobrancas"]["Row"]`).
- `CobrancaComRelacoes` (tipo local contendo dados adicionais de aluno, escola, pai e motorista).
