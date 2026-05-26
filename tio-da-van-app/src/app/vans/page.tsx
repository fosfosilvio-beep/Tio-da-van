'use client'
import { useState } from 'react'
import Link from 'next/link'
import { mockMotoristasPublicos, gerarLinkWhatsApp, type MotoristaPublico } from '@/lib/mocks/landing'
import { Van, MagnifyingGlass, Funnel, Star, GraduationCap, MapPin, CheckCircle, WhatsappLogo } from '@phosphor-icons/react'

export default function ListaVansPage() {
  const [escola, setEscola] = useState('')
  const [bairro, setBairro] = useState('')

  const motoristas: MotoristaPublico[] = mockMotoristasPublicos

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#1a1c1e] animate-fade-in font-sans">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-[#dde1e7] sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-decoration-none group">
            <div className="w-10 h-10 bg-[#eef3fa] rounded-lg flex items-center justify-center border border-[#dde1e7] group-hover:bg-[#2d4b73] transition-colors">
              <Van size={24} weight="fill" className="text-[#2d4b73] group-hover:text-white transition-colors" />
            </div>
            <span className="font-display font-extrabold text-xl text-[#2d4b73]">Tio da Van</span>
          </Link>
          <div className="flex gap-3">
            <Link href="/login" className="px-4 py-2 border-2 border-[#2d4b73] rounded-lg text-[#2d4b73] font-bold text-sm hover:bg-[#f8f9fb] transition-colors">Entrar</Link>
          </div>
        </div>
      </nav>

      {/* HEADER BUSCA */}
      <div className="bg-[#2d4b73] py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white mb-4">Encontre o Tio Perfeito</h1>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">Busque por escolas ou bairros e encontre as melhores vans cadastradas na sua região.</p>
          
          <div className="bg-white p-3 rounded-2xl shadow-xl flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0aec0]" size={20} />
              <input
                value={escola}
                onChange={e => setEscola(e.target.value)}
                placeholder="Qual a escola?"
                className="w-full bg-[#f8f9fb] border border-[#dde1e7] rounded-xl pl-12 pr-4 py-3 text-[#1a1c1e] font-medium focus:outline-none focus:border-[#2d4b73]"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0aec0]" size={20} />
              <input
                value={bairro}
                onChange={e => setBairro(e.target.value)}
                placeholder="Qual o bairro?"
                className="w-full bg-[#f8f9fb] border border-[#dde1e7] rounded-xl pl-12 pr-4 py-3 text-[#1a1c1e] font-medium focus:outline-none focus:border-[#2d4b73]"
              />
            </div>
            <button className="bg-[#ffb74d] hover:bg-[#f59e0b] text-[#1a1c1e] font-bold py-3 px-8 rounded-xl transition-colors flex items-center justify-center gap-2">
              <MagnifyingGlass weight="bold" size={18} /> Buscar
            </button>
          </div>
        </div>
      </div>

      {/* GRID DE CARDS */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-[#1a1c1e]">
            {motoristas.length} vans encontradas
          </h2>
          <button className="flex items-center gap-2 text-[#718096] font-bold hover:text-[#2d4b73] transition-colors">
            <Funnel size={20} /> Filtros
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {motoristas.map(m => (
            <div key={m.id} className="bg-white rounded-2xl overflow-hidden border border-[#dde1e7] shadow-sm hover:shadow-xl transition-shadow flex flex-col group">
              {/* Imagem Cover */}
              <div className="relative h-48 bg-[#eef0f4] overflow-hidden">
                <img src={m.foto_van_url} alt={`Van — ${m.nome}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${m.vagas_disponiveis > 0 ? 'bg-[#2ecc71]/90 text-white' : 'bg-[#e74c3c]/90 text-white'}`}>
                    {m.vagas_disponiveis > 0 ? `${m.vagas_disponiveis} Vagas` : 'Lotado'}
                  </span>
                </div>
              </div>
              
              {/* Conteúdo */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex gap-4 -mt-12 relative z-10 mb-4 items-end">
                  <img src={m.foto_perfil_url} alt={m.nome} className="w-16 h-16 rounded-2xl border-4 border-white shadow-md object-cover bg-white" />
                  <div className="mb-1">
                    <h3 className="font-bold text-lg text-[#1a1c1e] leading-tight">{m.nome}</h3>
                    <div className="flex items-center gap-1 text-sm text-[#f59e0b] font-bold">
                      <Star weight="fill" /> {m.avaliacao} <span className="text-[#a0aec0] font-medium text-xs">({m.total_avaliacoes})</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-start gap-2">
                    <GraduationCap className="text-[#a0aec0] shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-[#4a5568]">{m.escolas_atendidas.join(' • ')}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="text-[#a0aec0] shrink-0 mt-0.5" size={18} />
                    <div className="flex flex-wrap gap-1.5">
                      {m.bairros.map(b => (
                         <span key={b} className="bg-[#f8f9fb] border border-[#dde1e7] text-[#4a5568] text-[10px] font-bold px-2 py-0.5 rounded-md">{b}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="text-[#2ecc71] shrink-0 mt-0.5" weight="fill" size={18} />
                    <p className="text-sm font-bold text-[#1a1c1e]">R$ {m.valor_mensalidade}<span className="text-xs text-[#a0aec0] font-medium">/mês</span></p>
                  </div>
                </div>

                {/* Footer Card */}
                <div className="pt-4 border-t border-[#eef0f4]">
                  <a
                    href={gerarLinkWhatsApp(m, escola || undefined, bairro || undefined)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(37,211,102,0.3)]"
                  >
                    <WhatsappLogo size={20} weight="fill" /> Falar no WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
