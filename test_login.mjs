import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xexxnfhukprktdzkhnhi.supabase.co";
const supabaseKey = "sb_publishable_sphjc9wHe8Zb-oVHvDAa4A_II6s-ch0";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  console.log("Testing login via GoTrue API...");

  const { data, error } = await supabase.auth.signInWithPassword({
    email: "mae@tiodavan.com",
    password: "Teste123@"
  });

  if (error) {
    console.error("Login failed:", error.message);
  } else {
    console.log("Login successful! User ID:", data.user?.id);
  }
}

testLogin();
