import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixProfile() {
  console.log('🔧 Repairing profiles...')

  // 1. Get the Auth User ID
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) {
    console.error('❌ Error listing users:', listError.message)
    return
  }

  for (const user of users) {
    console.log(`\nProcessing: ${user.email}`)
    
    let table = ''
    if (user.email.includes('admin')) table = 'admins'
    else if (user.email.includes('faculty')) table = 'faculty'
    else if (user.email.includes('student')) table = 'students'

    if (!table) continue

    // 2. Upsert into the correct table
    const payload = { 
      user_id: user.id, 
      name: user.email.split('@')[0].toUpperCase(),
      ...(table === 'faculty' ? { department: 'Computer Science' } : {}),
      ...(table === 'students' ? { email: user.email, course: 'BCA', section: 'A' } : {})
    }

    const { error: upsertError } = await supabase
      .from(table)
      .upsert(payload, { onConflict: 'user_id' })

    if (upsertError) {
      // If user_id unique constraint doesn't exist, try matching by name/email
      console.log(`⚠️ Upsert failed, trying direct insert...`)
      await supabase.from(table).insert([payload])
    } else {
      console.log(`✅ Successfully linked ${user.email} to ${table}`)
    }
  }

  console.log('\n✨ Profile repair complete! Try logging in now.')
}

fixProfile()
