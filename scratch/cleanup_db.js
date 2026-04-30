import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function cleanup() {
  console.log('🧹 Starting Database Cleanup...')
  
  // 1. Get Admin ID
  const { data: { users } } = await supabase.auth.admin.listUsers()
  const adminUser = users.find(u => u.email === 'admin@sjcknl.edu.in')
  
  if (!adminUser) return

  // 2. Delete ALL existing links for this user to be safe
  console.log('🗑️ Deleting duplicates...')
  await supabase.from('admins').delete().eq('user_id', adminUser.id)
  await supabase.from('faculty').delete().eq('user_id', adminUser.id)
  await supabase.from('students').delete().eq('user_id', adminUser.id)

  // 3. Insert ONE clean link
  console.log('✨ Creating one clean admin link...')
  await supabase.from('admins').insert([{
    user_id: adminUser.id,
    name: 'Master Admin',
    role: 'admin'
  }])

  console.log('✅ Cleanup complete! Try logging in now.')
}

cleanup()
