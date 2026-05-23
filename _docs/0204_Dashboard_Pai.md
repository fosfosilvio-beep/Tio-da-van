# Documentação de Tela: Dashboard do Responsável (Pai/Mãe)

**Caminho da Rota:** `/dashboard/pai/page.tsx`
**Tipo de Rota:** Privada (Protegida pelo `proxy.ts`)

## 1. Responsabilidade
Servir como o painel central para o responsável do aluno. Nesta interface (Mobile-First), o pai poderá visualizar o status das faturas, o acompanhamento em tempo real da van e emitir avisos de falta.

## 2. Componentes (Fase Inicial)
- **Cabeçalho Base:** Exibe as boas-vindas utilizando o nome do usuário oriundo da tabela `perfis`.
- **LogoutButton:** Componente cliente injetado para acionar a Server Action `logOut()` e destruir a sessão SSR de forma segura.

## 3. Segurança e RLS
Nenhum dado é injetado nesta view sem a passagem pelo filtro do Row Level Security. O `proxy.ts` garante que administradores ou motoristas não entrem nesta rota.
