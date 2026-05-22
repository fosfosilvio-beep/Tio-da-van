# Módulos Financeiros (APIs e Webhooks)

## Propósito
Descrever os endpoints da API financeira construídos para automatizar faturas, gerenciar splits e processar webhooks do Mercado Pago.

---

## 1. Webhook Mercado Pago (`POST /api/webhooks/mercadopago`)
- **Arquivo**: `app/api/webhooks/mercadopago/route.ts`
- **Funcionalidade**: Receber as notificações de novos pagamentos Pix confirmados do Mercado Pago e atualizar o banco de dados.
- **Formato do Request**:
  - Aceita tanto o payload oficial de notificações (`{ "action": "payment.updated", "data": { "id": "payment_id" } }`) quanto chamadas diretas de simulação do painel (`{ "payment_id": "id", "status": "approved" }`).
- **Ações no Banco**:
  1. Localiza a cobrança pelo `mercadopago_payment_id`.
  2. Altera o status para `pago`.
  3. Define o timestamp de `pago_em`.
  4. Executa conciliação financeira do split (95% Motorista / 5% Plataforma).
- **Log**: Grava logs de conciliação diretamente em `logs/execucao_YYYY-MM-DD.log`.

---

## 2. Cron Preventivo de Cobranças (`POST /api/cobrancas/cron`)
- **Arquivo**: `app/api/cobrancas/cron/route.ts`
- **Funcionalidade**: Simular a rotina preventiva de faturamento que roda em segundo plano.
- **Ações no Banco**:
  1. Varre todos os alunos que possuem `status_vinculo = 'ativo'`.
  2. Verifica se o aluno já possui cobrança para o mês de referência (ex: `"2026-06"`).
  3. Caso não possua, cria uma nova cobrança com vencimento preventivo em D+3.
  4. Calcula o valor total (`R$ 450,00`), repasse do motorista (`R$ 427,50` - 95%) e comissão da plataforma (`R$ 22,50` - 5%).
  5. Gera IDs falsos simulando chaves de pagamento do Mercado Pago e chave Pix Copia e Cola.
- **Log**: Registra cada fatura gerada com sucesso em `logs/execucao_YYYY-MM-DD.log`.

---

## 3. Políticas de RLS Habilitadas
Para permitir a comunicação contínua e autônoma entre os Webhooks/Cron e o Supabase, as seguintes políticas permissivas de acesso foram estabelecidas nas tabelas do banco de dados:

```sql
-- Políticas para leitura/escrita aberta
CREATE POLICY "Allow public read" ON usuarios FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON usuarios FOR ALL USING (true);

CREATE POLICY "Allow public read" ON motoristas FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON motoristas FOR ALL USING (true);

CREATE POLICY "Allow public read" ON alunos FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON alunos FOR ALL USING (true);

CREATE POLICY "Allow public read" ON cobrancas FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON cobrancas FOR ALL USING (true);

CREATE POLICY "Allow public read" ON posicao_motorista FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON posicao_motorista FOR ALL USING (true);
```
