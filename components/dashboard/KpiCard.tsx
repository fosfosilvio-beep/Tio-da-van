import type { DashboardKPI } from "@/lib/types";

interface KpiCardProps {
  kpi: DashboardKPI;
}

export default function KpiCard({ kpi }: KpiCardProps): React.JSX.Element {
  const isPositivo: boolean = kpi.variacao >= 0;

  return (
    <div
      className="kpi-card"
      data-cor={kpi.cor}
      id={`kpi-${kpi.label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="kpi-top-row">
        <div className="kpi-icon">{kpi.icone}</div>
        <span className={`kpi-variacao ${isPositivo ? "positiva" : "negativa"}`}>
          {isPositivo ? "↑" : "↓"} {Math.abs(kpi.variacao).toFixed(1)}%
        </span>
      </div>
      <span className="kpi-label">{kpi.label}</span>
      <span className="kpi-valor">{kpi.valor}</span>
    </div>
  );
}
