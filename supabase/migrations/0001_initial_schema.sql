-- Create ENUMs
CREATE TYPE user_role AS ENUM ('pai', 'motorista', 'admin');
CREATE TYPE motorista_status AS ENUM ('pendente', 'aprovado', 'suspenso');
CREATE TYPE turno_aluno AS ENUM ('manha', 'tarde', 'integral');
CREATE TYPE vinculo_status AS ENUM ('pendente', 'ativo', 'inativo');
CREATE TYPE cobranca_status AS ENUM ('pendente', 'pago', 'vencido', 'cancelado');

-- Tabelas
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    nome_completo TEXT NOT NULL,
    telefone TEXT,
    role user_role NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE motoristas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) UNIQUE,
    placa TEXT NOT NULL,
    modelo_van TEXT NOT NULL,
    capacidade INT NOT NULL CHECK (capacidade > 0),
    cnh_numero TEXT NOT NULL,
    cnh_categoria TEXT NOT NULL,
    cnh_validade DATE NOT NULL,
    bairros_atendidos TEXT[],
    escolas_atendidas TEXT[],
    mercadopago_account_id TEXT,
    status motorista_status NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE alunos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pai_id UUID REFERENCES usuarios(id) NOT NULL,
    motorista_id UUID REFERENCES motoristas(id),
    nome TEXT NOT NULL,
    escola TEXT NOT NULL,
    serie_turma TEXT,
    turno turno_aluno NOT NULL,
    endereco_embarque TEXT NOT NULL,
    latitude_embarque FLOAT8,
    longitude_embarque FLOAT8,
    status_vinculo vinculo_status NOT NULL DEFAULT 'pendente',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE cobrancas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    motorista_id UUID REFERENCES motoristas(id) NOT NULL,
    pai_id UUID REFERENCES usuarios(id) NOT NULL,
    aluno_id UUID REFERENCES alunos(id) NOT NULL,
    valor_total NUMERIC(10,2) NOT NULL,
    valor_plataforma NUMERIC(10,2) NOT NULL,
    valor_motorista NUMERIC(10,2) NOT NULL,
    status cobranca_status NOT NULL DEFAULT 'pendente',
    mercadopago_payment_id TEXT,
    pix_copia_cola TEXT,
    vencimento DATE NOT NULL,
    pago_em TIMESTAMPTZ,
    referencia_mes TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE posicao_motorista (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    motorista_id UUID REFERENCES motoristas(id) UNIQUE,
    latitude FLOAT8 NOT NULL,
    longitude FLOAT8 NOT NULL,
    heading FLOAT8,
    speed FLOAT8,
    rota_ativa BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices Recomendados
CREATE INDEX idx_motoristas_bairros ON motoristas USING GIN (bairros_atendidos);
CREATE INDEX idx_motoristas_escolas ON motoristas USING GIN (escolas_atendidas);
CREATE INDEX idx_alunos_pai ON alunos (pai_id);
CREATE INDEX idx_alunos_motorista ON alunos (motorista_id);
CREATE INDEX idx_cobrancas_vencimento ON cobrancas (vencimento) WHERE status = 'pendente';
CREATE INDEX idx_cobrancas_motorista ON cobrancas (motorista_id);
CREATE INDEX idx_cobrancas_pai ON cobrancas (pai_id);
CREATE INDEX idx_posicao_ativa ON posicao_motorista (motorista_id) WHERE rota_ativa = true;

-- Habilitar RLS em todas as tabelas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE motoristas ENABLE ROW LEVEL SECURITY;
ALTER TABLE alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cobrancas ENABLE ROW LEVEL SECURITY;
ALTER TABLE posicao_motorista ENABLE ROW LEVEL SECURITY;
