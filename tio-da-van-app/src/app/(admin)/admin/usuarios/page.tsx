'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, UsersThree, MagnifyingGlass, CarProfile, WarningCircle } from '@phosphor-icons/react/dist/ssr'

export default function GestaoMotoristasPage() {
  const [searchTerm, setSearchTerm] = useState('')

  // Mock de Motoristas para moderação operacional
  const [motoristas, setMotoristas] = useState([
    { id: 'mot-001', nome: 'Marcos Silva', email: 'marcos@tiodavan.com', placa: 'ABC-1234', alunos: 42, status: 'ativo', adimplente: true },
    { id: 'mot-002', nome: 'Roberto Souza', email: 'roberto@van.com', placa: 'XYZ-9876', alunos: 28, status: 'pendente', adimplente: true },
    { id: 'mot-003', nome: 'Ana Clara', email: 'ana@tiodavan.com', placa: 'BEE-5555', alunos: 0, status: 'suspenso', adimplente: false },
    { id: 'mot-004', nome: 'Julio Cesar', email: 'julio@escolar.com', placa: 'QWE-4444', alunos: 55, status: 'ativo', adimplente: false },
  ])

  const toggleStatus = (id: string, novoStatus: string) => {
    setMotoristas(prev => prev.map(m => m.id === id ? { ...m, status: novoStatus } : m))
  }

  const filteredMotoristas = motoristas.filter(m => 
    m.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.placa.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3 text-white">
            <UsersThree className="text-[var(--accent-primary)]" weight="fill" />
            Gestão Operacional de Motoristas
          </h1>
          <p className="text-white/50 mt-1">
            Moderação, aprovação e banimento de prestadores de serviço na plataforma.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome ou placa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[var(--accent-primary)] focus:bg-white/10 transition-colors text-sm text-white placeholder:text-white/30"
          />
        </div>
      </header>

      <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#060913] border-b border-white/5 text-[0.65rem] uppercase tracking-widest text-white/50">
                <th className="p-5 font-bold">Motorista & Contato</th>
                <th className="p-5 font-bold">Veículo / Lotação</th>
                <th className="p-5 font-bold">Financeiro (Split)</th>
                <th className="p-5 font-bold">Status da Conta</th>
                <th className="p-5 font-bold text-right">Mesa de Operação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMotoristas.map(mot => (
                <tr key={mot.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-white/5 to-white/10 flex items-center justify-center border border-white/5 shadow-inner">
                        <span className="font-bold text-white/70">{mot.nome.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{mot.nome}</p>
                        <p className="text-xs text-white/40">{mot.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2 py-0.5 rounded w-fit border border-[var(--accent-primary)]/20">
                        <CarProfile size={14} /> {mot.placa}
                      </div>
                      <span className="text-xs text-white/50 font-medium">
                        {mot.alunos > 0 ? `${mot.alunos} alunos matriculados` : 'Nenhum aluno'}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    {mot.adimplente ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--accent-success)]/10 text-[var(--accent-success)] border border-[var(--accent-success)]/20 shadow-[0_0_10px_rgba(46,204,113,0.1)]">
                        <CheckCircle weight="fill" /> Split Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--accent-danger)]/10 text-[var(--accent-danger)] border border-[var(--accent-danger)]/20 shadow-[0_0_10px_rgba(255,107,107,0.1)]">
                        <WarningCircle weight="fill" /> Inadimplente
                      </span>
                    )}
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        mot.status === 'ativo' ? 'bg-[var(--accent-success)] shadow-[0_0_8px_var(--accent-success)]' : 
                        mot.status === 'pendente' ? 'bg-[var(--accent-warning)] shadow-[0_0_8px_var(--accent-warning)]' : 
                        'bg-[var(--accent-danger)] shadow-[0_0_8px_var(--accent-danger)]'
                      }`} />
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                        mot.status === 'ativo' ? 'text-[var(--accent-success)]' : 
                        mot.status === 'pendente' ? 'text-[var(--accent-warning)]' : 
                        'text-[var(--accent-danger)]'
                      }`}>
                        {mot.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      {mot.status !== 'ativo' && (
                        <button 
                          onClick={() => toggleStatus(mot.id, 'ativo')}
                          className="px-4 py-1.5 bg-[var(--accent-success)]/10 hover:bg-[var(--accent-success)]/20 text-[var(--accent-success)] text-xs font-bold rounded-lg border border-[var(--accent-success)]/30 transition-all shadow-lg hover:shadow-[0_0_15px_rgba(46,204,113,0.3)]"
                        >
                          Aprovar
                        </button>
                      )}
                      {mot.status !== 'suspenso' && (
                        <button 
                          onClick={() => toggleStatus(mot.id, 'suspenso')}
                          className="px-4 py-1.5 bg-[var(--accent-warning)]/10 hover:bg-[var(--accent-warning)]/20 text-[var(--accent-warning)] text-xs font-bold rounded-lg border border-[var(--accent-warning)]/30 transition-all shadow-lg hover:shadow-[0_0_15px_rgba(255,184,77,0.3)]"
                        >
                          Suspender
                        </button>
                      )}
                      {mot.status === 'suspenso' && (
                        <button 
                          onClick={() => toggleStatus(mot.id, 'banido')}
                          className="px-4 py-1.5 bg-[var(--accent-danger)]/10 hover:bg-[var(--accent-danger)]/20 text-[var(--accent-danger)] text-xs font-bold rounded-lg border border-[var(--accent-danger)]/30 transition-all shadow-lg hover:shadow-[0_0_15px_rgba(255,107,107,0.3)]"
                        >
                          Banir
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredMotoristas.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-white/40">
                    <UsersThree size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Nenhum motorista encontrado na base de dados operacionais.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
