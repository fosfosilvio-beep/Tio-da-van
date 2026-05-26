'use client'

import { useState } from 'react'
import { QRCodeGenerator } from '@/components/qrcode/QRCodeGenerator'
import { MapPin, Bus, CheckCircle, Warning, X, Van } from '@phosphor-icons/react/dist/ssr'

export default function MeusFilhosPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'rastreio' | 'qrcode'>('rastreio')

  // Mocks por enquanto - de acordo com as Leis de Governança
  const filho = {
    id: 'aln-001',
    nome: 'João Pedro da Silva',
    escola: 'Colégio Elite',
    status: 'embarcado', // aguardando, embarcado, desembarcado
    ultimaAtualizacao: '07:15 AM'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Monitoramento: {filho.nome}</h1>
          <p className="text-[var(--text-muted)] text-sm">Status em tempo real da rota de hoje</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="btn border border-[var(--accent-warning)] text-[var(--accent-warning)] hover:bg-[var(--accent-warning)] hover:text-[var(--bg-primary)] px-4 py-2"
        >
          <Warning weight="bold" />
          Informar Ausência Hoje
        </button>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border-color)]">
        <button 
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'rastreio' ? 'border-[var(--accent-primary)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
          onClick={() => setActiveTab('rastreio')}
        >
          Rastreio ao Vivo
        </button>
        <button 
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'qrcode' ? 'border-[var(--accent-primary)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
          onClick={() => setActiveTab('qrcode')}
        >
          QR Code (Embarque)
        </button>
      </div>

      {activeTab === 'rastreio' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card de Status */}
          <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center justify-center min-h-[300px]">
            <div className="w-20 h-20 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center mb-4 relative">
              <Bus size={40} className="text-[var(--accent-primary)] animate-pulse" weight="fill" />
              <div className="absolute top-0 right-0 w-5 h-5 bg-[var(--accent-success)] rounded-full border-2 border-[var(--bg-primary)] flex items-center justify-center">
                <CheckCircle weight="fill" className="text-white" size={12} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-[var(--accent-success)] uppercase tracking-wider mb-2">
              EMBARCADO
            </h2>
            <p className="text-[var(--text-muted)] text-sm mb-6">
              João entrou na van às <strong>{filho.ultimaAtualizacao}</strong>. Destino: {filho.escola}.
            </p>
            
            <div className="w-full relative py-8">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-[var(--border-color)] -translate-y-1/2 rounded-full"></div>
              <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-[var(--accent-success)] -translate-y-1/2 rounded-full"></div>
              
              <div className="flex justify-between relative z-10 px-2">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent-success)] border-4 border-[var(--bg-primary)] flex items-center justify-center"></div>
                  <span className="text-xs font-medium text-[var(--text-secondary)]">Aguardando</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent-success)] border-4 border-[var(--bg-primary)] flex items-center justify-center shadow-[0_0_10px_var(--accent-success)]"></div>
                  <span className="text-xs font-bold text-[var(--text-primary)]">Na Van</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--bg-secondary)] border-4 border-[var(--bg-primary)] flex items-center justify-center"></div>
                  <span className="text-xs font-medium text-[var(--text-muted)]">Na Escola</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Card Mapa Mock */}
          <div className="glass-card p-1 rounded-2xl overflow-hidden min-h-[300px] relative flex flex-col">
            <div className="bg-[var(--bg-tertiary)] flex-1 w-full flex items-center justify-center rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=-23.414,-51.428&zoom=14&size=600x400&maptype=roadmap&style=feature:all|element:labels.text.fill|color:0x8ec3b9&style=feature:all|element:labels.text.stroke|color:0x1a3646&style=feature:all|element:labels.icon|visibility:off&style=feature:administrative.country|element:geometry.stroke|color:0x4b6878&style=feature:administrative.land_parcel|element:labels.text.fill|color:0x64779e&style=feature:administrative.province|element:geometry.stroke|color:0x4b6878&style=feature:landscape.man_made|element:geometry.stroke|color:0x334e87&style=feature:landscape.natural|element:geometry|color:0x021019&style=feature:poi|element:geometry|color:0x283d6a&style=feature:poi|element:labels.text.fill|color:0x6f9ba5&style=feature:poi|element:labels.text.stroke|color:0x1d2c4d&style=feature:poi.park|element:geometry.fill|color:0x023e58&style=feature:poi.park|element:labels.text.fill|color:0x3C7680&style=feature:road|element:geometry|color:0x304a7d&style=feature:road|element:labels.text.fill|color:0x98a5be&style=feature:road|element:labels.text.stroke|color:0x1d2c4d&style=feature:road.highway|element:geometry|color:0x2c6675&style=feature:road.highway|element:geometry.stroke|color:0x255763&style=feature:road.highway|element:labels.text.fill|color:0xb0d5ce&style=feature:road.highway|element:labels.text.stroke|color:0x023e58&style=feature:transit|element:labels.text.fill|color:0x98a5be&style=feature:transit|element:labels.text.stroke|color:0x1d2c4d&style=feature:transit.line|element:geometry.fill|color:0x283d6a&style=feature:transit.station|element:geometry|color:0x3a4762&style=feature:water|element:geometry|color:0x0e1626&style=feature:water|element:labels.text.fill|color:0x4e6d70')] bg-cover bg-center opacity-50"></div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                <div className="w-12 h-12 bg-[var(--accent-primary)] rounded-full flex items-center justify-center border-4 border-white/20 shadow-[0_0_20px_var(--accent-primary)] animate-pulse">
                  <Van weight="fill" className="text-white" size={24} />
                </div>
                <div className="bg-[var(--bg-secondary)] px-3 py-1 rounded-full text-xs font-bold mt-2 shadow-lg border border-[var(--border-color)]">
                  Tio Marcos • A 5 min
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'qrcode' && (
        <div className="glass-card p-8 rounded-2xl flex flex-col items-center text-center max-w-xl mx-auto">
          <h2 className="text-xl font-display font-bold mb-2">Crachá de Embarque</h2>
          <p className="text-[var(--text-muted)] text-sm mb-8">
            Mostre este código para o Tio da Van para um embarque expresso e registro automático.
          </p>
          
          <div className="bg-white p-6 rounded-3xl mb-8 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <QRCodeGenerator value={filho.id} size={220} />
          </div>
          
          <div className="w-full bg-[var(--bg-secondary)] p-4 rounded-xl flex items-center justify-between text-left">
            <div>
              <p className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-wider mb-1">Aluno</p>
              <p className="font-bold text-lg">{filho.nome}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-wider mb-1">ID Segurança</p>
              <p className="font-mono text-[var(--accent-primary)] font-bold">{filho.id}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Ausência */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Warning className="text-[var(--accent-warning)]" />
                Informar Ausência
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[var(--text-muted)] hover:text-white">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Tem certeza que deseja informar que <strong>{filho.nome}</strong> não irá na van hoje? O motorista será notificado instantaneamente e a rota recalculada.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setModalOpen(false)}
                className="btn btn-ghost px-4 py-2"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  alert("Ausência registrada com sucesso!");
                  setModalOpen(false);
                }}
                className="btn bg-[var(--accent-warning)] text-[var(--bg-primary)] hover:brightness-110 px-4 py-2"
              >
                Confirmar Ausência
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
