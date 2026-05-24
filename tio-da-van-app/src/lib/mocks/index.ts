import type {
  Aluno, Rota, PontoEmbarque, Cobranca, Despesa,
  Ocorrencia, MotoristaPerfil, DashboardStats, AlunoComRota, RotaComPontos
} from '@/types'

// ============================================================
// MOCKS DE ALUNOS
// ============================================================
export const mockAlunos: Partial<AlunoComRota>[] = [
  {
    id: 'mock-aluno-1',
    nome: 'Lucas Oliveira',
    escola: 'Colégio São José',
    serie: '5º Ano',
    data_nascimento: '2015-06-15',
    foto_url: 'https://ui-avatars.com/api/?name=Lucas+Oliveira&background=6c63ff&color=fff&size=128',
    status_checkin: 'aguardando',
    ausente_hoje: false,
    ativo: true,
    responsavel_id: 'mock-resp-1',
    rota_id: 'mock-rota-1',
    rotas: { nome_rota: 'Manhã Centro', turno: 'manha', horario_inicio: '06:30' },
    pontos_embarque: { nome: 'Esquina Av. Brasil', lat: -23.5505, lng: -46.6333 },
  },
  {
    id: 'mock-aluno-2',
    nome: 'Ana Clara Santos',
    escola: 'Escola Municipal Dom Pedro',
    serie: '3º Ano',
    data_nascimento: '2017-03-22',
    foto_url: 'https://ui-avatars.com/api/?name=Ana+Clara&background=00d4aa&color=fff&size=128',
    status_checkin: 'embarcado',
    ausente_hoje: false,
    ativo: true,
    responsavel_id: 'mock-resp-2',
    rota_id: 'mock-rota-1',
    rotas: { nome_rota: 'Manhã Centro', turno: 'manha', horario_inicio: '06:30' },
    pontos_embarque: { nome: 'Rua das Flores, 45', lat: -23.5510, lng: -46.6340 },
  },
  {
    id: 'mock-aluno-3',
    nome: 'Pedro Henrique Lima',
    escola: 'Colégio São José',
    serie: '7º Ano',
    data_nascimento: '2013-11-08',
    foto_url: 'https://ui-avatars.com/api/?name=Pedro+Lima&background=ff6b6b&color=fff&size=128',
    status_checkin: 'desembarcado',
    ausente_hoje: false,
    ativo: true,
    responsavel_id: 'mock-resp-3',
    rota_id: 'mock-rota-2',
    rotas: { nome_rota: 'Tarde Zona Sul', turno: 'tarde', horario_inicio: '17:00' },
    pontos_embarque: { nome: 'Praça da Sé', lat: -23.5505, lng: -46.6350 },
  },
  {
    id: 'mock-aluno-4',
    nome: 'Maria Fernanda Costa',
    escola: 'Escola Estadual Tiradentes',
    serie: '4º Ano',
    data_nascimento: '2016-08-30',
    foto_url: 'https://ui-avatars.com/api/?name=Maria+Costa&background=ffd93d&color=333&size=128',
    status_checkin: 'aguardando',
    ausente_hoje: true,
    ativo: true,
    responsavel_id: 'mock-resp-4',
    rota_id: 'mock-rota-1',
    rotas: { nome_rota: 'Manhã Centro', turno: 'manha', horario_inicio: '06:30' },
    pontos_embarque: { nome: 'Terminal Bandeira', lat: -23.5450, lng: -46.6360 },
  },
]

// ============================================================
// MOCKS DE ROTAS
// ============================================================
export const mockRotas: Partial<RotaComPontos>[] = [
  {
    id: 'mock-rota-1',
    nome_rota: 'Manhã Centro',
    turno: 'manha',
    horario_inicio: '06:30',
    horario_fim: '07:30',
    dias_semana: ['seg', 'ter', 'qua', 'qui', 'sex'],
    ativa: true,
    pontos_embarque: [
      { id: 'p1', rota_id: 'mock-rota-1', nome: 'Esquina Av. Brasil', lat: -23.5505, lng: -46.6333, ordem: 1, raio_geofence_metros: 100, ativo: true, created_at: '' },
      { id: 'p2', rota_id: 'mock-rota-1', nome: 'Rua das Flores, 45', lat: -23.5510, lng: -46.6340, ordem: 2, raio_geofence_metros: 100, ativo: true, created_at: '' },
      { id: 'p3', rota_id: 'mock-rota-1', nome: 'Terminal Bandeira', lat: -23.5450, lng: -46.6360, ordem: 3, raio_geofence_metros: 150, ativo: true, created_at: '' },
    ],
    alunos: [
      { id: 'mock-aluno-1', nome: 'Lucas Oliveira', foto_url: null, status_checkin: 'aguardando', ausente_hoje: false },
      { id: 'mock-aluno-2', nome: 'Ana Clara Santos', foto_url: null, status_checkin: 'embarcado', ausente_hoje: false },
    ],
  },
  {
    id: 'mock-rota-2',
    nome_rota: 'Tarde Zona Sul',
    turno: 'tarde',
    horario_inicio: '17:00',
    horario_fim: '18:00',
    dias_semana: ['seg', 'ter', 'qua', 'qui', 'sex'],
    ativa: true,
    pontos_embarque: [
      { id: 'p4', rota_id: 'mock-rota-2', nome: 'Praça da Sé', lat: -23.5505, lng: -46.6350, ordem: 1, raio_geofence_metros: 100, ativo: true, created_at: '' },
    ],
    alunos: [
      { id: 'mock-aluno-3', nome: 'Pedro Henrique Lima', foto_url: null, status_checkin: 'desembarcado', ausente_hoje: false },
    ],
  },
]

// ============================================================
// MOCKS DE COBRANÇAS
// ============================================================
export const mockCobrancas: Partial<Cobranca>[] = [
  {
    id: 'mock-cob-1',
    aluno_id: 'mock-aluno-1',
    motorista_id: 'mock-motor-1',
    valor: 450,
    status: 'pendente',
    data_vencimento: '2026-05-10',
    tipo: 'mensalidade',
    mes_referencia: '2026-05',
  },
  {
    id: 'mock-cob-2',
    aluno_id: 'mock-aluno-2',
    motorista_id: 'mock-motor-1',
    valor: 450,
    status: 'pago',
    data_vencimento: '2026-05-10',
    data_pagamento: '2026-05-08',
    tipo: 'mensalidade',
    mes_referencia: '2026-05',
  },
  {
    id: 'mock-cob-3',
    aluno_id: 'mock-aluno-3',
    motorista_id: 'mock-motor-1',
    valor: 450,
    status: 'vencido',
    data_vencimento: '2026-04-10',
    tipo: 'mensalidade',
    mes_referencia: '2026-04',
  },
]

// ============================================================
// MOCKS DE DESPESAS
// ============================================================
export const mockDespesas: Partial<Despesa>[] = [
  { id: 'd1', categoria: 'combustivel', valor: 320.5, descricao: 'Abastecimento semana 1', data_despesa: '2026-05-05' },
  { id: 'd2', categoria: 'manutencao', valor: 850, descricao: 'Troca de óleo + filtros', data_despesa: '2026-05-12' },
  { id: 'd3', categoria: 'combustivel', valor: 290, descricao: 'Abastecimento semana 2', data_despesa: '2026-05-12' },
  { id: 'd4', categoria: 'seguro', valor: 210, descricao: 'Parcela seguro veicular', data_despesa: '2026-05-01' },
]

// ============================================================
// MOCK DASHBOARD STATS
// ============================================================
export const mockDashboardStats: DashboardStats = {
  total_alunos: 12,
  alunos_embarcados: 8,
  receita_mes: 5400,
  despesas_mes: 1670.5,
  lucro_mes: 3729.5,
  cobrancas_pendentes: 3,
  cobrancas_vencidas: 1,
}

// ============================================================
// MOCKS DE OCORRÊNCIAS
// ============================================================
export const mockOcorrencias: Partial<Ocorrencia>[] = [
  {
    id: 'oc1',
    aluno_id: 'mock-aluno-3',
    tipo: 'comportamento',
    descricao: 'Aluno foi agitado durante o trajeto',
    severidade: 'baixa',
    notificou_responsavel: true,
    created_at: '2026-05-20T07:45:00Z',
  },
  {
    id: 'oc2',
    aluno_id: 'mock-aluno-1',
    tipo: 'atraso',
    descricao: 'Responsável não estava no ponto às 6h35',
    severidade: 'media',
    notificou_responsavel: true,
    created_at: '2026-05-22T06:38:00Z',
  },
]
