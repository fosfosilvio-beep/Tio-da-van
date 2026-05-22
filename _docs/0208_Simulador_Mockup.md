# 0208 - Simulador Mobile Interativo 3-em-1 (Alta Fidelidade)

## Propósito
Exibir o ecossistema completo do **Tio da Van** em um formato interativo de alta fidelidade visual, simulando smartphones reais lado a lado. Isso permite aos usuários e clientes visualizarem de forma imediata o funcionamento da plataforma nas visões de **Responsáveis (Pais)**, **Motoristas** e **Administradores**, exatamente como retratado nos mockups do projeto.

---

## Paleta de Cores & Identidade Visual
As interfaces respeitam rigorosamente a identidade visual definida nos mockups:
- **Off-white Areia Quente (`#FAF8F3`)**: Usada como fundo dos dispositivos e cartões gerais.
- **Verde Menta Suave (`#A2E8DF`)**: Usada nas faixas de cabeçalho superiores dos aplicativos de campo e painéis.
- **Azul Oceano (`#3E8AC8`)**: Usada para ações primárias, botões de ação do responsável, e indicadores.
- **Amarelo Mel Dourado (`#F5C754`)**: Usada para avisos de CNH, tags de status pendente e botões secundários de "Contatar" ou "Enviar Cobranças".
- **Grafite Slate Navy (`#0F1B24`)**: Usado na tipografia de alta legibilidade, garantindo contraste superior.

---

## Telas Simuladas & Fluxos Interativos

### Set 1: Aplicações de Campo (Pais & Motoristas)

1. **App do Responsável — Home (Mãe Jamile)**:
   - **Bom dia, Jamile!**
   - **Mapa de Rota Escolar**: Um mapa interativo em SVG mostrando o trajeto em tempo real entre a Residência (Home) e a Escola (School), com o ícone de uma van escolar amarela percorrendo a linha pontilhada azul.
   - **Card de Status**: Telemetria em tempo real simulada, mostrando se o Tio Pedro está chegando (com temporizador regressivo).
   - **Ações**:
     - *Informar Ausência*: Permite marcar ausência do aluno para o dia corrente, disparando uma animação de confirmação e atualizando o status na tela de manifesto do motorista.
     - *Pagar Mensalidade*: Abre um modal com o QR Code Pix real e permite liquidar a fatura simuladamente, alterando o status da cobrança de "pendente" para "paga" instantaneamente.

2. **App do Responsável — Encontrar Van**:
   - **Encontrar sua Van**
   - **Filtro de Localização**: Permite simular a busca digitando a escola e o bairro.
   - **Resultados de Busca**: Card detalhado do transportador parceiro "Tio Pedro - Rota 1" com classificação (5 estrelas), escolas servidas e botão interativo de contato.

3. **App do Motorista — Painel de Controle (Tio Pedro)**:
   - **Tio Pedro's Painel**
   - **Manifesto de Alunos**: Lista de controle interativa ("João", "Maria", "Carlos", "Acma") com checkboxes funcionais. O contador "Alunos Hoje" é recalculado dinamicamente à medida que o motorista marca o embarque dos alunos na van.
   - **Iniciar Rota (Botão Central)**: Um botão circular interativo que permite iniciar a rota. Ao ser ativado, o status muda para "Em Rota", e a van no mapa do responsável começa a se mover, simulando a transmissão GPS ativa no Supabase.
   - **Status Financeiro**: Visão rápida de recebimentos com gráfico de pizza circular (18 pagos, 6 pendentes) e botão para disparar cobranças preventivas.

---

## Set 2: Painel Administrativo Geral (Mobile UI)

1. **Administrador Geral — Home**:
   - KPIs gerenciais consolidados (Total de Vans, Total de Alunos, Receita líquida obtida através da taxa de split de 5%).
   - **Mapa Geral**: Visualização SVG do município de Arapongas contendo múltiplos pins de vans escolares em trânsito.
   - Acesso direto para gerenciar usuários e relatórios.

2. **Gerenciar Usuários**:
   - **Switcher de Perfis**: Permite alternar a listagem entre "Motoristas" e "Responsáveis".
   - **Lista cadastral interativa**: Exibe o status cadastral e possui um botão de switch de ativação/desativação para cada usuário.

3. **Relatórios de Split Asaas**:
   - Faturamento bruto consolidado e comissão líquida de 5% retida na plataforma.
   - **Tabela de Payouts**: Listagem dos repasses detalhados para cada subconta de motorista Mercado Pago (95% para o motorista, 5% para a plataforma).
   - Botão interativo para exportação simulada de relatórios em PDF.
