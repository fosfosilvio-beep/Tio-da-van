# Índice de Telas (UI & Frontend)

Este documento mapeia todas as telas da aplicação, separadas por grupos de roteamento (Route Groups), garantindo a aderência aos princípios do Redirecionamento Inteligente e RBAC.

## 🚐 Grupo Motorista `(motorista)`
Rotas exclusivas para motoristas gerenciarem suas rotas, alunos e financeiro.
- `0201_Painel_Motorista.md` — Visão geral da área do motorista.
  - `/dashboard`
  - `/chamada`
  - `/alunos`
  - `/financeiro`
  - `/ocorrencias`
  - `/contratos`
  - `/aniversariantes`
  - `/rotas`

## 👨‍👩‍👧‍👦 Grupo Responsável `(responsavel)`
Rotas exclusivas para os pais/responsáveis acompanharem seus filhos.
- `0202_Painel_Responsavel.md` — Visão geral da área do responsável.
  - `/meu-painel`
  - `/meus-filhos` (se houver)

## 🛡️ Grupo Admin `(admin)`
Painel Master para gestão global do sistema.
- `0203_Painel_Admin.md` — Visão geral da área de administração.
  - `/admin`

## 🔐 Grupo Auth `(auth)`
- `/login` — Rota pública com redirecionamento inteligente pós-login.
- `/signup` — Rota de cadastro.
