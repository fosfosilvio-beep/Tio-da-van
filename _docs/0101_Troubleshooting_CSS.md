# 🛠️ 0101 — Guia de Troubleshooting: CSS Quebrado / Layout Espremido

> **Quarteirão:** [01XX] Configurações e Infra  
> **Arquivo:** `0101_Troubleshooting_CSS.md`  
> **Criado em:** 2026-05-25  
> **Responsabilidade única:** Documentar incidentes de CSS quebrado e o passo a passo de diagnóstico e correção.

---

## 📋 Incidente Registrado — 2026-05-25

**Sintoma relatado pelo usuário:**
> "Ta tudo quebrado, tudo espremido e fora do lugar"  
> "O design da landing page tá péssimo e quebrado"

**Build Error gerado:**
```
./src/app/globals.css:2502:8
Parsing CSS source code failed
@import rules must precede all rules aside from @charset and @layer statements
```

---

## 🔍 Causa Raiz Identificada (3 problemas simultâneos)

### ❌ Problema 1 — CSS DUPLICADO (crítico)

**O que foi:** O arquivo `globals.css` acumulou edições sucessivas e ficou com **2.500+ linhas**, com o `@import url(...)` do Google Fonts aparecendo uma segunda vez no meio do arquivo (linha 2502), depois de regras como `@keyframes` e `.card`.

**Por que quebrou:** O PostCSS (engine do Tailwind v4) rejeita qualquer `@import` que aparece depois de outras regras CSS. Quando isso acontece, **todo o CSS para de ser carregado** — a página fica sem cores, sem padding, sem fontes.

**Como detectar:**
```bash
# Verificar o tamanho do arquivo — se passar de 300 linhas está suspeito
wc -l src/app/globals.css

# Procurar por @import duplicados
grep -n "@import" src/app/globals.css
```

**Correção:** Reescrever o `globals.css` do zero mantendo a ordem correta:
```css
/* ✅ ORDEM OBRIGATÓRIA no globals.css com Tailwind v4 */
@import url('https://fonts.googleapis.com/...');  /* 1º — sempre primeiro */
@import "tailwindcss";                             /* 2º */
@theme { ... }                                    /* 3º — tokens do Tailwind v4 */
:root { ... }                                     /* 4º — variáveis CSS legado */
/* 5º — demais regras (.card, .btn, etc.) */
```

---

### ❌ Problema 2 — CLASSES TAILWIND v4 NÃO GERADAS (layout espremido)

**O que foi:** O `page.tsx` usava classes de cor custom do Tailwind v4 como `bg-primary-container`, `text-on-surface-variant`, `px-gutter` que dependem do pipeline de compilação CSS.

**Por que quebrou:** Quando o Problema 1 ocorria (ParseError), o Tailwind simplesmente não gerava nenhuma classe utilitária. Além disso, o token `--spacing-gutter: 12px` era muito pequeno, causando o visual "espremido".

**Correção adotada:** Para páginas públicas (landing page), usar **inline `style={{}}`** com valores hex diretamente — independente do compilador:
```tsx
// ❌ Frágil — depende do Tailwind compilar corretamente
<section className="bg-primary-container px-container-margin">

// ✅ Robusto — funciona sempre
<section style={{ backgroundColor: '#2d4b73', padding: '64px 24px' }}>
```

> **Regra de ouro:** Componentes do dashboard (pós-login) podem usar classes Tailwind v4. Páginas públicas (landing, login, cadastro) devem preferir inline styles ou classes Tailwind padrão (sem tokens custom).

---

### ⚠️ Problema 3 — HYDRATION MISMATCH (extensão de navegador)

**O que foi:** React reportava `A tree hydrated but some attributes didn't match`, com atributos `rtrvr-ls` e `rtrvr-ro` nas tags `<a>`.

**Por que aconteceu:** Uma extensão do Chrome (Reverso Translator ou similar) injeta atributos extras no DOM após o servidor renderizar. O React detecta a diferença entre HTML do servidor e DOM modificado pela extensão.

**Como detectar:** No erro do console, procure por atributos como `rtrvr-*`, `bis_*`, `data-extension-*` — são sempre extensões de browser, não bugs do código.

**Correção:** Adicionar `suppressHydrationWarning` nas tags `<a>` que ficam no DOM público (navbar, footer):
```tsx
<a href="#" suppressHydrationWarning>Termos de Uso</a>
```

> **Importante:** Este erro **não quebra a aplicação** — é apenas um aviso de DEV. Pode ser ignorado em produção se o layout estiver correto visualmente.

---

## 🚑 Protocolo de Emergência — CSS Quebrado

Quando o CSS parar de funcionar (layout sem cores, sem espaçamento), siga **nesta ordem:**

### Passo 1 — Verificar o globals.css
```bash
# Contar linhas — acima de 300 é sinal de problema
Get-Content src/app/globals.css | Measure-Object -Line

# Listar todas as ocorrências de @import
Select-String "@import" src/app/globals.css
```

### Passo 2 — Limpar o cache do Next.js
```bash
# PowerShell
Remove-Item -Recurse -Force .next
npm run dev
```

### Passo 3 — Se persistir, reescrever o globals.css
Copiar o template limpo abaixo e substituir o arquivo inteiro:

```css
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
@import "tailwindcss";

@theme {
  /* ... tokens ... */
}

:root {
  /* ... variáveis legado ... */
}
```

### Passo 4 — Verificar no browser
```bash
# Testar se o servidor responde (PowerShell)
curl.exe -s http://localhost:3000/ | Select-String "<!DOCTYPE"
```

---

## 🏗️ Arquitetura CSS do Projeto

```
src/app/globals.css
├── @import url(Google Fonts)      ← SEMPRE PRIMEIRA LINHA
├── @import "tailwindcss"          ← SEGUNDA
├── @theme { ... }                 ← Tokens Tailwind v4
│   ├── --color-primary: #13345b
│   ├── --color-secondary-container: #fdba5f
│   └── --spacing-gutter: 24px
├── :root { ... }                  ← Tokens CSS legado (para componentes do dashboard)
│   ├── --color-primary: #2d4b73
│   └── --shadow-card: ...
└── Regras globais (.card, .btn, tabelas, animações)
```

### Regras de Uso por Contexto

| Contexto | Abordagem recomendada |
|----------|----------------------|
| Landing Page (`/`) | Inline `style={{}}` com hex direto |
| Login / Cadastro público | Inline `style={{}}` ou Tailwind padrão |
| Dashboard (pós-login) | Classes Tailwind v4 via `@theme` |
| Componentes UI reutilizáveis | Classes `.btn`, `.card` do globals.css |

---

## 📝 Histórico de Incidentes

| Data | Problema | Causa | Resolvido |
|------|----------|-------|-----------|
| 2026-05-25 | Layout quebrado, CSS sem carregar | `globals.css` duplicado (2500+ linhas) + `@import` fora de ordem | ✅ Reescrita completa |
| 2026-05-25 | Layout espremido | `--spacing-gutter: 12px` muito pequeno | ✅ Migrado para inline styles (24px) |
| 2026-05-25 | Hydration mismatch no footer | Extensão Chrome (Reverso) injetando atributos | ✅ `suppressHydrationWarning` |

---

> [!CAUTION]
> **NUNCA** edite o `globals.css` múltiplas vezes sem verificar se o arquivo ficou duplicado. Após qualquer edição substancial, rode `Get-Content globals.css | Measure-Object -Line` para confirmar o tamanho do arquivo.

> [!TIP]
> Se o layout quebrar misteriosamente sem erro de código, a primeira suspeita é sempre o **cache do `.next`**. Delete a pasta e reinicie o servidor antes de investigar o código.
