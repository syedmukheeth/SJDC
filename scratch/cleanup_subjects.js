import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function cleanupSubjects() {
  console.log('🧹 Starting Subjects Cleanup...')
  
  // 1. Get all subjects
  const { data: subjects, error } = await supabase.from('subjects').select('*')
  if (error) {
    console.error('❌ Error fetching subjects:', error.message)
    return
  }

  // 2. Identify duplicates
  const seen = new Set()
  const toDelete = []

  for (const sub of subjects) {
    const key = `${sub.name}-${sub.course}`
    if (seen.has(key)) {
      toDelete.push(sub.id)
    } else {
      seen.add(key)
    }
  }

  // 3. Delete duplicates
  if (toDelete.length > 0) {
    console.log(`🗑️ Deleting ${toDelete.length} redundant subjects...`)
    const { error: delError } = await supabase.from('subjects').delete().in('id', toDelete)
    if (delError) {
      console.error('❌ Error deleting duplicates:', delError.message)
    } else {
      console.log('✅ Duplicates removed successfully!')
    }
  } else {
    console.log('✨ No duplicates found!')
  }
}

cleanupSubjects()
