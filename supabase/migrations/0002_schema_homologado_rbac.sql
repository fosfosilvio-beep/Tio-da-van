-- =========================================================================================
-- Arquivo: 0002_schema_homologado_rbac.sql
-- Escopo: Recriar infraestrutura de dados para o Tio da Van (Mobile-First Real)
-- =========================================================================================

-- 1. Limpeza de Entidades Antigas
DROP TABLE IF EXISTS public.posicao_motorista CASCADE;
DROP TABLE IF EXISTS public.cobrancas CASCADE;
DROP TABLE IF EXISTS public.alunos CASCADE;
DROP TABLE IF EXISTS public.motoristas_perfil CASCADE;
DROP TABLE IF EXISTS public.motoristas CASCADE;
DROP TABLE IF EXISTS public.perfis CASCADE;
DROP TABLE IF EXISTS public.usuarios CASCADE;

-- Limpeza de Triggers antigas
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;

-- Limpeza de ENUMs antigos
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.motorista_status CASCADE;
DROP TYPE IF EXISTS public.turno_aluno CASCADE;
DROP TYPE IF EXISTS public.vinculo_status CASCADE;
DROP TYPE IF EXISTS public.cobranca_status CASCADE;
DROP TYPE IF EXISTS public.tipo_usuario CASCADE;
DROP TYPE IF EXISTS public.status_cobranca CASCADE;

-- 2. Criação dos Tipos Enums (Conforme Especificação)
CREATE TYPE public.tipo_usuario AS ENUM ('admin', 'motorista', 'responsavel');
CREATE TYPE public.status_cobranca AS ENUM ('pendente', 'pago', 'vencido', 'cancelado');

-- =========================================================================================
-- 3. Entidades Core
-- =========================================================================================

-- Tabela 1: perfis (Extensão direta de auth.users)
CREATE TABLE public.perfis (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome_completo TEXT,
    telefone TEXT,
    tipo tipo_usuario NOT NULL DEFAULT 'responsavel',
    criado_em TIMESTAMPTZ DEFAULT now(),
    atualizado_em TIMESTAMPTZ DEFAULT now()
);

-- Tabela 2: motoristas_perfil (Atributos Específicos do Motorista)
CREATE TABLE public.motoristas_perfil (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_perfil UUID REFERENCES public.perfis(id) ON DELETE CASCADE UNIQUE NOT NULL,
    placa TEXT NOT NULL,
    capacidade INT NOT NULL CHECK (capacidade > 0),
    asaas_wallet_id TEXT,
    bairros_atendidos TEXT[] DEFAULT '{}',
    escolas_atendidas TEXT[] DEFAULT '{}',
    criado_em TIMESTAMPTZ DEFAULT now(),
    atualizado_em TIMESTAMPTZ DEFAULT now()
);

-- Tabela 3: alunos (Entidade de Amarração M-N)
CREATE TABLE public.alunos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_responsavel UUID REFERENCES public.perfis(id) ON DELETE CASCADE NOT NULL,
    id_motorista UUID REFERENCES public.motoristas_perfil(id) ON DELETE SET NULL,
    nome_aluno TEXT NOT NULL,
    escola TEXT NOT NULL,
    bairro_embarque TEXT NOT NULL,
    notificar_ausencia_hoje BOOLEAN DEFAULT false,
    embarcado_hoje BOOLEAN DEFAULT false,
    criado_em TIMESTAMPTZ DEFAULT now(),
    atualizado_em TIMESTAMPTZ DEFAULT now()
);

-- Tabela 4: cobrancas (Ledger Financeiro e Asaas)
CREATE TABLE public.cobrancas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_aluno UUID REFERENCES public.alunos(id) ON DELETE CASCADE NOT NULL,
    id_responsavel UUID REFERENCES public.perfis(id) ON DELETE CASCADE NOT NULL,
    id_motorista UUID REFERENCES public.motoristas_perfil(id) ON DELETE CASCADE NOT NULL,
    valor NUMERIC(10,2) NOT NULL,
    valor_split_admin NUMERIC(10,2) NOT NULL,
    valor_split_motorista NUMERIC(10,2) NOT NULL,
    status status_cobranca NOT NULL DEFAULT 'pendente',
    asaas_payment_id TEXT,
    pix_copia_cola TEXT,
    data_vencimento DATE NOT NULL,
    pago_em TIMESTAMPTZ,
    criado_em TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================================
-- 4. Automação de Perfis (Triggers PL/pgSQL)
-- =========================================================================================

-- Trigger function: Popula a tabela perfis automaticamente após o sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.perfis (id, nome_completo, tipo)
  VALUES (
      new.id, 
      new.raw_user_meta_data->>'full_name', 
      COALESCE((new.raw_user_meta_data->>'tipo')::tipo_usuario, 'responsavel')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ativa a trigger no schema auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =========================================================================================
-- 5. Segurança ao Nível de Tupla (Row Level Security - RLS)
-- =========================================================================================

ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motoristas_perfil ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cobrancas ENABLE ROW LEVEL SECURITY;

-- PERFIS:
CREATE POLICY "Permite SELECT no proprio perfil ou por administradores" ON public.perfis 
FOR SELECT USING (auth.uid() = id OR (SELECT tipo FROM public.perfis WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Permite UPDATE no proprio perfil" ON public.perfis
FOR UPDATE USING (auth.uid() = id);

-- MOTORISTAS_PERFIL:
CREATE POLICY "Leitura livre para usuarios logados (busca cruzada)" ON public.motoristas_perfil
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Motorista atualiza proprio perfil" ON public.motoristas_perfil
FOR UPDATE USING (id_perfil = auth.uid());

CREATE POLICY "Admins gerenciam motoristas_perfil" ON public.motoristas_perfil
FOR ALL USING ((SELECT tipo FROM public.perfis WHERE id = auth.uid()) = 'admin');

-- ALUNOS:
CREATE POLICY "Pais leem os filhos" ON public.alunos
FOR SELECT USING (id_responsavel = auth.uid());

CREATE POLICY "Motoristas leem alunos embarcados com eles" ON public.alunos
FOR SELECT USING (id_motorista IN (SELECT id FROM public.motoristas_perfil WHERE id_perfil = auth.uid()));

CREATE POLICY "Pais inserem seus filhos" ON public.alunos
FOR INSERT WITH CHECK (id_responsavel = auth.uid());

CREATE POLICY "Admins gerenciam alunos livremente" ON public.alunos
FOR ALL USING ((SELECT tipo FROM public.perfis WHERE id = auth.uid()) = 'admin');

-- COBRANCAS:
CREATE POLICY "Pais leem suas faturas" ON public.cobrancas
FOR SELECT USING (id_responsavel = auth.uid());

CREATE POLICY "Motoristas leem suas faturas a receber" ON public.cobrancas
FOR SELECT USING (id_motorista IN (SELECT id FROM public.motoristas_perfil WHERE id_perfil = auth.uid()));

CREATE POLICY "Apenas admin e motoristas inserem cobrancas" ON public.cobrancas
FOR ALL USING (
    (SELECT tipo FROM public.perfis WHERE id = auth.uid()) = 'admin' 
    OR 
    id_motorista IN (SELECT id FROM public.motoristas_perfil WHERE id_perfil = auth.uid())
);
