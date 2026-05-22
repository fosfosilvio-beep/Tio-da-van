# Auditoria do Template Gerencial (WowDash)

## Propósito
Este documento contém a auditoria e o mapeamento de recursos do template **WowDash NEXT JS**, fornecido para acelerar o desenvolvimento do **Painel Administrativo Master (Módulo C)** do projeto *Tio da Van*.

---

## 1. Visão Geral e Stack Técnica
O template encontra-se na pasta: `/wowdash-next-js-admin-dashboard-template-.../file`

**Tecnologias Base:**
- **Framework:** Next.js 15.0.4
- **Roteamento:** App Router (uso da pasta `src/app/`)
- **Linguagem:** JavaScript / JSX (Não utiliza TypeScript nativamente, exigirá tipagem gradual ou conversão de arquivos para `.tsx`).
- **Estilização e UI:** Bootstrap 5.3.3 e React Bootstrap (diferente de Tailwind, que costuma ser padrão Next, então a estilização do painel será via classes Bootstrap). Animações via `wowjs` e `animate.css`.

**Bibliotecas Adicionais Identificadas (`package.json`):**
- **Gráficos:** ApexCharts (`react-apexcharts`)
- **Tabelas:** DataTables (`datatables.net` com jQuery)
- **Ícones:** Phosphor Icons, Iconify (Solar)
- **Formulários e Calendários:** React Datepicker, Flatpickr, FullCalendar
- **Notificações:** React Toastify
- **Drag & Drop:** dnd-kit, react-beautiful-dnd

---

## 2. Estrutura de Diretórios
A arquitetura do template está isolada dentro de `src/`:

- `src/app/`: Contém **94 subdiretórios** (rotas), servindo como catálogo massivo de páginas e componentes prontas.
- `src/components/`: Componentes modulares reutilizáveis.
- `src/masterLayout/`: Contém os wrappers estruturais (Sidebar, Header, Footer) que dão a "casca" do painel.
- `src/helper/` e `src/hook/`: Funções auxiliares (como `PluginInit` para inicializar bibliotecas jQuery no client-side) e custom hooks.

---

## 3. Mapeamento de Recursos Úteis para o "Tio da Van"

Ao analisar as rotas do `src/app/`, selecionei os módulos que serão mais valiosos para o reaproveitamento no nosso projeto:

### 3.1. Dashboards (Visão Global)
O template oferece 11 layouts de dashboard (`index-2` a `index-11`).
* **Uso sugerido:** Extrair os "cards" de KPI e os gráficos de faturamento (ApexCharts) para compor a tela principal do Módulo C (Faturamento total, comissões de 5%, etc).

### 3.2. Gestão de Usuários e Motoristas
Rotas: `users-list`, `users-grid`, `add-user`, `view-profile`, `role-access`, `assign-role`
* **Uso sugerido:** Adaptar a tela `users-list` para listar os Motoristas com status (Pendente, Aprovado, Suspenso). Usar o `view-profile` para a tela de auditoria de documentos (CNH e Placa da Van).

### 3.3. Financeiro e Cobranças
Rotas: `invoice-list`, `invoice-preview`, `payment-gateway`, `wallet`, `pricing`
* **Uso sugerido:** A `invoice-list` serve perfeitamente para exibir as transações do Asaas/Mercado Pago, listando quem pagou e os repasses (split). 

### 3.4. Autenticação e Telas Limpas
Rotas: `sign-in`, `sign-up`, `forgot-password`, `access-denied`
* **Uso sugerido:** Podem ser integradas diretamente ao Supabase Auth para o login do Master Admin.

---

## 4. Recomendações de Implementação
Como o template é massivo (muitas dependências e 94 páginas), a melhor estratégia de implementação é o **"Cherry-Picking" (Extração Seletiva)**:

1. **Não iniciar o projeto inteiro dentro do template:** O código-fonte do template usa `.jsx` e jQuery em algumas partes.
2. **Copiar apenas o necessário:** Instalar o Bootstrap e ApexCharts no nosso projeto Next.js limpo.
3. Copiar o `masterLayout` e convertê-lo para TypeScript (`.tsx`).
4. Extrair apenas as tabelas e cartões de dashboard que vamos usar, isolando-os como Client Components (`"use client"`), respeitando nossa arquitetura de modularidade (Quarteirão 03XX).
