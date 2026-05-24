# 🚐 Painel do Motorista

**Route Group:** `src/app/(motorista)`

## Propósito
Fornecer todas as ferramentas necessárias para o motorista gerenciar seu dia a dia (alunos, embarque/desembarque, financeiro, rotas).

## Layout
**Arquivo:** `src/app/(motorista)/layout.tsx`
**Componentes Principais:**
- `Sidebar.tsx` (Menu lateral completo)
- `Header.tsx` (Barra superior)
- Conteúdo principal (`children`)

## Acesso e RBAC
- Protegido pelo `proxy.ts`.
- **Regra:** Apenas usuários com `tipo === 'motorista'` podem acessar as rotas filhas.
- Outros perfis serão redirecionados ou bloqueados.

## Mocks & Hooks Relacionados
- (Pendente mapear mocks)
- `useAuth` (para dados da sessão)
