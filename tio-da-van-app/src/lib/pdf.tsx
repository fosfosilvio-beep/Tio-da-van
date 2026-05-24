/**
 * lib/pdf.tsx
 * Geração de PDFs: Recibos e Contratos
 * Quarteirão [03XX] — Documentos
 */

import {
  Document, Page, Text, View, StyleSheet, Font
} from '@react-pdf/renderer'
import type { Cobranca, Aluno, MotoristaPerfil, Perfil, Contrato } from '@/types'

// ---- Estilos ----
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    padding: 40,
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#6c63ff',
  },
  logo: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#6c63ff',
  },
  logoSub: {
    fontSize: 9,
    color: '#888',
    marginTop: 2,
  },
  docTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a1a',
    textAlign: 'right',
  },
  docNum: {
    fontSize: 9,
    color: '#888',
    textAlign: 'right',
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#6c63ff',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 9,
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a1a',
    flex: 2,
  },
  totalBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f5f3ff',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#6c63ff',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#6c63ff',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: '#aaa',
  },
  statusBadge: {
    padding: '4 10',
    borderRadius: 4,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  clausula: {
    fontSize: 9,
    color: '#444',
    marginBottom: 8,
    lineHeight: 1.5,
  },
  assinatura: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  assinaturaBox: {
    width: '45%',
    borderTopWidth: 1,
    borderTopColor: '#666',
    paddingTop: 6,
    alignItems: 'center',
  },
  assinaturaLabel: {
    fontSize: 9,
    color: '#666',
  },
})

// ============================================================
// RECIBO DE PAGAMENTO
// ============================================================

type ReciboProps = {
  cobranca: Cobranca
  aluno: Aluno
  motorista: MotoristaPerfil
  perfilMotorista: Perfil
}

export function ReciboPDF({ cobranca, aluno, motorista, perfilMotorista }: ReciboProps) {
  const dataEmissao = new Date().toLocaleDateString('pt-BR')
  const dataPagamento = cobranca.data_pagamento
    ? new Date(cobranca.data_pagamento).toLocaleDateString('pt-BR')
    : '—'
  const valor = cobranca.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>🚐 Tio da Van</Text>
            <Text style={styles.logoSub}>Transporte Escolar Profissional</Text>
          </View>
          <View>
            <Text style={styles.docTitle}>RECIBO DE PAGAMENTO</Text>
            <Text style={styles.docNum}>Nº {cobranca.id.slice(0, 8).toUpperCase()}</Text>
            <Text style={styles.docNum}>Emitido em: {dataEmissao}</Text>
          </View>
        </View>

        {/* Dados do Motorista */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prestador de Serviço</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.value}>{perfilMotorista.nome}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Veículo:</Text>
            <Text style={styles.value}>
              {motorista.modelo_veiculo ?? '—'} — Placa: {motorista.placa_veiculo ?? '—'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Contato:</Text>
            <Text style={styles.value}>{perfilMotorista.email}</Text>
          </View>
        </View>

        {/* Dados do Aluno */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aluno / Beneficiário</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nome do aluno:</Text>
            <Text style={styles.value}>{aluno.nome}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Escola:</Text>
            <Text style={styles.value}>{aluno.escola ?? '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Série:</Text>
            <Text style={styles.value}>{aluno.serie ?? '—'}</Text>
          </View>
        </View>

        {/* Detalhes do Pagamento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalhes do Pagamento</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{cobranca.tipo === 'mensalidade' ? 'Mensalidade' : 'Avulso'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Referência:</Text>
            <Text style={styles.value}>{cobranca.mes_referencia ?? '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Vencimento:</Text>
            <Text style={styles.value}>{new Date(cobranca.data_vencimento).toLocaleDateString('pt-BR')}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Data de pagamento:</Text>
            <Text style={styles.value}>{dataPagamento}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={[styles.value, { color: cobranca.status === 'pago' ? '#00d4aa' : '#ff6b6b' }]}>
              {cobranca.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>VALOR TOTAL RECEBIDO</Text>
          <Text style={styles.totalValue}>{valor}</Text>
        </View>

        {/* Assinatura */}
        <View style={styles.assinatura}>
          <View style={styles.assinaturaBox}>
            <Text style={styles.assinaturaLabel}>Responsável pelo aluno</Text>
          </View>
          <View style={styles.assinaturaBox}>
            <Text style={styles.assinaturaLabel}>{perfilMotorista.nome} — Motorista</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Tio da Van — Gestão de Transporte Escolar</Text>
          <Text style={styles.footerText}>{dataEmissao}</Text>
        </View>
      </Page>
    </Document>
  )
}

// ============================================================
// CONTRATO DE PRESTAÇÃO DE SERVIÇOS
// ============================================================

type ContratoProps = {
  contrato: Contrato
  aluno: Aluno
  motorista: MotoristaPerfil
  perfilMotorista: Perfil
  perfilResponsavel: Perfil
}

export function ContratoPDF({
  contrato, aluno, motorista, perfilMotorista, perfilResponsavel
}: ContratoProps) {
  const dataEmissao = new Date().toLocaleDateString('pt-BR')
  const valor = contrato.valor_mensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>🚐 Tio da Van</Text>
            <Text style={styles.logoSub}>Transporte Escolar Profissional</Text>
          </View>
          <View>
            <Text style={styles.docTitle}>CONTRATO DE SERVIÇO</Text>
            <Text style={styles.docNum}>Nº {contrato.id.slice(0, 8).toUpperCase()}</Text>
            <Text style={styles.docNum}>Emitido em: {dataEmissao}</Text>
          </View>
        </View>

        {/* Partes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Partes Contratantes</Text>
          <View style={styles.row}>
            <Text style={styles.label}>CONTRATADO (Motorista):</Text>
            <Text style={styles.value}>{perfilMotorista.nome}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Veículo / Placa:</Text>
            <Text style={styles.value}>
              {motorista.modelo_veiculo ?? '—'} / {motorista.placa_veiculo ?? '—'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>CONTRATANTE (Responsável):</Text>
            <Text style={styles.value}>{perfilResponsavel.nome}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Aluno beneficiário:</Text>
            <Text style={styles.value}>{aluno.nome} — {aluno.escola ?? '—'}</Text>
          </View>
        </View>

        {/* Vigência e Valor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vigência e Valor</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Início:</Text>
            <Text style={styles.value}>{new Date(contrato.data_inicio).toLocaleDateString('pt-BR')}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Término:</Text>
            <Text style={styles.value}>
              {contrato.data_fim ? new Date(contrato.data_fim).toLocaleDateString('pt-BR') : 'Indeterminado'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Valor mensal:</Text>
            <Text style={[styles.value, { color: '#6c63ff', fontSize: 11 }]}>{valor}</Text>
          </View>
        </View>

        {/* Cláusulas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cláusulas Gerais</Text>
          <Text style={styles.clausula}>
            1. O CONTRATADO se compromete a realizar o transporte escolar do aluno beneficiário
            com segurança, pontualidade e responsabilidade nos dias úteis letivos.
          </Text>
          <Text style={styles.clausula}>
            2. O CONTRATANTE se compromete a efetuar o pagamento mensal até o dia 10 de cada mês,
            sob pena de suspensão do serviço após 15 dias de atraso.
          </Text>
          <Text style={styles.clausula}>
            3. O cancelamento do contrato deve ser comunicado com 30 dias de antecedência por qualquer das partes.
          </Text>
          <Text style={styles.clausula}>
            4. Ausências justificadas com mais de 48h de antecedência poderão ser compensadas com
            dias adicionais, a critério do CONTRATADO.
          </Text>
          <Text style={styles.clausula}>
            5. O CONTRATADO possui seguro de responsabilidade civil e o veículo está regularmente
            licenciado conforme exigências do DETRAN.
          </Text>
        </View>

        {/* Assinaturas */}
        <View style={styles.assinatura}>
          <View style={styles.assinaturaBox}>
            <Text style={styles.assinaturaLabel}>{perfilResponsavel.nome}</Text>
            <Text style={styles.assinaturaLabel}>Contratante</Text>
          </View>
          <View style={styles.assinaturaBox}>
            <Text style={styles.assinaturaLabel}>{perfilMotorista.nome}</Text>
            <Text style={styles.assinaturaLabel}>Contratado / Motorista</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Tio da Van — Gestão de Transporte Escolar</Text>
          <Text style={styles.footerText}>{dataEmissao}</Text>
        </View>
      </Page>
    </Document>
  )
}
