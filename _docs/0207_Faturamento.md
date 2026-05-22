# Tela de Faturamento & Payouts

## Rota
`/dashboard/faturamento`

## Propósito
Apresentar a performance comercial da plataforma, controle de repasses líquidos para os motoristas e retenção de taxas operacionais da plataforma.

## Métricas Apresentadas (Calculadas em tempo real)
1. **Volume Total Transacionado (GMV)**: Soma de todas as cobranças com status `pago`.
2. **Volume Pago aos Motoristas (95%)**: Repasse líquido correspondente aos parceiros.
3. **Receita Líquida Tio da Van (5%)**: Comissão de mediação retida para manutenção dos servidores e processamento financeiro.
4. **Volume de Inadimplência/Pendente**: Somatório de valores pendentes de pagamento ou em atraso.

## Componentes Utilizados
- Predefinidos no design system (`app/dashboard/dashboard.css`):
  - KPI Cards Grid de métricas comerciais.
  - Gráfico de barras mensal (CSS-only) alimentado dinamicamente com as receitas e comissões divididas.
  - Caixa explicativa do modelo comercial (Splits 95% / 5%).
  - Tabela detalhada de distribuição financeira por motorista.

## Conexão com o Banco de Dados
- Conectado em tempo real com o banco de dados Supabase via `createClient` de `@/utils/supabase/client`.
- Agrega as cobranças em tempo real e as vincula às contas Mercado Pago ativas dos motoristas.
