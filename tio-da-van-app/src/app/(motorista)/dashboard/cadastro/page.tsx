'use client'
import { useState } from 'react'
import Link from 'next/link'

const ETAPAS = ['Dados Pessoais', 'Documentos', 'Pagamento']

function UploadBox({ label, sublabel, required = false }: { label: string; sublabel?: string; required?: boolean }) {
  const [file, setFile] = useState<string | null>(null)
  return (
    <div>
      <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#2d4b73', display: 'block', marginBottom: 6 }}>
        {label} {required && <span style={{ color: '#e74c3c' }}>*</span>}
      </label>
      <div
        onClick={() => { /* abrir file picker */ }}
        style={{ border: '2px dashed #dde1e7', borderRadius: 8, padding: '20px 16px', textAlign: 'center', cursor: 'pointer', background: file ? '#eafaf1' : '#f8f9fb', transition: 'border-color 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = '#ffb74d')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = '#dde1e7')}
      >
        <div style={{ fontSize: 28, marginBottom: 8 }}>{file ? '✅' : '📄'}</div>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#2d4b73' }}>{file ? 'Enviado!' : 'Clique para enviar'}</div>
        {sublabel && <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: 4 }}>{sublabel}</div>}
      </div>
    </div>
  )
}

function Campo({ label, placeholder, type = 'text', half = false, required = false }: { label: string; placeholder?: string; type?: string; half?: boolean; required?: boolean }) {
  return (
    <div style={{ gridColumn: half ? 'span 1' : 'span 2' }}>
      <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#2d4b73', display: 'block', marginBottom: 6 }}>
        {label} {required && <span style={{ color: '#e74c3c' }}>*</span>}
        {!required && <span style={{ fontSize: '0.75rem', color: '#718096', fontWeight: 400 }}> (opcional)</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #dde1e7', borderRadius: 8, fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', color: '#1a1c1e' }}
        onFocus={e => (e.target.style.borderColor = '#2d4b73')}
        onBlur={e => (e.target.style.borderColor = '#dde1e7')}
      />
    </div>
  )
}

export default function CadastroMotoristaPage() {
  const [step, setStep] = useState(1)

  const progresso = ((step - 1) / ETAPAS.length) * 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 860, margin: '0 auto', fontFamily: 'Manrope, sans-serif' }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: 6 }}>
          <Link href="/dashboard" style={{ color: '#2d4b73', textDecoration: 'none' }}>Dashboard</Link> › Meu Cadastro Profissional
        </div>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1a1c1e', margin: 0 }}>Meu Cadastro Profissional</h1>
      </div>

      {/* Stepper */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(45,75,115,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 16, position: 'relative' }}>
          {ETAPAS.map((etapa, i) => {
            const num = i + 1
            const isDone = step > num
            const isActive = step === num
            return (
              <div key={etapa} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {i > 0 && <div style={{ position: 'absolute', top: 18, left: '-50%', width: '100%', height: 2, background: isDone ? '#ffb74d' : '#eef0f4' }} />}
                <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', zIndex: 1, background: isDone ? '#2ecc71' : isActive ? '#ffb74d' : '#eef0f4', color: isDone || isActive ? '#1a1c1e' : '#718096', boxShadow: isActive ? '0 0 0 4px rgba(255,183,77,0.2)' : 'none', transition: 'all 0.3s' }}>
                  {isDone ? '✓' : num}
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: isActive ? 700 : 500, color: isActive ? '#2d4b73' : '#718096', marginTop: 8, textAlign: 'center' }}>{etapa}</span>
              </div>
            )
          })}
        </div>
        {/* Barra de progresso */}
        <div style={{ height: 6, background: '#eef0f4', borderRadius: 99 }}>
          <div style={{ height: '100%', width: `${progresso + 33}%`, background: '#ffb74d', borderRadius: 99, transition: 'width 0.4s' }} />
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.78rem', color: '#718096', marginTop: 6 }}>Etapa {step} de {ETAPAS.length}</div>
      </div>

      {/* FORMULÁRIO */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(45,75,115,0.06)' }}>

        {/* ===== ETAPA 1: DADOS PESSOAIS ===== */}
        {step === 1 && (
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#2d4b73', margin: '0 0 24px' }}>Dados Pessoais e Profissionais</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Campo label="Nome completo" placeholder="Seu nome como no RG" required />
              <Campo label="CPF" placeholder="000.000.000-00" half required />
              <Campo label="RG" placeholder="00.000.000-0" half required />
              <Campo label="CNPJ" placeholder="00.000.000/0000-00" half />
              <Campo label="Data de Nascimento" type="date" half required />
              <Campo label="WhatsApp" placeholder="+55 (11) 99999-9999" half required />
              <Campo label="E-mail" type="email" placeholder="seu@email.com" half required />
              <Campo label="Endereço completo" placeholder="Rua, número, complemento" required />
              <Campo label="Bairro" placeholder="Bairro" half required />
              <Campo label="Cidade" placeholder="Cidade" half required />
              <Campo label="CEP" placeholder="00000-000" half required />
              <Campo label="Instagram" placeholder="@seu_perfil" half />
              <Campo label="Facebook" placeholder="facebook.com/seu_perfil" half />
            </div>

            {/* Foto de Perfil e Selfie */}
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#2d4b73', margin: '28px 0 16px' }}>Foto de Perfil e Selfie de Verificação</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <UploadBox label="Foto de Perfil" sublabel="Foto pública — JPG, PNG, max 5MB" required />
              <UploadBox label="Selfie de Verificação (Prova de Vida)" sublabel="Tire uma foto segurando seu RG — JPG, PNG" required />
            </div>
          </div>
        )}

        {/* ===== ETAPA 2: DOCUMENTOS ===== */}
        {step === 2 && (
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#2d4b73', margin: '0 0 8px' }}>Documentos de Identificação</h2>
            <p style={{ color: '#718096', fontSize: '0.9rem', margin: '0 0 24px' }}>Envie fotos claras. JPG ou PNG, max 5MB cada.</p>

            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#2d4b73', margin: '0 0 16px' }}>Carteira Nacional de Habilitação (CNH)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
              <UploadBox label="CNH — Frente" sublabel="Página com foto — JPG, PNG" required />
              <UploadBox label="CNH — Verso" sublabel="Página com vencimento — JPG, PNG" required />
            </div>

            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#2d4b73', margin: '0 0 16px' }}>RG — Documento de Identidade</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
              <UploadBox label="RG — Frente" sublabel="JPG, PNG" required />
              <UploadBox label="RG — Verso" sublabel="JPG, PNG" required />
            </div>

            {/* Info de segurança */}
            <div style={{ background: '#fffbf0', border: '1px solid #ffb74d', borderRadius: 8, padding: 16, display: 'flex', gap: 12 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>🛡️</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1a1c1e', marginBottom: 4 }}>Seus dados estão seguros</div>
                <div style={{ fontSize: '0.8rem', color: '#4a5568', lineHeight: 1.6 }}>Seus documentos são criptografados e usados apenas para verificação. Nunca compartilhamos sem sua permissão.</div>
              </div>
            </div>
          </div>
        )}

        {/* ===== ETAPA 3: PAGAMENTO ===== */}
        {step === 3 && (
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#2d4b73', margin: '0 0 8px' }}>Configuração de Pagamento</h2>
            <p style={{ color: '#718096', fontSize: '0.9rem', margin: '0 0 24px' }}>As mensalidades serão depositadas diretamente na sua chave Pix. A plataforma retém apenas 5% de taxa.</p>

            {/* Simulação de ganhos */}
            <div style={{ background: '#eef3fa', border: '1px solid #2d4b73', borderRadius: 8, padding: 20, marginBottom: 28, borderLeft: '4px solid #2d4b73' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#2d4b73', margin: '0 0 16px' }}>📊 Simulação de Ganhos Mensais</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: '10 alunos × R$ 450', value: 'R$ 4.500 bruto' },
                  { label: 'Taxa da plataforma (5%)', value: '− R$ 225' },
                  { label: 'Total líquido estimado', value: 'R$ 4.275/mês', highlight: true },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: '#4a5568' }}>{item.label}</span>
                    <span style={{ fontWeight: item.highlight ? 800 : 600, fontSize: item.highlight ? '1.1rem' : '0.9rem', color: item.highlight ? '#2ecc71' : '#1a1c1e' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#2d4b73', margin: '0 0 16px' }}>Chave Pix</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#2d4b73', display: 'block', marginBottom: 6 }}>Tipo de Chave <span style={{ color: '#e74c3c' }}>*</span></label>
                <select style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #dde1e7', borderRadius: 8, fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem', boxSizing: 'border-box', color: '#1a1c1e', background: '#fff' }}>
                  <option>CPF</option>
                  <option>CNPJ</option>
                  <option>E-mail</option>
                  <option>Telefone</option>
                  <option>Chave Aleatória</option>
                </select>
              </div>
              <Campo label="Chave Pix" placeholder="000.000.000-00" required />
            </div>

            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#2d4b73', margin: '0 0 16px' }}>Dados Bancários (opcional)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
              {[
                { label: 'Banco', placeholder: 'Ex: Nubank, Bradesco' },
                { label: 'Agência', placeholder: '0000' },
                { label: 'Conta Corrente', placeholder: '00000-0' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#2d4b73', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input placeholder={f.placeholder} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #dde1e7', borderRadius: 8, fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>

            {/* Termos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {['Li e aceito os Termos de Uso e Política de Privacidade do Tio da Van', 'Autorizo o uso dos meus dados para verificação de identidade (KYC)'].map(termo => (
                <label key={termo} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" style={{ width: 18, height: 18, marginTop: 2, accentColor: '#ffb74d', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', color: '#4a5568', lineHeight: 1.5 }}>{termo}</span>
                </label>
              ))}
            </div>

            {/* Card final */}
            <div style={{ background: '#eafaf1', border: '1px solid #2ecc71', borderRadius: 8, padding: 16, display: 'flex', gap: 12 }}>
              <span style={{ fontSize: 22 }}>✅</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1c1e', marginBottom: 4 }}>Você está na etapa final!</div>
                <div style={{ fontSize: '0.85rem', color: '#4a5568', lineHeight: 1.5 }}>Após concluir, seu perfil será revisado em até 24h. Você já pode cadastrar sua van enquanto aguarda.</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AÇÕES */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} style={{ padding: '12px 20px', border: '1.5px solid #dde1e7', borderRadius: 8, background: '#fff', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: 600, color: '#4a5568', fontSize: '0.9rem' }}>
              ← Voltar
            </button>
          )}
          <button style={{ padding: '12px 20px', border: '1.5px solid #dde1e7', borderRadius: 8, background: '#fff', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: 600, color: '#4a5568', fontSize: '0.9rem' }}>
            Salvar Rascunho
          </button>
        </div>
        {step < ETAPAS.length ? (
          <button onClick={() => setStep(s => s + 1)} style={{ padding: '12px 28px', background: '#ffb74d', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#1a1c1e' }}>
            Salvar e Continuar →
          </button>
        ) : (
          <Link href="/dashboard" style={{ padding: '12px 28px', background: '#2d4b73', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            ✅ Concluir Meu Cadastro!
          </Link>
        )}
      </div>
    </div>
  )
}
