import { Van, PresentationChart, TrendUp, MapPinLine } from '@phosphor-icons/react/dist/ssr'

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
          <PresentationChart className="text-[var(--accent-primary)]" weight="fill" />
          Dashboard Master
        </h1>
        <p className="text-white/50 mt-1">
          Visão panorâmica em tempo real do ecossistema Tio da Van.
        </p>
      </header>
      
      {/* Grid Principal: KPIs na Esquerda (1 coluna), Mapa na Direita (2 colunas) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna da Esquerda: KPIs */}
        <div className="flex flex-col gap-6">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-primary)] opacity-10 blur-2xl rounded-full group-hover:opacity-20 transition-opacity" />
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Motoristas Homologados</h3>
            <p className="text-4xl font-bold text-white mt-2">12</p>
            <div className="flex items-center gap-2 mt-4 text-xs font-medium text-[var(--accent-success)]">
              <TrendUp weight="bold" />
              <span>+3 neste mês</span>
            </div>
          </div>
          
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#00b4d8] opacity-10 blur-2xl rounded-full group-hover:opacity-20 transition-opacity" />
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Alunos Atendidos</h3>
            <p className="text-4xl font-bold text-white mt-2">143</p>
            <div className="flex items-center gap-2 mt-4 text-xs font-medium text-[var(--accent-success)]">
              <TrendUp weight="bold" />
              <span>+18 matrículas ativas</span>
            </div>
          </div>
          
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-success)] opacity-10 blur-2xl rounded-full group-hover:opacity-20 transition-opacity" />
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Receita da Plataforma (5%)</h3>
            <p className="text-4xl font-bold text-[var(--accent-success)] mt-2">R$ 1.787</p>
            <div className="flex items-center gap-2 mt-4 text-xs font-medium text-white/40">
              <span>Referente a R$ 35.750 de volume total.</span>
            </div>
          </div>
        </div>

        {/* Coluna Central e Direita: O Olho de Deus */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPinLine className="text-[var(--accent-primary)]" weight="fill" />
              O Olho de Deus (Visão Macro)
            </h2>
            <span className="px-3 py-1 bg-[var(--accent-success)]/20 text-[var(--accent-success)] text-[0.65rem] uppercase tracking-wider font-bold rounded-full border border-[var(--accent-success)]/30 flex items-center gap-2 shadow-[0_0_10px_rgba(46,204,113,0.3)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-success)] animate-pulse" />
              Tempo Real
            </span>
          </div>
          
          <div className="flex-1 bg-[#060913] rounded-2xl border border-white/5 relative overflow-hidden min-h-[400px]">
            {/* Imagem Placeholder de Mapa */}
            <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=-23.414,-51.428&zoom=13&size=1000x500&maptype=roadmap&style=feature:all|element:labels.text.fill|color:0x8ec3b9&style=feature:all|element:labels.text.stroke|color:0x1a3646&style=feature:all|element:labels.icon|visibility:off&style=feature:landscape.natural|element:geometry|color:0x021019&style=feature:water|element:geometry|color:0x0e1626')] bg-cover bg-center opacity-60 mix-blend-screen"></div>
            
            {/* Grade de Escaneamento Estilizada */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MCcgaGVpZ2h0PSc0MCc+PGdyaWQgZmlsbD0nbm9uZScgc3Ryb2tlPSdyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpJyBzdHJva2Utd2lkdGg9JzEnPjxwYXRoIGQ9J00gNDAgMCBMIDAgMCAwIDQwJy8+PC9ncmlkPjwvc3ZnPg==')] opacity-30"></div>
            
            {/* Pontos das Vans */}
            <div className="absolute top-[35%] left-[32%] flex flex-col items-center">
              <div className="w-4 h-4 bg-[var(--accent-primary)] rounded-full border-2 border-white shadow-[0_0_20px_var(--accent-primary)] animate-pulse"></div>
              <span className="mt-1 bg-[#060913]/90 px-2 py-0.5 rounded text-[0.6rem] font-bold text-white border border-white/10 shadow-lg whitespace-nowrap">Van 01 (Marcos)</span>
            </div>
            
            <div className="absolute top-[55%] left-[55%] flex flex-col items-center">
              <div className="w-4 h-4 bg-[#00b4d8] rounded-full border-2 border-white shadow-[0_0_20px_#00b4d8] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <span className="mt-1 bg-[#060913]/90 px-2 py-0.5 rounded text-[0.6rem] font-bold text-white border border-white/10 shadow-lg whitespace-nowrap">Van 03 (Silvio)</span>
            </div>
            
            <div className="absolute top-[25%] left-[70%] flex flex-col items-center">
              <div className="w-4 h-4 bg-[var(--accent-primary)] rounded-full border-2 border-white shadow-[0_0_20px_var(--accent-primary)] animate-pulse" style={{ animationDelay: '0.8s' }}></div>
            </div>
            
            <div className="absolute top-[70%] left-[45%] flex flex-col items-center">
              <div className="w-4 h-4 bg-[#00b4d8] rounded-full border-2 border-white shadow-[0_0_20px_#00b4d8] animate-pulse" style={{ animationDelay: '1.2s' }}></div>
            </div>

            {/* Radar Overlay Animado (Opcional, dá o "Wow Effect") */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[800px] h-[800px] border border-white/5 rounded-full absolute animate-[spin_20s_linear_infinite]" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(108,99,255,0.1) 360deg)' }}></div>
              <div className="w-[400px] h-[400px] border border-white/10 rounded-full absolute"></div>
              <div className="w-[200px] h-[200px] border border-white/20 rounded-full absolute"></div>
            </div>

            {/* Float Info */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div className="bg-[#060913]/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl">
                <h4 className="text-[0.65rem] font-bold text-white/50 uppercase tracking-widest mb-2">Monitoramento da Frota</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-success)] shadow-[0_0_8px_var(--accent-success)]"></span>
                    <span className="text-xs font-bold text-white">4 Vans Operando</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/20"></span>
                    <span className="text-xs font-medium text-white/40">8 Vans na Garagem</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
