# Portal Geral do Tio da Van (Home Portal)

## Propósito
O Portal Geral (`/`) funciona como um painel central de lançamento (Launchpad) de altíssima fidelidade. Ele substitui a antiga lista estática de tarefas para fornecer uma porta de entrada premium para todos os módulos administrativos e financeiros implementados.

---

## Estrutura do Portal

O portal renderiza cartões interativos projetados no sistema de design **WowDash** (glassmorphism, gradientes e micro-animações) integrados com Next.js `Link`:

1. **Painel de Controle Master (Admin)** (`/dashboard`): Acesso direto ao painel consolidador com KPIs, gráfico de receitas composto e status de frotas.
2. **Gestão de Motoristas** (`/dashboard/motoristas`): Consulta em tempo real de motoristas cadastrados, CNH, lotação da van e bairros/escolas atendidos.
3. **Cobranças Preventivas & Pix** (`/dashboard/cobrancas`): Módulo de faturamento antecipado com triggers de simulação de Pix e webhooks.
4. **Faturamento & Splits Comerciais** (`/dashboard/faturamento`): Visão analítica de repasses automáticos com cálculo de comissões (95% / 5%).

---

## Telemetria do Banco de Dados

O componente realiza uma chamada server-side em tempo real para verificar a conectividade com o banco de dados do **Supabase**:
- **Status Ativo (Live)**: Pulsador verde indica conexão perfeita com o endpoint PostgreSQL real.
- **Status Offline/Mock**: Pulsador vermelho indica que o banco de dados está inacessível, caindo de forma graciosa para simulações seguras.

---

## Contrato de Dados (Server Component)

- **Engine de Conectividade**:
  ```ts
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.from("usuarios").select("count", { count: "exact", head: true });
  ```
- **Roteamento**: `/` (página inicial)
- **Design Token**: Utiliza as variáveis CSS globais (`--primary`, `--secondary`, `--success`, `--danger`) do Dark Space Theme da aplicação.
