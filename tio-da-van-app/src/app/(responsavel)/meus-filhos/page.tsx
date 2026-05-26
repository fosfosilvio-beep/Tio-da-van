'use client'

export default function MeusFilhosPage() {
  return (
    <div className="w-full flex flex-col min-h-full pb-8">

      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-headline-lg font-bold text-on-surface tracking-tight">Rastreamento em Tempo Real</h2>
        <p className="text-body-md text-on-surface-variant mt-1">Acompanhe a localização e o status atual do transporte.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left — Map + Info bar */}
        <div className="lg:col-span-8 flex flex-col gap-4">

          {/* Map slot */}
          <div className="bg-surface-container rounded-xl border border-outline-variant/50 shadow-[0_4px_12px_rgba(19,52,91,0.04)] h-[480px] flex items-center justify-center relative overflow-hidden">
            {/* Tinted map overlay */}
            <div className="absolute inset-0 opacity-50 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=-23.5505,-46.6333&zoom=14&size=800x500&maptype=roadmap')] bg-cover bg-center" />

            {/* Centered placeholder */}
            <div className="relative z-10 bg-surface-container-lowest/90 backdrop-blur-sm p-5 rounded-xl shadow-md border border-outline-variant/30 text-center">
              <span
                className="material-symbols-outlined text-primary text-[40px] mb-2 block"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                location_on
              </span>
              <p className="text-label-lg font-bold text-on-surface">Slot do Google Maps</p>
              <p className="text-body-md text-on-surface-variant mt-0.5">Será integrado na próxima fase</p>
            </div>
          </div>

          {/* Info bar */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0_4px_12px_rgba(19,52,91,0.04)] p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[22px] shrink-0">info</span>
            <p className="text-body-md text-on-surface-variant">O sinal do GPS é atualizado a cada 30 segundos para maior precisão.</p>
          </div>
        </div>

        {/* Right — Student card + Timeline + Actions */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(19,52,91,0.04)] border border-outline-variant/30 p-6 flex flex-col">

          {/* Student profile */}
          <div className="flex items-center gap-4 border-b border-outline-variant/50 pb-6 mb-6">
            <img
              src="https://ui-avatars.com/api/?name=Lucas+Oliveira&background=2d4b73&color=fff&size=80"
              alt="Lucas Oliveira"
              className="w-14 h-14 rounded-full border-2 border-outline-variant shrink-0"
            />
            <div>
              <h3 className="text-headline-sm font-bold text-on-surface">Lucas Oliveira</h3>
              <span className="inline-flex items-center gap-1.5 bg-tertiary-fixed text-secondary px-3 py-1 rounded-full mt-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <span className="text-label-md font-bold">Embarcado às 07:15</span>
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex-1 relative mb-8 ml-2">
            {/* Vertical line */}
            <div className="absolute top-4 bottom-8 left-[9px] w-0.5 bg-outline-variant/50" />

            {/* Step 1: Done */}
            <div className="flex gap-4 relative mb-10">
              <div className="w-5 h-5 rounded-full bg-primary border-4 border-surface-container-lowest z-10 shadow-sm mt-0.5 shrink-0" />
              <div>
                <p className="text-label-lg font-bold text-on-surface">Casa</p>
                <p className="text-body-md text-on-surface-variant">R. das Flores, 123 · 07:10</p>
              </div>
            </div>

            {/* Step 2: Current */}
            <div className="flex gap-4 relative mb-10">
              <div className="w-5 h-5 rounded-full bg-surface-container-lowest border-[5px] border-secondary z-10 shadow-sm mt-0.5 shrink-0" />
              <div>
                <p className="text-label-lg font-bold text-primary">Na Van (Em trânsito)</p>
                <p className="text-body-md text-secondary font-semibold mt-0.5">Chegada prevista: 07:45</p>
              </div>
            </div>

            {/* Step 3: Pending */}
            <div className="flex gap-4 relative">
              <div className="w-5 h-5 rounded-full bg-outline-variant border-4 border-surface-container-lowest z-10 shadow-sm mt-0.5 shrink-0" />
              <div>
                <p className="text-label-lg font-bold text-on-surface-variant">Escola Elite</p>
                <p className="text-body-md text-on-surface-variant/60">Av. Principal, 1000</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 mt-auto">
            <button className="w-full bg-primary text-on-primary text-label-lg py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-sm active:scale-95 duration-150">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                phone
              </span>
              Contatar Motorista
            </button>
            <button className="w-full bg-transparent border-[1.5px] border-error text-error text-label-lg py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-error/5 transition-colors active:scale-95 duration-150">
              <span className="material-symbols-outlined text-[20px]">event_busy</span>
              Informar Ausência Amanhã
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
