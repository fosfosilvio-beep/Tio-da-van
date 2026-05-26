export const mockUsuariosAdmin = [
  { id: 'usr-1', nome: 'Carlos Eduardo Silva', email: 'carlos@email.com', tipo: 'motorista' as const, status_onboarding: true, created_at: '2026-01-10T10:00:00Z', avatar_url: 'https://ui-avatars.com/api/?name=Carlos+Eduardo&background=2d4b73&color=fff' },
  { id: 'usr-2', nome: 'Roberto Almeida', email: 'roberto@email.com', tipo: 'motorista' as const, status_onboarding: false, created_at: '2026-05-20T14:30:00Z' },
  { id: 'usr-3', nome: 'Mariana Costa', email: 'mariana@email.com', tipo: 'responsavel' as const, status_onboarding: true, created_at: '2026-03-15T09:15:00Z' }
];

export const mockAdminStats = {
  total_motoristas: 142,
  total_alunos: 850,
  receita_plataforma: 12500,
  motoristas_pendentes_kyc: 12
};

export const mockAuditLog = [
  { id: 'log-1', acao: 'Aprovou CNH', usuario: 'Admin Master', tipo: 'kyc_approval', created_at: '2026-05-25T10:30:00Z', detalhes: 'CNH do motorista usr-1 aprovada.' },
  { id: 'log-2', acao: 'Alterou taxa split', usuario: 'Admin Financeiro', tipo: 'config_change', created_at: '2026-05-24T16:45:00Z', detalhes: 'Taxa alterada de 4.5% para 5%.' },
  { id: 'log-3', acao: 'Baniu usuário', usuario: 'Admin Master', tipo: 'user_ban', created_at: '2026-05-23T11:20:00Z', detalhes: 'Usuário usr-9 banido por violação de termos.' }
];

export const mockTransacoesAdmin = [
  { id: 'tx-1', motorista: 'Carlos Eduardo', valor: 450, comissao: 22.50, status: 'pago', data: '2026-05-10T14:00:00Z' },
  { id: 'tx-2', motorista: 'Ana Paula', valor: 380, comissao: 19.00, status: 'pago', data: '2026-05-11T09:30:00Z' },
  { id: 'tx-3', motorista: 'Roberto Almeida', valor: 420, comissao: 21.00, status: 'pendente', data: '2026-05-15T10:00:00Z' }
];
