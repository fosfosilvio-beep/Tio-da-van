# Documentação de Tela: Login Unificado

**Caminho da Rota:** `/` (`app/page.tsx`)
**Tipo de Rota:** Pública (com ejeção automática via Middleware caso a sessão exista)
**Componente Mestre:** `CleanSlatePage` (Substituído por `UnifiedLoginPage`)

## 1. Responsabilidade
Atuar como o portal de entrada 100% unificado para todos os 3 perfis do sistema (Administrador, Motorista e Responsável). O usuário não escolhe o tipo de conta no login; a descoberta de redirecionamento ocorre via RBAC no Middleware (`proxy.ts`).

## 2. Contratos de Autenticação (Server Actions)
A comunicação com o Supabase Auth ocorre através de ações de servidor protegidas em `app/login/actions.ts`:
- **`logIn(formData: FormData)`**: 
  - Recebe o email e password.
  - Chama `supabase.auth.signInWithPassword()`.
  - Em caso de sucesso, emite um `redirect("/")` provocando o recarregamento onde o `proxy.ts` fará o despache correto.
  - Em caso de falha, retorna um estado de erro `{ error: string }`.

## 3. Composição Visual (Frontend)
- **Viewport Única:** A tela consome 100vh da altura da janela. Não deve haver scroll caso não seja necessário. O design é focado e limpo.
- **Paleta Estética:** Fundo claro (Warm Sand/Beige), elementos em azul pastel escuro para confiança, e realces secundários.
- **Formulário:** O formulário é client-side (`"use client"`) em um componente filho (ex: `LoginForm`) para manipular graciosamente o estado visual de carregamento (ex: spinner rotatório) utilizando o hook `useTransition` ou `useFormStatus`.

## 4. Integração com Middleware
Como o formulário roda no endpoint raiz `/`, ao submeter o login com sucesso, o token JWT do Supabase é anexado aos cookies via `createServerClient`.
A próxima requisição que o client faz disparará o `proxy.ts`, que captura o `auth.uid()`, lê a tabela `perfis`, descobre o `tipo_usuario` e executa um `NextResponse.redirect()` forçado para `/admin`, `/dashboard/motorista` ou `/dashboard/pai`.
