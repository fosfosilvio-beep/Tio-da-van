# Documentação de Tela: Dashboard do Motorista

**Caminho da Rota:** `/dashboard/motorista/page.tsx`
**Tipo de Rota:** Privada (Protegida pelo `proxy.ts`)

## 1. Responsabilidade
Painel operacional de trabalho do motorista da van. Usado primariamente em dispositivos móveis acoplados ao painel do veículo para conferência da lista de passageiros, confirmação de embarque diário e roteamento.

## 2. Componentes (Fase Inicial)
- **Cabeçalho Base:** Exibe as boas-vindas utilizando o nome do usuário oriundo da tabela `perfis`.
- **LogoutButton:** Componente cliente injetado para acionar a Server Action `logOut()` e destruir a sessão SSR de forma segura.

## 3. Segurança e RLS
Somente usuários cujo `tipo` no perfil for `motorista` conseguirão furar o bloqueio do `proxy.ts` para renderizar essa página.
