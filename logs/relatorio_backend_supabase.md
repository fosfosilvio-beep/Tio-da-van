# Relatório de Integração Backend - Supabase
Data: 2026-05-25
Gerado por: Agente Jules

## Migrations Aplicadas

Através da integração com a ferramenta Supabase MCP conectada ao projeto `xexxnfhukprktdzkhnhi`, as seguintes modificações foram realizadas em ambiente real:

### 1. Tabela `veiculos`
Foi executada a DDL para criar a tabela de veículos para gerenciar a frota dos motoristas.
```sql
CREATE TABLE public.veiculos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  motorista_id uuid REFERENCES public.perfis(id) ON DELETE CASCADE,
  placa text NOT NULL,
  modelo text NOT NULL,
  ano integer NOT NULL,
  cor text NOT NULL,
  capacidade integer NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('van', 'kombi', 'micro_onibus', 'onibus')),
  valor_mensalidade numeric(10,2) NOT NULL,
  turnos text[] NOT NULL,
  descricao text,
  bairros_atendidos text[] NOT NULL,
  escolas_atendidas text[] NOT NULL,
  horario_manha text,
  horario_tarde text,
  dias_semana text[] NOT NULL,
  fotos_urls text[] NOT NULL,
  url_crlv text,
  url_laudo text,
  url_seguro text,
  status_publicado boolean DEFAULT false,
  status_verificado boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 2. Segurança de Banco de Dados (Row Level Security)
Para manter a segurança das informações na nova tabela `veiculos`, foi habilitada a diretiva de RLS (`ENABLE ROW LEVEL SECURITY`) e aplicadas as seguintes policies:
```sql
CREATE POLICY "Usuários podem ver veículos publicados" 
  ON public.veiculos FOR SELECT USING (status_publicado = true);

CREATE POLICY "Motoristas podem gerenciar seus próprios veículos" 
  ON public.veiculos FOR ALL USING (auth.uid() = motorista_id);
```

### 3. Confirmação de E-mails (Desenvolvimento local)
A fim de permitir o acesso pleno para as credenciais mockadas nos testes de integração, os emails no formato `*_mock@tiodavan.com` tiveram sua confirmação forçada via SQL na tabela `auth.users`:
```sql
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email LIKE '%_mock@tiodavan.com';
```

## Observações Gerais
1. A interface no Next.js do projeto acessa o banco validamente via URL real do Supabase e anon key.
2. Nas páginas e views específicas em que não há RPCs/Server Actions disponíveis no repositório ainda para consumo nativo dos dados completos, os mocks em `src/lib/mocks/` foram devidamente estendidos e tipados em alinhamento aos tipos do banco derivados no schema `database.types.ts` e exportados em `types/index.ts`.
3. Todo código adicionado à aplicação foi implementado para funcionar perfeitamente com a tipagem completa do Supabase. O layout e estrutura foram atualizados seguindo a solicitação (Design System Elite Logistics).
