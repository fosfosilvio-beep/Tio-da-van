'use client'

import { useAniversariantes } from '@/hooks/useOcorrencias'
import { Cake } from '@phosphor-icons/react'

function idadeAtual(dataNascimento: string) {
  const hoje = new Date()
  const nasc = new Date(dataNascimento)
  let idade = hoje.getFullYear() - nasc.getFullYear()
  const m = hoje.getMonth() - nasc.getMonth()
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--
  return idade
}

export default function AniversariantesPage() {
  const { loading, hoje, estaSemana, esteMes } = useAniversariantes()

  const Section = ({
    titulo, emoji, alunos, cor
  }: {
    titulo: string; emoji: string; alunos: any[]; cor: string
  }) => (
    alunos.length > 0 ? (
      <div className="aniv-section">
        <div className="section-header">
          <span className="section-emoji">{emoji}</span>
          <h2 className="section-titulo">{titulo}</h2>
          <span className="section-count" style={{ background: `${cor}22`, color: cor }}>{alunos.length}</span>
        </div>
        <div className="aniv-grid">
          {alunos.map(a => (
            <div key={a.id} className="aniv-card glass-card animate-fade-in">
              <div className="aniv-ribbon" style={{ background: cor }} />
              <img
                src={a.foto_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(a.nome)}&background=6c63ff&color=fff&size=96&bold=true`}
                alt={a.nome}
                className="aniv-foto"
              />
              {a.diasAteAniversario === 0 && (
                <div className="aniv-hoje-badge">🎉 Hoje!</div>
              )}
              <div className="aniv-info">
                <span className="aniv-nome">{a.nome}</span>
                <span className="aniv-escola">{a.escola ?? '—'}</span>
                {a.data_nascimento && (
                  <span className="aniv-data">
                    🎂 {new Date(a.data_nascimento + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                    {' · '}
                    {idadeAtual(a.data_nascimento) + (a.diasAteAniversario === 0 ? 0 : 1)} anos
                  </span>
                )}
                {a.diasAteAniversario > 0 && (
                  <span className="aniv-dias" style={{ color: cor }}>
                    em {a.diasAteAniversario} dia{a.diasAteAniversario !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null
  )

  return (
    <div className="aniv-page">
      <div className="page-header animate-fade-in">
        <div>
          <h1 className="page-title"><Cake weight="fill" size={28} /> Aniversariantes</h1>
          <p className="page-sub">Alunos fazendo aniversário este mês</p>
        </div>
      </div>

      {loading ? (
        <div className="aniv-grid">
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 200 }} />)}
        </div>
      ) : (hoje.length + estaSemana.length + esteMes.length === 0) ? (
        <div className="empty-state glass-card animate-fade-in">
          <Cake size={64} color="var(--text-muted)" weight="thin" />
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Nenhum aniversariante nos próximos dias.</p>
        </div>
      ) : (
        <>
          <Section titulo="Hoje" emoji="🎉" alunos={hoje} cor="#ffd93d" />
          <Section titulo="Esta semana" emoji="🎂" alunos={estaSemana} cor="#6c63ff" />
          <Section titulo="Este mês" emoji="🎈" alunos={esteMes} cor="#00d4aa" />
        </>
      )}

      <style jsx>{`
        .aniv-page { display:flex; flex-direction:column; gap:28px; max-width:1400px; margin:0 auto; }
        .page-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
        .page-title { font-family:var(--font-display); font-size:1.5rem; font-weight:800; color:var(--text-primary); margin:0 0 4px; display:flex; align-items:center; gap:10px; }
        .page-sub { color:var(--text-muted); font-size:0.875rem; margin:0; }
        .aniv-section { display:flex; flex-direction:column; gap:14px; }
        .section-header { display:flex; align-items:center; gap:10px; }
        .section-emoji { font-size:1.4rem; }
        .section-titulo { font-family:var(--font-display); font-size:1.1rem; font-weight:700; color:var(--text-primary); margin:0; }
        .section-count { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.78rem; font-weight:700; }
        .aniv-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:14px; }
        .aniv-card { padding:16px; display:flex; flex-direction:column; align-items:center; gap:10px; text-align:center; position:relative; overflow:hidden; }
        .aniv-ribbon { position:absolute; top:0; left:0; right:0; height:4px; }
        .aniv-foto { width:72px; height:72px; border-radius:50%; object-fit:cover; border:3px solid var(--border-glass); margin-top:4px; }
        .aniv-hoje-badge { position:absolute; top:12px; right:12px; background:var(--gradient-gold); color:#1a1a1a; font-size:0.65rem; font-weight:800; padding:3px 8px; border-radius:99px; }
        .aniv-info { display:flex; flex-direction:column; gap:4px; }
        .aniv-nome { font-weight:700; font-size:0.9rem; color:var(--text-primary); }
        .aniv-escola { font-size:0.75rem; color:var(--text-muted); }
        .aniv-data { font-size:0.75rem; color:var(--text-secondary); }
        .aniv-dias { font-size:0.78rem; font-weight:600; }
        .empty-state { padding:80px; display:flex; flex-direction:column; align-items:center; gap:16px; text-align:center; }
      `}</style>
    </div>
  )
}
