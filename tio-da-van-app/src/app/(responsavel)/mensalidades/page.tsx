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

      {/* Bento Grid — duas colunas no topo, tabela full-width abaixo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Card Esquerdo — Mensalidade Atual */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm p-6 md:p-8 flex flex-col border border-[#e1e2e4]">

          {/* Título + Badge */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#fddf9c] flex items-center justify-center shrink-0">
                <Money size={24} className="text-[#845400]" weight="fill" />
              </div>
              <div>
                <h3 className="font-bold text-[#191c1e] text-base">Mensalidade Atual</h3>
                <p className="text-[13px] text-[#43474e] mt-0.5">Vencimento: 10/11/2023</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-[#fddf9c] text-[#845400] text-[11px] rounded-full font-bold uppercase tracking-wider shrink-0">
              Pendente
            </span>
          </div>

          {/* Valor */}
          <div className="mb-8">
            <p className="text-sm text-[#43474e] font-semibold mb-1">Valor a pagar</p>
            <p className="text-[42px] font-bold text-[#13345b] tracking-tight leading-none">R$ 450,00</p>
            <p className="text-xs text-[#74777f] font-medium mt-3">Referente a: Transporte Escolar — Novembro</p>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <button className="flex-1 bg-[#13345b] text-white text-sm font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#13345b]/90 transition-colors shadow-sm active:scale-95 duration-150">
              <Copy size={18} weight="bold" />
              Copiar Código Pix
            </button>
            <button className="flex-1 bg-transparent border-2 border-[#13345b] text-[#13345b] text-sm font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#13345b]/5 transition-colors active:scale-95 duration-150">
              <FilePdf size={18} weight="bold" />
              Baixar Boleto
            </button>
          </div>
        </div>

        {/* Card Direito — Comprovante de Referência */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm p-6 border border-[#e1e2e4] flex flex-col">
          <h3 className="font-bold text-[#191c1e] text-base mb-4">Comprovante de Referência</h3>
          {/* Altura fixa para não estourar o grid */}
          <div className="h-[260px] rounded-xl overflow-hidden border border-[#c3c6cf] relative bg-[#edeef0]">
            <img
              alt="Referência de Histórico"
              className="object-cover w-full h-full opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOkKEVpCPgF7Z6lNbqaDmKYv2YcnNjlFlKHX_1uhAklAhtxEJ745iOotExZLGC7HhLCCe98GBmTyTK1WFzi0QMXsaWSPUGTDdzTcHzpYgvsa1Hj3W2qwsFO3OcZo22Q4K3ZAT9ymn59_KzFBHjeqoWSngyUg9b0ieNutOFCMj5V9mfTK64GtKwFwPCjK93Ps5v6VoDJ-FoNFX7rgQomfwzKYfFub9D54J62qn0478G9wFJQUi5iXsjF7NgEOSrQbSoeH7ohhxCJps"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end p-4">
              <p className="text-sm font-bold text-[#191c1e] bg-white/95 px-4 py-2 rounded-lg shadow-sm">
                Visualização do Recibo Anterior
              </p>
            </div>
          </div>
        </div>

        {/* Tabela — Histórico de Pagamentos (full-width) */}
        <div className="lg:col-span-12 bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-[#e1e2e4]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#191c1e] text-base">Histórico de Pagamentos</h3>
            <button className="text-[#13345b] text-sm font-bold flex items-center gap-2 bg-[#f8f9fb] px-4 py-2 rounded-lg border border-[#e1e2e4] hover:bg-[#f2f4f6] transition-colors">
              Filtrar <Faders size={16} weight="bold" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#c3c6cf]">
                  <th className="py-3 px-4 text-[12px] font-bold text-[#43474e] uppercase tracking-wider">Mês/Referência</th>
                  <th className="py-3 px-4 text-[12px] font-bold text-[#43474e] uppercase tracking-wider">Data do Pagamento</th>
                  <th className="py-3 px-4 text-[12px] font-bold text-[#43474e] uppercase tracking-wider">Valor</th>
                  <th className="py-3 px-4 text-[12px] font-bold text-[#43474e] uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-[12px] font-bold text-[#43474e] uppercase tracking-wider text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { mes: 'Outubro 2023', data: '08/10/2023', valor: 'R$ 450,00' },
                  { mes: 'Setembro 2023', data: '09/09/2023', valor: 'R$ 450,00' },
                  { mes: 'Agosto 2023', data: '10/08/2023', valor: 'R$ 450,00' },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b border-[#e1e2e4] hover:bg-[#f8f9fb] transition-colors group">
                    <td className="py-4 px-4 text-sm text-[#191c1e] font-bold">{item.mes}</td>
                    <td className="py-4 px-4 text-sm text-[#43474e] font-medium">{item.data}</td>
                    <td className="py-4 px-4 text-sm text-[#191c1e] font-bold">{item.valor}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4e3ff] text-[#001c3a] text-xs font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#13345b]" />
                        Pago
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-[#13345b] p-2.5 rounded-full hover:bg-[#13345b]/10 transition-colors inline-flex" title="Ver Recibo">
                        <Receipt size={18} weight="bold" />
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
