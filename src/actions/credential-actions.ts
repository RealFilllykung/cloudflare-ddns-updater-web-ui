'use server'

import { prisma } from '@/lib/prisma'
import type { Credential } from '@/components/section/credentials-section'

type Result<T> = {
  success: boolean
  data?: T
  error?: string
}

export async function createCredential(credential: Omit<Credential, 'id'>) {
  try {
    const newCredential = await prisma.credential.create({
      data: {
        id: Date.now().toString(),
        ...credential
      }
    })
    return { success: true, data: newCredential }
  } catch (error) {
    console.error('Failed to create credential:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create credential' }
  }
}

export async function updateCredential(id: string, credential: Omit<Credential, 'id'>) {
  try {
    const updatedCredential = await prisma.credential.update({
      where: { id },
      data: {
        ...credential
      }
    })
    return { success: true, data: updatedCredential }
  } catch (error) {
    console.error('Failed to update credential:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update credential' }
  }
}

export async function deleteCredential(id: string) {
  try {
    await prisma.credential.delete({
      where: { id }
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to delete credential:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete credential' }
  }
}

export async function getAllCredentials() {
  try {
    const credentials = await prisma.credential.findMany()
    return { success: true, data: credentials }
  } catch (error) {
    console.error('Failed to fetch credentials:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch credentials' }
  }
}