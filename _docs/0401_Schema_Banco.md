# Schema de Banco de Dados: Tio da Van

Este documento define a infraestrutura e a modelagem consolidada do banco de dados relacional PostgreSQL gerido pela plataforma Supabase. O schema foi otimizado para suportar o modelo de transporte de Arapongas com integrações do Asaas.

## 1. Entidades de Base (ENUMs)

- `tipo_usuario`: 'admin', 'motorista', 'responsavel'
- `status_boleto`: 'pendente', 'pago', 'vencido'
- `status_motorista`: 'analise', 'ativo', 'bloqueado'

---

## 2. Tabelas Core

### 2.1. `perfis`
Extensão direta da tabela de autenticação `auth.users`. Populada via trigger.
- **id** (UUID): PK, FK para `auth.users(id)`
- **nome_completo** (TEXT): Opcional
- **telefone** (TEXT): Opcional
- **tipo** (tipo_usuario): DEFAULT 'responsavel'

### 2.2. `motoristas_perfil`
Entidade estendida para condutores, contendo regras logísticas.
- **id** (UUID): PK, FK para `perfis(id)` (Acesso estrito)
- **placa_veiculo** (TEXT)
- **capacidade_maxima** (INT): DEFAULT 15
- **bairros_atendidos** (TEXT[]): Ex: `{'Centro', 'Jardim Primavera'}`
- **escolas_atendidas** (TEXT[]): Ex: `{'Colégio Prisma'}`
- **status_cadastro** (status_motorista): DEFAULT 'analise'
- **asaas_wallet_id** (TEXT): Chave de recebimento do split.

### 2.3. `alunos`
O elo logístico e humano (M-N).
- **id** (UUID): PK
- **nome_aluno** (TEXT)
- **escola_destino** (TEXT)
- **periodo_letivo** (TEXT): Matutino, Vespertino, Noturno
- **id_responsavel** (UUID): FK -> `perfis(id)`
- **id_motorista** (UUID): FK -> `motoristas_perfil(id)`
- **notificar_ausencia_hoje** (BOOLEAN): DEFAULT false (Pais acionam isso no app)
- **embarcado_hoje** (BOOLEAN): DEFAULT false (Motorista aciona no check-in)

### 2.4. `cobrancas`
O Ledger financeiro automatizado atrelado aos webhooks do Asaas.
- **id** (UUID): PK
- **id_aluno** (UUID): FK -> `alunos(id)`
- **valor_mensalidade** (NUMERIC)
- **data_vencimento** (DATE)
- **status_pagamento** (status_boleto): DEFAULT 'pendente'
- **asaas_id_cobranca** (TEXT)
- **pix_copia_cola** (TEXT)
- **pago_em** (TIMESTAMPTZ)

---

## 3. Row Level Security (RLS) Consolidadas

Para blindagem do backend contra APIs falsificadas, as seguintes lógicas foram travadas:

- **Alunos**: 
  - Pais inserem e veem apenas seus filhos (`id_responsavel = auth.uid()`).
  - Motoristas veem apenas alunos vinculados (`id_motorista = auth.uid()`).
  - Motoristas só podem atualizar a própria fila, e exclusivamente os estados de embarque.
- **Cobranças**:
  - Pais só leem faturas onde o aluno atrelado pertença ao `id_responsavel = auth.uid()`.
  - Motoristas leem faturas a receber dos alunos atrelados ao `id_motorista = auth.uid()`.
