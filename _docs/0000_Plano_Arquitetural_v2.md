# 🚐 Tio da Van 2.0 Elite — Plano Arquitetural

> **Versão:** 2.1 | **Data:** 2026-05-25
> **Documento de referência:** Este é o plano mestre do projeto.

## Decisões de Arquitetura

| Decisão | Escolha |
|---------|---------|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript (strict) |
| Estilização | Tailwind CSS v4 + **Elite Logistics System** (Clean Light, Deep Blue & Amber) |
| Backend | Supabase (PostgreSQL 17 + Auth + Storage + Realtime) |
| Projeto Supabase | `xexxnfhukprktdzkhnhi` (Org: Tio da van) |
| WhatsApp | Evolution API (self-hosted) |
| Mapas | Google Maps API |
| Pagamentos | Asaas API (última fase) |
| Deploy | Vercel |
| Prototipagem UI | Google Stitch MCP (toda tela de frontend gerada via Stitch primeiro) |

---

## 🎨 Sistema de Design — Elite Logistics System

> **ATENÇÃO:** O sistema de design foi migrado de *Dark Glassmorphism* para **Elite Logistics System** (Clean, corporativo, com fundo claro e sidebar azul profundo).

### Paleta de Cores (Tokens CSS)

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-primary` | `#2d4b73` | Sidebar, cabeçalhos, navegação |
| `--color-accent` | `#ffb74d` | CTAs principais, botões de ação, alertas |
| `--color-surface` | `#f8f9fb` | Cor de fundo das páginas (Clean) |
| `--color-surface-container` | `#ffffff` | Fundo de cards e modais |
| `--color-text-primary` | `#1a1c1e` | Títulos e corpo de texto principal |
| `--color-success` | `#2ecc71` | Estados de sucesso |
| `--color-danger` | `#e74c3c` | Erros e alertas críticos |

### Tipografia

| Propriedade | Valor |
|-------------|-------|
| Font Family | `Manrope, sans-serif` |
| Weights | Regular (400), Medium (500), Bold (700) |

### Sistema de Formas e Espaçamento

| Propriedade | Valor |
|-------------|-------|
| Border Radius | `8px` (suave, sem perder seriedade técnica) |
| Grid System | Múltiplos de `4px / 8px` |
| Shadows | Elevações leves com pouco desfoque (sem glow neon) |

### Componentes Globais

- **Sidebar:** Persistente à esquerda (Desktop), fundo `#2d4b73`, ícones outline brancos
- **Inputs:** Bordas finas, fundo branco, foco no azul primário `#2d4b73`
- **Botões primários:** Fundo âmbar `#ffb74d`, texto escuro, cantos `8px`
- **Botões secundários:** Borda fina, fundo transparente

---

## Tabelas do Banco (10) — Com Extensões Elite
*Todas as tabelas são asseguradas por políticas de Row Level Security (RLS) no Supabase.*

1. `perfis` — Usuários (motorista/responsável/admin/dono_frota).
   * *Campos novos:* `status_onboarding` (boolean) para KYC.
2. `motoristas_perfil` — Dados específicos do motorista e uploads de documentos.
   * *Campos novos:* `url_cnh_frente` (text), `url_cnh_verso` (text), `url_veiculo_foto` (text) para KYC; `dados_bancarios_asaas` (jsonb) para Split; `frota_id` (uuid) vinculando motorista funcionário ao dono da frota.
3. `rotas` — Rotas nomeadas com turno (manha/almoco/tarde/noite).
4. `pontos_embarque` — Pontos GPS vinculados a rotas.
5. `alunos` — Alunos com check-in/status e chaves estrangeiras.
   * *Campos novos:* `token_convite` (text) para onboarding fechado de responsáveis.
6. `cobrancas` — Cobranças integradas ao Asaas para split de 5%.
7. `despesas` — Despesas do motorista para cálculo automático de lucro.
8. `ocorrencias` — Registro de ocorrências em tempo real.
9. `contratos` — Contratos em PDF e assinaturas.
10. `notificacoes` — Notificações push transacionais.

---

## 🎨 Novas Telas, Filtros e Fluxos Incorporados

### 1. Landing Page Pública & Marketplace Sem Fricção (`src/app/page.tsx`)
*   **Seção "Sou Pai":** Filtros de busca por **bairro** e **escola** sem login. Botão "Ver Vans Disponíveis" → `/vans`.
*   **Seção "Sou Motorista":** CTA "Cadastrar Minha Van Agora" → Google Auth → `/dashboard` (com Onboarding Popup).
*   **Ação pai:** WhatsApp direto com o motorista selecionado (link dinâmico com texto predefinido).

### 2. Lista Pública de Vans por Região (`/vans`)
*   Página pública (sem login), acessada ao clicar em "Ver Vans Disponíveis" na Landing Page.
*   Filtros: escola + bairro (passados como query params da LP).
*   Cards de van: **foto da van**, **foto do motorista**, nome, avaliação, escolas atendidas, bairros, vagas.
*   CTA de cada card: `💬 Negociar no WhatsApp` (link `wa.me/` com texto dinâmico).

### 3. Funil de Onboarding & KYC do Motorista
*   **Rota de entrada:** `/signup` → Google Authenticator → `/dashboard`
*   **Dashboard 1ª visita:** Popup de onboarding (com X para fechar) + Card fixo "⚠️ Complete seu cadastro".
*   **Formulário KYC** (`/dashboard/cadastro`):
    - Nome completo, RG, CPF, CNPJ (opcional), foto selfie, endereço completo
    - Foto CNH (frente + verso), WhatsApp, e-mail
    - Redes sociais (Instagram, Facebook — opcionais)
    - Configuração de pagamento: Chave Pix, banco, dados Asaas
*   **Dashboard após KYC completo:** Card fixo desaparece. Aparece Card CTA "➕ Adicionar Van ou Frota".

### 4. Cadastro de Van / Frota (`/dashboard/frota/nova`)
*   Acessado pelo Card CTA no dashboard após KYC.
*   Campos: fotos do veículo (mín. 3), documentação do veículo, horários de operação, rotas (bairros e escolas atendidas), capacidade de alunos, turno (manhã/tarde/integral), valor mensal.
*   Upload de: CRLV, laudo de vistoria, seguro.

### 5. Painel Empresarial de Gestão de Frotas (`/dashboard/frota`)
*   Interface exclusiva para `dono_frota`: gerenciar motoristas vinculados, rotas por veículo, split financeiro.

### 6. Link de Convites e Web Push Sonoro
*   URL segura: `/convite/[motorista_id]`.
*   Web Push com Service Worker executando `olha-a-van.mp3` ao iniciar rota.

---

## Fases de Implementação
 
- **Fase 1:** Infraestrutura (SQL + Auth + Tipos)
- **Fase 2:** Motor de Gestão (Server Actions + Integrações)
- **Fase 3:** Interface Elite Logistics System (Telas + Asaas)
- **Fase 4:** Novas Telas & Módulos Elite (LP, KYC Onboarding, Frota e Push Sonoro)
 
> Consulte o plano detalhado de execução em: [implementation_plan.md](file:///C:/Users/NOSSA%20WEBTV/.gemini/antigravity-ide/brain/617bc358-bcfc-442c-bf71-9a4c04edf15c/implementation_plan.md) no artifact directory.
