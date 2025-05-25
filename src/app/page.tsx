"use client"

import { useEffect, useState } from "react"
import { CredentialsSection } from "@/components/section/credentials-section"
import { DnsRecordsSection } from "@/components/section/dns-records-section"
import type { Credential } from "@/components/section/credentials-section"
import type { DnsRecord } from "@/components/section/dns-records-section"
import { initDatabase } from "@/lib/init-db"

export default function DDNSManager() {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>([])

  useEffect(() => {
    // Initialize database when the app starts
    initDatabase().catch(console.error)
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">DDNS Manager</h1>
        <p className="text-muted-foreground">Manage your Cloudflare Dynamic DNS records</p>
      </div>

      <CredentialsSection
        credentials={credentials}
        setCredentials={setCredentials}
        setDnsRecords={setDnsRecords}
      />

      <DnsRecordsSection
        credentials={credentials}
        dnsRecords={dnsRecords}
        setDnsRecords={setDnsRecords}
      />
    </div>
  )
}
