import { initializeDb } from '@/actions/db-actions'

export async function initDatabase() {
  try {
    const result = await initializeDb()
    
    if (result.success) {
      console.log('Database initialized successfully:')
      console.log(`- ${result.credentialCount} credentials`)
      console.log(`- ${result.dnsRecordCount} DNS records`)
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}
