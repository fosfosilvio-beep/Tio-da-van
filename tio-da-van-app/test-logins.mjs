import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function createMockUsers() {
  const res1 = await supabase.auth.signInWithPassword({
    email: 'motorista_mock@tiodavan.com',
    password: 'password123'
  });
  console.log("Motorista login:", res1.data?.user?.id ? "Success" : res1.error?.message);
}
createMockUsers()
