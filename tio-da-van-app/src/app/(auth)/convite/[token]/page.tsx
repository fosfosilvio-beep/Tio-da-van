'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { Van, CheckCircle, Warning, IdentificationCard, ShieldCheck } from '@phosphor-icons/react'
import Link from 'next/link'

export default function ConvitePage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params)
  const token = resolvedParams.token
  const router = useRouter()
  
  const [form, setForm] = useState({ nome_aluno: '', escola: '', serie: '', telefone_responsavel: '' })
  const [loading, setLoading] = useState(false)
  const [concluido, setConcluido] = useState(false)

  // MOCK: Motorista vinculado a esse token de convite
  const motorista = {
    nome: 'Carlos Silva',
    foto_url: 'https://ui-avatars.com/api/?name=Carlos+Silva&background=2d4b73&color=fff&size=120&bold=true',
    escolas_atendidas: ['Colégio São José', 'Escola Estadual Tiradentes'],
    nota: 4.9
  }

  const handleCadastro = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setConcluido(true)
    }, 1500)
  }

  if (concluido) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="bg-white max-w-md w-full rounded-[2rem] p-8 border border-[#dde1e7] shadow-xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#2ecc71]" />
          <div className="w-20 h-20 bg-[#eafaf1] rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-sm mb-6">
            <CheckCircle size={40} className="text-[#2ecc71]" weight="fill" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#1a1c1e] mb-2">Aluno Matriculado!</h2>
          <p className="text-[#718096] mb-8">
            Os dados de <strong>{form.nome_aluno}</strong> foram enviados para o Tio {motorista.nome}. Você já pode baixar o aplicativo para acompanhar as viagens.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/login" className="bg-[#2d4b73] text-white font-bold py-3.5 rounded-xl shadow-sm hover:bg-[#1a365d] transition-all">
              Acessar Meu Painel
            </Link>
            <Link href="/" className="bg-[#f8f9fb] text-[#4a5568] font-bold py-3.5 rounded-xl hover:bg-[#eef0f4] transition-all">
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col items-center justify-center p-4 md:p-8 animate-fade-in relative overflow-hidden">
      {/* Background Decorativo Clean */}
      <div className="absolute top-0 left-0 w-full h-64 bg-[#2d4b73] -skew-y-3 origin-top-left z-0" />
      
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        
        {/* Info do Motorista */}
        <div className="bg-white p-8 rounded-[2rem] border border-[#dde1e7] shadow-lg flex flex-col justify-center">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 bg-[#eafaf1] text-[#2ecc71] text-xs font-bold uppercase tracking-wider rounded-full border border-[#2ecc71]/20 w-fit">
            <ShieldCheck weight="fill" size={16} /> Convite Verificado
          </div>
          
          <h1 className="text-3xl font-display font-extrabold text-[#1a1c1e] mb-4 leading-tight">
            Você foi convidado(a) para a van do Tio {motorista.nome.split(' ')[0]}
          </h1>
          <p className="text-[#718096] mb-8">
            Complete o cadastro do seu filho para garantir a vaga e acompanhar as viagens em tempo real pelo app.
          </p>

          <div className="flex items-center gap-4 bg-[#f8f9fb] p-4 rounded-xl border border-[#dde1e7]">
            <img src={motorista.foto_url} alt="Motorista" className="w-16 h-16 rounded-full border-2 border-white shadow-sm" />
            <div>
              <p className="font-bold text-[#1a1c1e]">{motorista.nome}</p>
              <div className="flex items-center gap-1 text-sm text-[#ffb74d] font-bold mt-1">
                {'★'.repeat(Math.floor(motorista.nota))}
                <span className="text-[#718096] font-medium ml-1">({motorista.nota})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Cadastro */}
        <div className="bg-white p-8 rounded-[2rem] border border-[#dde1e7] shadow-xl">
          <h2 className="text-xl font-bold text-[#1a1c1e] mb-6 flex items-center gap-2">
            <IdentificationCard weight="fill" className="text-[#2d4b73]" size={24} />
            Dados do Passageiro
          </h2>
          
          <form onSubmit={handleCadastro} className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-bold text-[#718096] uppercase tracking-wider block mb-1.5">Nome do Aluno *</label>
              <input 
                required
                type="text" 
                placeholder="Ex: João Guilherme Santos"
                className="w-full bg-[#f8f9fb] border border-[#dde1e7] text-[#1a1c1e] rounded-xl px-4 py-3 focus:outline-none focus:border-[#2d4b73] transition-colors font-medium"
                value={form.nome_aluno} onChange={e => setForm({...form, nome_aluno: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#718096] uppercase tracking-wider block mb-1.5">Escola</label>
                <select className="w-full bg-[#f8f9fb] border border-[#dde1e7] text-[#1a1c1e] rounded-xl px-4 py-3 focus:outline-none focus:border-[#2d4b73] transition-colors font-medium" value={form.escola} onChange={e => setForm({...form, escola: e.target.value})}>
                  <option value="">Selecione...</option>
                  {motorista.escolas_atendidas.map(e => <option key={e} value={e}>{e}</option>)}
                  <option value="outra">Outra Escola</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#718096] uppercase tracking-wider block mb-1.5">Série/Ano</label>
                <input 
                  type="text" 
                  placeholder="Ex: 5º Ano B"
                  className="w-full bg-[#f8f9fb] border border-[#dde1e7] text-[#1a1c1e] rounded-xl px-4 py-3 focus:outline-none focus:border-[#2d4b73] transition-colors font-medium"
                  value={form.serie} onChange={e => setForm({...form, serie: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#718096] uppercase tracking-wider block mb-1.5">Seu Celular / WhatsApp *</label>
              <input 
                required
                type="tel" 
                placeholder="(00) 00000-0000"
                className="w-full bg-[#f8f9fb] border border-[#dde1e7] text-[#1a1c1e] rounded-xl px-4 py-3 focus:outline-none focus:border-[#2d4b73] transition-colors font-medium"
                value={form.telefone_responsavel} onChange={e => setForm({...form, telefone_responsavel: e.target.value})}
              />
            </div>

            <div className="bg-[#fffbf0] p-4 rounded-xl border border-[#fde68a] flex items-start gap-3 mt-2">
              <Warning size={20} weight="fill" className="text-[#f39c12] shrink-0 mt-0.5" />
              <p className="text-xs text-[#b45309] font-medium leading-relaxed">
                Ao enviar este cadastro, uma conta será criada automaticamente para você no <strong>Tio da Van</strong> usando o seu número de celular, permitindo o pagamento e rastreio.
              </p>
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-[#ffb74d] hover:bg-[#f59e0b] text-[#1a1c1e] font-extrabold py-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#1a1c1e] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Concluir Matrícula e Baixar o App <Van weight="fill" size={20} /></>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
