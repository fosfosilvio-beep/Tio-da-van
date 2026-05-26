'use client'

import { MapPin, PhoneCall, CalendarX, Info } from '@phosphor-icons/react/dist/ssr'

export default function MeusFilhosPage() {
  return (
    <div className="w-full flex flex-col min-h-full pb-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#13345b] tracking-tight">Rastreamento em Tempo Real</h2>
        <p className="text-sm text-[#43474e] mt-1">Acompanhe a localização e o status atual do transporte.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Area (Map Slot + Info) */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          <div className="bg-[#e1e2e4] rounded-[24px] border border-[#c3c6cf] shadow-inner h-[500px] flex items-center justify-center relative overflow-hidden bg-cover bg-center">
             {/* Map Placeholder */}
             <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=-23.5505,-46.6333&zoom=14&size=800x500&maptype=roadmap&style=feature:all|element:labels.text.fill|color:0x8ec3b9&style=feature:all|element:labels.icon|visibility:off&style=feature:landscape|element:geometry|color:0xf8f9fb&style=feature:water|element:geometry|color:0xd4e3ff')] bg-cover bg-center opacity-60"></div>
             
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-[#e1e2e4] text-center z-10">
               <MapPin size={32} className="text-[#13345b] mx-auto mb-2" weight="fill" />
               <p className="text-sm font-bold text-[#13345b]">Slot do Google Maps</p>
               <p className="text-xs text-[#74777f]">Será integrado na próxima fase</p>
             </div>
          </div>
          
          <div className="bg-[#f8f9fb] border border-[#e1e2e4] rounded-xl p-4 flex items-center gap-3">
             <Info size={20} className="text-[#13345b]" weight="bold" />
             <p className="text-sm text-[#43474e]">O sinal do GPS é atualizado a cada 30 segundos para maior precisão.</p>
          </div>
        </div>

        {/* Right Sidebar (Timeline) */}
        <div className="xl:col-span-4 bg-white rounded-[24px] shadow-sm border border-[#e1e2e4] p-6 flex flex-col">
          
          {/* Profile */}
          <div className="flex items-center gap-4 border-b border-[#e1e2e4] pb-6 mb-6">
            <img src="https://ui-avatars.com/api/?name=Lucas+Oliveira&background=2d4b73&color=fff&size=80" alt="Lucas Oliveira" className="w-16 h-16 rounded-full border-2 border-[#e1e2e4]" />
            <div>
              <h3 className="font-bold text-[#13345b] text-lg">Lucas Oliveira</h3>
              <div className="inline-flex items-center gap-1.5 bg-[#fdba5f]/20 text-[#744900] px-3 py-1 rounded-full mt-1">
                <div className="w-2 h-2 rounded-full bg-[#744900]"></div>
                <span className="text-[11px] font-bold">Embarcado às 07:15</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex-1 relative mb-8 ml-2 mt-4">
            <div className="absolute top-4 bottom-8 left-[9px] w-0.5 bg-[#e1e2e4]"></div>
            
            {/* Step 1: Done */}
            <div className="flex gap-4 relative mb-10">
              <div className="w-5 h-5 rounded-full bg-[#13345b] border-4 border-white flex items-center justify-center z-10 shadow-sm mt-1" />
              <div>
                <p className="font-bold text-[#191c1e] text-sm">Casa</p>
                <p className="text-xs text-[#74777f]">R. das Flores, 123 - 07:10</p>
              </div>
            </div>

            {/* Step 2: Current */}
            <div className="flex gap-4 relative mb-10">
              <div className="w-5 h-5 rounded-full bg-white border-[5px] border-[#fdba5f] flex items-center justify-center z-10 shadow-sm mt-1" />
              <div>
                <p className="font-bold text-[#13345b] text-sm">Na Van (Em trânsito)</p>
                <p className="text-xs text-[#744900] font-semibold mt-0.5">Chegada prevista: 07:45</p>
              </div>
            </div>

            {/* Step 3: Pending */}
            <div className="flex gap-4 relative">
              <div className="w-5 h-5 rounded-full bg-[#e1e2e4] border-4 border-white flex items-center justify-center z-10 shadow-sm mt-1" />
              <div>
                <p className="font-bold text-[#74777f] text-sm">Escola Elite</p>
                <p className="text-xs text-[#c3c6cf]">Av. Principal, 1000</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 mt-auto">
            <button className="w-full bg-[#13345b] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#13345b]/90 transition-colors shadow-sm">
              <PhoneCall size={20} weight="fill" /> Contatar Motorista
            </button>
            <button className="w-full bg-white text-[#ba1a1a] border border-[#ffdad6] py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#fff0ee] transition-colors">
              <CalendarX size={20} weight="bold" /> Informar Ausência Amanhã
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}
