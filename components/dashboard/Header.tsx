"use client";

interface HeaderProps {
  breadcrumb?: string;
}

export default function Header({ breadcrumb = "Dashboard" }: HeaderProps): React.JSX.Element {
  return (
    <header className="header" id="dashboard-header">
      <div className="header-left">
        <span className="header-breadcrumb">
          Tio da Van / <span className="header-breadcrumb-current">{breadcrumb}</span>
        </span>
      </div>

      <div className="header-right">
        <button
          className="header-icon-btn"
          title="Buscar"
          type="button"
          id="header-search-btn"
          aria-label="Buscar"
        >
          🔍
        </button>
        <button
          className="header-icon-btn"
          title="Notificações"
          type="button"
          id="header-notifications-btn"
          aria-label="Notificações"
        >
          🔔
          <span className="notification-dot" />
        </button>
        <button
          className="header-icon-btn"
          title="Configurações"
          type="button"
          id="header-settings-btn"
          aria-label="Configurações"
        >
          ⚙️
        </button>
      </div>
    </header>
  );
}
