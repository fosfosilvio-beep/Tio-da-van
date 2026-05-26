'use client'

import { MapPin, PhoneCall, CalendarX, Info, Scan, Crosshair, WifiHigh } from '@phosphor-icons/react/dist/ssr'

export default function MeusFilhosWowdashPage() {
  return (
    <div className="flex flex-col gap-6 relative w-full h-full pb-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-2 mb-2">
        <div>
          <h1 className="font-black text-2xl md:text-3xl text-white tracking-wide mb-1 flex items-center gap-3">
            RASTREAMENTO GLOBAL
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] animate-pulse"></span>
          </h1>
          <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">
            Acompanhamento tático de transporte em tempo real.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-slate-800/80 border border-slate-700/50 hover:border-emerald-500/50 hover:bg-slate-800 text-emerald-400 rounded-xl font-bold flex items-center gap-2 transition-all backdrop-blur-md">
            <WifiHigh size={20} /> SYNC GPS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Area (Map Slot HUD) */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-[0_0_30px_rgba(34,211,238,0.05)] rounded-2xl h-[500px] flex items-center justify-center relative overflow-hidden group">
             
             {/* HUD Corners */}
             <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-lg z-20"></div>
             <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-lg z-20"></div>
             <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-lg z-20"></div>
             <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-500/50 rounded-br-lg z-20"></div>

             {/* Grid Overlay */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-10"></div>

             {/* Map Placeholder */}
             <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=-23.5505,-46.6333&zoom=14&size=800x500&maptype=satellite&style=feature:all|element:labels|visibility:off')] bg-cover bg-center opacity-40 mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-1000"></div>
             
             <div className="relative z-30 bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 p-6 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.2)] text-center max-w-sm">
               <Crosshair size={48} className="text-cyan-400 mx-auto mb-4 animate-[spin_4s_linear_infinite] opacity-80" weight="thin" />
               <p className="text-lg font-black text-white tracking-widest uppercase mb-1">Módulo Google Maps</p>
               <p className="text-xs text-cyan-400 font-mono uppercase tracking-widest">Inicialização pendente na fase 2</p>
             </div>

             {/* Live Indicators */}
             <div className="absolute top-6 right-8 z-20 flex gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]"></span>
                <span className="text-[10px] font-mono text-red-400 tracking-widest">REC</span>
             </div>
             <div className="absolute bottom-6 left-8 z-20">
                <p className="text-[10px] font-mono text-cyan-500/50 tracking-widest">LAT: -23.5505 / LNG: -46.6333</p>
             </div>
          </div>
          
          {/* Info bar HUD */}
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 flex items-center gap-4">
             <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
               <Scan size={24} weight="bold" />
             </div>
             <div className="flex-1">
               <p className="text-xs font-bold text-white uppercase tracking-wider">Telemetria Ativa</p>
               <p className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Sinal de GPS sendo sincronizado com satélite a cada 30 segundos.</p>
             </div>
          </div>
        </div>

        {/* Right Sidebar (Timeline HUD) */}
        <div className="xl:col-span-4 bg-slate-800/60 backdrop-blur-xl rounded-[24px] shadow-2xl border border-slate-700/50 p-6 flex flex-col relative overflow-hidden">
          
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Profile Card */}
          <div className="flex items-center gap-4 border-b border-slate-700/50 pb-6 mb-6 relative z-10">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-cyan-500/50 p-1">
                <img src="https://ui-avatars.com/api/?name=Lucas+Oliveira&background=0f172a&color=22d3ee&size=80" alt="Lucas Oliveira" className="w-full h-full rounded-xl object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
            </div>
            <div>
              <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">Passageiro 01</p>
              <h3 className="font-black text-white text-lg tracking-wide">LUCAS OLIVEIRA</h3>
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-lg mt-1 shadow-[0_0_10px_rgba(52,211,153,0.1)]">
                <span className="text-[10px] font-bold uppercase tracking-widest">A bordo às 07:15</span>
              </div>
            </div>
          </div>

          {/* HUD Timeline */}
          <div className="flex-1 relative mb-8 ml-3 mt-4 z-10">
            <div className="absolute top-4 bottom-8 left-[9px] w-[2px] bg-slate-700/50"></div>
            
            {/* Step 1: Done */}
            <div className="flex gap-5 relative mb-10 group">
              <div className="w-5 h-5 rounded-full bg-slate-800 border-2 border-slate-500 flex items-center justify-center z-10 mt-1" />
              <div>
                <p className="font-bold text-slate-300 text-sm tracking-wide uppercase">Ponto de Origem</p>
                <p className="text-[10px] font-mono text-slate-500 mt-1">R. DAS FLORES, 123 - 07:10</p>
              </div>
            </div>

            {/* Step 2: Current */}
            <div className="flex gap-5 relative mb-10">
              <div className="w-5 h-5 rounded-full bg-slate-900 border-[4px] border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] flex items-center justify-center z-10 mt-1">
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="font-bold text-cyan-400 text-sm tracking-wide uppercase">Unidade Móvel (Van)</p>
                <p className="text-[10px] font-mono text-cyan-400/80 mt-1">VELOCIDADE: 45KM/H - ETA: 07:45</p>
              </div>
            </div>

            {/* Step 3: Pending */}
            <div className="flex gap-5 relative">
              <div className="w-5 h-5 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center z-10 mt-1" />
              <div>
                <p className="font-bold text-slate-600 text-sm tracking-wide uppercase">Destino Final</p>
                <p className="text-[10px] font-mono text-slate-600 mt-1">ESCOLA ELITE - AV. PRINCIPAL</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 mt-auto relative z-10">
            <button className="w-full bg-slate-800/80 hover:bg-slate-700 border border-slate-600 hover:border-cyan-500/50 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all">
              <PhoneCall size={18} weight="fill" className="text-cyan-400" /> Transmissão de Voz
            </button>
            <button className="w-full bg-rose-500/10 text-rose-400 border border-rose-500/30 py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)] transition-all">
              <CalendarX size={18} weight="bold" /> Registrar Ausência
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}
