# Roteamento Dinâmico e Responsividade Mobile-First

## Propósito
Este documento detalha o sistema de roteamento dinâmico por perfil de usuário e o layout responsivo de tela única da aplicação **Tio da Van**, substituindo a visualização paralela anterior por interfaces completas e otimizadas.

---

## 1. Estrutura de Rotas (Next.js App Router)

A reestruturação eliminou as maquetes de celulares fixos em paralelo e implementou rotas isoladas que ocupam 100% da tela do usuário final, otimizadas para smartphones (Mobile-First):

1. **Portal de Login e Acesso Único** (`/`):
   - Rota: [page.tsx](file:///c:/Users/NOSSA%20WEBTV/Documents/GitHub/Tio-da-van/app/page.tsx)
   - Descrição: Launchpad de boas-vindas com formulário de login integrado via Supabase e 3 botões de simulação rápida para os perfis teste.
   
2. **Painel do Responsável** (`/dashboard/pai`):
   - Rota: [pai/page.tsx](file:///c:/Users/NOSSA%20WEBTV/Documents/GitHub/Tio-da-van/app/dashboard/pai/page.tsx)
   - Descrição: Tela cheia exclusiva para Pais/Responsáveis. Exibe o mapa de telemetria GPS ao vivo em Arapongas, status da rota, botão para reporte de ausência e faturamento via Pix.

3. **Painel do Motorista** (`/dashboard/motorista`):
   - Rota: [motorista/page.tsx](file:///c:/Users/NOSSA%20WEBTV/Documents/GitHub/Tio-da-van/app/dashboard/motorista/page.tsx)
   - Descrição: Tela cheia exclusiva para o Motorista (Tio da Van). Exibe o manifesto de alunos (check-in interativo de passageiros), botão circular para início de rota (GPS ativo) e controle financeiro de cobranças Asaas.

4. **Painel do Administrador Geral** (`/admin`):
   - Rota: [admin/page.tsx](file:///c:/Users/NOSSA%20WEBTV/Documents/GitHub/Tio-da-van/app/admin/page.tsx)
   - Descrição: Tela completa de central gerencial contendo gráficos, mapa consolidado da frota ao vivo, demonstrativo de splits Asaas (95% Motorista / 5% Plataforma) e tabela de moderação/aprovação de novos transportadores com reações em tempo real no banco.

---

## 2. Controle de Acesso Dinâmico (`perfis.rota_destino`)

A tabela `perfis` gerencia o redirecionamento dinâmico após o login bem-sucedido. Ela mapeia o ID do usuário de autenticação do Supabase à sua rota de destino:

```sql
CREATE TYPE tipo_usuario AS ENUM ('admin', 'motorista', 'responsavel');

CREATE TABLE perfis (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    nome TEXT NOT NULL,
    tipo tipo_usuario NOT NULL DEFAULT 'responsavel',
    rota_destino TEXT NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, now()) NOT NULL
);
```

### Contrato de Redirecionamento (Login Flow)
Ao logar via credenciais ou por simulação, a aplicação executa a seguinte lógica:
1. Valida o usuário e obtém o `id` no Supabase Auth.
2. Faz o SELECT na tabela `perfis` buscando o ID logado.
3. Lê a coluna `rota_destino` (ex: `/dashboard/pai`, `/dashboard/motorista` ou `/admin`).
4. Executa `router.push(profile.rota_destino)`.

---

## 3. Arquitetura de Layouts Responsivos e Centramento CSS

Para garantir a melhor experiência responsiva, usamos **CSS dinâmico condicional** no arquivo de layout geral:

- **Dashboard Layout Geral** ([layout.tsx](file:///c:/Users/NOSSA%20WEBTV/Documents/GitHub/Tio-da-van/app/dashboard/layout.tsx)):
  - O layout geral do Next.js analisa se o caminho atual pertence à rota do pai (`/dashboard/pai`) ou do motorista (`/dashboard/motorista`).
  - Se for uma rota mobile-first, ele **ignora a barra lateral de administração e o cabeçalho**, renderizando a tela cheia e limpa para o smartphone.

- **Bypass de Centramento do Body** ([globals.css](file:///c:/Users/NOSSA%20WEBTV/Documents/GitHub/Tio-da-van/app/globals.css)):
  - A estilização do `body` de nossa aplicação centraliza elementos na tela por padrão para uma experiência de desktop limpa.
  - Para evitar conflitos nas telas cheias de celulares e no painel admin completo, o `body` detecta elementos mobile ou o painel através do seletor `:has()` e cancela o centramento/padding:
    ```css
    body:has(.dashboard-layout),
    body:has(.smartphone-status-bar),
    body:has(#admin-panel) {
      display: block;
      align-items: initial;
      justify-content: initial;
      padding: 0;
      background-image: none;
      overflow-x: hidden;
    }
    ```

---

## 4. Contratos de Dados do Banco e Mocking
- **Jamile (Responsável)**: UUID `'11111111-1111-1111-1111-111111111111'`, redireciona para `/dashboard/pai`
- **Tio Pedro (Motorista)**: UUID `'22222222-2222-2222-2222-222222222222'`, redireciona para `/dashboard/motorista`
- **Admin**: UUID `'33333333-3333-3333-3333-333333333333'`, redireciona para `/admin`
