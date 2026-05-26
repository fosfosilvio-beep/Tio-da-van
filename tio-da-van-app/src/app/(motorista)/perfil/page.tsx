'use client'

import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { User, Envelope, Phone, SignOut, PencilSimple } from '@phosphor-icons/react'

export default function PerfilPage() {
  const { perfil, signOut } = useAuth()
  const router = useRouter()

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', fontFamily: 'Manrope, sans-serif' }}>
      <div className="page-header">
        <h1 className="section-title">Meu Perfil</h1>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => router.push('/dashboard')}
        >
          ← Voltar ao Dashboard
        </button>
      </div>

      {/* Avatar + Nome */}
      <div className="card" style={{ padding: 32, marginBottom: 16, textAlign: 'center' }}>
        <div style={{
          width: 80, height: 80,
          borderRadius: '50%',
          background: 'var(--color-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: '2rem', color: 'white', fontWeight: 800,
          overflow: 'hidden'
        }}>
          {perfil?.avatar_url
            ? <img src={perfil.avatar_url} alt={perfil.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span>{perfil?.nome?.charAt(0)?.toUpperCase() ?? 'U'}</span>
          }
        </div>
        <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--color-text-primary)', margin: '0 0 4px' }}>
          {perfil?.nome ?? 'Usuário'}
        </h2>
        <span className="pill pill-embarcado" style={{ display: 'inline-flex' }}>
          {perfil?.tipo === 'motorista' ? '🚐 Motorista' : perfil?.tipo === 'responsavel' ? '👨‍👧 Responsável' : '🛡️ Admin'}
        </span>
      </div>

      {/* Dados */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <h3 className="section-title" style={{ fontSize: 16, marginBottom: 16 }}>Dados da Conta</h3>

        <div className="form-group" style={{ marginBottom: 16 }}>
          <label className="label">Nome completo</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <input
              className="input"
              defaultValue={perfil?.nome ?? ''}
              placeholder="Seu nome completo"
              readOnly
              style={{ cursor: 'not-allowed', background: 'var(--color-surface-variant)' }}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 16 }}>
          <label className="label">E-mail</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Envelope size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <input
              className="input"
              defaultValue={perfil?.email ?? ''}
              placeholder="seu@email.com"
              readOnly
              style={{ cursor: 'not-allowed', background: 'var(--color-surface-variant)' }}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 24 }}>
          <label className="label">Telefone</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Phone size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <input
              className="input"
              defaultValue={perfil?.telefone ?? ''}
              placeholder="(00) 00000-0000"
              readOnly
              style={{ cursor: 'not-allowed', background: 'var(--color-surface-variant)' }}
            />
          </div>
        </div>

        <button className="btn btn-secondary btn-md" style={{ width: '100%' }}>
          <PencilSimple size={16} />
          Editar Dados (em breve)
        </button>
      </div>

      {/* Logout */}
      <div className="card" style={{ padding: 20 }}>
        <button
          className="btn btn-danger btn-md"
          style={{ width: '100%' }}
          onClick={signOut}
        >
          <SignOut size={18} />
          Sair da conta
        </button>
      </div>
    </div>
  )
}
