# Tela Todos

## Propósito
Exibe a lista de itens "todos" provenientes da tabela `todos` no Supabase.

## Contrato de Dados
```ts
type Todo = {
  id: number;
  name: string;
};
```

## Componentes Utilizados
- **Page** – Server Component que usa `createClient` (server) para buscar os dados.
- **Lista** – Renderiza `<ul>` com `<li>` para cada `todo`.

## Mocks (para desenvolvimento sem backend)
Arquivo: `lib/mocks/todos.ts`
```ts
export const mockTodos: Partial<Todo>[] = [
  { id: 1, name: "Comprar leite" },
  { id: 2, name: "Estudar Next.js" },
];
```

## Hooks Relacionados
- `useSupabaseClients` – Documentado em `0301_useSupabaseClients.md`.

## Roteamento
- **URL**: `/` (página inicial)
- **Arquivo**: `page.tsx`
