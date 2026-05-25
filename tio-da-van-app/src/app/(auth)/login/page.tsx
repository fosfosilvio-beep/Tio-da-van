'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeSlash, Van, EnvelopeSimple, Lock, ArrowRight } from '@phosphor-icons/react'

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await signIn(email, password)

    if (error) {
      setError('E-mail ou senha inválidos. Tente novamente.')
      setLoading(false)
    } else {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        const { data: p } = await supabase
          .from('perfis')
          .select('tipo')
          .eq('auth_user_id', session.user.id)
          .single()

        if (p?.tipo === 'admin') {
          window.location.href = '/admin'
        } else if (p?.tipo === 'responsavel') {
          window.location.href = '/meu-painel'
        } else {
          window.location.href = '/dashboard'
        }
      } else {
        window.location.href = '/dashboard'
      }
    }
  }

  return (
    <div className="login-page">
      {/* Background decorativo */}
      <div className="login-bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="login-container">
        {/* Logo e título */}
        <div className="login-header">
          <div className="login-logo">
            <Van size={32} weight="fill" color="#6c63ff" />
          </div>
          <h1 className="login-title">Tio da Van</h1>
          <p className="login-subtitle">Gestão profissional de transporte escolar</p>
        </div>

        {/* Card de login */}
        <div className="glass-card login-card">
          <h2 className="login-card-title">Entrar na plataforma</h2>

          {error && (
            <div className="login-error animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">E-mail</label>
              <div className="input-wrapper">
                <EnvelopeSimple size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-dark input-with-icon"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Senha</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-dark input-with-icon input-with-icon-right"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="login-forgot">
              <Link href="/forgot-password" className="forgot-link">
                Esqueci minha senha
              </Link>
            </div>

            <button
              id="btn-login-submit"
              type="submit"
              className="btn-primary btn-login"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="loading-dot" />
                  <span className="loading-dot" />
                  <span className="loading-dot" />
                </span>
              ) : (
                <>
                  Entrar <ArrowRight size={18} weight="bold" />
                </>
              )}
            </button>
          </form>

          <p className="login-signup-text">
            Não tem conta?{' '}
            <Link href="/signup" className="signup-link">
              Criar conta
            </Link>
          </p>
        </div>

        <p className="login-footer">
          © 2026 Tio da Van. Todos os direitos reservados.
        </p>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          position: relative;
          overflow: hidden;
          padding: 24px;
        }

        .login-bg-orbs {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.25;
        }

        .orb-1 {
          width: 400px; height: 400px;
          background: var(--accent-primary);
          top: -100px; left: -100px;
          animation: float 6s ease-in-out infinite;
        }

        .orb-2 {
          width: 300px; height: 300px;
          background: var(--accent-secondary);
          bottom: -80px; right: -80px;
          animation: float 8s ease-in-out infinite reverse;
        }

        .orb-3 {
          width: 200px; height: 200px;
          background: var(--accent-gold);
          top: 50%; right: 20%;
          animation: float 10s ease-in-out infinite;
        }

        .login-container {
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 1;
          animation: fadeIn 0.6s ease forwards;
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-logo {
          width: 64px; height: 64px;
          background: var(--gradient-primary);
          border-radius: var(--radius-xl);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          box-shadow: var(--shadow-glow-purple);
        }

        .login-title {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 800;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 8px;
        }

        .login-subtitle {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin: 0;
        }

        .login-card {
          padding: 32px;
          margin-bottom: 24px;
        }

        .login-card-title {
          font-family: var(--font-display);
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 24px;
          text-align: center;
        }

        .login-error {
          background: rgba(255, 107, 107, 0.12);
          border: 1px solid rgba(255, 107, 107, 0.3);
          border-radius: var(--radius-md);
          color: var(--accent-warning);
          padding: 12px 16px;
          font-size: 0.875rem;
          margin-bottom: 20px;
          text-align: center;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-with-icon {
          padding-left: 42px;
        }

        .input-with-icon-right {
          padding-right: 42px;
        }

        .input-icon-right {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
          transition: var(--transition-fast);
        }

        .input-icon-right:hover {
          color: var(--text-secondary);
        }

        .login-forgot {
          text-align: right;
        }

        .forgot-link {
          font-size: 0.825rem;
          color: var(--accent-primary);
          text-decoration: none;
          transition: var(--transition-fast);
        }

        .forgot-link:hover { opacity: 0.8; }

        .btn-login {
          width: 100%;
          justify-content: center;
          padding: 13px;
          font-size: 1rem;
          border-radius: var(--radius-md);
          margin-top: 4px;
        }

        .btn-loading {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .loading-dot {
          width: 6px; height: 6px;
          background: white;
          border-radius: 50%;
          animation: pulse 1.2s infinite;
        }

        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes pulse {
          0%, 100% { transform: scale(0.8); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; }
        }

        .login-signup-text {
          text-align: center;
          margin: 20px 0 0;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .signup-link {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 600;
          transition: var(--transition-fast);
        }

        .signup-link:hover { opacity: 0.8; }

        .login-footer {
          text-align: center;
          font-size: 0.75rem;
          color: var(--text-disabled);
          margin: 0;
        }
      `}</style>
    </div>
  )
}
