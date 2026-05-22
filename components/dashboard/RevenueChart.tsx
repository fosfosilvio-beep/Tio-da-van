import type { ChartDataPoint } from "@/lib/types";

interface RevenueChartProps {
  data: ChartDataPoint[];
}

/**
 * Gráfico de receita mensal CSS-only (sem dependências externas).
 * Será substituído por ApexCharts na iteração de polimento.
 */
export default function RevenueChart({ data }: RevenueChartProps): React.JSX.Element {
  const maxReceita: number = Math.max(...data.map((d) => d.receita));

  return (
    <div className="chart-card" id="revenue-chart">
      <h3 className="chart-card-title">Receita Mensal (Últimos 6 Meses)</h3>
      <div className="mini-bar-chart">
        {data.map((point) => {
          const receitaHeight: number = (point.receita / maxReceita) * 100;
          const comissaoHeight: number = (point.comissao / maxReceita) * 100;

          return (
            <div key={point.mes} className="mini-bar-col">
              <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: "100%" }}>
                <div
                  className="mini-bar"
                  style={{ height: `${receitaHeight}%` }}
                  title={`Receita: R$ ${point.receita.toLocaleString("pt-BR")}`}
                />
                <div
                  className="mini-bar comissao"
                  style={{ height: `${comissaoHeight}%` }}
                  title={`Comissão 5%: R$ ${point.comissao.toLocaleString("pt-BR")}`}
                />
              </div>
              <span className="mini-bar-label">{point.mes}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
