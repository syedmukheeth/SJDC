import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function audit() {
  console.log('🕵️‍♂️ Starting Database Audit...')
  
  // 1. Check Auth User
  const { data: { users }, error: authErr } = await supabase.auth.admin.listUsers()
  const adminUser = users.find(u => u.email === 'admin@sjcknl.edu.in')
  
  if (!adminUser) {
    console.error('❌ Admin user NOT FOUND in Auth!')
    return
  }
  console.log('✅ Admin user found in Auth with ID:', adminUser.id)

  // 2. Check Admins Table
  const { data: adminRows, error: tableErr } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', adminUser.id)

  if (tableErr) {
    console.error('❌ Error fetching admins:', tableErr.message)
  } else {
    console.log(`✅ Found ${adminRows.length} rows for this user:`, adminRows)
  }

  // 3. Check RLS Policies (List all tables)
  const { data: tables, error: schemaErr } = await supabase.rpc('get_tables')
  if (schemaErr) {
    console.warn('⚠️ Could not fetch tables via RPC (expected).')
  }
}

audit()
