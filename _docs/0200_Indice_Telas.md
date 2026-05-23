# Índice de Telas (UI) - Nova Fase: Ponto de Partida Limpo (Clean Slate)

Este documento centraliza o mapeamento de telas e rotas ativas do Módulo C (Painel Administrativo Master) e da interface da aplicação Next.js. A estrutura de rotas antiga foi totalmente limpa para permitir o desenvolvimento planejado e robusto de cada interface a partir de um baseline do zero.

---

## 1. Rotas Ativas Atualmente

| Rota | Tipo / Responsabilidade | Status | Descrição |
| --- | --- | --- | --- |
| `/` | Portal Unificado (Login / Root Page) | **Ativo** | Tela limpa e minimalista contendo um formulário para Supabase Auth. Executa o roteamento (RBAC) via proxy.ts após o login. Referência: `_docs/0201_Login.md` |
| `/dashboard/pai` | Painel do Responsável | **Ativo** | Casca Estrutural (Minimalista). Referência: `_docs/0204_Dashboard_Pai.md` |
| `/dashboard/motorista` | Painel do Motorista | **Ativo** | Casca Estrutural (Minimalista). Referência: `_docs/0205_Dashboard_Motorista.md` |
| `/dashboard/pai/buscar` | Busca de Vans | **Ativo** | Tela de pesquisa e vínculo de Aluno ao Motorista. Referência: `_docs/0204B_Buscar_Motorista.md` |
| `/admin` | Console de Administração | **Ativo** | Casca Estrutural (Minimalista). Referência: `_docs/0206_Dashboard_Admin.md` |
---

## 2. Próximas Telas a Serem Criadas (Mapeadas no Escopo)

| Rota Pretendida | Componentes do WowDash a Utilizar | Função |
| --- | --- | --- |
| **`/dashboard`** (Painel Master) | KPI Cards, ApexCharts de Faturamento, Gráficos Lineares | Visão unificada de ganhos totais da plataforma, comissões de 5% retidas e splits. |
| **`/motoristas`** (Gestão de Frota) | Bootstrap Tables, Document View Modals | Listagem de condutores de vans de Arapongas, aprovação cadastral e alertas de vencimento de CNH. |
| **`/cobrancas`** (Financeiro) | Invoice Lists, DataTables | Relatórios de boletos gerados e liquidações Pix processadas de forma automática pelo Asaas/Mercado Pago. |
