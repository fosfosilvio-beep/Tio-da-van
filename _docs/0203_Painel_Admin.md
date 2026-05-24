# 🛡️ Painel Master (Admin)

**Route Group:** `src/app/(admin)`

## Propósito
Gerenciar motoristas, assinaturas do sistema, métricas globais e configurações de superusuário.

## Layout
**Arquivo:** `src/app/(admin)/layout.tsx`
**Componentes Principais:**
- Inicialmente um layout básico focado em informações administrativas.
- Pode evoluir para ter seu próprio Sidebar administrativo no futuro.

## Rotas Mapeadas
- `/admin` (Dashboard Master)

## Acesso e RBAC
- Protegido pelo `proxy.ts`.
- **Regra:** Apenas usuários com `tipo === 'admin'` podem acessar a raiz `/admin` e sub-rotas. Motoristas e responsáveis são estritamente proibidos de visualizar esta área.

## Mocks & Hooks Relacionados
- `useAuth`
