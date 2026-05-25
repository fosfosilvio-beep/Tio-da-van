# 🌐 Landing Page Pública — Tio da Van

> **Quarteirão:** [02XX] Telas e UI
> **Arquivo:** `0204_LandingPage.md`
> **Atualizado em:** 2026-05-25
> **Responsabilidade única:** Página de conversão pública (sem autenticação) para captação de famílias e motoristas.

---

## Rota

| Propriedade | Valor |
|-------------|-------|
| Rota Next.js | `src/app/page.tsx` |
| Acesso | **Público** (sem autenticação) |
| Dispositivo | Desktop-first (responsivo mobile) |
| Stitch Screen ID | `2329474e9dd74a229377a2f7ca911006` |
| Projeto Stitch | `6828261981780852293` (Tio da Van - Código Real) |

---

## Design System Aplicado

**Stitch Premium Centralized Layout (Tailwind v4 @theme)**

| Token | Valor |
|-------|-------|
| Cor Primary Container | `#2d4b73` |
| Cor Secondary / Accent | `#fdba5f` / `#845400` |
| Surface (fundo de página) | `#f8f9fb` / `#edeef0` |
| Cards | `#ffffff` / `#f2f4f6` com shadow-sm |
| Tipografia | Manrope |
| Border Radius | `8px` (`rounded-md/lg`) padrão |

---

## Seções da Página

### 1. Navbar (Sticky)
- Logo `🚐 Tio da Van` (imagem premium importada do Stitch)
- Links: Como Funciona | Para Motoristas | Para Famílias | Recursos
- CTAs: `Entrar` (ghost link) + `Sou Motorista` (filled azul)

### 2. Hero Section
- Fundo `#2d4b73`
- Headline branca bold: *"O Transporte Escolar Que Sua Família Merece"*
- Subtitle: *"Motoristas verificados, rastreamento em tempo real..."*
- CTA primário: `Buscar Van no Meu Bairro` (scroll suave para a seção de busca `#busca`)
- Foto da Van Escolar de alta qualidade à direita

### 3. Search Section (Marketplace)
- Busca por **escola** e **bairro** — sem login prévio
- Form com `action="/vans"` usando envio GET nativo (Server Component First)
- Chips com links diretos para escolas populares: Colégio Objetivo, Escola Americana, Colégio Bandeirantes

### 4. Card "Sou Motorista" (Promo)
- Seção promocional voltada para conversão de motoristas
- CTA: `🚐 Cadastrar Minha Van Agora` redirecionando para a tela de `/login`

### 5. Cards de Motoristas (3 colunas)
- Exibe os 3 primeiros motoristas em destaque dinamicamente a partir de `mockMotoristasPublicos`
- Exibe o avatar, nome, avaliação ⭐, tag de vagas e bairros/escolas atendidas
- CTA: `💬 Contatar via WhatsApp` linkado dinamicamente para o WhatsApp do motorista

### 6. Como Funciona (3 Steps)
- **Busque** → **Conecte** → **Confie**

### 7. Grid de Features (2×3)
- 📍 Rastreamento GPS
- 📱 Embarque com QR Code
- 💰 Pagamento Integrado via Pix
- 🔔 Notificações Automáticas
- 🛡️ Verificação KYC Rigorosa
- 📊 Relatórios Transparentes

### 8. Footer (Deep Blue)
- Logo branco + tagline + links rápidos + copyright

---

## Contrato de Dados (Mocks)

Para a seção de busca e cards de motoristas, usa mocks tipados em `lib/mocks/landing.ts`:

```typescript
export interface MotoristaPublico {
  id: string
  nome: string
  foto_perfil_url: string
  foto_van_url: string
  avaliacao: number
  total_avaliacoes: number
  escolas_atendidas: string[]
  bairros: string[]
  vagas_disponiveis: number
  valor_mensalidade: number
  whatsapp: string
}
```

---

## Notas de Implementação

> **IMPORTANTE:** A rota `src/app/page.tsx` foi implementada como um **Server Component** para máxima performance e otimização de SEO. Os filtros de busca usam inputs HTML tradicionais com envio `GET` direcionado para a rota `/vans`. Os chips populares são links diretos para a rota `/vans` pré-filtrada.

