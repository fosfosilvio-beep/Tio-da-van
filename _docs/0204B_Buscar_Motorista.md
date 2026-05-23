# Documentação de Tela: Buscar Tio da Van

**Caminho da Rota:** `/dashboard/pai/buscar/page.tsx`
**Tipo de Rota:** Privada (Protegida pelo `proxy.ts`)

## 1. Responsabilidade
Fornecer ao Responsável (Pai/Mãe) uma interface limpa para procurar motoristas de van ativos que atendam sua região e escola desejada, além de permitir o cadastro e vinculação instantânea do seu filho ao Tio escolhido.

## 2. Componentes e Estrutura
- **Server Component (`page.tsx`)**: Responsável por ler os `searchParams` da URL e realizar a query de intersecção (`@>`) no Supabase, garantindo performance e segurança na busca.
- **SearchForm (`SearchForm.tsx`)**: Componente cliente contendo dois selects hardcoded para a versão MVP (Bairros e Escolas). Ao submeter, injeta os parâmetros na URL via `router.push()`.
- **DriverCard (`DriverCard.tsx`)**: Componente híbrido/cliente que exibe os dados do motorista e contém o formulário embutido (ou botão) para registrar o Aluno. Oculta ou exibe o formulário utilizando estado React local.

## 3. Lógica de Busca e Dados (Intersecção de Arrays)
O banco de dados utiliza colunas `TEXT[]` para `bairros_atendidos` e `escolas_atendidas`.
A consulta é construída Server-Side com as abstrações do Supabase JS:
```typescript
.contains('bairros_atendidos', [bairro])
.contains('escolas_atendidas', [escola])
```
Isso traduz para o operador nativo do PostgreSQL de forma segura contra Injections.

## 4. Ações de Servidor (Server Actions)
O arquivo `app/dashboard/pai/buscar/actions.ts` contém:
- `vincularAluno(formData: FormData)`: Extrai os dados submetidos pelo formulário de dentro do `DriverCard`.
- **Validação de Segurança**: Puxa o UUID logado via SSR (`auth.getUser()`) para definir o `id_responsavel` de forma inviolável.
- Cria a linha na tabela `alunos`.
- Redireciona o usuário para `/dashboard/pai` via `redirect()`.

## 5. Segurança e RLS
- Os resultados da busca excluem motoristas bloqueados ou em análise (`status_cadastro = 'ativo'`).
- A tabela `alunos` valida o INSERT através da política `Pais podem inserir seus próprios filhos`, que exige que o `id_responsavel` corresponda ao `auth.uid()`.
