# 👨‍👩‍👧‍👦 Painel do Responsável

**Route Group:** `src/app/(responsavel)`

## Propósito
Área restrita aos pais/responsáveis para acompanhamento de pagamentos, status de check-in dos filhos e informações de contrato.

## Layout
**Arquivo:** `src/app/(responsavel)/layout.tsx`
**Componentes Principais:**
- Layout simplificado sem o Sidebar complexo do motorista.
- Header ou Navigation Bar específica para pais.

## Rotas Mapeadas
- `/meu-painel` (Painel Central do Pai)

## Acesso e RBAC
- Protegido pelo `proxy.ts`.
- **Regra:** Apenas usuários com `tipo === 'responsavel'` podem acessar. Motoristas ou admins tentando acessar de forma indevida são redirecionados.

## Mocks & Hooks Relacionados
- `useAuth`
- (Futuro: `useFilhos`, `useFaturas`)
