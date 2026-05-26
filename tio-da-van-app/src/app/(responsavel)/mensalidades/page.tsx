'use client'

export default function MensalidadesPage() {
  return (
    <div className="w-full flex flex-col min-h-full pb-8">

      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-headline-lg font-bold text-on-surface tracking-tight">Histórico Financeiro</h2>
        <p className="text-body-md text-on-surface-variant mt-1">Acompanhe seus pagamentos e mensalidades.</p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Card — Mensalidade Atual */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(19,52,91,0.04)] p-6 flex flex-col justify-between border border-outline-variant/30">
          <div>
            {/* Header do card */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-secondary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    payments
                  </span>
                </div>
                <div>
                  <h3 className="text-headline-sm font-bold text-on-surface">Mensalidade Atual</h3>
                  <p className="text-label-md text-on-surface-variant mt-0.5">Vencimento: 10/11/2023</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-tertiary-fixed text-secondary text-label-md rounded-full font-bold shrink-0">
                Pendente
              </span>
            </div>

            {/* Valor */}
            <div className="mt-6 mb-8">
              <p className="text-body-md text-on-surface-variant mb-1">Valor a pagar</p>
              <p className="text-4xl font-bold text-primary tracking-tight leading-none">R$ 450,00</p>
              <p className="text-label-md text-on-surface-variant mt-2">
                Referente a: Transporte Escolar — Novembro
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 bg-primary text-on-primary text-label-lg py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-sm active:scale-95 duration-150">
              <span className="material-symbols-outlined text-[20px]">content_copy</span>
              Copiar Código Pix
            </button>
            <button className="flex-1 bg-transparent border-[1.5px] border-primary text-primary text-label-lg py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors active:scale-95 duration-150">
              <span className="material-symbols-outlined text-[20px]">description</span>
              Baixar Boleto
            </button>
          </div>
        </div>

        {/* Card — Comprovante de Referência */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(19,52,91,0.04)] p-6 border border-outline-variant/30 flex flex-col">
          <h3 className="text-headline-sm font-bold text-on-surface mb-4">Comprovante de Referência</h3>
          <div className="flex-1 min-h-[220px] rounded-lg overflow-hidden border border-outline-variant/50 relative bg-surface-container">
            <img
              alt="Referência de Histórico"
              className="object-cover w-full h-full opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOkKEVpCPgF7Z6lNbqaDmKYv2YcnNjlFlKHX_1uhAklAhtxEJ745iOotExZLGC7HhLCCe98GBmTyTK1WFzi0QMXsaWSPUGTDdzTcHzpYgvsa1Hj3W2qwsFO3OcZo22Q4K3ZAT9ymn59_KzFBHjeqoWSngyUg9b0ieNutOFCMj5V9mfTK64GtKwFwPCjK93Ps5v6VoDJ-FoNFX7rgQomfwzKYfFub9D54J62qn0478G9wFJQUi5iXsjF7NgEOSrQbSoeH7ohhxCJps"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-4">
              <p className="text-label-lg text-on-surface bg-surface-container-lowest/90 px-3 py-1.5 rounded backdrop-blur-sm shadow-sm">
                Visualização do Recibo Anterior
              </p>
            </div>
          </div>
        </div>

        {/* Tabela — Histórico de Pagamentos */}
        <div className="lg:col-span-12 bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(19,52,91,0.04)] p-6 border border-outline-variant/30">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-headline-sm font-bold text-on-surface">Histórico de Pagamentos</h3>
            <button className="text-primary hover:text-primary/80 text-label-lg flex items-center gap-1 transition-colors">
              Filtrar
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/50">
                  <th className="py-3 px-4 text-label-lg text-on-surface-variant font-semibold">Mês/Referência</th>
                  <th className="py-3 px-4 text-label-lg text-on-surface-variant font-semibold">Data do Pagamento</th>
                  <th className="py-3 px-4 text-label-lg text-on-surface-variant font-semibold">Valor</th>
                  <th className="py-3 px-4 text-label-lg text-on-surface-variant font-semibold">Status</th>
                  <th className="py-3 px-4 text-label-lg text-on-surface-variant font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="text-body-md">
                {[
                  { mes: 'Outubro 2023',  data: '08/10/2023', valor: 'R$ 450,00' },
                  { mes: 'Setembro 2023', data: '09/09/2023', valor: 'R$ 450,00' },
                  { mes: 'Agosto 2023',   data: '10/08/2023', valor: 'R$ 450,00' },
                ].map((item, idx, arr) => (
                  <tr
                    key={idx}
                    className={`hover:bg-surface-container-low/50 transition-colors ${idx < arr.length - 1 ? 'border-b border-outline-variant/20' : ''}`}
                  >
                    <td className="py-4 px-4 text-on-surface font-medium">{item.mes}</td>
                    <td className="py-4 px-4 text-on-surface-variant">{item.data}</td>
                    <td className="py-4 px-4 text-on-surface">{item.valor}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-label-md font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Pago
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors inline-flex"
                        title="Ver Recibo"
                      >
                        <span className="material-symbols-outlined text-[20px]">receipt_long</span>
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
