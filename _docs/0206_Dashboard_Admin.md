# Documentação de Tela: Console de Administração

**Caminho da Rota:** `/admin/page.tsx`
**Tipo de Rota:** Privada (Protegida pelo `proxy.ts`)

## 1. Responsabilidade
Visão analítica mestre (Desktop-First) para o gestor geral da plataforma. Exibe os balanços do mês, aprovação de novos motoristas e repasse dos Splits do Asaas.

## 2. Componentes (Fase Inicial)
- **Cabeçalho Base:** Console de Administração Geral (Arapongas).
- **LogoutButton:** Componente cliente injetado para acionar a Server Action `logOut()` e destruir a sessão SSR de forma segura.

## 3. Segurança e RLS
Somente usuários cujo `tipo` no perfil for `admin` conseguirão acessar. O `proxy.ts` rejeita categoricamente qualquer outro perfil e os direciona de volta a suas devidas Viewports.
