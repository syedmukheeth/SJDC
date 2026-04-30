import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project')) {
  console.error('❌ Error: Please set valid Supabase credentials in your .env file first.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const testUsers = [
  {
    email: 'admin@sjcknl.edu.in',
    password: 'password123',
    role: 'admin',
    name: 'Master Admin'
  },
  {
    email: 'faculty@sjcknl.edu.in',
    password: 'password123',
    role: 'faculty',
    name: 'Prof. Satyanarayana'
  },
  {
    email: 'student@sjcknl.edu.in',
    password: 'password123',
    role: 'student',
    name: 'Syed Student'
  }
]

async function seed() {
  console.log('🚀 Starting database seed...')

  for (const user of testUsers) {
    console.log(`\nCreating ${user.role}: ${user.email}...`)
    
    // 1. Sign Up the User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user.email,
      password: user.password
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log(`ℹ️ User ${user.email} already exists in Auth.`)
        // Try to get existing user ID if possible (though sign up doesn't return it for existing)
        // We'll skip for now or assume they are linked.
        continue
      } else {
        console.error(`❌ Auth Error for ${user.email}:`, authError.message)
        continue
      }
    }

    const userId = authData.user?.id
    if (!userId) {
      console.log(`⚠️ User created but ID not returned (might need email confirmation).`)
      continue
    }

    console.log(`✅ Auth user created with ID: ${userId}`)

    // 2. Link to Role Table
    let table = ''
    let payload = { user_id: userId, name: user.name }

    if (user.role === 'admin') {
      table = 'admins'
      payload.role = 'admin'
    } else if (user.role === 'faculty') {
      table = 'faculty'
      payload.department = 'Computer Science'
    } else if (user.role === 'student') {
      table = 'students'
      payload.email = user.email
      payload.course = 'BCA'
      payload.section = 'A'
    }

    const { error: dbError } = await supabase.from(table).insert([payload])

    if (dbError) {
      console.error(`❌ Database Error for ${user.role}:`, dbError.message)
    } else {
      console.log(`✨ Successfully linked ${user.email} to ${table} table.`)
    }
  }

  console.log('\n--- Seed Complete ---')
  console.log('Credentials to use:')
  console.log('Email: [role]@sjcknl.edu.in')
  console.log('Password: password123')
  console.log('\nNOTE: If login fails with "Invalid credentials", go to your Supabase Dashboard > Authentication > Users and manually click "Confirm User" for each.')
}

seed()
