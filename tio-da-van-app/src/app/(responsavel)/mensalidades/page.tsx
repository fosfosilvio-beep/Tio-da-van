'use client'

import { Money, Copy, FilePdf, Faders, Receipt } from '@phosphor-icons/react/dist/ssr'

export default function MensalidadesPage() {
  return (
    <div className="w-full flex flex-col min-h-full pb-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#191c1e] tracking-tight">Histórico Financeiro</h2>
        <p className="text-sm text-[#43474e] mt-1">Acompanhe seus pagamentos e mensalidades.</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Current Bill Card */}
        <div className="lg:col-span-5 bg-white rounded-[24px] shadow-sm p-6 md:p-8 flex flex-col justify-between border border-[#e1e2e4]">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#fddf9c] flex items-center justify-center">
                  <Money size={28} className="text-[#845400]" weight="fill" />
                </div>
                <div>
                  <h3 className="font-bold text-[#191c1e] text-lg">Mensalidade Atual</h3>
                  <p className="text-[13px] text-[#43474e] font-medium mt-0.5">Vencimento: 10/11/2023</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-[#fddf9c] text-[#845400] text-[11px] rounded-full font-bold uppercase tracking-wider">
                Pendente
              </span>
            </div>
            
            <div className="mt-8 mb-10">
              <p className="text-sm text-[#43474e] font-semibold mb-1">Valor a pagar</p>
              <p className="text-[40px] font-bold text-[#13345b] tracking-tight leading-none">R$ 450,00</p>
              <p className="text-xs text-[#74777f] font-medium mt-3">Referente a: Transporte Escolar - Novembro</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <button className="flex-1 bg-[#13345b] text-white text-sm font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#13345b]/90 transition-colors shadow-sm">
              <Copy size={20} weight="bold" />
              Copiar Código Pix
            </button>
            <button className="flex-1 bg-transparent border-2 border-[#13345b] text-[#13345b] text-sm font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#13345b]/5 transition-colors">
              <FilePdf size={20} weight="bold" />
              Baixar Boleto
            </button>
          </div>
        </div>

        {/* Reference Image Card */}
        <div className="lg:col-span-7 bg-white rounded-[24px] shadow-sm p-6 border border-[#e1e2e4] flex flex-col">
          <h3 className="font-bold text-[#191c1e] text-lg mb-4">Comprovante de Referência</h3>
          <div className="flex-1 rounded-xl overflow-hidden border border-[#c3c6cf] relative bg-[#edeef0] flex items-center justify-center">
            <img 
              alt="Referência de Histórico" 
              className="object-cover w-full h-full opacity-80" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOkKEVpCPgF7Z6lNbqaDmKYv2YcnNjlFlKHX_1uhAklAhtxEJ745iOotExZLGC7HhLCCe98GBmTyTK1WFzi0QMXsaWSPUGTDdzTcHzpYgvsa1Hj3W2qwsFO3OcZo22Q4K3ZAT9ymn59_KzFBHjeqoWSngyUg9b0ieNutOFCMj5V9mfTK64GtKwFwPCjK93Ps5v6VoDJ-FoNFX7rgQomfwzKYfFub9D54J62qn0478G9wFJQUi5iXsjF7NgEOSrQbSoeH7ohhxCJps"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex items-end p-4">
              <p className="text-sm font-bold text-[#191c1e] bg-white/95 px-4 py-2 rounded-lg backdrop-blur-sm shadow-sm">
                Visualização do Recibo Anterior
              </p>
            </div>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="lg:col-span-12 bg-white rounded-[24px] shadow-sm p-6 md:p-8 border border-[#e1e2e4]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#191c1e] text-lg">Histórico de Pagamentos</h3>
            <button className="text-[#13345b] hover:text-[#13345b]/80 text-sm font-bold flex items-center gap-2 bg-[#f8f9fb] px-4 py-2 rounded-lg border border-[#e1e2e4]">
              Filtrar <Faders size={18} weight="bold" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#c3c6cf] text-[#43474e] text-[13px] font-bold">
                  <th className="py-4 px-4 uppercase tracking-wider">Mês/Referência</th>
                  <th className="py-4 px-4 uppercase tracking-wider">Data do Pagamento</th>
                  <th className="py-4 px-4 uppercase tracking-wider">Valor</th>
                  <th className="py-4 px-4 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-4 uppercase tracking-wider text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { mes: 'Outubro 2023', data: '08/10/2023', valor: 'R$ 450,00' },
                  { mes: 'Setembro 2023', data: '09/09/2023', valor: 'R$ 450,00' },
                  { mes: 'Agosto 2023', data: '10/08/2023', valor: 'R$ 450,00' },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b border-[#e1e2e4] hover:bg-[#f8f9fb] transition-colors group">
                    <td className="py-4 px-4 text-[#191c1e] font-bold">{item.mes}</td>
                    <td className="py-4 px-4 text-[#43474e] font-medium">{item.data}</td>
                    <td className="py-4 px-4 text-[#191c1e] font-bold">{item.valor}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4e3ff] text-[#001c3a] text-xs font-bold">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#13345b]"></div> Pago
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-[#13345b] hover:bg-[#13345b]/10 p-2.5 rounded-full transition-colors inline-flex group-hover:bg-[#13345b]/5" title="Ver Recibo">
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
