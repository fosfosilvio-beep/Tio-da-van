# Schema de Banco de Dados e RBAC (Supabase)

Este documento documenta o esquema relacional, políticas de segurança e regras de negócio do banco de dados PostgreSQL (Supabase) utilizado no **Tio da Van**.

---

## 1. Tipos Customizados (ENUMs)

- `tipo_usuario`: Define o nível hierárquico e acesso da conta (`admin`, `motorista`, `responsavel`).
- `status_cobranca`: Estado da liquidação financeira (`pendente`, `pago`, `vencido`, `cancelado`).

---

## 2. Entidades Principais

### `perfis`
Tabela primária de usuários estendida do `auth.users`. 
- **População Automática**: Preenchida via trigger `handle_new_user()` após registro no Supabase Auth.
- **Campos Importantes**:
  - `id` (UUID - Chave Estrangeira de `auth.users`)
  - `nome_completo` (Mapeado dos metadados do Auth)
  - `tipo` (tipo_usuario - Determina a Rota de Destino)

### `motoristas_perfil`
Metadados estendidos para usuários do tipo `motorista`.
- **Busca Cruzada**: Usa `bairros_atendidos` (TEXT[]) e `escolas_atendidas` (TEXT[]) para match relacional no Supabase via operador `@>`.
- **Campos Importantes**:
  - `id_perfil` (UUID - Unique)
  - `capacidade` (INT)
  - `asaas_wallet_id` (Chave de subconta para o Split)

### `alunos`
Entidade de amarração N:M conectando a Mãe/Pai (Responsável) ao Motorista.
- **Flags Diárias (Tempo Real)**:
  - `notificar_ausencia_hoje` (Pai avisa que o aluno não vai)
  - `embarcado_hoje` (Motorista confirma que o aluno entrou na van)

### `cobrancas`
O Ledger financeiro do sistema, sincronizado via webhook com o Asaas.
- **Campos Importantes**:
  - `valor_split_admin` (A comissão de 5% da plataforma)
  - `valor_split_motorista` (O payout líquido de 95%)
  - `pix_copia_cola` (Token de pagamento para o cliente)

---

## 3. Matriz de Segurança (Row Level Security - RLS)

O princípio de **Mínimo Privilégio** foi aplicado utilizando políticas RLS para garantir a modularidade e segurança de ponta a ponta:

| Tabela | Responsável (Pai) | Motorista | Admin |
| --- | --- | --- | --- |
| **perfis** | UPDATE/SELECT no próprio id | UPDATE/SELECT no próprio id | ALL |
| **motoristas_perfil** | SELECT (Busca de Vans) | UPDATE/SELECT no próprio perfil | ALL |
| **alunos** | SELECT/INSERT filhos próprios | SELECT filhos na sua rota | ALL |
| **cobrancas** | SELECT faturas próprias | SELECT faturas emitidas | ALL |

---

## 4. Integração Auth e Triggers

Sempre que um usuário é criado usando `supabase.auth.signUp()`, a trigger `on_auth_user_created` captura o `id` e insere em `perfis`, permitindo transações limpas do banco e do Middleware sem duplicação de responsabilidades.
