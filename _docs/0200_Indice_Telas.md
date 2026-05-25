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

## 🌐 Páginas Públicas (Raiz / Marketplace)
Rotas públicas sem autenticação, voltadas para conversão de novos usuários.
- `0204_LandingPage.md` — Landing Page de conversão e Marketplace.
  - `/` — Landing Page (Hero, Seção "Sou Pai" + Seção "Sou Motorista", Features)
  - Stitch: `d1319a777e254549a11a7ed4fe1645a7`
- `0205_ListaVansPublica.md` — Lista pública de vans disponíveis por região.
  - `/vans?escola=...&bairro=...` — Resultados de busca com cards de motorista + WhatsApp CTA
  - Stitch: `717a244e4b11491c8b52737d8fb57dea`

## 🚐 Onboarding & KYC do Motorista
Fluxo exclusivo do primeiro acesso do motorista.
- `0206_OnboardingMotorista.md` — Dashboard com popup + Formulário KYC completo.
  - `/dashboard` (1ª visita) — Popup de boas-vindas + Card de aviso persistente
  - Stitch: `8a43eab7679043ce8117849fcc0b245e`
  - `/dashboard/cadastro` — Formulário KYC: Dados Pessoais, RG, CPF, CNH, selfie, Pix
  - Stitch: `86463eddc24c4f6ab59b7ff4ea0df665`
- `0207_CadastroVanFrota.md` — Cadastro de Van ou Frota.
  - `/dashboard/frota/nova` — Formulário com 4 abas: Dados, Fotos, Rotas, Documentos
  - Stitch: `dc2fc73290904a89822d1eedc2bf407e`
