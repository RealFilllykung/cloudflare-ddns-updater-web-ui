import { getPublicIp } from './public-ip-actions'

export interface CloudflareCredential {
  email: string
  apiKey: string
  zoneId: string
}

export interface CloudflareDnsRecord {
  id?: string
  type: string
  name: string
  content: string
  proxied: boolean
  ttl: number
  comment?: string
}

async function cloudflareApi(
  endpoint: string,
  method: string,
  credentials: CloudflareCredential,
  body?: any
) {
  const url = `https://api.cloudflare.com/client/v4/zones/${credentials.zoneId}${endpoint}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Auth-Email': credentials.email,
    'X-Auth-Key': credentials.apiKey,
  }
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.errors?.[0]?.message || 'Cloudflare API error')
  return data.result
}

export async function listDnsRecords(credentials: CloudflareCredential) {
  return cloudflareApi('/dns_records', 'GET', credentials)
}

export async function createDnsRecord(credentials: CloudflareCredential, record: CloudflareDnsRecord) {
  return cloudflareApi('/dns_records', 'POST', credentials, record)
}

export async function updateDnsRecord(credentials: CloudflareCredential, recordId: string, record: CloudflareDnsRecord) {
  return cloudflareApi(`/dns_records/${recordId}`, 'PATCH', credentials, record)
}

// Main action: update or create DNS record for current public IP
export async function upsertDnsRecord(credentials: CloudflareCredential, record: Omit<CloudflareDnsRecord, 'id' | 'content' | 'proxied'>) {
  const ip = await getPublicIp()
  const all = await listDnsRecords(credentials)
  const match = all.find((r: any) => r.name === record.name && r.type === record.type)
  if (match) {
    // Preserve the proxied value from Cloudflare
    const recordData = { ...record, content: ip, proxied: match.proxied }
    return updateDnsRecord(credentials, match.id, recordData)
  } else {
    // Always set proxied to false for new records
    const recordData = { ...record, content: ip, proxied: false }
    return createDnsRecord(credentials, recordData)
  }
}
