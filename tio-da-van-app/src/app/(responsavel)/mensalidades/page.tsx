'use client'

import { Money, Copy, FilePdf, Faders, Receipt, ShieldCheck } from '@phosphor-icons/react/dist/ssr'

export default function MensalidadesWowdashPage() {
  return (
    <div className="flex flex-col gap-6 relative w-full h-full pb-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-2 mb-2">
        <div>
          <h1 className="font-bold text-2xl md:text-3xl text-slate-800 mb-1">
            Área Financeira
          </h1>
          <p className="text-slate-500 text-sm">
            Gestão de mensalidades, pagamentos e histórico.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Current Bill Card (Hub Styled) */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm p-6 md:p-8 flex flex-col justify-between border border-slate-200 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Money size={28} weight="fill" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Mensalidade Atual</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Vencimento: 10/11/2023</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs rounded-lg font-bold uppercase tracking-wide">
                Pendente
              </span>
            </div>
            
            <div className="mt-10 mb-12">
              <p className="text-sm text-slate-500 font-medium mb-2">Valor a pagar</p>
              <p className="text-5xl font-black text-slate-800 tracking-tight leading-none">R$ 450,00</p>
              <p className="text-xs text-slate-400 mt-4">Ref: Transporte - Novembro/2023</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-auto relative z-10">
            <button className="flex-1 bg-blue-600 text-white text-sm font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20">
              <Copy size={20} weight="bold" /> Copiar PIX
            </button>
            <button className="flex-1 bg-white border border-slate-200 text-slate-700 text-sm font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
              <FilePdf size={20} weight="bold" className="text-blue-600" /> Boleto
            </button>
          </div>
        </div>

        {/* Reference Security Card (Hub Style) */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm p-6 border border-slate-200 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck size={24} className="text-emerald-500" weight="fill" />
            <h3 className="font-bold text-slate-800 text-lg">Histórico de Transparência</h3>
          </div>
          
          <div className="flex-1 rounded-xl overflow-hidden border border-slate-100 relative bg-slate-50 flex items-center justify-center group">
            
            <img 
              alt="Referência de Pagamento" 
              className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-500" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOkKEVpCPgF7Z6lNbqaDmKYv2YcnNjlFlKHX_1uhAklAhtxEJ745iOotExZLGC7HhLCCe98GBmTyTK1WFzi0QMXsaWSPUGTDdzTcHzpYgvsa1Hj3W2qwsFO3OcZo22Q4K3ZAT9ymn59_KzFBHjeqoWSngyUg9b0ieNutOFCMj5V9mfTK64GtKwFwPCjK93Ps5v6VoDJ-FoNFX7rgQomfwzKYfFub9D54J62qn0478G9wFJQUi5iXsjF7NgEOSrQbSoeH7ohhxCJps"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-6 z-20">
              <div className="bg-white/95 backdrop-blur-sm border border-slate-200 px-5 py-4 rounded-xl shadow-lg w-full flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-slate-800">Recibo - Outubro 2023</p>
                  <p className="text-xs text-slate-500 mt-0.5">Pagamento confirmado pelo motorista.</p>
                </div>
                <button className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                  <Receipt size={20} weight="fill" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History Table (Hub Styled) */}
        <div className="lg:col-span-12 bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-slate-200">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-lg">Últimas Transações</h3>
            <button className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 transition-colors">
              Filtros <Faders size={16} weight="bold" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wide">
                  <th className="py-4 px-4 font-semibold">Mês Referência</th>
                  <th className="py-4 px-4 font-semibold">Data do Pagamento</th>
                  <th className="py-4 px-4 font-semibold">Valor</th>
                  <th className="py-4 px-4 font-semibold">Status</th>
                  <th className="py-4 px-4 font-semibold text-right">Comprovante</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { mes: 'Outubro 2023', data: '08/10/2023', valor: 'R$ 450,00' },
                  { mes: 'Setembro 2023', data: '09/09/2023', valor: 'R$ 450,00' },
                  { mes: 'Agosto 2023', data: '10/08/2023', valor: 'R$ 450,00' },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 text-slate-800 font-bold">{item.mes}</td>
                    <td className="py-4 px-4 text-slate-500">{item.data}</td>
                    <td className="py-4 px-4 text-slate-800 font-semibold">{item.valor}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 text-xs font-bold">
                        Pago
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-flex" title="Ver Recibo">
                        <Receipt size={20} weight="fill" />
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
