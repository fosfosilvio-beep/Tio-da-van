import type { MotoristaStatus } from "@/lib/types";

interface DriverStatusDonutProps {
  statusCounts: Record<MotoristaStatus, number>;
}

export default function DriverStatusDonut({ statusCounts }: DriverStatusDonutProps): React.JSX.Element {
  const total: number = Object.values(statusCounts).reduce((sum, v) => sum + v, 0);

  // Cálculo dos ângulos para o conic-gradient
  const aprovadoDeg: number = (statusCounts.aprovado / total) * 360;
  const pendenteDeg: number = (statusCounts.pendente / total) * 360;
  const suspensoDeg: number = (statusCounts.suspenso / total) * 360;

  const conicGradient: string = `conic-gradient(
    hsl(142, 71%, 45%) 0deg ${aprovadoDeg}deg,
    hsl(45, 100%, 51%) ${aprovadoDeg}deg ${aprovadoDeg + pendenteDeg}deg,
    hsl(0, 84%, 60%) ${aprovadoDeg + pendenteDeg}deg ${aprovadoDeg + pendenteDeg + suspensoDeg}deg,
    hsla(210, 40%, 98%, 0.08) ${aprovadoDeg + pendenteDeg + suspensoDeg}deg 360deg
  )`;

  return (
    <div className="chart-card" id="driver-status-donut">
      <h3 className="chart-card-title">Motoristas por Status</h3>
      <div className="donut-stats">
        <div className="donut-ring" style={{ background: conicGradient }}>
          <div className="donut-center">
            <div className="donut-center-value">{total}</div>
            <div className="donut-center-label">Total</div>
          </div>
        </div>
        <div className="donut-legend">
          <div className="donut-legend-item">
            <span className="donut-legend-dot aprovado" />
            Aprovados
            <span className="donut-legend-value">{statusCounts.aprovado}</span>
          </div>
          <div className="donut-legend-item">
            <span className="donut-legend-dot pendente" />
            Pendentes
            <span className="donut-legend-value">{statusCounts.pendente}</span>
          </div>
          <div className="donut-legend-item">
            <span className="donut-legend-dot suspenso" />
            Suspensos
            <span className="donut-legend-value">{statusCounts.suspenso}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
