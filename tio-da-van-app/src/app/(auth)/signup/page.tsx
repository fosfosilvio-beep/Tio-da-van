'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import { Van, EnvelopeSimple, Lock, User, ArrowRight, Eye, EyeSlash } from '@phosphor-icons/react'

export default function SignupPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ nome: '', email: '', password: '', confirmPassword: '' })
  const [tipo, setTipo] = useState<'motorista' | 'responsavel'>('motorista')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setError('As senhas não coincidem.'); return }
    if (form.password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres.'); return }
    setLoading(true); setError(null)
    const { error } = await signUp(form.email, form.password, form.nome, tipo)
    if (error) { setError(error); setLoading(false) }
    else router.push('/dashboard')
  }

  return (
    <div className="login-page">
      <div className="login-bg-orbs">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
      </div>
      <div className="login-container" style={{ maxWidth: 480 }}>
        <div className="login-header">
          <div className="login-logo"><Van size={32} weight="fill" color="#6c63ff" /></div>
          <h1 className="login-title">Criar Conta</h1>
          <p className="login-subtitle">Comece a gerir seu transporte escolar hoje</p>
        </div>

        <div className="glass-card login-card">
          {/* Tipo de conta */}
          <div className="tipo-selector">
            {(['motorista', 'responsavel'] as const).map(t => (
              <button
                key={t} type="button"
                className={`tipo-btn ${tipo === t ? 'tipo-btn-active' : ''}`}
                onClick={() => setTipo(t)}
              >
                {t === 'motorista' ? '🚐 Sou Motorista' : '👨‍👧 Sou Responsável'}
              </button>
            ))}
          </div>

          {error && <div className="login-error animate-fade-in">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Nome completo</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input id="signup-nome" type="text" placeholder="Seu nome" value={form.nome}
                  onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}
                  className="input-dark input-with-icon" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">E-mail</label>
              <div className="input-wrapper">
                <EnvelopeSimple size={18} className="input-icon" />
                <input id="signup-email" type="email" placeholder="seu@email.com" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="input-dark input-with-icon" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Senha</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input id="signup-senha" type={showPwd ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="input-dark input-with-icon input-with-icon-right" required />
                <button type="button" className="input-icon-right" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar senha</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input id="signup-confirm" type="password" placeholder="Repita a senha" value={form.confirmPassword}
                  onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  className="input-dark input-with-icon" required />
              </div>
            </div>
            <button id="btn-signup-submit" type="submit" className="btn-primary btn-login" disabled={loading}>
              {loading ? <span className="btn-loading"><span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" /></span>
                : <>Criar conta <ArrowRight size={18} weight="bold" /></>}
            </button>
          </form>
          <p className="login-signup-text">
            Já tem conta? <Link href="/login" className="signup-link">Entrar</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-page { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--bg-primary); position:relative; overflow:hidden; padding:24px; }
        .login-bg-orbs { position:absolute; inset:0; pointer-events:none; }
        .orb { position:absolute; border-radius:50%; filter:blur(80px); opacity:0.2; }
        .orb-1 { width:400px; height:400px; background:var(--accent-primary); top:-100px; left:-100px; animation:float 6s ease-in-out infinite; }
        .orb-2 { width:300px; height:300px; background:var(--accent-secondary); bottom:-80px; right:-80px; animation:float 8s ease-in-out infinite reverse; }
        .orb-3 { width:200px; height:200px; background:var(--accent-gold); top:50%; right:20%; animation:float 10s ease-in-out infinite; }
        .login-container { width:100%; position:relative; z-index:1; animation:fadeIn 0.6s ease forwards; }
        .login-header { text-align:center; margin-bottom:28px; }
        .login-logo { width:56px; height:56px; background:var(--gradient-primary); border-radius:var(--radius-xl); display:flex; align-items:center; justify-content:center; margin:0 auto 14px; box-shadow:var(--shadow-glow-purple); }
        .login-title { font-family:var(--font-display); font-size:1.8rem; font-weight:800; background:var(--gradient-primary); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin:0 0 6px; }
        .login-subtitle { color:var(--text-muted); font-size:0.875rem; margin:0; }
        .login-card { padding:28px; }
        .tipo-selector { display:flex; gap:8px; margin-bottom:20px; }
        .tipo-btn { flex:1; padding:10px 8px; background:var(--glass-bg); border:1px solid var(--border-glass); border-radius:var(--radius-md); color:var(--text-secondary); font-size:0.825rem; font-weight:600; cursor:pointer; transition:var(--transition-smooth); font-family:var(--font-primary); }
        .tipo-btn-active { background:rgba(108,99,255,0.15); border-color:var(--accent-primary); color:var(--accent-primary); }
        .login-error { background:rgba(255,107,107,0.12); border:1px solid rgba(255,107,107,0.3); border-radius:var(--radius-md); color:var(--accent-warning); padding:10px 14px; font-size:0.85rem; margin-bottom:16px; text-align:center; }
        .login-form { display:flex; flex-direction:column; gap:14px; }
        .form-group { display:flex; flex-direction:column; gap:6px; }
        .form-label { font-size:0.82rem; font-weight:500; color:var(--text-secondary); }
        .input-wrapper { position:relative; display:flex; align-items:center; }
        .input-icon { position:absolute; left:14px; color:var(--text-muted); pointer-events:none; }
        .input-with-icon { padding-left:42px; }
        .input-with-icon-right { padding-right:42px; }
        .input-icon-right { position:absolute; right:14px; background:none; border:none; color:var(--text-muted); cursor:pointer; display:flex; align-items:center; padding:0; transition:var(--transition-fast); }
        .btn-login { width:100%; justify-content:center; padding:12px; font-size:0.95rem; margin-top:4px; }
        .btn-loading { display:flex; gap:6px; align-items:center; }
        .loading-dot { width:6px; height:6px; background:white; border-radius:50%; animation:pulse 1.2s infinite; }
        .loading-dot:nth-child(2) { animation-delay:0.2s; }
        .loading-dot:nth-child(3) { animation-delay:0.4s; }
        @keyframes pulse { 0%,100%{transform:scale(0.8);opacity:0.6} 50%{transform:scale(1.2);opacity:1} }
        .login-signup-text { text-align:center; margin:16px 0 0; font-size:0.85rem; color:var(--text-muted); }
        .signup-link { color:var(--accent-primary); text-decoration:none; font-weight:600; }
      `}</style>
    </div>
  )
}
