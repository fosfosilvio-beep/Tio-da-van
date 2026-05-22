# Engenharia de Integração

## Propósito
Documentar os dois motores autônomos que fazem o **Tio da Van** funcionar sem intervenção manual: o motor financeiro (Mercado Pago) e o motor de rastreamento (WebSockets).

---

## 1. Motor Financeiro (Mercado Pago + Webhooks)

### Fluxo Completo do Ciclo de Pagamento

```mermaid
sequenceDiagram
    autonumber
    participant CRON as Edge Function (Cron)
    participant DB as Supabase DB
    participant MP as Mercado Pago API
    participant PAI as App do Pai
    participant MOT as App do Motorista

    CRON->>DB: Consulta mensalidades vencendo em 3 dias
    DB-->>CRON: Lista de cobranças pendentes
    CRON->>MP: POST /v1/payments (Split: 95% Motorista / 5% Plataforma)
    MP-->>CRON: Cobrança criada (Pix gerado)
    CRON->>DB: Grava cobrança com status "Pendente" + link Pix
    DB-->>PAI: Push notification: "Sua mensalidade vence em 3 dias"

    PAI->>MP: Paga via Pix Copia e Cola
    MP->>DB: Webhook POST /api/webhooks/mercadopago (status: "approved")
    DB->>DB: UPDATE cobrancas SET status = 'pago'
    DB-->>MOT: Push notification: "Fulano pagou a mensalidade"
```

### Detalhes Técnicos

| Item | Valor |
| --- | --- |
| **Endpoint de Webhook** | `POST /api/webhooks/mercadopago` (Route Handler Next.js ou Edge Function Supabase) |
| **Split de Pagamento** | 95% para o motorista / 5% para a plataforma |
| **Frequência do Cron** | Diário à meia-noite (00:00 UTC-3) |
| **Antecedência de Cobrança** | 3 dias antes do vencimento |
| **Métodos de Pagamento** | Pix (principal), Boleto (secundário) |

### Modelo de Dados Envolvido
- **Tabela `cobrancas`**: `id`, `motorista_id`, `pai_id`, `aluno_id`, `valor`, `valor_plataforma` (5%), `valor_motorista` (95%), `status` (pendente/pago/vencido/cancelado), `mercadopago_payment_id`, `pix_copia_cola`, `vencimento`, `pago_em`, `created_at`.

---

## 2. Motor de Rastreamento (Supabase Realtime / WebSockets)

### Fluxo Completo do Tracking GPS

```mermaid
sequenceDiagram
    autonumber
    participant MOT as App Motorista
    participant RT as Supabase Realtime
    participant DB as Supabase DB
    participant PAI as App Pai
    participant GMAP as Google Maps API

    MOT->>MOT: Clica "Iniciar Rota"
    loop A cada 5 segundos
        MOT->>DB: UPSERT posicao_motorista (lat, lng, timestamp)
        DB->>RT: Broadcast de posição via canal
    end
    PAI->>RT: Subscribe no canal do motorista
    RT-->>PAI: Recebe lat/lng em tempo real
    PAI->>GMAP: Solicita cálculo de ETA (origem → destino)
    GMAP-->>PAI: "Chega em 4 minutos"
    PAI->>PAI: Renderiza ícone da van se movendo no mapa
```

### Detalhes Técnicos

| Item | Valor |
| --- | --- |
| **Canal Realtime** | `posicao:motorista_{id}` |
| **Frequência de Envio** | A cada 5 segundos enquanto rota ativa |
| **Dados Transmitidos** | `{ lat, lng, heading, speed, timestamp }` |
| **Mapa** | Google Maps JavaScript API (Web) / React Native Maps (Mobile) |
| **ETA** | Google Maps Directions API |

### Modelo de Dados Envolvido
- **Tabela `posicao_motorista`**: `id`, `motorista_id`, `latitude`, `longitude`, `heading`, `speed`, `rota_ativa` (boolean), `updated_at`.

---

## 3. Notificações Push

| Evento | Destinatário | Mensagem Exemplo |
| --- | --- | --- |
| Cobrança criada | Pai | "Sua mensalidade de R$350 vence em 3 dias. Pague via Pix." |
| Pagamento confirmado | Motorista | "Fulano pagou a mensalidade de Maio." |
| Aluno ausente | Motorista | "João não irá hoje (turno manhã)." |
| Van partiu | Pai | "A van iniciou a rota. Acompanhe ao vivo." |
| Van chegando | Pai | "A van está a 2 min de distância." |
