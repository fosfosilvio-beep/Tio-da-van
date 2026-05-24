'use client'

import { ShieldWarning, ClockCounterClockwise, Database, Browser } from '@phosphor-icons/react/dist/ssr'

export default function AuditoriaPage() {
  const logs = [
    { id: 1, action: 'LOGIN_FAIL', user: 'desconhecido (IP: 192.168.1.4)', time: 'Há 5 minutos', level: 'warning' },
    { id: 2, action: 'SPLIT_PROCESSED', user: 'Sistema Asaas', time: 'Há 1 hora', level: 'info' },
    { id: 3, action: 'MOTORISTA_BANIDO', user: 'Admin (Master)', time: 'Há 3 horas', level: 'critical' },
    { id: 4, action: 'NOVO_CADASTRO', user: 'roberto@van.com', time: 'Há 5 horas', level: 'info' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-display font-bold flex items-center gap-3 text-white">
          <ShieldWarning className="text-[var(--accent-warning)]" weight="fill" />
          Auditoria de Sistema
        </h1>
        <p className="text-white/50 mt-1">
          Rastreio de segurança, logs de atividades e tentativas de acesso ao ecossistema.
        </p>
      </header>

      {/* Cards de Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--accent-success)]/10 flex items-center justify-center">
            <Database size={24} className="text-[var(--accent-success)]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white/50 uppercase">Banco de Dados</h3>
            <p className="text-lg font-bold text-white">Online (3ms)</p>
          </div>
        </div>
        
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--accent-success)]/10 flex items-center justify-center">
            <Browser size={24} className="text-[var(--accent-success)]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white/50 uppercase">API Supabase</h3>
            <p className="text-lg font-bold text-white">Conectado</p>
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--accent-warning)]/10 flex items-center justify-center">
            <ShieldWarning size={24} className="text-[var(--accent-warning)]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white/50 uppercase">Bloqueios de IP (24h)</h3>
            <p className="text-lg font-bold text-white">12 Bloqueios</p>
          </div>
        </div>
      </div>

      {/* Tabela de Logs */}
      <div className="bg-[#060913] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
          <ClockCounterClockwise size={20} className="text-white/50" />
          <h2 className="text-sm font-bold text-white">Logs Recentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <span className={`text-[0.65rem] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${
                      log.level === 'critical' ? 'bg-[var(--accent-danger)]/10 text-[var(--accent-danger)] border-[var(--accent-danger)]/20' :
                      log.level === 'warning' ? 'bg-[var(--accent-warning)]/10 text-[var(--accent-warning)] border-[var(--accent-warning)]/20' :
                      'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/20'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-white/70 font-mono">
                    {log.user}
                  </td>
                  <td className="p-4 text-xs text-white/40 text-right">
                    {log.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
