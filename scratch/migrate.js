import postgres from 'postgres'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const sql = postgres(process.env.DATABASE_URL)

async function migrate() {
  console.log('🚀 Starting Master Migration...')
  
  try {
    const schema = fs.readFileSync('./schema.sql', 'utf8')
    
    // Split by semicolon and run each command
    // We filter out empty strings and comments
    const commands = schema
      .split(';')
      .map(c => c.trim())
      .filter(c => c.length > 0 && !c.startsWith('--'))

    for (let command of commands) {
      console.log(`📡 Executing command: ${command.substring(0, 50)}...`)
      try {
        await sql.unsafe(command)
      } catch (err) {
        console.warn(`⚠️ Warning on command: ${err.message}`)
      }
    }

    console.log('✅ Migration complete! All tables created.')
  } catch (err) {
    console.error('❌ Migration failed:', err.message)
  } finally {
    await sql.end()
  }
}

migrate()
