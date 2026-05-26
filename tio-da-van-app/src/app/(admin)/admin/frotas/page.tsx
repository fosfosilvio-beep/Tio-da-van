'use client'

import { Van, Buildings, CarProfile, CaretRight } from '@phosphor-icons/react'

export default function AuditoriaFrotasPage() {
  const frotas = [
    { id: '1', nome: 'Viação Oliveira LTDA', cnpj: '12.345.678/0001-90', vans: 4, faturamento: 15400, status: 'ativo' },
    { id: '2', nome: 'Transportes Rápidos SP', cnpj: '98.765.432/0001-10', vans: 12, faturamento: 42000, status: 'ativo' },
    { id: '3', nome: 'Van Segura', cnpj: '45.678.901/0001-23', vans: 2, faturamento: 8200, status: 'pendente' }
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-display font-bold flex items-center gap-3 text-[#1a1c1e]">
          <Van className="text-[#2d4b73]" weight="fill" />
          Auditoria de Frotas
        </h1>
        <p className="text-[#718096] mt-1">Visão geral e faturamento das empresas de transporte escolar.</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {frotas.map((frota) => (
          <div key={frota.id} className="bg-white rounded-2xl border border-[#dde1e7] shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#2d4b73]/50 transition-colors group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#eef3fa] rounded-xl flex items-center justify-center border border-[#dde1e7] shrink-0">
                <Buildings size={24} className="text-[#2d4b73]" weight="fill" />
              </div>
              <div>
                <h3 className="font-bold text-[#1a1c1e] text-lg">{frota.nome}</h3>
                <p className="text-sm font-mono text-[#718096]">CNPJ: {frota.cnpj}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#2d4b73] bg-[#eef3fa] px-2.5 py-1 rounded-md border border-[#dde1e7]">
                    <CarProfile size={14} /> {frota.vans} Veículos Ativos
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${frota.status === 'ativo' ? 'bg-[#eafaf1] text-[#2ecc71]' : 'bg-[#fffbf0] text-[#f39c12]'}`}>
                    {frota.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 justify-between md:justify-end w-full md:w-auto border-t md:border-t-0 border-[#eef0f4] pt-4 md:pt-0">
              <div className="text-left md:text-right">
                <p className="text-[10px] font-bold text-[#718096] uppercase tracking-wider mb-1">Faturamento Mensal Estimado</p>
                <p className="text-xl font-extrabold text-[#1a1c1e]">R$ {frota.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <button className="w-10 h-10 rounded-full bg-[#f8f9fb] border border-[#dde1e7] flex items-center justify-center text-[#4a5568] group-hover:bg-[#2d4b73] group-hover:text-white transition-all shadow-sm">
                <CaretRight weight="bold" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
