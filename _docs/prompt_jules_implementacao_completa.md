# 🚐 PROMPT MESTRE — Agente Autônomo Jules
## Implementação Completa: Tio da Van 2.0 Elite

---

## [CONTEXTO DO PROJETO E PAPEL]

Você atua como um **Engenheiro de Software Sênior e Agente Autônomo**. O projeto é o **Tio da Van 2.0 Elite** — uma plataforma SaaS de gestão de transporte escolar que conecta motoristas de van escolar a famílias, com dashboard operacional, cobranças integradas, rastreamento e comunicação via WhatsApp.

O repositório está na branch `PARA-JULES` em `https://github.com/fosfosilvio-beep/Tio-da-van.git`. A aplicação Next.js vive em `/tio-da-van-app`.

Seu objetivo é **analisar o repositório atual, refatorar o que for necessário (respeitando o que já funciona) e implementar TODAS as telas/rotas pendentes de ponta a ponta**, sem necessidade de intervenção intermediária. Ao final, gere um **Pull Request detalhado** com as modificações.

---

## [OBJETIVO PRINCIPAL]

Implementar **todas as telas internas da aplicação** (dashboard do motorista, painel do responsável, painel admin) com UI premium, dados mockados e tipagem estrita. Especificamente:

1. **Refatorar o Layout do Motorista** — Sidebar + Header funcional com o design "Elite Logistics System" (Deep Blue + Amber, fundo claro).
2. **Implementar as 8 telas do motorista** — Dashboard, Chamada, Alunos, Rotas, Financeiro, Ocorrências, Contratos, Aniversariantes.
3. **Implementar o Onboarding KYC** — 3 etapas (Dados Pessoais, Documentos, Pagamento).
4. **Implementar o Cadastro de Van/Frota** — Formulário com 4 abas.
5. **Implementar as 3 telas do responsável** — Meu Painel, Meus Filhos, Mensalidades.
6. **Implementar as 3 telas do admin** — Dashboard Admin, Usuários, Auditoria/Financeiro.
7. **Revisar e corrigir componentes de layout** — Sidebar e Header do motorista e admin.

---

## [STACK TECNOLÓGICA E FERRAMENTAS]

| Tecnologia | Versão/Detalhe |
|------------|----------------|
| **Framework** | Next.js 16.2.6 (App Router, Turbopack) |
| **Linguagem** | TypeScript strict |
| **Estilização** | **Inline styles** para páginas públicas (Landing Page, `/vans`) / **CSS custom + variáveis CSS** para páginas internas (dashboard). O `globals.css` usa `@import "tailwindcss"` + `@theme` para tokens Tailwind v4 + `:root` para variáveis legado. |
| **Backend/BaaS** | Supabase (PostgreSQL 17, Auth, Storage, Realtime). Projeto ID: `xexxnfhukprktdzkhnhi` |
| **Ícones** | `@phosphor-icons/react` + Material Symbols Outlined (via CDN no layout) |
| **Gráficos** | `recharts` (já instalado) |
| **QR Code** | `html5-qrcode` (scanner) + `qrcode.react` (gerador) — já instalados |
| **PDF** | `@react-pdf/renderer` — já instalado |
| **Mapas** | `@react-google-maps/api` — já instalado |

> [!CAUTION]
> **NÃO instale novas dependências** sem necessidade extrema. Todas as libs acima já estão no `package.json`.

---

## [ARQUITETURA E PADRÕES DE CÓDIGO]

### Regras de Governança (OBRIGATÓRIAS)

1. **Protocolo de Reconhecimento:** Antes de alterar qualquer arquivo, leia o `indice.txt` na raiz e os docs relevantes em `_docs/`.
2. **Raiz Limpa:** A raiz NÃO recebe arquivos novos. Toda documentação vive em `_docs/`.
3. **Bloquinho Doc Obrigatório:** Se criar ou alterar uma tela/rota/tabela, crie ou atualize o respectivo `.md` em `_docs/`.
4. **Tolerância Zero a @ts-ignore:** Use mocks tipados em `lib/mocks/` se o backend não estiver pronto.
5. **Log Diário:** Registre passos importantes em `logs/execucao_AAAA-MM-DD.log`.
6. **Preservação de Infraestrutura:** NUNCA sobrescreva `.env.local`, `next.config.ts`, as instâncias de Supabase em `lib/supabase/`.

### Padrões de Código

- **Route Groups:** `(motorista)`, `(responsavel)`, `(admin)`, `(auth)` — cada um com seu `layout.tsx`.
- **Server Components por padrão.** Use `'use client'` apenas quando necessário (interatividade, hooks, eventos).
- **Hooks customizados** em `src/hooks/` (ex: `useAlunos.ts`, `useChamada.ts`).
- **Server Actions** em `src/lib/actions/` (ex: `alunos.ts`, `chamada.ts`).
- **Mocks tipados** em `src/lib/mocks/` (ex: `index.ts`, `landing.ts`).
- **Tipos** derivados de `database.types.ts` em `src/types/index.ts`.
- **Componentes de layout** em `src/components/layout/`.

### Design System — Elite Logistics System

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-primary` / `#2d4b73` | Deep Blue | Sidebar, cabeçalhos, nav |
| `--color-accent` / `#ffb74d` | Âmbar | CTAs, botões de ação |
| `--color-surface` / `#f8f9fb` | Fundo claro | Fundo de páginas |
| `--color-surface-container` / `#ffffff` | Branco | Cards e modais |
| `--color-text-primary` / `#1a1c1e` | Escuro | Títulos e texto |
| `--color-success` / `#2ecc71` | Verde | Estados de sucesso |
| `--color-danger` / `#e74c3c` | Vermelho | Erros e alertas |
| Border Radius | `8px` | Cantos suaves |
| Font | `Manrope, sans-serif` | Toda a aplicação |
| Shadows | Leves, sem glow neon | Elevações corporativas |

> **IMPORTANTE sobre CSS:** A Sidebar e componentes internos usam variáveis CSS via `var(--color-primary)`, `var(--shadow-card)`, etc. definidas no `:root` do `globals.css`. NÃO use classes Tailwind v4 custom para cores (como `bg-primary-container`). Use as variáveis CSS legado diretamente no `style={{}}` OU crie classes CSS tradicionais no `globals.css`.

---

## [ESCOPO DA IMPLEMENTAÇÃO — MAPA COMPLETO DE ROTAS]

### Legenda de Status
- ✅ = Já existe (revisar e refinar se necessário)
- 🔧 = Existe mas precisa refatoração pesada  
- 🆕 = Precisa ser criado do zero

---

### 🌐 Páginas Públicas

| # | Rota | Arquivo | Status | Observação |
|---|------|---------|--------|------------|
| 1 | `/` | `src/app/page.tsx` | ✅ | Landing Page — NÃO MEXER, foi refatorada hoje |
| 2 | `/vans` | `src/app/vans/page.tsx` | 🔧 | Lista pública de vans — revisar UI e usar mocks de `landing.ts` |

---

### 🔐 Auth

| # | Rota | Arquivo | Status | Observação |
|---|------|---------|--------|------------|
| 3 | `/login` | `src/app/(auth)/login/page.tsx` | 🔧 | Tela de login — garantir design Elite e funcionalidade de auth via Supabase |
| 4 | `/signup` | `src/app/(auth)/signup/page.tsx` | 🔧 | Tela de cadastro — formulário de signup com seleção de tipo (motorista/responsavel) |

---

### 🚐 Grupo Motorista `(motorista)`

**Layout:** `src/app/(motorista)/layout.tsx` — Sidebar (Deep Blue) + Header + conteúdo. Precisa refatorar para usar variáveis CSS corretas.

| # | Rota | Arquivo | Status | Descrição |
|---|------|---------|--------|-----------|
| 5 | `/dashboard` | `src/app/(motorista)/dashboard/page.tsx` | 🔧 | Dashboard principal — Stat cards (total alunos, embarcados, receita, lucro), gráfico de receita (Recharts), lista de próximas cobranças, card de onboarding se `status_onboarding === false`. Usar `mockDashboardStats` + `mockCobrancas` |
| 6 | `/dashboard/cadastro` | `src/app/(motorista)/dashboard/cadastro/page.tsx` | 🔧 | Formulário KYC 3 etapas (query param `?step=1,2,3`). **Step 1:** Dados Pessoais (nome, CPF, RG, WhatsApp, endereço). **Step 2:** Documentos (upload CNH frente/verso, selfie — MOCKAR upload com preview local). **Step 3:** Pagamento (Chave Pix, banco — MOCKAR Asaas). |
| 7 | `/dashboard/frota/nova` | `src/app/(motorista)/dashboard/frota/nova/page.tsx` | 🔧 | Formulário de cadastro de veículo com 4 abas: Dados, Fotos, Documentos, Rotas/Horários (ver contrato `Veiculo` na doc 0207). MOCKAR uploads com preview local. |
| 8 | `/chamada` | `src/app/(motorista)/chamada/page.tsx` | 🔧 | Lista de alunos da rota atual, com botões "Embarcar"/"Desembarcar" por aluno. Seletor de rota + turno no topo. Usar `mockAlunos` + `mockRotas`. Mostrar contagem: X embarcados, Y aguardando, Z ausentes. |
| 9 | `/chamada/scanner` | `src/app/(motorista)/chamada/scanner/page.tsx` | 🆕 | Scanner QR Code (`html5-qrcode`). Ao escanear, faz mock de check-in do aluno. MOCKAR: exibir Toast "Aluno X embarcado ✅". |
| 10 | `/alunos` | `src/app/(motorista)/alunos/page.tsx` | 🔧 | Tabela de alunos com: avatar, nome, escola, série, status, rota. Filtros por rota e status. Botão "➕ Novo Aluno" abre modal de cadastro (inline). Usar `mockAlunos`. |
| 11 | `/rotas` | `src/app/(motorista)/rotas/page.tsx` | 🔧 | Lista de rotas em cards. Cada card: nome, turno, horário, nº de pontos, nº de alunos. Botão "➕ Nova Rota" abre modal. Clicar no card expande para ver pontos de embarque (accordion/collapsible). Usar `mockRotas`. |
| 12 | `/financeiro` | `src/app/(motorista)/financeiro/page.tsx` | 🔧 | **3 abas:** (1) Cobranças — tabela com status pill (pago/pendente/vencido), botão "➕ Nova Cobrança". (2) Despesas — tabela + botão adicionar. (3) Resumo — cards de receita/despesa/lucro + gráfico Recharts (barras mensal). Usar `mockCobrancas` + `mockDespesas` + `mockDashboardStats`. |
| 13 | `/ocorrencias` | `src/app/(motorista)/ocorrencias/page.tsx` | 🔧 | Lista de ocorrências em cards/timeline. Cada uma: aluno, tipo (badge), severidade (cor), data, descrição. Botão "➕ Registrar Ocorrência" abre modal. Usar `mockOcorrencias`. |
| 14 | `/contratos` | `src/app/(motorista)/contratos/page.tsx` | 🔧 | Lista de contratos com status (rascunho/ativo/encerrado). Botão "📄 Gerar Contrato PDF" (MOCKAR — usar `@react-pdf/renderer` para gerar um PDF básico com dados mockados). Botão "✍️ Novo Contrato" abre modal. |
| 15 | `/aniversariantes` | `src/app/(motorista)/aniversariantes/page.tsx` | 🔧 | Lista de alunos cujo `data_nascimento` é no mês atual. Cards com foto, nome, data, idade. Se nenhum no mês, mostra empty state elegante. Usar `mockAlunos` filtrando por mês. |

---

### 👨‍👩‍👧‍👦 Grupo Responsável `(responsavel)`

**Layout:** `src/app/(responsavel)/layout.tsx` — Layout simplificado (header horizontal, sem sidebar). Precisa criar.

| # | Rota | Arquivo | Status | Descrição |
|---|------|---------|--------|-----------|
| 16 | `/meu-painel` | `src/app/(responsavel)/meu-painel/page.tsx` | 🆕 | Dashboard do pai: cards com info do(s) filho(s) (nome, escola, motorista, status do dia). Card de "Próxima Cobrança" com valor e vencimento. Card "Status da Van" (simulação de "Van a caminho" ou "Van parada"). |
| 17 | `/meus-filhos` | `src/app/(responsavel)/meus-filhos/page.tsx` | 🆕 | Lista de filhos com cards detalhados: foto, nome, escola, série, rota, motorista, observações médicas. Botão "Ver Histórico de Viagens" (mock). |
| 18 | `/mensalidades` | `src/app/(responsavel)/mensalidades/page.tsx` | 🆕 | Tabela de faturas: mês ref, valor, vencimento, status (pill). Botão "💳 Pagar via Pix" — **MOCKAR:** abre modal com QR Code fake (usar `qrcode.react` gerando um QR com texto "MOCK_PIX_PAYMENT"). |

---

### 🛡️ Grupo Admin `(admin)`

**Layout:** `src/app/(admin)/layout.tsx` — Sidebar admin (pode ser mais simples) + Header. Precisa refatorar.

| # | Rota | Arquivo | Status | Descrição |
|---|------|---------|--------|-----------|
| 19 | `/admin` | `src/app/(admin)/admin/page.tsx` | 🔧 | Dashboard master: stat cards (total motoristas, total alunos, total receita plataforma, motoristas pendentes KYC). Gráfico de crescimento mensal (Recharts). Lista de "Últimas Ações" (mock). |
| 20 | `/admin/usuarios` | `src/app/(admin)/admin/usuarios/page.tsx` | 🆕 | Tabela de todos os usuários (motoristas + responsáveis). Colunas: nome, email, tipo, status onboarding, data cadastro. Filtros por tipo. Botão "Ver Perfil" abre detalhes em modal. |
| 21 | `/admin/financeiro` | `src/app/(admin)/admin/financeiro/page.tsx` | 🆕 | Visão financeira global: receita total, comissão da plataforma (5% mock), gráficos. Tabela de transações recentes. |
| 22 | `/admin/auditoria` | `src/app/(admin)/admin/auditoria/page.tsx` | 🆕 | Log de ações do sistema (mock): quem fez o quê, quando. Tabela com filtros por tipo de ação e data. |

---

## [MOCKS E CONTRATOS DE DADOS]

### Mocks Existentes (`src/lib/mocks/index.ts`)
Já existem mocks tipados para: `mockAlunos`, `mockRotas`, `mockCobrancas`, `mockDespesas`, `mockDashboardStats`, `mockOcorrencias`.

### Mocks a Criar

```typescript
// src/lib/mocks/responsavel.ts
export const mockFilhos: Partial<AlunoComRota>[]  // 2-3 filhos com rotas
export const mockFaturasResponsavel: Partial<Cobranca>[]  // faturas do responsável

// src/lib/mocks/admin.ts  
export const mockUsuariosAdmin: Array<{
  id: string; nome: string; email: string; tipo: 'motorista' | 'responsavel' | 'admin';
  status_onboarding: boolean; created_at: string; avatar_url?: string;
}>
export const mockAdminStats: { total_motoristas: number; total_alunos: number; receita_plataforma: number; motoristas_pendentes_kyc: number; }
export const mockAuditLog: Array<{ id: string; acao: string; usuario: string; tipo: string; created_at: string; detalhes: string; }>
export const mockTransacoesAdmin: Array<{ id: string; motorista: string; valor: number; comissao: number; status: string; data: string; }>

// src/lib/mocks/contratos.ts
export const mockContratos: Array<{
  id: string; aluno_nome: string; responsavel_nome: string; motorista_nome: string;
  valor_mensal: number; status: 'rascunho' | 'ativo' | 'encerrado'; 
  data_inicio: string; data_fim?: string;
}>
```

### Contrato de Dados — Tipo `Veiculo` (nova tabela, ainda não existe no DB)

```typescript
interface Veiculo {
  id: string
  motorista_id: string
  placa: string
  modelo: string
  ano: number
  cor: string
  capacidade: number
  tipo: 'van' | 'kombi' | 'micro_onibus' | 'onibus'
  valor_mensalidade: number
  turnos: ('manha' | 'tarde' | 'integral' | 'noturno')[]
  descricao?: string
  bairros_atendidos: string[]
  escolas_atendidas: string[]
  horario_manha?: string
  horario_tarde?: string
  dias_semana: ('seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab')[]
  fotos_urls: string[]
  url_crlv?: string
  url_laudo?: string
  url_seguro?: string
  status_publicado: boolean
  status_verificado: boolean
  created_at: string
  updated_at: string
}
```

### Enums do Banco (referência para tipagem)

```
tipo_usuario: "motorista" | "responsavel" | "admin"
status_checkin: "aguardando" | "embarcado" | "desembarcado"
status_cobranca: "pendente" | "pago" | "vencido" | "cancelado"
status_contrato: "rascunho" | "ativo" | "encerrado"
tipo_cobranca: "mensalidade" | "avulso"
turno_rota: "manha" | "almoco" | "tarde" | "noite"
categoria_despesa: "combustivel" | "manutencao" | "seguro" | "multa" | "outros"
tipo_ocorrencia: "comportamento" | "atraso" | "incidente" | "elogio" | "pendencia"
severidade_ocorrencia: "baixa" | "media" | "alta"
```

---

## [REQUISITOS NÃO FUNCIONAIS E DE QUALIDADE]

### Desempenho
- Use **Server Components** por padrão. `'use client'` apenas para interatividade.
- Não faça chamadas Supabase em `page.tsx` diretamente — use hooks (client) ou Server Actions.
- Imagens de avatar usem `https://ui-avatars.com/api/?name=NOME&background=2d4b73&color=fff&size=80&bold=true`.

### Segurança / Auth
- O `middleware.ts` já faz RBAC (redireciona motorista que tenta acessar `/admin`, etc.). NÃO mexa no middleware.
- O `AuthProvider` (`src/providers/AuthProvider.tsx`) já fornece `useAuth()` com `user`, `perfil`, `signIn`, `signUp`, `signOut`. Use-o em componentes client.

### Design / UX
- **Responsivo**: Todas as telas devem funcionar em mobile (sidebar colapsa, grids empilham).
- **Status pills** usam as classes `.pill-*` do `globals.css` (ex: `.pill-pago`, `.pill-pendente`, `.pill-vencido`).
- **Cards** usam a classe `.card` do `globals.css`.
- **Botões** usam `.btn .btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`.
- **Inputs** usam a classe `.input`.
- **Tabelas** usam `.table-container` + tags `table/thead/tbody`.
- **Empty states** devem ser elegantes — ícone grande + texto + CTA.
- **Animações** use `.animate-fade-in` do `globals.css`.
- **O Sidebar do Motorista** (`src/components/layout/Sidebar.tsx`) já existe com estilos JSX inline. Os estilos referenciam variáveis CSS que podem não existir mais (`--gradient-sidebar`, `--glass-bg`). **Refatore o Sidebar** para usar as variáveis CSS que EXISTEM no `:root` do `globals.css` (`--color-primary`, `--color-surface`, `--shadow-card`, etc.) ou hardcode os hex values.

### O Que MOCKAR (não implementar real)
- ❌ **Uploads de arquivo** — Mostrar preview local com `URL.createObjectURL()` + toast de sucesso. Não chamar Supabase Storage.
- ❌ **Pagamentos Asaas** — Formulário de Pix com dados mock.
- ❌ **QR Code Scanner** — Inicializar câmera mas ao escanear qualquer QR, simular check-in mock.
- ❌ **Geração de PDF** — Gerar PDF básico com `@react-pdf/renderer` usando dados mock.
- ❌ **Google Maps** — Exibir mapa estático ou placeholder no slot de rotas.
- ❌ **WhatsApp (Evolution API)** — Usar link `wa.me/` direto.
- ❌ **Push Notifications** — Não implementar o Service Worker com `olha-a-van.mp3`.

---

## [CRITÉRIOS DE ACEITAÇÃO]

1. ✅ O código compila sem erros de TypeScript (`npm run build` passa).
2. ✅ Sem uso de `@ts-ignore` — tudo tipado.
3. ✅ Todas as 22 rotas/páginas listadas acima funcionam quando acessadas.
4. ✅ O `middleware.ts` NÃO foi alterado.
5. ✅ O `globals.css` NÃO foi corrompido (verificar: `Get-Content globals.css | Measure-Object -Line` — deve ser ~280 linhas, NUNCA acima de 400).
6. ✅ A Landing Page (`/`) NÃO foi alterada.
7. ✅ Para cada tela nova/alterada, existe um `.md` correspondente em `_docs/`.
8. ✅ Todos os mocks novos estão tipados (`Partial<Tipo>[]`).
9. ✅ UI é visualmente coerente com o "Elite Logistics System" (azul profundo, âmbar, fundo claro, Manrope).
10. ✅ Log diário registrado em `logs/execucao_AAAA-MM-DD.log`.

---

## [INSTRUÇÕES DE EXECUÇÃO ASSÍNCRONA]

### Fase 1 — Reconhecimento (NÃO modifique código ainda)
1. Leia `indice.txt` na raiz.
2. Leia **todos** os `.md` em `_docs/`.
3. Leia `src/types/index.ts`, `src/lib/mocks/index.ts`, `src/lib/mocks/landing.ts`.
4. Leia `src/app/globals.css` — entenda os tokens CSS e as classes utilitárias.
5. Leia `src/components/layout/Sidebar.tsx` e `Header.tsx`.
6. Leia o `middleware.ts` para entender o RBAC.
7. Leia `_docs/0101_Troubleshooting_CSS.md` — contém armadilhas conhecidas do CSS/Tailwind.

### Fase 2 — Infraestrutura de Mocks e Tipos
1. Criar `src/lib/mocks/responsavel.ts` com mocks tipados.
2. Criar `src/lib/mocks/admin.ts` com mocks tipados.
3. Criar `src/lib/mocks/contratos.ts` com mocks tipados.
4. Atualizar `src/types/index.ts` com tipo `Veiculo` e tipos compostos necessários.

### Fase 3 — Refatoração dos Layouts
1. **Refatorar** `src/components/layout/Sidebar.tsx` — corrigir variáveis CSS inexistentes, usar as do `:root`.
2. **Refatorar** `src/components/layout/Header.tsx` — idem.
3. **Refatorar** `src/app/(motorista)/layout.tsx` — garantir que Sidebar + Header + conteúdo funcionam.
4. **Criar/Refatorar** `src/app/(responsavel)/layout.tsx` — layout simplificado com header horizontal.
5. **Criar/Refatorar** `src/app/(admin)/layout.tsx` — layout com sidebar admin.
6. **Refatorar** `src/components/layout/AdminSidebar.tsx` e `AdminHeader.tsx`.

### Fase 4 — Implementação das Telas (por grupo)
Implementar cada `page.tsx` conforme a tabela de escopo acima, na ordem:
1. Motorista: dashboard → chamada → alunos → rotas → financeiro → ocorrências → contratos → aniversariantes
2. Onboarding: cadastro (3 steps) → frota/nova (4 tabs)
3. Responsável: meu-painel → meus-filhos → mensalidades
4. Admin: admin → admin/usuarios → admin/financeiro → admin/auditoria
5. Auth: login → signup
6. Público: vans (revisão)

### Fase 5 — Documentação
1. Criar/atualizar `_docs/` para cada tela implementada.
2. Registrar log diário em `logs/`.

### Fase 6 — Verificação
1. Executar `npm run build` — DEVE compilar sem erros.
2. Verificar que `globals.css` não está corrompido (< 400 linhas).
3. Gerar um **Pull Request** detalhado na branch `PARA-JULES` com todas as modificações.

---

## [ÁRVORE DE ARQUIVOS ATUAL — REFERÊNCIA]

```
src/
├── app/
│   ├── (admin)/
│   │   ├── layout.tsx
│   │   └── admin/
│   │       ├── page.tsx
│   │       ├── auditoria/page.tsx
│   │       ├── financeiro/page.tsx
│   │       └── usuarios/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (motorista)/
│   │   ├── layout.tsx
│   │   ├── alunos/page.tsx
│   │   ├── aniversariantes/page.tsx
│   │   ├── chamada/
│   │   │   ├── page.tsx
│   │   │   └── scanner/page.tsx
│   │   ├── contratos/page.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── cadastro/page.tsx
│   │   │   └── frota/nova/page.tsx
│   │   ├── financeiro/page.tsx
│   │   ├── ocorrencias/page.tsx
│   │   └── rotas/page.tsx
│   ├── (responsavel)/
│   │   ├── layout.tsx
│   │   ├── mensalidades/page.tsx
│   │   ├── meu-painel/page.tsx
│   │   └── meus-filhos/page.tsx
│   ├── api/webhooks/asaas/route.ts
│   ├── vans/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                    ← NÃO MEXER
├── components/layout/
│   ├── AdminHeader.tsx
│   ├── AdminSidebar.tsx
│   ├── Header.tsx
│   └── Sidebar.tsx
├── hooks/
│   ├── useAlunos.ts
│   ├── useChamada.ts
│   ├── useFinanceiro.ts
│   ├── useNotificacoes.ts
│   ├── useOcorrencias.ts
│   └── useRotas.ts
├── lib/
│   ├── actions/ (alunos, chamada, financeiro, ocorrencias-contratos, rotas)
│   ├── asaas/client.ts
│   ├── evolution.ts
│   ├── geofencing.ts
│   ├── mocks/ (index.ts, landing.ts)
│   ├── pdf.tsx
│   └── supabase/ (client.ts, server.ts, database.types.ts)
├── providers/AuthProvider.tsx
├── types/index.ts
└── middleware.ts                   ← NÃO MEXER
```

---

> [!IMPORTANT]
> **Prioridade absoluta:** O código deve COMPILAR (`npm run build`) sem erros. Se houver conflito entre "visual perfeito" e "compila sem erro", escolha "compila sem erro".

> [!WARNING]
> **Leia `_docs/0101_Troubleshooting_CSS.md` ANTES de tocar no `globals.css`.** Edições acumuladas nesse arquivo já causaram crash total do CSS uma vez. Nunca duplique imports. Nunca ultrapasse 400 linhas.
