'use client'

import { Money, Copy, FilePdf, Faders, Receipt, ShieldCheck } from '@phosphor-icons/react/dist/ssr'

export default function MensalidadesWowdashPage() {
  return (
    <div className="flex flex-col gap-6 relative w-full h-full pb-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-2 mb-2">
        <div>
          <h1 className="font-black text-2xl md:text-3xl text-white tracking-wide mb-1 flex items-center gap-3">
            HUB FINANCEIRO
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] animate-pulse"></span>
          </h1>
          <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">
            Gestão de transações e contratos vigentes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Current Bill Card (HUD Styled) */}
        <div className="lg:col-span-5 bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col justify-between border border-slate-700/50 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
          <div className="absolute -left-20 -top-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-inner">
                  <Money size={28} className="text-cyan-400" weight="fill" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg tracking-wide uppercase">Ciclo Atual</h3>
                  <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mt-1">LIMITE: 10/11/2023</p>
                </div>
              </div>
              <span className="px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] rounded-lg font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                PENDENTE
              </span>
            </div>
            
            <div className="mt-10 mb-12">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Valor Requerido</p>
              <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 tracking-tight leading-none drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">R$ 450,00</p>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-4">REF: OP-TRANSPORTE-NOV/23</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-auto relative z-10">
            <button className="flex-1 bg-cyan-500 text-slate-900 text-xs font-bold uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <Copy size={20} weight="bold" />
              COPIAR CHAVE PIX
            </button>
            <button className="flex-1 bg-slate-800/80 border border-slate-600 text-slate-300 text-xs font-bold uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-700 hover:text-white hover:border-cyan-500/50 transition-all">
              <FilePdf size={20} weight="bold" className="text-cyan-400" />
              EMITIR BOLETO
            </button>
          </div>
        </div>

        {/* Reference Security Card (HUD Style) */}
        <div className="lg:col-span-7 bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-700/50 flex flex-col relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck size={24} className="text-emerald-400" weight="fill" />
            <h3 className="font-bold text-white text-lg tracking-wide uppercase">Criptografia & Transparência</h3>
          </div>
          
          <div className="flex-1 rounded-xl overflow-hidden border border-slate-700 relative bg-slate-900 flex items-center justify-center group">
            {/* Overlay Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-10"></div>
            
            <img 
              alt="Referência de Histórico" 
              className="object-cover w-full h-full opacity-30 mix-blend-luminosity grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOkKEVpCPgF7Z6lNbqaDmKYv2YcnNjlFlKHX_1uhAklAhtxEJ745iOotExZLGC7HhLCCe98GBmTyTK1WFzi0QMXsaWSPUGTDdzTcHzpYgvsa1Hj3W2qwsFO3OcZo22Q4K3ZAT9ymn59_KzFBHjeqoWSngyUg9b0ieNutOFCMj5V9mfTK64GtKwFwPCjK93Ps5v6VoDJ-FoNFX7rgQomfwzKYfFub9D54J62qn0478G9wFJQUi5iXsjF7NgEOSrQbSoeH7ohhxCJps"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent flex items-end p-6 z-20">
              <div className="bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 px-5 py-3 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.1)] w-full flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-0.5">Módulo de Transparência</p>
                  <p className="text-sm font-bold text-white tracking-wide uppercase">Visualização de Recibo Anterior</p>
                </div>
                <button className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-900 transition-all">
                  <Receipt size={20} weight="bold" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History Table (HUD Styled) */}
        <div className="lg:col-span-12 bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-700/50">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700/50">
            <h3 className="font-bold text-white text-lg tracking-wide uppercase flex items-center gap-3">
              <span className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,1)]"></span>
              Log de Transações
            </h3>
            <button className="text-cyan-400 hover:text-cyan-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2 bg-cyan-500/10 px-4 py-2.5 rounded-xl border border-cyan-500/30 hover:bg-cyan-500/20 transition-all shadow-[0_0_10px_rgba(34,211,238,0.1)]">
              FILTROS <Faders size={16} weight="bold" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700/50 text-slate-500 text-[10px] font-mono uppercase tracking-widest">
                  <th className="py-4 px-4">Referência Operacional</th>
                  <th className="py-4 px-4">Timestamp</th>
                  <th className="py-4 px-4">Volume (R$)</th>
                  <th className="py-4 px-4">Status de Rede</th>
                  <th className="py-4 px-4 text-right">Ação Tática</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { mes: 'OUTUBRO 2023', data: '2023-10-08 14:32:00', valor: 'R$ 450,00' },
                  { mes: 'SETEMBRO 2023', data: '2023-09-09 09:15:22', valor: 'R$ 450,00' },
                  { mes: 'AGOSTO 2023', data: '2023-08-10 16:45:10', valor: 'R$ 450,00' },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors group">
                    <td className="py-4 px-4 text-white font-bold tracking-wide">{item.mes}</td>
                    <td className="py-4 px-4 text-slate-400 font-mono text-xs">{item.data}</td>
                    <td className="py-4 px-4 text-cyan-400 font-mono font-bold">{item.valor}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(52,211,153,0.1)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> LIQUIDADO
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 p-2 rounded-lg transition-all inline-flex shadow-[0_0_10px_rgba(34,211,238,0)] hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]" title="Ver Recibo">
                        <Receipt size={20} weight="bold" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
