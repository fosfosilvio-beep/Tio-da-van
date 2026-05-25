# 🚐 Cadastro de Van / Frota

> **Quarteirão:** [02XX] Telas e UI
> **Arquivo:** `0207_CadastroVanFrota.md`
> **Criado em:** 2026-05-25
> **Responsabilidade única:** Formulário de cadastro de veículo/frota pelo motorista após completar o KYC.

---

## Rota

| Aba | Rota | Stitch Screen ID |
|-----|------|------------------|
| **Aba 1:** Dados do Veículo | `/dashboard/frota/nova?tab=dados` | `dc2fc73290904a89822d1eedc2bf407e` |
| **Aba 2:** Fotos do Veículo | `/dashboard/frota/nova?tab=fotos` | `1f722a052caf41cb89a803cc07cd373a` |
| **Aba 3:** Documentos (CRLV, laudo, seguro) | `/dashboard/frota/nova?tab=documentos` | `a84d2c2ed81b4af4a57c8424d775c34c` |
| **Aba 4 — FINAL:** Rotas e Horários | `/dashboard/frota/nova?tab=rotas` | `f179687a40374a2a8d42df9e2cd24b8f` |

> **NOTA DE DESIGN:** Rotas e Horários foi movido para a última aba pois demanda mais tempo (configuração de bairros, escolas, horários e dias). O motorista resolve as partes burocráticas primeiro e fecha com a parte operacional.

**Rota Next.js:** `src/app/(motorista)/dashboard/frota/nova/page.tsx`
**Acesso:** Autenticado (motorista com `status_onboarding === true`)
**Projeto Stitch:** `6828261981780852293`

---

## Gatilho de Acesso

O motorista chega aqui clicando no card CTA **"➕ Adicionar Van ou Frota"** que aparece no dashboard após o KYC estar completo.

```
Dashboard (KYC completo) → Card "Adicionar Van" → /dashboard/frota/nova
```

---

## Design System

**Elite Logistics System** — Sidebar azul `#2d4b73`, fundo `#f8f9fb`, Manrope, cards brancos 8px radius.

---

## Estrutura do Formulário (4 Abas/Tabs)

### Aba 1: Dados do Veículo
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| Placa | text (mask ABC-1234) | ✅ |
| Modelo/Marca | text (ex: Mercedes Sprinter 2020) | ✅ |
| Ano de fabricação | number | ✅ |
| Cor | text | ✅ |
| Número de passageiros | number (max 30) | ✅ |
| Tipo de veículo | select: Van / Kombi / Micro-ônibus / Ônibus | ✅ |
| Valor mensalidade por aluno | currency (R$) | ✅ |
| Turno de operação | checkboxes: Manhã / Tarde / Integral / Noturno | ✅ (min 1) |
| Descrição/Observações | textarea (4 linhas) | ❌ |

### Aba 2: Fotos do Veículo (mín. 3)
| Upload | Obrigatório |
|--------|-------------|
| Frente do Veículo | ✅ |
| Lateral Direita | ✅ |
| Interior do Veículo | ✅ |
| Traseira do Veículo | ❌ |

Destino: `storage/veiculos/{veiculo_id}/fotos/`

### Aba 3: Rotas e Horários
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| Bairros atendidos | tag input (chips) | ✅ |
| Escolas atendidas | tag input (chips) | ✅ |
| Horário coleta manhã | time | ❌ |
| Horário retorno tarde | time | ❌ |
| Dias da semana | checkboxes (Seg-Sab) | ✅ |

### Aba 4: Documentos
| Upload | Obrigatório |
|--------|-------------|
| CRLV (documento do veículo) | ✅ |
| Laudo de vistoria | ❌ |
| Seguro do veículo | ❌ |

Destino: `storage/veiculos/{veiculo_id}/documentos/`

---

## Botões de Ação

| Botão | Ação |
|-------|------|
| `Salvar Rascunho` (ghost) | Salva sem publicar (`status_publicado: false`) |
| `Cancelar` (link) | Volta para `/dashboard` |
| `Publicar Veículo →` (âmbar, CTA) | Publica o veículo no marketplace |

---

## Contrato de Dados (Nova Tabela `veiculos`)

```typescript
interface Veiculo {
  id: string                   // uuid
  motorista_id: string         // FK → perfis.id
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
  horario_manha?: string        // '06:30'
  horario_tarde?: string        // '17:00'
  dias_semana: ('seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab')[]
  fotos_urls: string[]          // Storage URLs
  url_crlv?: string
  url_laudo?: string
  url_seguro?: string
  status_publicado: boolean
  status_verificado: boolean    // Admin verifica em até 24h
  created_at: string
  updated_at: string
}
```

---

## Server Actions

| Action | Arquivo | Função |
|--------|---------|--------|
| `criarVeiculo` | `src/lib/actions/veiculos.ts` | INSERT na tabela `veiculos` |
| `uploadFotoVeiculo` | `src/lib/actions/storage.ts` | Upload para Supabase Storage |
| `uploadDocumentoVeiculo` | `src/lib/actions/storage.ts` | Upload de CRLV/laudo/seguro |
| `publicarVeiculo` | `src/lib/actions/veiculos.ts` | Define `status_publicado: true` |

---

## Nota de RLS

- A tabela `veiculos` deve ter RLS: motorista só pode INSERT/UPDATE/DELETE nos seus próprios veículos (`motorista_id = auth.uid()`).
- `SELECT` público: qualquer um pode ver veículos com `status_publicado = true AND status_verificado = true`.
