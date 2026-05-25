import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/database.types'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Atualiza sessão (não remova este trecho)
  const { data: { user } } = await supabase.auth.getUser()

  let tipo: string | null = null
  if (user) {
    const { data: perfil } = await supabase
      .from('perfis')
      .select('tipo')
      .eq('auth_user_id', user.id)
      .single()
    tipo = perfil?.tipo || null
  }

  // Rotas públicas — NÃO redirecionar (Landing Page e Marketplace)
  const publicPaths = ['/', '/vans']
  const isPublicPath = publicPaths.some(path =>
    request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith('/vans')
  )
  if (isPublicPath) return supabaseResponse

  // Rotas protegidas — redireciona para login se não autenticado
  const protectedPaths = ['/dashboard', '/rotas', '/chamada', '/financeiro', '/alunos', '/ocorrencias', '/contratos', '/aniversariantes', '/meu-painel', '/meus-filhos', '/mensalidades', '/admin']
  const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Se autenticado tentando acessar login/signup, redireciona para painel correto
  const authPaths = ['/login', '/signup']
  const isAuthPath = authPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (isAuthPath && user) {
    const url = request.nextUrl.clone()
    if (tipo === 'admin') url.pathname = '/admin'
    else if (tipo === 'responsavel') url.pathname = '/meu-painel'
    else url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // RBAC: Verificação de acesso cruzado (Bloqueio estrito)
  if (user && isProtected) {
    const pathname = request.nextUrl.pathname
    
    if (tipo === 'admin') {
      if (!pathname.startsWith('/admin')) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
      }
    } else if (tipo === 'responsavel') {
      if (!pathname.startsWith('/meu-painel') && !pathname.startsWith('/meus-filhos') && !pathname.startsWith('/mensalidades')) {
        const url = request.nextUrl.clone()
        url.pathname = '/meu-painel'
        return NextResponse.redirect(url)
      }
    } else {
      // Motorista (bloqueia acesso as rotas do admin e do responsavel)
      if (pathname.startsWith('/admin') || pathname.startsWith('/meu-painel') || pathname.startsWith('/meus-filhos') || pathname.startsWith('/mensalidades')) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
