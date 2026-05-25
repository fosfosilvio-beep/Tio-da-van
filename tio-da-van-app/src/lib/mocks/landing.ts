// src/lib/mocks/landing.ts
// Mocks RIGOROSAMENTE TIPADOS para fase inicial (sem Supabase real para rota pública)
// Contrato: MotoristaPublico — dados exibidos na Landing Page e na Lista de Vans

export interface MotoristaPublico {
  id: string
  nome: string
  foto_perfil_url: string
  foto_van_url: string
  avaliacao: number
  total_avaliacoes: number
  escolas_atendidas: string[]
  bairros: string[]
  horario_manha?: string
  horario_tarde?: string
  capacidade_total: number
  vagas_disponiveis: number
  valor_mensalidade: number
  whatsapp: string
}

export const mockMotoristasPublicos: MotoristaPublico[] = [
  {
    id: '1',
    nome: 'Carlos Eduardo Silva',
    foto_perfil_url: 'https://ui-avatars.com/api/?name=Carlos+Eduardo&background=2d4b73&color=fff&size=80&bold=true',
    foto_van_url: 'https://picsum.photos/seed/van1/400/225',
    avaliacao: 4.9,
    total_avaliacoes: 28,
    escolas_atendidas: ['Colégio São José', 'EMEF Dom Pedro II'],
    bairros: ['Centro', 'Vila Madalena', 'Pinheiros'],
    horario_manha: '06:30',
    horario_tarde: '17:00',
    capacidade_total: 14,
    vagas_disponiveis: 2,
    valor_mensalidade: 420,
    whatsapp: '11991234567',
  },
  {
    id: '2',
    nome: 'Roberto Almeida Santos',
    foto_perfil_url: 'https://ui-avatars.com/api/?name=Roberto+Almeida&background=2d4b73&color=fff&size=80&bold=true',
    foto_van_url: 'https://picsum.photos/seed/van2/400/225',
    avaliacao: 4.7,
    total_avaliacoes: 15,
    escolas_atendidas: ['Escola Estadual Tiradentes', 'EMEI Dom Pedro'],
    bairros: ['Moema', 'Itaim Bibi'],
    horario_manha: '06:45',
    horario_tarde: '17:30',
    capacidade_total: 12,
    vagas_disponiveis: 4,
    valor_mensalidade: 380,
    whatsapp: '11992345678',
  },
  {
    id: '3',
    nome: 'Ana Paula Ferreira',
    foto_perfil_url: 'https://ui-avatars.com/api/?name=Ana+Paula&background=2d4b73&color=fff&size=80&bold=true',
    foto_van_url: 'https://picsum.photos/seed/van3/400/225',
    avaliacao: 5.0,
    total_avaliacoes: 42,
    escolas_atendidas: ['Colégio Objetivo', 'Colégio São José'],
    bairros: ['Jardins', 'Bela Vista', 'Liberdade'],
    horario_manha: '06:15',
    horario_tarde: '17:15',
    capacidade_total: 15,
    vagas_disponiveis: 1,
    valor_mensalidade: 450,
    whatsapp: '11993456789',
  },
  {
    id: '4',
    nome: 'Marcos Oliveira Costa',
    foto_perfil_url: 'https://ui-avatars.com/api/?name=Marcos+Oliveira&background=2d4b73&color=fff&size=80&bold=true',
    foto_van_url: 'https://picsum.photos/seed/van4/400/225',
    avaliacao: 4.8,
    total_avaliacoes: 19,
    escolas_atendidas: ['EMEF Dom Pedro II', 'Escola Estadual Tiradentes'],
    bairros: ['Centro', 'Vila Madalena'],
    horario_manha: '06:30',
    horario_tarde: '17:00',
    capacidade_total: 14,
    vagas_disponiveis: 3,
    valor_mensalidade: 400,
    whatsapp: '11994567890',
  },
  {
    id: '5',
    nome: 'Fernanda Lima Rocha',
    foto_perfil_url: 'https://ui-avatars.com/api/?name=Fernanda+Lima&background=2d4b73&color=fff&size=80&bold=true',
    foto_van_url: 'https://picsum.photos/seed/van5/400/225',
    avaliacao: 4.6,
    total_avaliacoes: 11,
    escolas_atendidas: ['Colégio Objetivo'],
    bairros: ['Pinheiros', 'Jardins'],
    horario_manha: '07:00',
    horario_tarde: '17:30',
    capacidade_total: 10,
    vagas_disponiveis: 5,
    valor_mensalidade: 360,
    whatsapp: '11995678901',
  },
  {
    id: '6',
    nome: 'Paulo Henrique Souza',
    foto_perfil_url: 'https://ui-avatars.com/api/?name=Paulo+Henrique&background=2d4b73&color=fff&size=80&bold=true',
    foto_van_url: 'https://picsum.photos/seed/van6/400/225',
    avaliacao: 4.9,
    total_avaliacoes: 33,
    escolas_atendidas: ['EMEI Dom Pedro', 'EMEF Dom Pedro II', 'Colégio São José'],
    bairros: ['Moema', 'Itaim Bibi', 'Vila Madalena'],
    horario_manha: '06:30',
    horario_tarde: '17:00',
    capacidade_total: 16,
    vagas_disponiveis: 2,
    valor_mensalidade: 430,
    whatsapp: '11996789012',
  },
]

/**
 * Gera link do WhatsApp com mensagem dinâmica
 */
export function gerarLinkWhatsApp(motorista: MotoristaPublico, escola?: string, bairro?: string): string {
  const contexto = escola ? ` para a ${escola}` : ''
  const localizacao = bairro ? ` (bairro ${bairro})` : ''
  const texto = `Olá ${motorista.nome}! Vi seu perfil no Tio da Van e gostaria de conversar sobre uma vaga para o meu filho${contexto}${localizacao}. Podemos conversar?`
  return `https://wa.me/55${motorista.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(texto)}`
}
