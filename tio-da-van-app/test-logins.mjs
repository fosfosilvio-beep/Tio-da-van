import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xexxnfhukprktdzkhnhi.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhleHhuZmh1a3Bya3RkemtobmhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzOTMwNjAsImV4cCI6MjA5NDk2OTA2MH0.649BOSzxH9_mHtSmm7_BXWw4vPJNGzz1nGCSlUibxQE'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testLogin(email, password, expectedType) {
  console.log(`\n--- Testando Login para: ${email} ---`)
  
  // 1. Tentar Login
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (authError) {
    console.error(`❌ Falha no login: ${authError.message}`)
    return
  }

  console.log(`✅ Autenticado com sucesso! User ID: ${authData.user.id}`)

  // 2. Buscar Perfil vinculado no banco
  const { data: perfilData, error: perfilError } = await supabase
    .from('perfis')
    .select('nome, tipo')
    .eq('auth_user_id', authData.user.id)
    .single()

  if (perfilError || !perfilData) {
    console.error(`❌ Perfil não encontrado no banco para este usuário!`)
  } else {
    console.log(`✅ Perfil encontrado: Nome="${perfilData.nome}", Tipo="${perfilData.tipo}"`)
    if (perfilData.tipo === expectedType) {
      console.log(`🚀 Redirecionamento configurado para: ${perfilData.tipo === 'motorista' ? '/dashboard' : perfilData.tipo === 'responsavel' ? '/meu-painel' : '/admin'}`)
    } else {
      console.log(`⚠️ Tipo de usuário diferente do esperado!`)
    }
  }

  // Deslogar para o próximo teste
  await supabase.auth.signOut()
}

async function runTests() {
  await testLogin('admin@tiodavan.com', 'password123', 'admin')
  await testLogin('motorista@tiodavan.com', 'password123', 'motorista')
  await testLogin('responsavel@tiodavan.com', 'password123', 'responsavel')
}

runTests()
