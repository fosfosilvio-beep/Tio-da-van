# 📋 Dashboard com Onboarding & KYC do Motorista

> **Quarteirão:** [02XX] Telas e UI
> **Arquivo:** `0206_OnboardingMotorista.md`
> **Criado em:** 2026-05-25
> **Responsabilidade única:** Fluxo completo de primeiro acesso do motorista — popup de boas-vindas, cadastro KYC e dashboard pós-cadastro.

---

## Rotas

| Tela | Rota | Stitch Screen ID | Acesso |
|------|------|-----------------|--------|
| Dashboard 1ª visita (popup) | `/dashboard` | `8a43eab7679043ce8117849fcc0b245e` | Autenticado (motorista) |
| **KYC — Etapa 1:** Dados Pessoais | `/dashboard/cadastro?step=1` | `86463eddc24c4f6ab59b7ff4ea0df665` | Autenticado |
| **KYC — Etapa 2:** Documentos (RG, CNH, Selfie) | `/dashboard/cadastro?step=2` | `39732334817046c1a63287608df09595` | Autenticado |
| **KYC — Etapa 3 (FINAL):** Pagamento (Pix) | `/dashboard/cadastro?step=3` | `3ce8c409cbf04b649bdd1d273d929a93` | Autenticado |

---

## Design System Aplicado

**Elite Logistics System** (`assets/b55db86a182d4318a841786d3b445c2c`)
- Sidebar: `#2d4b73` (Deep Blue)
- CTAs: `#ffb74d` (Âmbar)
- Warning card: `#fffbf0` (âmbar claro) com borda âmbar esquerda 4px
- Fundo de página: `#f8f9fb`

---

## Fluxo de Onboarding

```
Google Auth → /dashboard (1ª visita)
    ↓
[Popup Onboarding aparece]
    ├── Usuário clica X → popup fecha → Card de aviso persiste no dashboard
    └── Usuário clica "Começar Meu Cadastro" → /dashboard/cadastro
            ↓
        [Formulário KYC - 3 etapas]
            ├── Etapa 1: Dados Pessoais e Profissionais (nome, CPF, RG, endereço, WhatsApp, redes sociais)
            ├── Etapa 2: Documentos (CNH frente/verso, selfie com RG, foto RG frente/verso)
            └── Etapa 3 — FINAL: Pagamento (Chave Pix, banco, simulação de ganhos, termos)
                        ↓
                [Concluir Cadastro]
                        ↓
            Dashboard Normal (card de aviso DESAPARECE)
            + Card CTA "➕ Adicionar Van ou Frota" → /dashboard/frota/nova
```

> **NOTA DE DESIGN:** A etapa de Foto do Veículo foi removida do KYC. As fotos da van ficam exclusivamente no fluxo de Cadastro de Van/Frota (`/dashboard/frota/nova`), evitando duplicidade.

---

## Popup de Onboarding (1ª Visita)

| Elemento | Descrição |
|----------|-----------|
| Gatilho | `perfis.status_onboarding === false` (1ª visita) |
| Fechamento | Botão X e link "Fechar e fazer depois" |
| Progresso | Barra âmbar: `0 de 4 etapas concluídas` |
| CTA | "Começar Meu Cadastro →" (âmbar, full-width) |

**Etapas do popup:**
1. ⬜ Dados Pessoais e Profissionais
2. ⬜ Documentos (RG, CPF, CNH)
3. ⬜ Foto do Veículo
4. ⬜ Configuração de Pagamento (Pix)

---

## Card de Aviso Persistente

Aparece no dashboard quando `status_onboarding === false`:
- Fundo âmbar claro `#fffbf0`, borda âmbar esquerda 4px
- Ícone ⚠️ + texto: *"Cadastro incompleto — Complete seu perfil para aparecer nas buscas das famílias."*
- Botão âmbar: "Completar Agora"
- Desaparece quando `status_onboarding === true`

---

## Formulário KYC — Campos

### Dados Pessoais
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| Nome completo | text | ✅ |
| CPF | text (mask) | ✅ |
| RG | text | ✅ |
| CNPJ | text (opcional) | ❌ |
| Data de nascimento | date | ✅ |
| WhatsApp | tel (+55 prefix) | ✅ |
| E-mail | email | ✅ |
| Endereço completo | text | ✅ |
| Bairro | text | ✅ |
| Cidade | text | ✅ |
| CEP | text (mask) | ✅ |
| Instagram | text (opcional) | ❌ |
| Facebook | text (opcional) | ❌ |

### Uploads de Documentos
| Upload | Destino Supabase Storage |
|--------|--------------------------|
| Foto de perfil | `storage/motoristas/perfil/{id}` |
| Selfie de verificação | `storage/motoristas/selfie/{id}` |
| CNH — Frente | `storage/motoristas/cnh-frente/{id}` |
| CNH — Verso | `storage/motoristas/cnh-verso/{id}` |

### Configuração de Pagamento
| Campo | Tipo |
|-------|------|
| Tipo de Chave Pix | select (CPF/CNPJ/E-mail/Telefone) |
| Chave Pix | text |
| Banco | text |
| Agência | text |
| Conta | text |

---

## Contrato de Dados (Tabela `motoristas_perfil`)

```typescript
interface MotoristaPerfil {
  id: string                    // FK → perfis.id
  cpf: string
  rg: string
  cnpj?: string
  data_nascimento: string       // ISO date
  whatsapp: string
  endereco: string
  bairro: string
  cidade: string
  cep: string
  instagram?: string
  facebook?: string
  url_foto_perfil?: string      // Supabase Storage URL
  url_selfie?: string
  url_cnh_frente?: string
  url_cnh_verso?: string
  chave_pix?: string
  tipo_chave_pix?: 'cpf' | 'cnpj' | 'email' | 'telefone'
  banco?: string
  dados_bancarios_asaas?: Record<string, unknown>  // jsonb
  frota_id?: string             // FK → frotas.id (se for funcionário)
  status_onboarding: boolean    // false = incompleto, true = completo
  created_at: string
}
```

---

## Hooks / Dependências

| Hook/Action | Arquivo | Função |
|-------------|---------|--------|
| `useOnboarding` | `src/hooks/useOnboarding.ts` | Verifica `status_onboarding` e controla popup |
| `salvarPerfilMotorista` | `src/lib/actions/motoristas.ts` | Server Action — salva KYC no Supabase |
| `uploadDocumento` | `src/lib/actions/storage.ts` | Server Action — upload para Supabase Storage |
