import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "@/lib/supabase/database.types";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  
  // Lista de rotas públicas
  const isPublicRoute = url.pathname === "/";

  // Se não estiver logado e tentar acessar rota privada, volta para o login
  if (!user && !isPublicRoute) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Se estiver logado, avalia a Role (RBAC) e aplica o bypass/bloqueio
  if (user) {
    const { data: perfil } = await supabase
      .from("perfis")
      .select("tipo")
      .eq("id", user.id)
      .single();

    const role = perfil?.tipo || "responsavel";

    // Rotas de destino baseadas na Role
    let roleDestino = "/";
    if (role === "admin") roleDestino = "/admin";
    else if (role === "motorista") roleDestino = "/dashboard/motorista";
    else if (role === "responsavel") roleDestino = "/dashboard/pai";

    // Redireciona a raiz para a rota logada
    if (isPublicRoute) {
      url.pathname = roleDestino;
      return NextResponse.redirect(url);
    }

    // Blindagem de Rotas
    if (url.pathname.startsWith("/admin") && role !== "admin") {
      url.pathname = roleDestino;
      return NextResponse.redirect(url);
    }
    if (url.pathname.startsWith("/dashboard/motorista") && role !== "motorista") {
      url.pathname = roleDestino;
      return NextResponse.redirect(url);
    }
    if (url.pathname.startsWith("/dashboard/pai") && role !== "responsavel") {
      url.pathname = roleDestino;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
