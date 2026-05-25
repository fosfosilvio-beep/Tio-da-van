'use client'
import { useState } from 'react'
import Link from 'next/link'

const ABAS = ['Dados do Veículo', 'Fotos', 'Documentos', 'Rotas e Horários']
const TURNOS = ['Manhã', 'Tarde', 'Integral', 'Noturno']
const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
const BAIRROS_SUGERIDOS = ['Moema', 'Itaim Bibi', 'Jardins', 'Liberdade', 'Bela Vista', 'Pinheiros']

function UploadDoc({ label, sublabel, required = false, icon = '📄' }: { label: string; sublabel?: string; required?: boolean; icon?: string }) {
  const [done, setDone] = useState(false)
  return (
    <div style={{ background: '#fff', border: '1px solid #dde1e7', borderRadius: 10, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#eef3fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{done ? '✅' : icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1c1e', marginBottom: 2 }}>
          {label}
          {required && <span style={{ color: '#e74c3c', marginLeft: 4 }}>*</span>}
          {!required && <span style={{ color: '#2ecc71', fontSize: '0.75rem', fontWeight: 600, marginLeft: 8, background: '#eafaf1', padding: '2px 8px', borderRadius: 99 }}>Opcional</span>}
        </div>
        {sublabel && <div style={{ fontSize: '0.8rem', color: '#718096' }}>{sublabel}</div>}
        {done && <div style={{ height: 4, background: '#eafaf1', borderRadius: 99, marginTop: 8 }}><div style={{ height: '100%', width: '100%', background: '#2ecc71', borderRadius: 99 }} /></div>}
      </div>
      <button onClick={() => setDone(!done)} style={{ padding: '8px 16px', border: '1.5px solid #2d4b73', borderRadius: 8, background: done ? '#eafaf1' : '#fff', color: '#2d4b73', fontWeight: 600, cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
        {done ? 'Enviado ✓' : 'Enviar'}
      </button>
    </div>
  )
}

export default function CadastroVanPage() {
  const [aba, setAba] = useState(0)
  const [turnos, setTurnos] = useState<string[]>([])
  const [dias, setDias] = useState<string[]>(['Seg', 'Ter', 'Qua', 'Qui', 'Sex'])
  const [bairros, setBairros] = useState<string[]>(['Centro', 'Vila Madalena'])
  const [escolas, setEscolas] = useState<string[]>(['Colégio São José'])
  const [novoBairro, setNovoBairro] = useState('')
  const [novaEscola, setNovaEscola] = useState('')

  function toggleTurno(t: string) { setTurnos(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]) }
  function toggleDia(d: string) { setDias(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]) }
  function adicionarBairro() { if (novoBairro.trim()) { setBairros(prev => [...prev, novoBairro.trim()]); setNovoBairro('') } }
  function adicionarEscola() { if (novaEscola.trim()) { setEscolas(prev => [...prev, novaEscola.trim()]); setNovaEscola('') } }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900, margin: '0 auto', fontFamily: 'Manrope, sans-serif' }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: 6 }}>
          <Link href="/dashboard" style={{ color: '#2d4b73', textDecoration: 'none' }}>Dashboard</Link> › <Link href="/dashboard" style={{ color: '#2d4b73', textDecoration: 'none' }}>Minha Frota</Link> › Novo Veículo
        </div>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1a1c1e', margin: 0 }}>Cadastro do Veículo</h1>
      </div>

      {/* Nota de aviso */}
      <div style={{ background: '#fffbf0', border: '1px solid #ffb74d', borderLeft: '4px solid #ffb74d', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>⏱️</span>
        <span style={{ fontSize: '0.875rem', color: '#4a5568' }}>Seus dados serão validados em até <strong>24h</strong>. Fotos de qualidade aumentam suas chances de contratação.</span>
      </div>

      {/* TABS */}
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(45,75,115,0.06)' }}>
        <div style={{ display: 'flex', borderBottom: '2px solid #eef0f4' }}>
          {ABAS.map((a, i) => {
            const isDone = i < aba
            const isActive = i === aba
            return (
              <button key={a} onClick={() => setAba(i)} style={{ flex: 1, padding: '16px 12px', border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: isActive ? 700 : 500, fontSize: '0.875rem', color: isActive ? '#2d4b73' : isDone ? '#2ecc71' : '#718096', background: isActive ? '#fff' : '#f8f9fb', borderBottom: isActive ? '2px solid #ffb74d' : '2px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {isDone && <span style={{ color: '#2ecc71' }}>✓</span>}
                {a}
              </button>
            )
          })}
        </div>

        <div style={{ padding: 32 }}>
          {/* ===== ABA 1: DADOS ===== */}
          {aba === 0 && (
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#2d4b73', margin: '0 0 24px' }}>Dados do Veículo</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Placa', placeholder: 'ABC-1234', required: true },
                  { label: 'Modelo / Marca', placeholder: 'Ex: Mercedes Sprinter 2020', required: true },
                  { label: 'Ano de Fabricação', placeholder: '2020', required: true },
                  { label: 'Cor', placeholder: 'Ex: Branco', required: true },
                  { label: 'Número de Passageiros', placeholder: '14', required: true },
                  { label: 'Valor Mensalidade por Aluno (R$)', placeholder: '450,00', required: true },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#2d4b73', display: 'block', marginBottom: 6 }}>{f.label}{f.required && <span style={{ color: '#e74c3c' }}>*</span>}</label>
                    <input placeholder={f.placeholder} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #dde1e7', borderRadius: 8, fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#2d4b73', display: 'block', marginBottom: 6 }}>Tipo de Veículo <span style={{ color: '#e74c3c' }}>*</span></label>
                  <select style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #dde1e7', borderRadius: 8, fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem', background: '#fff' }}>
                    <option>Van</option><option>Kombi</option><option>Micro-ônibus</option><option>Ônibus</option>
                  </select>
                </div>
              </div>

              {/* Turnos */}
              <div style={{ marginTop: 20 }}>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#2d4b73', display: 'block', marginBottom: 10 }}>Turno de Operação <span style={{ color: '#e74c3c' }}>*</span></label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {TURNOS.map(t => (
                    <button key={t} onClick={() => toggleTurno(t)} style={{ padding: '8px 20px', border: '1.5px solid', borderRadius: 99, cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: '0.875rem', background: turnos.includes(t) ? '#2d4b73' : '#fff', color: turnos.includes(t) ? '#fff' : '#4a5568', borderColor: turnos.includes(t) ? '#2d4b73' : '#dde1e7', transition: 'all 0.2s' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Descrição */}
              <div style={{ marginTop: 20 }}>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#2d4b73', display: 'block', marginBottom: 6 }}>Descrição / Observações</label>
                <textarea rows={4} placeholder="Descreva seu serviço, diferenciais, detalhes do trajeto..." style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #dde1e7', borderRadius: 8, fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
            </div>
          )}

          {/* ===== ABA 2: FOTOS ===== */}
          {aba === 1 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#2d4b73', margin: 0 }}>Fotos do Veículo</h2>
                <span style={{ background: '#eef0f4', color: '#718096', padding: '4px 12px', borderRadius: 99, fontSize: '0.8rem', fontWeight: 600 }}>0 de 4 fotos</span>
              </div>
              <p style={{ color: '#718096', fontSize: '0.9rem', margin: '0 0 24px' }}>Envie pelo menos 3 fotos. Fotos de alta qualidade aumentam muito a confiança dos pais.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'Frente do Veículo', required: true },
                  { label: 'Lateral Direita', required: true },
                  { label: 'Interior do Veículo', required: true },
                  { label: 'Traseira do Veículo', required: false },
                ].map(foto => (
                  <div key={foto.label} style={{ border: '2px dashed #dde1e7', borderRadius: 10, padding: 32, textAlign: 'center', cursor: 'pointer', background: '#f8f9fb' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#ffb74d')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#dde1e7')}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>📸</div>
                    <div style={{ fontWeight: 700, color: '#2d4b73', marginBottom: 4 }}>{foto.label}{foto.required && <span style={{ color: '#e74c3c' }}>*</span>}</div>
                    <div style={{ fontSize: '0.78rem', color: '#718096' }}>Clique ou arraste a foto</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#eef3fa', borderRadius: 8, padding: 16 }}>
                <div style={{ fontWeight: 700, color: '#2d4b73', fontSize: '0.9rem', marginBottom: 10 }}>💡 Dicas para fotos melhores</div>
                {['Tire fotos com boa iluminação natural', 'Mantenha o veículo limpo e organizado', 'Inclua fotos dos cintos de segurança', 'Mostre o interior com os bancos visíveis'].map(tip => (
                  <div key={tip} style={{ fontSize: '0.85rem', color: '#4a5568', marginBottom: 6 }}>✓ {tip}</div>
                ))}
              </div>
            </div>
          )}

          {/* ===== ABA 3: DOCUMENTOS ===== */}
          {aba === 2 && (
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#2d4b73', margin: '0 0 8px' }}>Documentos do Veículo</h2>
              <p style={{ color: '#718096', fontSize: '0.9rem', margin: '0 0 24px' }}>Envie os documentos oficiais do seu veículo. CRLV é obrigatório para publicação.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                <UploadDoc label="CRLV — Certificado de Registro e Licenciamento" sublabel="PDF, JPG ou PNG — Max 10MB. Deve estar dentro da validade." required icon="📋" />
                <UploadDoc label="Laudo de Vistoria Técnica" sublabel="Aumenta a confiança dos pais. Válido por 6 meses." icon="🔍" />
                <UploadDoc label="Apólice de Seguro" sublabel="Seguro contra terceiros ou total. Recomendado." icon="🛡️" />
                <UploadDoc label="Alvará Municipal ou Permissão de Transporte" sublabel="Se você possuir autorização municipal para transporte escolar." icon="📝" />
              </div>
              {/* Checklist */}
              <div style={{ background: '#eafaf1', border: '1px solid #2ecc71', borderRadius: 8, padding: 16 }}>
                <div style={{ fontWeight: 700, color: '#2d4b73', fontSize: '0.9rem', marginBottom: 12 }}>Revisão do Cadastro</div>
                {[
                  { label: 'Dados do veículo preenchidos', done: true },
                  { label: 'Fotos enviadas', done: false },
                  { label: 'CRLV enviado', done: false },
                  { label: 'Rotas e horários configurados', done: false },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, fontSize: '0.875rem' }}>
                    <span>{item.done ? '✅' : '⚠️'}</span>
                    <span style={{ color: item.done ? '#2ecc71' : '#f39c12', fontWeight: item.done ? 600 : 400 }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== ABA 4: ROTAS E HORÁRIOS ===== */}
          {aba === 3 && (
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#2d4b73', margin: '0 0 24px' }}>Rotas e Horários</h2>

              {/* Bairros */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontWeight: 700, fontSize: '0.95rem', color: '#2d4b73', display: 'block', marginBottom: 4 }}>Bairros que Você Atende <span style={{ color: '#e74c3c' }}>*</span></label>
                <p style={{ color: '#718096', fontSize: '0.85rem', margin: '0 0 12px' }}>Adicione todos os bairros onde você faz coleta ou entrega de alunos.</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  {bairros.map(b => (
                    <span key={b} style={{ padding: '5px 14px', background: '#2d4b73', color: '#fff', borderRadius: 99, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setBairros(prev => prev.filter(x => x !== b))}>
                      {b} ✕
                    </span>
                  ))}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input value={novoBairro} onChange={e => setNovoBairro(e.target.value)} onKeyDown={e => e.key === 'Enter' && adicionarBairro()} placeholder="+ Adicionar bairro" style={{ padding: '5px 12px', border: '1.5px dashed #2d4b73', borderRadius: 99, fontFamily: 'Manrope, sans-serif', fontSize: '0.85rem', outline: 'none', width: 160 }} />
                    <button onClick={adicionarBairro} style={{ padding: '5px 14px', background: '#ffb74d', border: 'none', borderRadius: 99, cursor: 'pointer', fontWeight: 700, fontFamily: 'Manrope, sans-serif', fontSize: '0.85rem' }}>+</button>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: 6 }}>Sugestões:</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {BAIRROS_SUGERIDOS.filter(b => !bairros.includes(b)).map(b => (
                    <span key={b} onClick={() => setBairros(prev => [...prev, b])} style={{ padding: '4px 12px', background: '#eef3fa', color: '#2d4b73', borderRadius: 99, fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 }}>{b}</span>
                  ))}
                </div>
              </div>

              {/* Escolas */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontWeight: 700, fontSize: '0.95rem', color: '#2d4b73', display: 'block', marginBottom: 4 }}>Escolas que Você Atende <span style={{ color: '#e74c3c' }}>*</span></label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {escolas.map(e => (
                    <span key={e} style={{ padding: '5px 14px', background: '#2d4b73', color: '#fff', borderRadius: 99, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setEscolas(prev => prev.filter(x => x !== e))}>
                      {e} ✕
                    </span>
                  ))}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input value={novaEscola} onChange={e => setNovaEscola(e.target.value)} onKeyDown={e => e.key === 'Enter' && adicionarEscola()} placeholder="+ Adicionar escola" style={{ padding: '5px 12px', border: '1.5px dashed #2d4b73', borderRadius: 99, fontFamily: 'Manrope, sans-serif', fontSize: '0.85rem', outline: 'none', width: 180 }} />
                    <button onClick={adicionarEscola} style={{ padding: '5px 14px', background: '#ffb74d', border: 'none', borderRadius: 99, cursor: 'pointer', fontWeight: 700, fontFamily: 'Manrope, sans-serif', fontSize: '0.85rem' }}>+</button>
                  </div>
                </div>
              </div>

              {/* Horários */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                {[{ label: 'Coleta Manhã', placeholder: '06:30' }, { label: 'Retorno Tarde', placeholder: '17:00' }, { label: 'Coleta Tarde (opcional)', placeholder: '12:00' }, { label: 'Retorno Noite (opcional)', placeholder: '18:30' }].map(h => (
                  <div key={h.label}>
                    <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#2d4b73', display: 'block', marginBottom: 6 }}>{h.label}</label>
                    <input type="time" defaultValue={h.placeholder} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #dde1e7', borderRadius: 8, fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                  </div>
                ))}
              </div>

              {/* Dias */}
              <div>
                <label style={{ fontWeight: 700, fontSize: '0.95rem', color: '#2d4b73', display: 'block', marginBottom: 10 }}>Dias de Operação <span style={{ color: '#e74c3c' }}>*</span></label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {DIAS.map(d => (
                    <button key={d} onClick={() => toggleDia(d)} style={{ padding: '8px 16px', border: '1.5px solid', borderRadius: 8, cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.875rem', background: dias.includes(d) ? '#2d4b73' : '#fff', color: dias.includes(d) ? '#fff' : '#4a5568', borderColor: dias.includes(d) ? '#2d4b73' : '#dde1e7', transition: 'all 0.2s' }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AÇÕES */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          {aba > 0 && (
            <button onClick={() => setAba(a => a - 1)} style={{ padding: '12px 20px', border: '1.5px solid #dde1e7', borderRadius: 8, background: '#fff', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: 600, color: '#4a5568' }}>
              ← Voltar
            </button>
          )}
          <button style={{ padding: '12px 20px', border: '1.5px solid #dde1e7', borderRadius: 8, background: '#fff', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: 600, color: '#4a5568' }}>
            Salvar Rascunho
          </button>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/dashboard" style={{ color: '#718096', fontSize: '0.875rem', textDecoration: 'underline' }}>Cancelar</Link>
          {aba < ABAS.length - 1 ? (
            <button onClick={() => setAba(a => a + 1)} style={{ padding: '12px 24px', background: '#ffb74d', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#1a1c1e' }}>
              Salvar e Continuar →
            </button>
          ) : (
            <Link href="/dashboard" style={{ padding: '12px 24px', background: '#2d4b73', borderRadius: 8, color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              🚐 Publicar Veículo!
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
