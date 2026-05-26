'use client'

import { SlidersHorizontal, Key, Money, FloppyDisk } from '@phosphor-icons/react'

export default function ConfiguracoesAdminPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-display font-bold flex items-center gap-3 text-[#1a1c1e]">
          <SlidersHorizontal className="text-[#2d4b73]" weight="fill" />
          Configurações da Plataforma
        </h1>
        <p className="text-[#718096] mt-1">
          Parâmetros globais, taxas de split e chaves de API.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* API Asaas */}
        <div className="bg-white rounded-2xl border border-[#dde1e7] shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#1a1c1e] flex items-center gap-2 mb-4 border-b border-[#dde1e7] pb-2">
            <Key className="text-[#2d4b73]" /> Integração Asaas (Produção)
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#4a5568] block mb-1">API Key</label>
              <input 
                type="password" 
                defaultValue="****************************************"
                className="w-full bg-[#f8f9fb] border border-[#dde1e7] text-[#1a1c1e] rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-[#2d4b73]" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#4a5568] block mb-1">Wallet ID (Conta Recebedora Master)</label>
              <input 
                type="text" 
                defaultValue="b1a2c3d4-e5f6-7890-abcd-ef1234567890"
                className="w-full bg-[#f8f9fb] border border-[#dde1e7] text-[#1a1c1e] rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-[#2d4b73]" 
              />
            </div>
          </div>
        </div>

        {/* Taxas e Parâmetros */}
        <div className="bg-white rounded-2xl border border-[#dde1e7] shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#1a1c1e] flex items-center gap-2 mb-4 border-b border-[#dde1e7] pb-2">
            <Money className="text-[#2d4b73]" /> Taxas e Monetização
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#4a5568] block mb-1">Taxa de Plataforma (Split Padrão)</label>
              <div className="relative">
                <input 
                  type="number" 
                  defaultValue="5.0"
                  step="0.1"
                  className="w-full bg-[#f8f9fb] border border-[#dde1e7] text-[#1a1c1e] rounded-lg pl-3 pr-8 py-2 font-mono text-sm focus:outline-none focus:border-[#2d4b73]" 
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718096] font-bold">%</span>
              </div>
              <p className="text-[10px] text-[#718096] mt-1">Essa taxa será descontada de todas as mensalidades via Pix.</p>
            </div>
            
            <div>
               <label className="text-xs font-bold text-[#4a5568] block mb-1">Dias de Carência Bloqueio de Motorista</label>
              <input 
                type="number" 
                defaultValue="3"
                className="w-full bg-[#f8f9fb] border border-[#dde1e7] text-[#1a1c1e] rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-[#2d4b73]" 
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button className="bg-[#ffb74d] hover:bg-[#f59e0b] text-[#1a1c1e] font-bold py-3 px-8 rounded-xl shadow-sm transition-all flex items-center gap-2">
          <FloppyDisk size={20} weight="fill" /> Salvar Configurações
        </button>
      </div>
    </div>
  )
}
