export type AsaasCustomer = {
  name: string
  cpfCnpj: string
  email?: string
  phone?: string
  mobilePhone?: string
  address?: string
  addressNumber?: string
  province?: string
  postalCode?: string
}

export type AsaasPayment = {
  customer: string
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED'
  value: number
  dueDate: string
  description?: string
  externalReference?: string
}

const API_KEY = process.env.ASAAS_API_KEY
const API_URL = process.env.ASAAS_ENVIRONMENT === 'production' 
  ? 'https://api.asaas.com/v3'
  : 'https://sandbox.asaas.com/api/v3'

export async function asaasRequest(endpoint: string, method: string = 'GET', body?: any) {
  if (!API_KEY) {
    console.warn('⚠️ ASAAS_API_KEY não configurada. Simulando requisição para', endpoint)
    return { simulated: true, id: `sim_${Date.now()}` }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'access_token': API_KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Asaas API Error (${response.status}): ${errorText}`)
  }

  return response.json()
}

// 1. Criar ou buscar cliente
export async function createOrGetCustomer(customerData: AsaasCustomer): Promise<string> {
  if (!API_KEY) return 'cus_simulated_123'
  
  // Tenta buscar por CPF primeiro
  const search = await asaasRequest(`/customers?cpfCnpj=${customerData.cpfCnpj}`)
  if (search.data && search.data.length > 0) {
    return search.data[0].id
  }

  // Se não existir, cria
  const create = await asaasRequest('/customers', 'POST', customerData)
  return create.id
}

// 2. Gerar Cobrança (Pix/Boleto)
export async function createPayment(paymentData: AsaasPayment) {
  if (!API_KEY) return { id: `pay_sim_${Date.now()}`, invoiceUrl: '#', bankSlipUrl: '#' }
  return asaasRequest('/payments', 'POST', paymentData)
}

// 3. Obter QR Code Pix de uma cobrança
export async function getPixQrCode(paymentId: string) {
  if (!API_KEY) return { encodedImage: 'base64simulada', payload: '000201...simulado' }
  return asaasRequest(`/payments/${paymentId}/pixQrCode`)
}
