# Esquema de Banco de Dados (Supabase / PostgreSQL)

## Propósito
Definir a estrutura das tabelas do **Tio da Van** no Supabase, contendo perfis, motoristas, alunos e controle financeiro de mensalidades.

---

## Estrutura Criada (Fase 4 - Nova Modelagem de Perfis)

### 1. Tipos Customizados (Enums)
* **`tipo_usuario`**: `'admin'`, `'motorista'`, `'responsavel'`
* **`status_boleto`**: `'pendente'`, `'pago'`, `'vencido'`
* **`status_motorista`**: `'pendente'`, `'aprovado'`, `'suspenso'`

---

### 2. Tabela `perfis`
Tabela vinculada ao cadastro de autenticação central (`auth.users`).

| Coluna | Tipo | Restrições | Descrição |
| --- | --- | --- | --- |
| `id` | `uuid` | PK, REFERENCES `auth.users` | Chave primária vinculada ao Auth |
| `nome` | `text` | NOT NULL | Nome completo do usuário |
| `telefone` | `text` | — | WhatsApp / Telefone de contato |
| `tipo` | `tipo_usuario` | NOT NULL, DEFAULT `'responsavel'` | Tipo de perfil do usuário |
| `criado_em` | `timestamptz` | DEFAULT `now()` | Data de criação do perfil |

---

### 3. Tabela `motoristas_perfil`
Extensão de `perfis` contendo os dados específicos do transportador e do veículo.

| Coluna | Tipo | Restrições | Descrição |
| --- | --- | --- | --- |
| `id` | `uuid` | PK, REFERENCES `perfis(id)` ON DELETE CASCADE | ID do perfil correspondente |
| `documento_van` | `text` | — | Documento ou placa da van escolar |
| `capacidade_maxima` | `int` | DEFAULT `15` | Lotação máxima permitida |
| `bairros_atendidos` | `text[]` | — | Vetor contendo a lista de bairros atendidos |
| `escolas_atendidas` | `text[]` | — | Vetor contendo a lista de escolas atendidas |
| `status_cadastro` | `status_motorista` | NOT NULL, DEFAULT `'pendente'` | Status de moderação do motorista |
| `asaas_wallet_id` | `text` | — | Chave de carteira Asaas para split de pagamentos |
| `criado_em` | `timestamptz` | DEFAULT `now()` | Data de criação |

---

### 4. Tabela `alunos`
Estudantes cadastrados pelos responsáveis e vinculados a um motorista.

| Coluna | Tipo | Restrições | Descrição |
| --- | --- | --- | --- |
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | Chave primária do aluno |
| `nome_aluno` | `text` | NOT NULL | Nome completo do aluno |
| `escola` | `text` | NOT NULL | Escola onde estuda |
| `periodo` | `text` | — | Turno escolar (Matutino, Vespertino, Noturno) |
| `id_responsavel` | `uuid` | FK → `perfis(id)` ON DELETE RESTRICT | Responsável do aluno |
| `id_motorista` | `uuid` | FK → `motoristas_perfil(id)` ON DELETE SET NULL | Motorista que realiza o transporte |
| `ativo` | `boolean` | DEFAULT `true` | Situação de transporte ativo |
| `criado_em` | `timestamptz` | DEFAULT `now()` | Data de vinculação |

---

### 5. Tabela `cobrancas`
Faturas Pix automatizadas integradas ao Asaas.

| Coluna | Tipo | Restrições | Descrição |
| --- | --- | --- | --- |
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | Identificador único |
| `id_aluno` | `uuid` | FK → `alunos(id)` ON DELETE RESTRICT | Aluno correspondente à cobrança |
| `valor` | `numeric(10,2)` | NOT NULL | Valor mensal cobrado |
| `data_vencimento` | `date` | NOT NULL | Data limite para pagamento |
| `status` | `status_boleto` | NOT NULL, DEFAULT `'pendente'` | Estado do pagamento |
| `asaas_id_cobranca` | `text` | — | Identificador na API externa do Asaas |
| `pix_copia_cola` | `text` | — | Código Pix copia e cola gerado |
| `pago_em` | `timestamptz` | — | Data/Hora de conciliação |
| `criado_em` | `timestamptz` | DEFAULT `now()` | Data de emissão da cobrança |

---

## Segurança (Row Level Security)

A segurança baseada em linhas (RLS) foi habilitada em todas as novas tabelas:
```sql
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE motoristas_perfil ENABLE ROW LEVEL SECURITY;
ALTER TABLE alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cobrancas ENABLE ROW LEVEL SECURITY;
```
