import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project')) {
  console.error('❌ Error: Please set valid Supabase credentials in your .env file first.')
  console.log('TIP: Use SUPABASE_SERVICE_ROLE_KEY to bypass RLS during seeding.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

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

    let userId = authData.user?.id

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log(`ℹ️ User ${user.email} already exists in Auth.`)
        
        // Safely attempt to list users to get ID
        try {
          const { data, error: listError } = await supabase.auth.admin.listUsers()
          if (!listError && data?.users) {
            userId = data.users.find(u => u.email === user.email)?.id
            
            // FORCE PASSWORD UPDATE
            if (userId) {
              console.log(`🔑 Resetting password for ${user.email} to 'password123'...`)
              await supabase.auth.admin.updateUserById(userId, { password: 'password123' })
            }
          }
        } catch (e) {
          // Admin methods might not be available, which is expected with anon key
        }
      } else {
        console.error(`❌ Auth Error for ${user.email}:`, authError.message)
      }
    }

    if (!userId) {
      console.log(`⚠️ Note: Could not fetch ID for ${user.email} automatically. If the link fails, check your Supabase Dashboard.`)
    } else {
      console.log(`✅ User ID identified: ${userId}`)
    }

    // 2. Link to Role Table
    if (userId) {
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

      // Manual Upsert: Check if exists first
      const { data: existing } = await supabase.from(table).select('id').eq('user_id', userId).single()
      
      let dbError;
      if (existing) {
        console.log(`ℹ️ Updating existing ${user.role} link...`)
        const { error } = await supabase.from(table).update(payload).eq('user_id', userId)
        dbError = error
      } else {
        const { error } = await supabase.from(table).insert([payload])
        dbError = error
      }

      if (dbError) {
        console.error(`❌ Database Link Error for ${user.role}:`, dbError.message)
      } else {
        console.log(`✨ Successfully linked ${user.email} to ${table} table.`)
      }
    }
  }

  // 3. Seed Subjects
  console.log('\n📚 Seeding subjects...')
  const defaultSubjects = [
    { name: 'Artificial Intelligence', course: 'BCA' },
    { name: 'Computer Networks', course: 'BCA' },
    { name: 'Web Development', course: 'BCA' },
    { name: 'Operating Systems', course: 'BSc-CS' },
    { name: 'Data Structures', course: 'BSc-CS' },
    { name: 'Business Management', course: 'BBA' }
  ]

  for (const sub of defaultSubjects) {
    const { data: existing } = await supabase.from('subjects').select('id').eq('name', sub.name).single()
    if (existing) {
      await supabase.from('subjects').update(sub).eq('name', sub.name)
    } else {
      await supabase.from('subjects').insert([sub])
    }
  }
  console.log('✅ Subjects check/sync complete.')

  // 4. Seed Website Content (CMS)
  console.log('\n🌐 Seeding CMS content...')
  const defaultCMS = [
    { 
      section: 'hero_title', 
      title: 'Homepage Hero', 
      content: 'Welcome to St. Joseph\'s Degree College',
      metadata: { page: 'home' }
    },
    { 
      section: 'announcement_bar', 
      title: 'Header Announcement', 
      content: 'Admissions open for the Academic Year 2024-25! Enrol now.',
      metadata: { page: 'all' }
    }
  ]

  for (const item of defaultCMS) {
    const { error: cmsError } = await supabase.from('website_content').upsert([item], { onConflict: 'section' })
    if (cmsError) console.error(`❌ Error seeding CMS [${item.section}]:`, cmsError.message)
    else console.log(`✅ CMS section [${item.section}] initialized.`)
  }

  console.log('\n--- Seed Complete ---')
  console.log('1. Admin: admin@sjcknl.edu.in')
  console.log('2. Faculty: faculty@sjcknl.edu.in')
  console.log('3. Student: student@sjcknl.edu.in')
  console.log('Password: password123')
}

seed().catch(err => {
  console.error('💥 Critical Seed Error:', err.message)
  process.exit(1)
})
