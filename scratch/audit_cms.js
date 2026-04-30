import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function auditCMS() {
  console.log('🕵️‍♂️ Auditing CMS Content...')
  
  const { data, error } = await supabase.from('website_content').select('*')
  
  if (error) {
    console.error('❌ Error fetching CMS:', error.message)
  } else {
    console.log(`✅ Found ${data.length} CMS sections:`, data)
  }
}

auditCMS()
