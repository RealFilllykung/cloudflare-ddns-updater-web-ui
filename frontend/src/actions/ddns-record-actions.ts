'use server'

import { upsertDnsRecord } from './cloudflare-actions'
import { prisma } from '@/lib/prisma'
import type { DnsRecord } from '@/components/section/dns-records-section'

type Result<T> = {
  success: boolean
  data?: T
  error?: string
}

export async function createDnsRecord(record: Omit<DnsRecord, 'id'>) {
  try {
    // Get credential for Cloudflare
    const credential = await prisma.credential.findUnique({ where: { id: record.credentialId } })
    if (!credential) throw new Error('Credential not found')
    // Upsert Cloudflare record
    await upsertDnsRecord(
      {
        email: credential.email,
        apiKey: credential.apiKey,
        zoneId: credential.zoneId,
      },
      {
        type: 'A',
        name: record.domain,
        ttl: 3600,
        comment: 'Record created by Cloudflare DDNS updater web UI on ' + new Date().toLocaleString(),
      }
    )
    // Save to local DB
    const newRecord = await prisma.dnsRecord.create({
      data: {
        id: Date.now().toString(),
        ...record,
        lastUpdate: new Date(),
      }
    })
    return { success: true, data: { ...newRecord, lastUpdate: newRecord.lastUpdate.toLocaleString() } }
  } catch (error) {
    console.error('Failed to create DNS record:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create DNS record' }
  }
}

export async function updateDnsRecord(id: string, data: Omit<DnsRecord, 'id'>) {
  try {
    // Get credential for Cloudflare
    const credential = await prisma.credential.findUnique({ where: { id: data.credentialId } })
    if (!credential) throw new Error('Credential not found')
    // Upsert Cloudflare record
    await upsertDnsRecord(
      {
        email: credential.email,
        apiKey: credential.apiKey,
        zoneId: credential.zoneId,
      },
      {
        type: 'A',
        name: data.domain,
        ttl: 3600,
        comment: 'Updated by Cloudflare DDNS updater web UI on ' + new Date().toLocaleString(),
      }
    )
    // Update local DB
    const updatedRecord = await prisma.dnsRecord.update({
      where: { id },
      data: {
        ...data,
        lastUpdate: new Date(),
      }
    })
    return { success: true, data: { ...updatedRecord, lastUpdate: updatedRecord.lastUpdate.toLocaleString() } }
  } catch (error) {
    console.error('Failed to update DNS record:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update DNS record' }
  }
}

export async function deleteDnsRecord(id: string) {
  try {
    await prisma.dnsRecord.delete({
      where: { id }
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to delete DNS record:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete DNS record' }
  }
}

export async function getAllDnsRecords() {
  try {
    const records = await prisma.dnsRecord.findMany()
    return { 
      success: true, 
      data: records.map((record: typeof records[number]) => ({
        ...record,
        lastUpdate: record.lastUpdate.toLocaleString()
      }))
    }
  } catch (error) {
    console.error('Failed to fetch DNS records:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch DNS records' }
  }
}