'use client'

import { MapPin, PhoneCall, CalendarX, Info, Scan, Crosshair, WifiHigh } from '@phosphor-icons/react/dist/ssr'

export default function MeusFilhosWowdashPage() {
  return (
    <div className="flex flex-col gap-6 relative w-full h-full pb-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-2 mb-2">
        <div>
          <h1 className="font-bold text-2xl md:text-3xl text-slate-800 mb-1">
            Acompanhar Trajeto
          </h1>
          <p className="text-slate-500 text-sm">
            Monitoramento em tempo real do trajeto escolar.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-sm text-sm">
            <WifiHigh size={20} className="text-blue-600" /> Atualizar GPS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Area (Map Slot Hub) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl h-[500px] flex items-center justify-center relative overflow-hidden group">
             
             {/* Map Placeholder */}
             <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=-23.5505,-46.6333&zoom=14&size=800x500&maptype=roadmap&style=feature:all|element:labels|visibility:on')] bg-cover bg-center opacity-70 group-hover:opacity-100 transition-all duration-700"></div>
             
             <div className="relative z-30 bg-white/90 backdrop-blur-md border border-slate-200 p-8 rounded-2xl shadow-lg text-center max-w-sm">
               <Crosshair size={48} className="text-blue-600 mx-auto mb-4" weight="duotone" />
               <p className="text-lg font-bold text-slate-800 mb-2">Módulo de Mapa</p>
               <p className="text-sm text-slate-500">Aguardando inicialização da API do Google Maps para exibir a localização exata da van.</p>
             </div>

             {/* Live Indicators */}
             <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-600 uppercase">GPS Online</span>
             </div>
          </div>
          
          {/* Info bar Hub */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
             <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
               <Scan size={24} weight="fill" />
             </div>
             <div className="flex-1">
               <p className="text-sm font-bold text-slate-800">Telemetria Ativa</p>
               <p className="text-sm text-slate-500 mt-0.5">Sinal de localização da van sendo atualizado a cada 30 segundos.</p>
             </div>
          </div>
        </div>

        {/* Right Sidebar (Timeline Hub) */}
        <div className="xl:col-span-4 bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 md:p-8 flex flex-col relative overflow-hidden h-full">
          
          {/* Profile Card */}
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200">
                <img src="https://ui-avatars.com/api/?name=Lucas+Oliveira&background=f8f9fa&color=2563eb&size=80" alt="Lucas Oliveira" className="w-full h-full rounded-xl object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Lucas Oliveira</h3>
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md mt-1">
                <span className="text-xs font-bold uppercase tracking-wide">A bordo às 07:15</span>
              </div>
            </div>
          </div>

          {/* SaaS Timeline */}
          <div className="flex-1 relative mb-8 ml-3 mt-2">
            <div className="absolute top-4 bottom-8 left-[9px] w-[2px] bg-slate-100"></div>
            
            {/* Step 1: Done */}
            <div className="flex gap-5 relative mb-10 group">
              <div className="w-5 h-5 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center z-10 mt-1" />
              <div>
                <p className="font-bold text-slate-500 text-sm">Embarque na Residência</p>
                <p className="text-xs text-slate-400 mt-1">Rua das Flores, 123 - 07:10</p>
              </div>
            </div>

            {/* Step 2: Current */}
            <div className="flex gap-5 relative mb-10">
              <div className="w-5 h-5 rounded-full bg-blue-600 border-[4px] border-blue-100 flex items-center justify-center z-10 mt-1 shadow-sm">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="font-bold text-blue-700 text-sm">Em Trânsito</p>
                <p className="text-xs text-blue-600/80 mt-1">Av. Principal - Previsão: 07:45</p>
              </div>
            </div>

            {/* Step 3: Pending */}
            <div className="flex gap-5 relative">
              <div className="w-5 h-5 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-10 mt-1" />
              <div>
                <p className="font-semibold text-slate-400 text-sm">Destino Final (Escola)</p>
                <p className="text-xs text-slate-400 mt-1">Escola Elite - Centro</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 mt-auto pt-6 border-t border-slate-100">
            <button className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-sm">
              <PhoneCall size={18} weight="fill" className="text-blue-600" /> Falar com Motorista
            </button>
            <button className="w-full bg-orange-50 text-orange-600 hover:bg-orange-100 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all">
              <CalendarX size={18} weight="fill" /> Informar Falta
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}
