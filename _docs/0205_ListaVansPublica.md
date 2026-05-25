# 🚐 Lista Pública de Vans por Região

> **Quarteirão:** [02XX] Telas e UI
> **Arquivo:** `0205_ListaVansPublica.md`
> **Criado em:** 2026-05-25
> **Responsabilidade única:** Página pública de resultados do marketplace — exibe vans disponíveis por escola e bairro sem exigir login.

---

## Rota

| Propriedade | Valor |
|-------------|-------|
| Rota Next.js | `src/app/vans/page.tsx` |
| Acesso | **Público** (sem autenticação) |
| Dispositivo | Desktop-first (responsivo mobile) |
| Stitch Screen ID | `717a244e4b11491c8b52737d8fb57dea` |
| Projeto Stitch | `6828261981780852293` |

---

## Design System

**Elite Logistics System** — fundo `#f8f9fb`, Manrope, `#2d4b73` azul, `#ffb74d` âmbar.

---

## Query Params (passados pela Landing Page)

| Parâmetro | Exemplo | Origem |
|-----------|---------|--------|
| `escola` | `Colégio São José` | Input da seção "Sou Pai" na LP |
| `bairro` | `Vila Madalena` | Input da seção "Sou Pai" na LP |

**URL exemplo:** `/vans?escola=Colégio São José&bairro=Vila Madalena`

---

## Layout da Página

### 1. Navbar (sticky)
- Igual à Landing Page

### 2. Barra de Filtros
- Breadcrumb: `Início > Buscar Vans`
- Dois inputs pré-preenchidos: Escola + Bairro
- Botão âmbar: `Atualizar Busca`
- Contador: `12 motoristas encontrados para sua região`

### 3. Grid de Cards (3 colunas)
Cada card contém:
| Elemento | Descrição |
|----------|-----------|
| Foto da van | Imagem real da van (placeholder 16:9 com ícone de van) |
| Avatar motorista | Foto do motorista em círculo (ui-avatars como fallback) |
| Nome do motorista | Manrope Bold |
| Avaliação | ⭐ 4.9 (24 avaliações) |
| Escolas atendidas | Lista de nomes |
| Bairros | Pills azuis |
| Horários | Manhã/Tarde com horários |
| Vagas | Badge verde `2 vagas disponíveis` |
| Valor | `A partir de R$ 420,00/mês` |
| CTA | Botão verde `💬 Negociar no WhatsApp` |

### 4. Paginação
- Anterior | 1 2 3 | Próxima

### 5. Estado Vazio
- Ícone van cinza + texto `Nenhuma van encontrada para essa região`
- Botão ghost `Ampliar busca`

---

## Link WhatsApp (CTA dinâmico)

```typescript
const whatsappLink = (motorista: MotoristaPublico, escola: string, bairro: string) => {
  const texto = encodeURIComponent(
    `Olá ${motorista.nome}! Vi seu perfil no Tio da Van e gostaria de conversar sobre uma vaga para o meu filho na ${escola} (bairro: ${bairro}). Podemos conversar?`
  )
  return `https://wa.me/55${motorista.whatsapp.replace(/\D/g, '')}?text=${texto}`
}
```

---

## Contrato de Dados (Mock para fase inicial)

```typescript
// src/lib/mocks/landing.ts
export interface MotoristaPublico {
  id: string
  nome: string
  foto_perfil_url: string       // ui-avatars fallback
  foto_van_url: string          // picsum fallback
  avaliacao: number
  total_avaliacoes: number
  escolas_atendidas: string[]
  bairros: string[]
  horario_manha?: string        // '06:30'
  horario_tarde?: string        // '17:00'
  capacidade_total: number
  vagas_disponiveis: number
  valor_mensalidade: number
  whatsapp: string
}
```

---

## Hooks / Server Actions

| Recurso | Arquivo | Função |
|---------|---------|--------|
| `buscarMotoristasPublicos` | `src/lib/actions/marketplace.ts` | Query Supabase: JOIN motoristas_perfil + rotas + veiculos com filtro por escola/bairro |
| `mockMotoristasPublicos` | `src/lib/mocks/landing.ts` | Dados tipados para fase inicial (sem DB real) |
