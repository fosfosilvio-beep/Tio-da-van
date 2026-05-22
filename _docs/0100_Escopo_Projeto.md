# Visão Geral e Escopo do Projeto: Tio da Van

O aplicativo **Tio da Van** é uma plataforma tecnológica voltada para nichar e modernizar o transporte escolar e universitário na cidade de **Arapongas (PR)**. O objetivo central é conectar pais/responsáveis a motoristas de vans particulares, otimizando a gestão logística, a comunicação diária e a administração financeira desse serviço.

---

## 1. Stack Tecnológica (A Fundação)

| Camada | Tecnologia | Função Principal |
| --- | --- | --- |
| **Front-end Móvel** | React Native (Expo) | Aplicativo dos Pais e Motoristas (acesso a GPS e Notificações). |
| **Front-end Web** | Next.js | Painel Administrativo (Master) e Landing Page do app. |
| **Back-end & Banco** | Supabase (PostgreSQL) | Banco de dados relacional, Autenticação e Row Level Security. |
| **Motor de Tempo Real** | Supabase Realtime | Atualização do mapa da van e chat sem precisar recarregar a tela. |
| **Gateway de Pagamento** | Mercado Pago API | Geração de Pix, cobranças recorrentes e Split de 5%. |
| **Geolocalização** | Google Maps API | Renderização do mapa e cálculo de distância/tempo. |

---

## 2. Diagrama de Módulos (Três Interfaces, Um Banco)

O sistema é dividido em três interfaces distintas que consomem o mesmo banco de dados Supabase:

### Módulo A: App do Motorista (Operacional) — React Native / Expo
- **Gestão de Frota e Rotas:** Cadastro da placa, capacidade da van e seleção de bairros/escolas atendidas.
- **Painel de Bordo Diário:** Lista de alunos do dia, com botões de "Embarcou", "Entregue" ou "Faltou".
- **Transmissão de GPS:** Botão "Iniciar Rota" que envia a localização do celular para o banco a cada 5 segundos.
- **Dashboard Financeiro:** Visualização do saldo livre de taxas, quem está devendo e quem já pagou.

### Módulo B: App do Pai/Responsável (Cliente) — React Native / Expo
- **Match de Rota:** Motor de busca que cruza o endereço de casa com o colégio para listar motoristas compatíveis.
- **Tracking ao Vivo:** Tela de mapa ativada quando a van está em rota, mostrando o tempo estimado de chegada.
- **Avisos de Ausência:** Botão rápido para notificar que o aluno não irá naquele turno.
- **Carteira:** Histórico de mensalidades, visualização de faturas e código "Pix Copia e Cola".

### Módulo C: Painel Administrativo Master — Next.js (Web)
- **Visão Global:** Faturamento total gerado na plataforma e receita líquida (os 5%).
- **Auditoria:** Gestão de cadastros de motoristas (aprovação de documentos para garantir segurança).

---

## 3. Arquitetura de Dados (Entidades Principais)

Entidades implementadas no banco de dados Supabase (PostgreSQL):

1. **`usuarios`**: Cadastro geral contendo e-mail, senha e níveis de acesso (Pai, Motorista, Admin).
2. **`motoristas`**: Dados da van, CNH, bairros de atuação, escolas atendidas e dados bancários/Mercado Pago.
3. **`alunos`**: Vinculados aos Pais/Responsáveis. Dados do estudante, escola de destino, período/turno e status de presença diária.
4. **`cobrancas`**: Faturamento, mensalidades, histórico de pagamentos e status de liquidação.

---

## 4. Engenharia de Integração

### 4.1 Motor Financeiro (Webhook Mercado Pago)

O ciclo do dinheiro funciona de forma autônoma:

1. Um cronograma do Supabase (Edge Function) roda todo dia à meia-noite e identifica quais mensalidades vencem em 3 dias.
2. O sistema dispara requisição para a API do **Mercado Pago** criando a cobrança com a regra de **Split: 95% Motorista / 5% Plataforma**.
3. Quando o pai paga, o Mercado Pago envia um Webhook de volta para o Supabase.
4. O Supabase atualiza a tabela `cobrancas` para "Pago" e dispara notificação push para o celular do motorista.

### 4.2 Motor de Rastreamento (WebSockets / Supabase Realtime)

1. O motorista inicia a viagem. O app envia latitude/longitude para o Supabase a cada 5 segundos.
2. O app do pai "escuta" esse canal via WebSocket (Supabase Realtime).
3. A API do Google Maps desenha o ícone da van se movendo suavemente e calcula o tempo estimado de chegada.

---

## 5. Fases de Execução (Roadmap de Produção)

| Fase | Nome | Descrição |
| --- | --- | --- |
| **1** | Estrutura Basal (Backend) | Criação das tabelas no Supabase, regras de RLS para isolar dados, e sistema de Login/Cadastro. |
| **2** | Motor de Match e Painéis | Telas no Next.js/Expo para o motorista cadastrar rota e o pai pesquisar e se vincular. |
| **3** | O Coração Financeiro | Integração com API do Mercado Pago: cobranças, Split de pagamento e alertas de vencimento. |
| **4** | Rastreio e Logística | Mapa, emissão de GPS do motorista e fluxo diário de "Embarcou/Faltou". |
| **5** | Piloto | App rodando rotas reais em Arapongas (Centro e bairros adjacentes) com 2-3 motoristas parceiros. |
