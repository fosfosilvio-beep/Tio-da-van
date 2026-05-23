# Documentação de Tela: Dashboard do Responsável (Pai/Mãe)

**Caminho da Rota:** `/dashboard/pai/page.tsx`
**Tipo de Rota:** Privada (Protegida pelo `proxy.ts`)

## 1. Responsabilidade
Servir como o painel central para o responsável do aluno. Nesta interface (Mobile-First), o pai poderá visualizar o status das faturas, o acompanhamento em tempo real da van e emitir avisos de falta.

## 2. Componentes e Estrutura
- **Server Component (`page.tsx`)**: Responsável por fazer a busca segura no banco via RLS (`id_responsavel = auth.uid()`), conectando as entidades `alunos`, `motoristas_perfil` e `perfis`.
- **Cabeçalho Base:** Exibe as boas-vindas com nome do pai e informações resumidas do motorista vinculado.
- **Card de Mapa (Mock):** Interface visual limpa simulando rastreamento da van.
- **Botão de Ausência (`AbsenceButton.tsx`)**: Client Component que utiliza `useTransition` para acionar a Server Action `toggleAusencia`, atualizando o status de comparecimento do filho em tempo real.
- **LogoutButton:** Aciona a limpeza da sessão e redireciona ao login.

## 3. Lógica de Dados (Server Actions)
O arquivo `app/dashboard/pai/actions.ts` expõe a função `toggleAusencia(alunoId: string, statusAtual: boolean)` que:
1. Valida o UUID do usuário atual via Supabase Auth SSR.
2. Atualiza a flag `notificar_ausencia_hoje` no banco.
3. Invoca `revalidatePath('/dashboard/pai')` para reidratação instantânea.

## 4. Segurança e RLS
- Os dados do aluno só são renderizados se o `id_responsavel` coincidir com o `auth.uid()`.
- O `proxy.ts` previne que admins ou motoristas acessem esta página acidentalmente.
