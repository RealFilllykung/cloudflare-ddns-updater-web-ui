'use server'

import { existsSync, mkdirSync } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { execSync } from 'child_process'

export async function initializeDb() {
  try {
    const dbFolderPath = path.join(process.cwd(), 'database')
    
    if (!existsSync(dbFolderPath)) {
      console.log('Creating database folder...')
      mkdirSync(dbFolderPath, { recursive: true })
    }

    console.log('Setting up database schema...')
    execSync('npx prisma db push', { stdio: 'inherit' })

    // Test database connection
    await prisma.$connect()
    
    // Get counts to verify tables exist
    const credentialCount = await prisma.credential.count()
    const dnsRecordCount = await prisma.dnsRecord.count()
    
    return {
      success: true,
      credentialCount,
      dnsRecordCount
    }
  } catch (error) {
    console.error('Failed to initialize database:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
