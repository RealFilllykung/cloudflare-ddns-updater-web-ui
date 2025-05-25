import { existsSync, mkdirSync } from 'fs'
import path from 'path'

export function ensureDbFolder() {
  const dbFolderPath = path.join(process.cwd(), 'database')
  
  if (!existsSync(dbFolderPath)) {
    console.log('Creating database folder...')
    mkdirSync(dbFolderPath, { recursive: true })
  }
  
  return dbFolderPath
}
