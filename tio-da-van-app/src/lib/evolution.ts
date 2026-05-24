/**
 * lib/evolution.ts
 * Cliente para a Evolution API (WhatsApp)
 * Quarteirão [03XX] — Integração de Comunicação
 */

const EVOLUTION_URL = process.env.EVOLUTION_API_URL ?? 'http://localhost:8080'
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY ?? ''
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE_NAME ?? 'tio-da-van'

type EvolutionResponse = {
  success: boolean
  error?: string
}

/** Normaliza número BR: remove não-dígitos, adiciona 55 se necessário */
function normalizarTelefone(telefone: string): string {
  const digits = telefone.replace(/\D/g, '')
  if (digits.startsWith('55') && digits.length >= 12) return digits
  return `55${digits}`
}

/** Envia mensagem de texto simples via WhatsApp */
export async function enviarMensagemWhatsApp(
  telefone: string,
  mensagem: string
): Promise<EvolutionResponse> {
  try {
    const numero = normalizarTelefone(telefone)

    const response = await fetch(
      `${EVOLUTION_URL}/message/sendText/${EVOLUTION_INSTANCE}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: EVOLUTION_KEY,
        },
        body: JSON.stringify({
          number: numero,
          text: mensagem,
        }),
      }
    )

    if (!response.ok) {
      const errBody = await response.text()
      console.error('[Evolution] Erro ao enviar mensagem:', errBody)
      return { success: false, error: errBody }
    }

    return { success: true }
  } catch (err) {
    console.error('[Evolution] Exceção ao enviar mensagem:', err)
    return { success: false, error: String(err) }
  }
}

/** Envia imagem com legenda */
export async function enviarImagemWhatsApp(
  telefone: string,
  imageUrl: string,
  legenda?: string
): Promise<EvolutionResponse> {
  try {
    const numero = normalizarTelefone(telefone)

    const response = await fetch(
      `${EVOLUTION_URL}/message/sendMedia/${EVOLUTION_INSTANCE}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: EVOLUTION_KEY,
        },
        body: JSON.stringify({
          number: numero,
          mediatype: 'image',
          media: imageUrl,
          caption: legenda ?? '',
        }),
      }
    )

    if (!response.ok) return { success: false, error: await response.text() }
    return { success: true }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

/** Envia arquivo PDF (ex: recibo, contrato) */
export async function enviarDocumentoWhatsApp(
  telefone: string,
  documentoUrl: string,
  nomeArquivo: string
): Promise<EvolutionResponse> {
  try {
    const numero = normalizarTelefone(telefone)

    const response = await fetch(
      `${EVOLUTION_URL}/message/sendMedia/${EVOLUTION_INSTANCE}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: EVOLUTION_KEY,
        },
        body: JSON.stringify({
          number: numero,
          mediatype: 'document',
          media: documentoUrl,
          fileName: nomeArquivo,
        }),
      }
    )

    if (!response.ok) return { success: false, error: await response.text() }
    return { success: true }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

/** Verifica status da instância Evolution */
export async function verificarStatusInstancia(): Promise<{
  conectado: boolean
  estado?: string
}> {
  try {
    const response = await fetch(
      `${EVOLUTION_URL}/instance/connectionState/${EVOLUTION_INSTANCE}`,
      {
        headers: { apikey: EVOLUTION_KEY },
      }
    )

    if (!response.ok) return { conectado: false }

    const data = await response.json()
    const estado = data?.instance?.state ?? data?.state ?? 'unknown'
    return { conectado: estado === 'open', estado }
  } catch {
    return { conectado: false }
  }
}

/** Templates de mensagens pré-formatados */
export const templates = {
  embarque: (nomeAluno: string) =>
    `🚐 *Tio da Van*\n\nSeu filho(a) *${nomeAluno}* acabou de embarcar na van!\nViajem segura! 😊`,

  desembarque: (nomeAluno: string, destino: string) =>
    `✅ *Tio da Van*\n\n*${nomeAluno}* chegou com segurança em *${destino}*. 🏫`,

  aproximacao: (pontoNome: string, minutos: number) =>
    `⏰ *Tio da Van*\n\nA van está a *~${minutos} minutos* do ponto "${pontoNome}".\nPrepare-se! 🚦`,

  lembreteCobranca: (nomeAluno: string, valor: string, vencimento: string) =>
    `💰 *Tio da Van*\n\nLembrete de mensalidade:\n👦 Aluno: *${nomeAluno}*\n💵 Valor: *${valor}*\n📅 Vencimento: *${vencimento}*\n\nQualquer dúvida, entre em contato!`,

  ocorrencia: (nomeAluno: string, tipo: string, descricao: string) =>
    `⚠️ *Tio da Van — Ocorrência*\n\nAluno: *${nomeAluno}*\nTipo: *${tipo}*\n\n${descricao}\n\nEntre em contato para mais informações.`,
}
