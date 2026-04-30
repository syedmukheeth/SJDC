import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAsAnon() {
  console.log('🧪 Testing as ANONYMOUS user...')
  
  // Try to read subjects (should be public)
  const { data: subjects, error: subErr } = await supabase.from('subjects').select('*').limit(1)
  if (subErr) console.error('❌ Subjects (Public) failed:', subErr.message)
  else console.log('✅ Subjects (Public) readable!')

  // Try to read admins (should be blocked if not logged in)
  const { data: admins, error: adminErr } = await supabase.from('admins').select('*').limit(1)
  if (adminErr) console.log('✅ Admins correctly BLOCKED for anonymous:', adminErr.message)
  else console.log('⚠️ Admins should be blocked but are readable!')
  
  console.log('\n💡 CONCLUSION: If the first one works and the second one says "BLOCKED", then your RLS is active and needs the policies I provided in schema.sql!')
}

testAsAnon()
