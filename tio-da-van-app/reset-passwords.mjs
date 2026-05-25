import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://xexxnfhukprktdzkhnhi.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhleHhuZmh1a3Bya3RkemtobmhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTM5MzA2MCwiZXhwIjoyMDk0OTY5MDYwfQ.g82KagiU6pDwtHaI1jLNQdLk1CRuXyYdJXCHRqIFfrs'

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function resetPasswords() {
  const users = [
    { email: 'motorista@tiodavan.com', tipo: 'motorista' },
    { email: 'responsavel@tiodavan.com', tipo: 'responsavel' },
    { email: 'admin@tiodavan.com', tipo: 'admin' }
  ]

  for (const u of users) {
    console.log(`\nBuscando usuário: ${u.email}`)
    
    // Lista usuários para encontrar o ID
    const { data: { users: authUsers }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      console.error('Erro ao listar usuários:', listError.message)
      continue
    }

    const authUser = authUsers.find(x => x.email === u.email)
    
    if (!authUser) {
      console.log(`❌ Usuário ${u.email} não encontrado no Auth.`)
      continue
    }

    console.log(`✅ Usuário encontrado no Auth. ID: ${authUser.id}. Atualizando senha para "123456"...`)
    
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      authUser.id,
      { password: '123456' }
    )

    if (updateError) {
      console.error(`❌ Erro ao atualizar senha:`, updateError.message)
    } else {
      console.log(`✅ Senha atualizada com sucesso para "123456"`)
    }
  }
}

resetPasswords()
