import Link from 'next/link'
import { mockMotoristasPublicos, gerarLinkWhatsApp } from '@/lib/mocks/landing'

export const metadata = {
  title: 'Tio da Van — Transporte Escolar Elite',
  description: 'Motoristas verificados, rastreamento em tempo real e tranquilidade para o seu dia a dia. A escolha certa para o transporte escolar.',
}

export default function LandingPage() {
  const motoristasDestaque = mockMotoristasPublicos.slice(0, 3)

  return (
    <div className="antialiased overflow-x-hidden min-h-screen" style={{ backgroundColor: '#f8f9fb', color: '#191c1e', fontFamily: 'Manrope, sans-serif' }}>

      {/* ── 1. STICKY NAVBAR ── */}
      <nav style={{ backgroundColor: 'rgba(248,249,251,0.96)', backdropFilter: 'blur(12px)', position: 'fixed', top: 0, width: '100%', zIndex: 50, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderBottom: '1px solid #e1e2e4' }}>
        <div className="flex justify-between items-center h-16 max-w-7xl mx-auto px-6">
          <Link href="/" className="text-xl font-bold" style={{ color: '#13345b', textDecoration: 'none' }} suppressHydrationWarning>
            🚐 Tio da Van
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#como-funciona" className="text-sm font-semibold transition-colors" style={{ color: '#13345b', textDecoration: 'none' }} suppressHydrationWarning>Como Funciona</a>
            <a href="#sou-motorista" className="text-sm font-medium transition-colors" style={{ color: '#43474e', textDecoration: 'none' }} suppressHydrationWarning>Para Motoristas</a>
            <a href="#busca" className="text-sm font-medium transition-colors" style={{ color: '#43474e', textDecoration: 'none' }} suppressHydrationWarning>Para Famílias</a>
            <a href="#features" className="text-sm font-medium transition-colors" style={{ color: '#43474e', textDecoration: 'none' }} suppressHydrationWarning>Preços</a>
          </div>
          <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors" style={{ backgroundColor: '#13345b', color: '#ffffff', textDecoration: 'none' }} suppressHydrationWarning>
            Entrar
          </Link>
        </div>
      </nav>

      {/* ── 2. HERO SECTION ── */}
      <section style={{ backgroundColor: '#2d4b73', paddingTop: '112px', paddingBottom: '96px', position: 'relative', overflow: 'hidden' }}>
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center px-6" style={{ gap: '32px' }}>
          <img
            alt="Logo Tio da Van"
            className="w-full h-auto object-contain"
            style={{ maxWidth: '400px' }}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz6MnYmhdQzfLbtWatEQ4mRZBgughzncA7jS8uRpjdLMefJfzAnkT8QAsS02GvWZXueot_D49MrPSp7b21VG4fm0dpl_8KL2t36oC-Elf0oAu0HVp497Fjmhw1gpPyQya1mfZTW-v5U7z5JWiy1fW4dxAJN1ky1aPHbfkedLYh8Hym62nSOrRKAL3YKEWWyiEH_Ij1HOWJ4Yw4r7VBOERU5Kf2Zbx_zLLd4lA1N2gmk5lQWzDLSYXx5FcBF_wAy2F0aCMk4xPm9ZKHoQ"
          />
          <div className="flex flex-col items-center" style={{ gap: '16px' }}>
            <h1 className="font-bold text-center max-w-3xl" style={{ color: '#ffffff', fontSize: 'clamp(28px, 5vw, 40px)', lineHeight: '1.2' }}>
              O Transporte Escolar Que Sua Família Merece
            </h1>
            <p className="text-base max-w-2xl" style={{ color: '#9ebbea', lineHeight: '1.75' }}>
              Motoristas verificados, rastreamento em tempo real e tranquilidade para o seu dia a dia. A escolha certa para o transporte escolar.
            </p>
          </div>
          <div className="flex flex-col items-center w-full" style={{ gap: '24px' }}>
            <a href="#busca" className="inline-block font-bold py-4 px-10 rounded-xl transition-all" style={{ backgroundColor: '#fdba5f', color: '#744900', textDecoration: 'none', fontSize: '16px', boxShadow: '0 4px 16px rgba(253,186,95,0.4)' }} suppressHydrationWarning>
              Buscar Van no Meu Bairro
            </a>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ color: '#fdba5f', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-sm" style={{ color: '#9ebbea' }}>Motoristas Verificados</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ color: '#fdba5f', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-sm" style={{ color: '#9ebbea' }}>Rastreamento Live</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. SEARCH SECTION ── */}
      <section id="busca" style={{ backgroundColor: '#f2f4f6', padding: '64px 24px', position: 'relative' }}>
        <form action="/vans" method="GET" className="max-w-4xl mx-auto rounded-2xl p-8" style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 24px rgba(45,75,115,0.08)', border: '1px solid #e1e2e4' }}>
          <h2 className="text-center font-bold mb-6" style={{ fontSize: '20px', color: '#191c1e' }}>
            Sou Pai — Encontre a Van Ideal para Seu Filho
          </h2>
          <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="relative">
              <span className="material-symbols-outlined absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#74777f', fontSize: '20px' }}>school</span>
              <input
                name="escola"
                className="w-full rounded-xl outline-none"
                style={{ paddingLeft: '44px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', border: '1.5px solid #c3c6cf', backgroundColor: '#f8f9fb', fontSize: '14px', color: '#191c1e' }}
                placeholder="Nome da Escola"
                type="text"
                suppressHydrationWarning
              />
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#74777f', fontSize: '20px' }}>location_on</span>
              <input
                name="bairro"
                className="w-full rounded-xl outline-none"
                style={{ paddingLeft: '44px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', border: '1.5px solid #c3c6cf', backgroundColor: '#f8f9fb', fontSize: '14px', color: '#191c1e' }}
                placeholder="Seu Bairro"
                type="text"
                suppressHydrationWarning
              />
            </div>
          </div>
          <button type="submit" className="w-full rounded-xl font-bold py-3 transition-all" style={{ backgroundColor: '#fdba5f', color: '#744900', fontSize: '16px', border: 'none', cursor: 'pointer' }} suppressHydrationWarning>
            🔍 Ver Vans Disponíveis
          </button>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {['Colégio Objetivo', 'Escola Americana', 'Colégio Bandeirantes'].map((nome) => (
              <Link
                key={nome}
                href={`/vans?escola=${encodeURIComponent(nome)}`}
                className="rounded-full text-xs font-medium px-3 py-1 transition-colors"
                style={{ backgroundColor: '#e7e8ea', color: '#43474e', textDecoration: 'none' }}
                suppressHydrationWarning
              >
                {nome}
              </Link>
            ))}
          </div>
        </form>

        {/* SOU MOTORISTA PROMO CARD */}
        <div id="sou-motorista" className="max-w-4xl mx-auto mt-8 rounded-2xl p-8" style={{ backgroundColor: '#eef3fa', border: '1px solid #c3c6cf', boxShadow: '0 2px 8px rgba(45,75,115,0.06)' }}>
          <div className="grid gap-8 items-center" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span className="inline-block rounded-full font-bold text-xs px-3 py-1" style={{ backgroundColor: '#fdba5f', color: '#744900', width: 'fit-content' }}>
                🚐 Para Motoristas e Donos de Frota
              </span>
              <h2 className="font-bold" style={{ fontSize: '26px', lineHeight: '1.3', color: '#2d4b73' }}>
                Sou Motorista — Cadastre Sua Van ou Frota
              </h2>
              <p className="text-sm" style={{ color: '#43474e', lineHeight: '1.6' }}>
                Cadastre suas rotas, horários, fotos do veículo e apareça para centenas de famílias da sua região. Verificação rápida e gratuita.
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Perfil verificado (KYC)', 'Apareça na busca das famílias', 'Gerencie cobranças e rotas', 'Gratuito para começar'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm" style={{ color: '#191c1e' }}>
                    <span className="material-symbols-outlined text-sm" style={{ color: '#16a34a', fontVariationSettings: "'FILL' 1", fontSize: '18px' }}>check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-center justify-center gap-3">
              <Link
                href="/login"
                className="w-full rounded-xl font-bold py-4 text-center transition-all"
                style={{ backgroundColor: '#fdba5f', color: '#744900', textDecoration: 'none', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(253,186,95,0.3)' }}
                suppressHydrationWarning
              >
                🚐 Cadastrar Minha Van Agora
              </Link>
              <p className="text-xs" style={{ color: '#74777f' }}>
                Leva menos de 5 minutos. Sem taxa de cadastro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. VAN CARDS ── */}
      <section style={{ padding: '64px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <h2 className="font-bold text-center mb-8" style={{ fontSize: '24px', color: '#191c1e' }}>
          Motoristas em Destaque
        </h2>
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {motoristasDestaque.map((m) => {
            const linkWhats = gerarLinkWhatsApp(m)
            const lotado = m.vagas_disponiveis === 0

            return (
              <div key={m.id} className="rounded-2xl overflow-hidden flex flex-col" style={{ backgroundColor: '#ffffff', border: '1px solid #e1e2e4', boxShadow: '0 4px 12px rgba(45,75,115,0.06)' }}>
                {/* Header do Card */}
                <div className="flex gap-4 p-4" style={{ borderBottom: '1px solid #e1e2e4' }}>
                  <img
                    alt={`Motorista ${m.nome}`}
                    className="rounded-xl object-cover"
                    style={{ width: '64px', height: '64px', backgroundColor: '#edeef0', flexShrink: 0 }}
                    src={m.foto_perfil_url}
                  />
                  <div>
                    <h3 className="font-bold" style={{ fontSize: '16px', color: '#191c1e' }}>{m.nome}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined" style={{ color: '#fdba5f', fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-semibold text-sm" style={{ color: '#191c1e' }}>{m.avaliacao}</span>
                    </div>
                    <span className="inline-block mt-1 rounded px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: lotado ? '#fee2e2' : '#dcfce7', color: lotado ? '#991b1b' : '#166534' }}>
                      {lotado ? 'Lotado' : `${m.vagas_disponiveis} vagas disponíveis`}
                    </span>
                  </div>
                </div>
                {/* Body do Card */}
                <div className="p-4 flex flex-col gap-3 flex-1" style={{ backgroundColor: '#f8f9fb' }}>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined" style={{ color: '#74777f', fontSize: '18px', flexShrink: 0 }}>school</span>
                    <p className="text-sm" style={{ color: '#43474e' }}>{m.escolas_atendidas.join(', ')}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined" style={{ color: '#74777f', fontSize: '18px', flexShrink: 0 }}>map</span>
                    <p className="text-sm" style={{ color: '#43474e' }}>{m.bairros.join(', ')}</p>
                  </div>
                </div>
                {/* Footer do Card */}
                <div className="p-4" style={{ borderTop: '1px solid #e1e2e4' }}>
                  {lotado ? (
                    <button className="w-full rounded-xl py-3 text-sm font-semibold" style={{ backgroundColor: '#e1e2e4', color: '#74777f', cursor: 'not-allowed', border: 'none' }} suppressHydrationWarning>
                      Lista de Espera
                    </button>
                  ) : (
                    <a
                      href={linkWhats}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                      style={{ backgroundColor: '#25D366', color: '#ffffff', textDecoration: 'none', display: 'flex' }}
                      suppressHydrationWarning
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chat</span>
                      Contatar via WhatsApp
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/vans"
            className="inline-block rounded-xl font-bold py-3 px-8 transition-colors"
            style={{ border: '2px solid #13345b', color: '#13345b', textDecoration: 'none', fontSize: '14px' }}
            suppressHydrationWarning
          >
            Ver Todos os Motoristas →
          </Link>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ── */}
      <section id="como-funciona" style={{ padding: '64px 24px', backgroundColor: '#f2f4f6', borderTop: '1px solid #e1e2e4', borderBottom: '1px solid #e1e2e4' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="font-bold text-center mb-12" style={{ fontSize: '20px', color: '#191c1e' }}>
            Como Funciona — Em 3 Passos Simples
          </h2>
          <div className="grid gap-8 text-center" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {[
              { icon: 'search', step: '1. Busque', desc: 'Encontre vans disponíveis na sua região que atendam a escola do seu filho.' },
              { icon: 'handshake', step: '2. Conecte', desc: 'Fale diretamente com o motorista pelo app ou WhatsApp e feche o contrato.' },
              { icon: 'security', step: '3. Confie', desc: 'Acompanhe as viagens em tempo real e pague de forma segura pelo app.' },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-4">
                <div className="rounded-full flex items-center justify-center" style={{ width: '96px', height: '96px', backgroundColor: '#fddf9c', boxShadow: '0 4px 12px rgba(253,223,156,0.4)', border: '4px solid #f2f4f6' }}>
                  <span className="material-symbols-outlined" style={{ color: '#715c25', fontSize: '40px' }}>{s.icon}</span>
                </div>
                <h3 className="font-bold" style={{ fontSize: '16px', color: '#191c1e' }}>{s.step}</h3>
                <p className="text-sm" style={{ color: '#43474e', maxWidth: '240px', lineHeight: '1.6' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FEATURES GRID ── */}
      <section id="features" style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <h2 className="font-bold text-center mb-12" style={{ fontSize: '24px', color: '#191c1e' }}>
          Tecnologia Elite para Sua Tranquilidade
        </h2>
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {[
            { icon: 'my_location',       title: 'Rastreamento GPS',          desc: 'Saiba exatamente onde a van está durante todo o trajeto.' },
            { icon: 'qr_code_scanner',   title: 'Embarque com QR Code',      desc: 'Confirmação digital de entrada e saída da escola e de casa.' },
            { icon: 'payments',          title: 'Pagamento Integrado via Pix', desc: 'Gestão financeira fácil e sem atrasos através da plataforma.' },
            { icon: 'notifications_active', title: 'Notificações Automáticas', desc: "Avisos de 'Van Chegando' e confirmações de desembarque." },
            { icon: 'verified_user',     title: 'Verificação KYC Rigorosa',  desc: 'Antecedentes criminais e CNH checados regularmente.' },
            { icon: 'receipt_long',      title: 'Relatórios Transparentes',  desc: 'Histórico completo de viagens e pagamentos no aplicativo.' },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl p-6 transition-all" style={{ backgroundColor: '#ffffff', border: '1px solid #e1e2e4', boxShadow: '0 2px 8px rgba(45,75,115,0.04)' }}>
              <div className="rounded-full flex items-center justify-center mb-4" style={{ width: '48px', height: '48px', backgroundColor: '#fddf9c' }}>
                <span className="material-symbols-outlined" style={{ color: '#715c25' }}>{f.icon}</span>
              </div>
              <h3 className="font-bold mb-2" style={{ fontSize: '15px', color: '#191c1e' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: '#43474e', lineHeight: '1.6' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. FOOTER ── */}
      <footer style={{ backgroundColor: '#13345b', borderTop: '1px solid #294870', width: '100%' }}>
        <div className="flex flex-col md:flex-row justify-between items-center py-12 px-6 max-w-6xl mx-auto gap-4">
          <div className="font-bold text-lg" style={{ color: '#ffffff', opacity: 0.9 }}>
            🚐 Tio da Van
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {['Termos de Uso', 'Privacidade', 'Contato', 'Suporte'].map((link) => (
              <a key={link} className="text-sm transition-colors" href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }} suppressHydrationWarning>
                {link}
              </a>
            ))}
          </div>
          <div className="text-sm text-center md:text-right" style={{ color: 'rgba(255,255,255,0.6)' }}>
            © 2026 Tio da Van 2.0 Elite. Todos os direitos reservados.
          </div>
        </div>
      </footer>

    </div>
  )
}
