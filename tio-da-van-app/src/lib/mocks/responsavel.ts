import { AlunoComRota, Cobranca } from '@/types'

export const mockFilhos: Partial<AlunoComRota>[] = [
  {
    id: 'mock-filho-1',
    nome: 'Lucas Oliveira',
    escola: 'Colégio São José',
    serie: '5º Ano',
    data_nascimento: '2015-06-15',
    foto_url: 'https://ui-avatars.com/api/?name=Lucas+Oliveira&background=6c63ff&color=fff&size=128',
    status_checkin: 'embarcado',
    ausente_hoje: false,
    ativo: true,
    rota_id: 'mock-rota-1',
    rotas: { nome_rota: 'Manhã Centro', turno: 'manha', horario_inicio: '06:30' },
    pontos_embarque: { nome: 'Esquina Av. Brasil', lat: -23.5505, lng: -46.6333 },
  },
  {
    id: 'mock-filho-2',
    nome: 'Isabela Oliveira',
    escola: 'Escola Municipal Dom Pedro',
    serie: '2º Ano',
    data_nascimento: '2018-09-10',
    foto_url: 'https://ui-avatars.com/api/?name=Isabela+Oliveira&background=ff6b6b&color=fff&size=128',
    status_checkin: 'aguardando',
    ausente_hoje: false,
    ativo: true,
    rota_id: 'mock-rota-1',
    rotas: { nome_rota: 'Manhã Centro', turno: 'manha', horario_inicio: '06:30' },
    pontos_embarque: { nome: 'Esquina Av. Brasil', lat: -23.5505, lng: -46.6333 },
  }
];

export const mockFaturasResponsavel: Partial<Cobranca>[] = [
  {
    id: 'mock-fat-1',
    aluno_id: 'mock-filho-1',
    valor: 450,
    status: 'pendente',
    data_vencimento: '2026-05-10',
    tipo: 'mensalidade',
    mes_referencia: '2026-05',
  },
  {
    id: 'mock-fat-2',
    aluno_id: 'mock-filho-2',
    valor: 350,
    status: 'pendente',
    data_vencimento: '2026-05-10',
    tipo: 'mensalidade',
    mes_referencia: '2026-05',
  },
  {
    id: 'mock-fat-3',
    aluno_id: 'mock-filho-1',
    valor: 450,
    status: 'pago',
    data_vencimento: '2026-04-10',
    data_pagamento: '2026-04-09',
    tipo: 'mensalidade',
    mes_referencia: '2026-04',
  }
];
