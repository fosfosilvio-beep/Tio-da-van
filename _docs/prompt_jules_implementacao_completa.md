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

### 🌐 Grupo Público e Autenticação `(public)` & `(auth)`

| # | Rota | Arquivo | Status | Propósito / Descrição |
|---|------|---------|--------|-----------------------|
| 1 | `/` | `src/app/page.tsx` | ✅ | **Landing Page & Marketplace:** Apresentar o serviço e captar novos usuários. Hero com proposta de valor, busca pública de vans (Ex: Arapongas por escola), e cards de resultados com CTA "Chamar no WhatsApp". **NÃO EDITAR**. |
| 2 | `/vans` | `src/app/vans/page.tsx` | 🔧 | **Busca de Vans:** Exibe resultados filtrados com cards dos motoristas e link direto para WhatsApp. |
| 3 | `/login` | `src/app/(auth)/login/page.tsx` | 🔧 | **Portal de Acesso:** Login unificado via Google (Supabase Auth) ou Email/Senha. Design Soft UI limpo, fundo `bg-slate-50`, cartões `rounded-3xl` flutuantes. |
| 4 | `/signup` | `src/app/(auth)/signup/page.tsx` | 🔧 | **Registro Inicial:** Seleção de perfil inicial ("Sou Motorista" ou "Sou Pai"). |
| 5 | `/convite/[token]` | `src/app/(auth)/convite/[token]/page.tsx` | 🆕 | **Landing de Convite:** Tela de captura de leads. O pai clica no link do WhatsApp do motorista, acessa o formulário de cadastro pré-vinculado à van/motorista correto. |

---

### 🚐 Grupo Motorista & Dono de Frota `(motorista)`

**Layout:** `src/app/(motorista)/layout.tsx` — Sidebar (Deep Blue) + Header funcional + área de conteúdo. Usar variáveis CSS do `:root`.

| # | Rota | Arquivo | Status | Propósito / Descrição |
|---|------|---------|--------|-----------------------|
| 6 | `/dashboard` | `src/app/(motorista)/dashboard/page.tsx` | 🔧 | **Painel Geral:** Central de comando. Cartões de estatísticas, botão de pulso "Iniciar Rota", mini-chamada da rota ativa e atalhos rápidos. |
| 7 | `/dashboard/cadastro` | `src/app/(motorista)/dashboard/cadastro/page.tsx` | 🔧 | **Onboarding / KYC:** Funil de 3 passos para envio de documentos. Dados pessoais, fotos CNH/Van, dados bancários (Asaas) e distinção entre "Autônomo" ou "Dono de Frota". |
| 8 | `/dashboard/frota/nova` | `src/app/(motorista)/dashboard/frota/nova/page.tsx` | 🔧 | **Cadastro de Veículo:** Formulário com 4 abas para cadastrar novos veículos na frota (CRLV, fotos, turnos). |
| 9 | `/chamada` | `src/app/(motorista)/chamada/page.tsx` | 🔧 | **Mesa de Chamada:** Offline-first. Leitor de QR Code integrado na tela, lista de alunos com botões de status (Aguardando, Embarcado, Desembarcado, Faltou). Gatilho do áudio "Olha a van!". |
| 10 | `/chamada/scanner` | `src/app/(motorista)/chamada/scanner/page.tsx` | 🆕 | **Scanner Adicional:** Tela inteira de leitor de QR Code usando câmera para check-in rápido de alunos. |
| 11 | `/alunos` | `src/app/(motorista)/alunos/page.tsx` | 🔧 | **Gestão da Clientela:** Tabela com ficha de alunos, observações médicas/ficha de cada um, e botão "Gerar Link de Convite" (gera rota `/convite/[token]`). |
| 12 | `/rotas` | `src/app/(motorista)/rotas/page.tsx` | 🔧 | **Planejamento de Trajetos:** Ordem de paradas baseada nos endereços dos alunos. Mapa interativo com pins (ou placeholder de mapa elegante). |
| 13 | `/financeiro` | `src/app/(motorista)/financeiro/page.tsx` | 🔧 | **Meu Caixa:** Gestão de boletos/Pix gerados pelo Asaas. Listagem de cobranças pagas/pendentes, inadimplência e registro de despesas operacionais (combustível/manutenção). |
| 14 | `/ocorrencias` | `src/app/(motorista)/ocorrencias/page.tsx` | 🔧 | **Livro de Bordo:** Registro de ocorrências ou incidentes para notificação e comunicação oficial aos responsáveis. |
| 15 | `/contratos` | `src/app/(motorista)/contratos/page.tsx` | 🔧 | **Gestão de Contratos:** Geração de contrato base em PDF usando `@react-pdf/renderer` com dados mockados. |
| 16 | `/aniversariantes` | `src/app/(motorista)/aniversariantes/page.tsx` | 🔧 | **Aniversariantes do Mês:** Visualização rápida de aniversariantes da rota para engajamento e relacionamento. |
| 17 | `/minha-frota` | `src/app/(motorista)/minha-frota/page.tsx` | 🆕 | **Gestão de Equipe (Dono de Frota):** Gestão de motoristas empregados, veículos (placas/CRLV), delegação de rotas por van e relatórios financeiros independentes por veículo. |

---

### 👨‍👩‍👧‍👦 Grupo Responsável `(responsavel)`

**Layout:** `src/app/(responsavel)/layout.tsx` — PWA Mobile-First simplificado (sem sidebar, header horizontal).

| # | Rota | Arquivo | Status | Propósito / Descrição |
|---|------|---------|--------|-----------------------|
| 18 | `/meu-painel` | `src/app/(responsavel)/meu-painel/page.tsx` | 🆕 | **Central do Pai:** Visão geral da rotina do filho. Status da van em tempo real ("Na van agora", "Chegou na escola"), foto e dados do motorista, e atalho rápido do WhatsApp. |
| 19 | `/meus-filhos` | `src/app/(responsavel)/meus-filhos/page.tsx` | 🆕 | **Lista de Filhos:** Fichas de cadastro individuais dos filhos com escola, série, rota associada e anotações médicas. |
| 20 | `/meu-painel/cracha` | `src/app/(responsavel)/meu-painel/cracha/page.tsx` | 🆕 | **Crachá de Embarque (Passe Digital):** Exibição em tela cheia do QR Code único do aluno com brilho máximo configurado para leitura fácil pelo motorista. |
| 21 | `/meu-painel/avisos` | `src/app/(responsavel)/meu-painel/avisos/page.tsx` | 🆕 | **Central de Notificações:** Histórico de alertas de chegada/partida, avisos gerais e botão para justificar falta do dia. |
| 22 | `/meu-painel/financeiro` | `src/app/(responsavel)/meu-painel/financeiro/page.tsx` | 🆕 | **Mensalidades / Pagamento:** Histórico de boletos/Pix, botão de copiar Pix Copia e Cola, modal com QR Code simulado de pagamento via `qrcode.react`. |

---

### 🛡️ Grupo Administrativo `(admin)`

**Layout:** `src/app/(admin)/layout.tsx` — Sidebar admin + Header. Design focado em **Soft UI com fundos claros**, elementos limpos e sem cores escuras cansativas.

| # | Rota | Arquivo | Status | Propósito / Descrição |
|---|------|---------|--------|-----------------------|
| 23 | `/admin` | `src/app/(admin)/admin/page.tsx` | 🔧 | **Cockpit Master (BI):** Gráficos de crescimento de usuários, mapa de calor de vans, split Asaas e relatórios globais de saúde da plataforma. |
| 24 | `/admin/usuarios` | `src/app/(admin)/admin/usuarios/page.tsx` | 🆕 | **Moderação KYC:** Mesa de análise de CNH e fotos das vans enviadas no onboarding. Botão de aprovação e painel de suspensão de contas. |
| 25 | `/admin/frotas` | `src/app/(admin)/admin/frotas/page.tsx` | 🆕 | **Auditoria de Frotas:** Lista de Donos de Frota cadastrados, quantidade de vans ativas sob cada CNPJ e faturamento acumulado. |
| 26 | `/admin/financeiro` | `src/app/(admin)/admin/financeiro/page.tsx` | 🆕 | **Receita da Plataforma:** Relatórios de extrato de splits (5% da taxa do SaaS) e previsibilidade de caixa. |
| 27 | `/admin/configuracoes` | `src/app/(admin)/admin/configuracoes/page.tsx` | 🆕 | **Parametrização:** Configuração de split de tarifas, chaves de API do Asaas/Evolution e gestão de contas de administradores. |
| 28 | `/admin/auditoria` | `src/app/(admin)/admin/auditoria/page.tsx` | 🆕 | **Log de Ações:** Log de segurança e auditoria do sistema (ações executadas por operadores do sistema). |

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
│   │       ├── configuracoes/page.tsx
│   │       ├── financeiro/page.tsx
│   │       ├── frotas/page.tsx
│   │       └── usuarios/page.tsx
│   ├── (auth)/
│   │   ├── convite/
│   │   │   └── [token]/
│   │   │       └── page.tsx
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
│   │   ├── minha-frota/
│   │   │   └── page.tsx
│   │   ├── ocorrencias/page.tsx
│   │   └── rotas/page.tsx
│   ├── (responsavel)/
│   │   ├── layout.tsx
│   │   ├── meu-painel/
│   │   │   ├── page.tsx
│   │   │   ├── cracha/page.tsx
│   │   │   ├── avisos/page.tsx
│   │   │   └── financeiro/page.tsx
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

## [CHECKLIST DO STATUS DA IMPLEMENTAÇÃO]

O Agente Autônomo deve preencher e atualizar este checklist ao final do seu trabalho, indicando quais rotas estão 100% integradas, testadas e quais ainda dependem de backend Supabase real:

### 🔄 Checklist de Navegabilidade & Fluxo (100% Funcional)
- [ ] **Navegação Home:** Todas as páginas internas possuem botões de retorno (Home, Back) e links de navegação 100% funcionais no Sidebar/Header.
- [ ] **Histórico e Fallbacks:** Verificação de estados vazios (empty states) para listagens vazias e toasts/mensagens de fallback apropriadas se recursos não forem encontrados.
- [ ] **Botões de Desfazer:** Modais e formulários incluem botões de "Voltar", "Cancelar" ou "Desfazer Ação" visíveis e clicáveis.
- [ ] **Responsividade:** Layouts adaptados para mobile-first (principalmente no grupo `responsavel` e fluxo de `chamada` do motorista).

### 🌐 Páginas Públicas & Auth
- [ ] `/` (Landing Page & Marketplace) - [x] Integrado e preservado (NÃO ALTERAR)
- [ ] `/vans` (Lista de vans) - [ ] Integrado e com filtros
- [ ] `/login` (Portal Soft UI) - [ ] Google Auth & e-mail integrado
- [ ] `/signup` (Registro de Perfil) - [ ] Seleção de perfil funcionando
- [ ] `/convite/[token]` (Landing de convite) - [ ] Form de cadastro vinculado à van ativa

### 🚐 Painel do Motorista (`(motorista)`)
- [ ] Layout principal com Sidebar e Header robusto - [ ] Concluído
- [ ] `/dashboard` (Comandos rápidos e estatísticas) - [ ] Concluído
- [ ] `/dashboard/cadastro` (Funil KYC 3 etapas) - [ ] Concluído
- [ ] `/dashboard/frota/nova` (Cadastro de veículo com 4 abas) - [ ] Concluído
- [ ] `/chamada` (Leitor QR integrado, lista de alunos, som trigger) - [ ] Concluído
- [ ] `/chamada/scanner` (Câmera cheia de scanner QR) - [ ] Concluído
- [ ] `/alunos` (Ficha, observações e botão gerar convite) - [ ] Concluído
- [ ] `/rotas` (Ordenação e mapa interativo) - [ ] Concluído
- [ ] `/financeiro` (Receitas Asaas, inadimplência, despesas) - [ ] Concluído
- [ ] `/ocorrencias` (Timeline de registro) - [ ] Concluído
- [ ] `/contratos` (Geração de PDF mockado) - [ ] Concluído
- [ ] `/aniversariantes` (Aniversariantes do mês) - [ ] Concluído
- [ ] `/minha-frota` (Vans, CRLV, equipe, faturamento independente) - [ ] Concluído

### 👨‍👩‍👧‍👦 Painel do Responsável (`(responsavel)`)
- [ ] Layout PWA mobile-first horizontal - [ ] Concluído
- [ ] `/meu-painel` (Fila de status da van e dados do motorista) - [ ] Concluído
- [ ] `/meus-filhos` (Fichas e observações médicas) - [ ] Concluído
- [ ] `/meu-painel/cracha` (QR code tela cheia e brilho máximo) - [ ] Concluído
- [ ] `/meu-painel/avisos` (Central de notificações de chegada) - [ ] Concluído
- [ ] `/meu-painel/financeiro` (Histórico Pix copia e cola, adimplência) - [ ] Concluído

### 🛡️ Painel Admin (`(admin)`)
- [ ] Layout Soft UI claro (sem modo escuro ativo por padrão) - [ ] Concluído
- [ ] `/admin` (Auditoria Asaas, gráficos gerais) - [ ] Concluído
- [ ] `/admin/usuarios` (Mesa de moderação KYC e aprovação CNH) - [ ] Concluído
- [ ] `/admin/frotas` (Listagem de CNPJ e faturamento das vans) - [ ] Concluído
- [ ] `/admin/financeiro` (Comissões split de 5%) - [ ] Concluído
- [ ] `/admin/configuracoes` (Configurações globais e chaves de API) - [ ] Concluído
- [ ] `/admin/auditoria` (Trilha de auditoria operacional) - [ ] Concluído

---

> [!IMPORTANT]
> **Prioridade absoluta:** O código deve COMPILAR (`npm run build`) sem erros. Se houver conflito entre "visual perfeito" e "compila sem erro", escolha "compila sem erro".

> [!WARNING]
> **Leia `_docs/0101_Troubleshooting_CSS.md` ANTES de tocar no `globals.css`.** Edições acumuladas nesse arquivo já causaram crash total do CSS uma vez. Nunca duplique imports. Nunca ultrapasse 400 linhas.

