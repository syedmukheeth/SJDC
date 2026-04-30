import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function deepCheck() {
  console.log('🔍 Deep Diagnostic Check...')

  const tables = ['admins', 'faculty', 'students', 'subjects', 'attendance']
  
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase.from(table).select('*', { count: 'exact' })
      if (error) {
        console.error(`❌ Table "${table}" error:`, error.message)
      } else {
        console.log(`✅ Table "${table}": ${count} records found.`)
      }
    } catch (e) {
      console.error(`💥 Table "${table}" crashed:`, e.message)
    }
  }
}

deepCheck()
