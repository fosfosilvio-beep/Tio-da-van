import type { Tables } from '@/lib/supabase/database.types'

// Tipos derivados diretamente do banco (fonte de verdade)
export type Perfil = Tables<'perfis'>
export type MotoristaPerfil = Tables<'motoristas_perfil'>
export type Rota = Tables<'rotas'>
export type PontoEmbarque = Tables<'pontos_embarque'>
export type Aluno = Tables<'alunos'>
export type Cobranca = Tables<'cobrancas'>
export type Despesa = Tables<'despesas'>
export type Ocorrencia = Tables<'ocorrencias'>
export type Contrato = Tables<'contratos'>
export type Notificacao = Tables<'notificacoes'>

// --- Tipo Veículo ---
export interface Veiculo {
  id: string
  motorista_id: string
  placa: string
  modelo: string
  ano: number
  cor: string
  capacidade: number
  tipo: 'van' | 'kombi' | 'micro_onibus' | 'onibus'
  valor_mensalidade: number
  turnos: ('manha' | 'tarde' | 'integral' | 'noturno')[]
  descricao?: string
  bairros_atendidos: string[]
  escolas_atendidas: string[]
  horario_manha?: string
  horario_tarde?: string
  dias_semana: ('seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab')[]
  fotos_urls: string[]
  url_crlv?: string
  url_laudo?: string
  url_seguro?: string
  status_publicado: boolean
  status_verificado: boolean
  created_at: string
  updated_at: string
}

// Tipos compostos (joins comuns)
export type AlunoComRota = Omit<Aluno, 'rota_id' | 'ponto_embarque_id'> & {
  rota_id?: string | null
  ponto_embarque_id?: string | null
  rotas: Pick<Rota, 'nome_rota' | 'turno' | 'horario_inicio'> | null
  pontos_embarque: Pick<PontoEmbarque, 'nome' | 'lat' | 'lng'> | null
}

export type RotaComPontos = Rota & {
  pontos_embarque: PontoEmbarque[]
  alunos: Pick<Aluno, 'id' | 'nome' | 'foto_url' | 'status_checkin' | 'ausente_hoje'>[]
}

export type MotoristaComPerfil = MotoristaPerfil & {
  perfis: Perfil
}

export type CobrancaComAluno = Cobranca & {
  alunos: Pick<Aluno, 'nome' | 'foto_url'>
}

export type OcorrenciaComAluno = Ocorrencia & {
  alunos: Pick<Aluno, 'nome' | 'foto_url'>
}

// Tipos de formulário (para criação)
export type NovaRotaForm = {
  nome_rota: string
  turno: Rota['turno']
  horario_inicio: string
  horario_fim?: string
  dias_semana: string[]
}

export type NovoPontoForm = {
  nome: string
  lat: number
  lng: number
  ordem: number
  raio_geofence_metros: number
}

export type NovoAlunoForm = {
  nome: string
  escola?: string
  serie?: string
  data_nascimento?: string
  responsavel_email: string
  rota_id?: string
  ponto_embarque_id?: string
  observacoes_medicas?: string
}

export type NovaCobrancaForm = {
  aluno_id: string
  valor: number
  data_vencimento: string
  tipo: Cobranca['tipo']
  mes_referencia?: string
}

export type NovaDespesaForm = {
  categoria: Despesa['categoria']
  valor: number
  descricao: string
  data_despesa: string
}

export type NovaOcorrenciaForm = {
  aluno_id: string
  tipo: Ocorrencia['tipo']
  descricao: string
  severidade: Ocorrencia['severidade']
}

// Dashboard stats
export type DashboardStats = {
  total_alunos: number
  alunos_embarcados: number
  receita_mes: number
  despesas_mes: number
  lucro_mes: number
  cobrancas_pendentes: number
  cobrancas_vencidas: number
}

// Posição GPS para geofencing
export type GeoPosition = {
  lat: number
  lng: number
  accuracy?: number
  timestamp?: number
}
