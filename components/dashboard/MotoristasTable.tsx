import type { MotoristaComUsuario } from "@/lib/types";

interface MotoristasTableProps {
  motoristas: MotoristaComUsuario[];
}

/**
 * Formata a data de validade da CNH para exibição.
 * Retorna no formato dd/mm/yyyy.
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR");
}

/**
 * Verifica se a CNH está próxima do vencimento (< 60 dias).
 */
function isCnhExpiringSoon(dateStr: string): boolean {
  const expiry = new Date(dateStr);
  const now = new Date();
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays < 60 && diffDays > 0;
}

export default function MotoristasTable({ motoristas }: MotoristasTableProps): React.JSX.Element {
  return (
    <div className="data-card" id="motoristas-table-card">
      <div className="data-card-header">
        <h2 className="data-card-title">Motoristas Recentes</h2>
        <div className="data-card-actions">
          <button className="btn-sm" type="button">Filtrar</button>
          <button className="btn-primary-sm" type="button">+ Novo Motorista</button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Motorista</th>
            <th>Veículo</th>
            <th>Capacidade</th>
            <th>CNH Validade</th>
            <th>Bairros</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {motoristas.map((m) => (
            <tr key={m.id} id={`motorista-row-${m.id}`}>
              {/* Célula do motorista com avatar */}
              <td>
                <div className="user-cell">
                  <img
                    src={m.usuario.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(m.usuario.nome_completo)}&background=6C5CE7&color=fff`}
                    alt={m.usuario.nome_completo}
                    className="user-cell-avatar"
                    width={38}
                    height={38}
                  />
                  <div className="user-cell-info">
                    <span className="user-cell-name">{m.usuario.nome_completo}</span>
                    <span className="user-cell-email">{m.usuario.email}</span>
                  </div>
                </div>
              </td>

              {/* Veículo */}
              <td>
                <span>{m.modelo_van}</span>
                <br />
                <span style={{ fontSize: "0.75rem", color: "hsla(210,40%,98%,0.4)" }}>
                  {m.placa}
                </span>
              </td>

              {/* Capacidade */}
              <td>{m.capacidade} alunos</td>

              {/* CNH */}
              <td>
                <span style={{
                  color: isCnhExpiringSoon(m.cnh_validade)
                    ? "hsl(45, 100%, 60%)"
                    : "inherit"
                }}>
                  {formatDate(m.cnh_validade)}
                  {isCnhExpiringSoon(m.cnh_validade) && " ⚠️"}
                </span>
              </td>

              {/* Bairros */}
              <td>
                <div className="tag-list">
                  {(m.bairros_atendidos ?? []).slice(0, 3).map((bairro) => (
                    <span key={bairro} className="tag-pill">{bairro}</span>
                  ))}
                  {(m.bairros_atendidos ?? []).length > 3 && (
                    <span className="tag-pill">+{(m.bairros_atendidos ?? []).length - 3}</span>
                  )}
                </div>
              </td>

              {/* Status */}
              <td>
                <span className={`status-badge ${m.status}`}>
                  {m.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
