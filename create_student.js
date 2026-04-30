import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function createStudent() {
  console.log('🔄 Retrying Student creation...')
  
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'student@sjcknl.edu.in',
    password: 'password123'
  })

  if (authError) {
    console.error('❌ Error:', authError.message)
    return
  }

  console.log('✅ Student Auth created! ID:', authData.user?.id)
  console.log('\nNow please run the SQL I provided earlier to link this ID to the database tables!')
}

createStudent()
