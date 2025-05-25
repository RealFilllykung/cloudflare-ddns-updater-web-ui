import { prisma } from './prisma'
import { ensureDbFolder } from './ensure-db-folder'

export async function initDatabase() {
  try {
    // Ensure database folder exists
    ensureDbFolder()

    // Test database connection
    await prisma.$connect()
    
    // Get counts to verify tables exist
    const credentialCount = await prisma.credential.count()
    const dnsRecordCount = await prisma.dnsRecord.count()
    
    console.log('Database initialized successfully:')
    console.log(`- ${credentialCount} credentials`)
    console.log(`- ${dnsRecordCount} DNS records`)

  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}
