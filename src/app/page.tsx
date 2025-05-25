"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Credential {
  id: string
  name: string
  zoneId: string
  apiKey: string
}

interface DnsRecord {
  id: string
  credentialId: string
  credentialName: string
  domain: string
  currentIp: string
  lastUpdate: string
}

export default function DDNSManager() {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>([])

  // Credential dialog state
  const [credentialDialog, setCredentialDialog] = useState(false)
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null)
  const [credentialForm, setCredentialForm] = useState({
    name: "",
    zoneId: "",
    apiKey: "",
  })
  const [showZoneId, setShowZoneId] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  // DNS record dialog state
  const [recordDialog, setRecordDialog] = useState(false)
  const [recordForm, setRecordForm] = useState({
    credentialId: "",
    domain: "",
  })

  const handleCredentialSubmit = () => {
    if (!credentialForm.name || !credentialForm.zoneId || !credentialForm.apiKey) return

    if (editingCredential) {
      setCredentials((prev) =>
        prev.map((cred) => (cred.id === editingCredential.id ? { ...cred, ...credentialForm } : cred)),
      )
    } else {
      const newCredential: Credential = {
        id: Date.now().toString(),
        ...credentialForm,
      }
      setCredentials((prev) => [...prev, newCredential])
    }

    resetCredentialForm()
  }

  const resetCredentialForm = () => {
    setCredentialForm({ name: "", zoneId: "", apiKey: "" })
    setEditingCredential(null)
    setCredentialDialog(false)
    setShowZoneId(false)
    setShowApiKey(false)
  }

  const handleEditCredential = (credential: Credential) => {
    setEditingCredential(credential)
    setCredentialForm({
      name: credential.name,
      zoneId: credential.zoneId,
      apiKey: credential.apiKey,
    })
    setCredentialDialog(true)
  }

  const handleDeleteCredential = (credentialId: string) => {
    setCredentials((prev) => prev.filter((cred) => cred.id !== credentialId))
    // Also remove associated DNS records
    setDnsRecords((prev) => prev.filter((record) => record.credentialId !== credentialId))
  }

  const handleRecordSubmit = () => {
    if (!recordForm.credentialId || !recordForm.domain) return

    const credential = credentials.find((cred) => cred.id === recordForm.credentialId)
    if (!credential) return

    const newRecord: DnsRecord = {
      id: Date.now().toString(),
      credentialId: recordForm.credentialId,
      credentialName: credential.name,
      domain: recordForm.domain,
      currentIp: "192.168.1.100", // Mock IP
      lastUpdate: new Date().toLocaleString(),
    }

    setDnsRecords((prev) => [...prev, newRecord])
    setRecordForm({ credentialId: "", domain: "" })
    setRecordDialog(false)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">DDNS Manager</h1>
        <p className="text-muted-foreground">Manage your Cloudflare Dynamic DNS records</p>
      </div>

      {/* Credentials Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Account Credentials</h2>
          <Dialog open={credentialDialog} onOpenChange={setCredentialDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingCredential(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Cloudflare Credentials
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingCredential ? "Edit Credentials" : "Add Cloudflare Credentials"}</DialogTitle>
                <DialogDescription>Enter your Cloudflare account credentials to manage DNS records.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="credential-name">Credential Name</Label>
                  <Input
                    id="credential-name"
                    value={credentialForm.name}
                    onChange={(e) => setCredentialForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="My Cloudflare Account"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zone-id">Zone Identifier ID</Label>
                  <div className="relative">
                    <Input
                      id="zone-id"
                      type={showZoneId ? "text" : "password"}
                      value={credentialForm.zoneId}
                      onChange={(e) => setCredentialForm((prev) => ({ ...prev, zoneId: e.target.value }))}
                      placeholder="Enter zone identifier"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowZoneId(!showZoneId)}
                    >
                      {showZoneId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="relative">
                    <Input
                      id="api-key"
                      type={showApiKey ? "text" : "password"}
                      value={credentialForm.apiKey}
                      onChange={(e) => setCredentialForm((prev) => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="Enter API key"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetCredentialForm}>
                  Cancel
                </Button>
                <Button onClick={handleCredentialSubmit}>{editingCredential ? "Update" : "Add"} Credentials</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {credentials.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">No credentials added yet. Click the button above to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {credentials.map((credential) => (
              <Card key={credential.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{credential.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEditCredential(credential)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Credential</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this credential? This action cannot be undone and will
                              also remove all associated DNS records.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCredential(credential.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Cloudflare Account</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* DNS Records Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">DNS Records</h2>
          <Dialog open={recordDialog} onOpenChange={setRecordDialog}>
            <DialogTrigger asChild>
              <Button disabled={credentials.length === 0}>
                <Plus className="w-4 h-4 mr-2" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add DNS Record</DialogTitle>
                <DialogDescription>Create a new dynamic DNS record for your domain.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="credential-select">Credential</Label>
                  <Select
                    value={recordForm.credentialId}
                    onValueChange={(value) => setRecordForm((prev) => ({ ...prev, credentialId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a credential" />
                    </SelectTrigger>
                    <SelectContent>
                      {credentials.map((credential) => (
                        <SelectItem key={credential.id} value={credential.id}>
                          {credential.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain-name">Domain Name</Label>
                  <Input
                    id="domain-name"
                    value={recordForm.domain}
                    onChange={(e) => setRecordForm((prev) => ({ ...prev, domain: e.target.value }))}
                    placeholder="your-domain.com or sub-domain.your-domain.com"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRecordDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRecordSubmit}>Create Record</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {dnsRecords.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">
                {credentials.length === 0
                  ? "Add credentials first to create DNS records."
                  : "No DNS records created yet. Click the button above to add your first record."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dnsRecords.map((record) => (
              <Card key={record.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{record.domain}</CardTitle>
                  <CardDescription>via {record.credentialName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Current IP</p>
                    <p className="text-sm text-muted-foreground">{record.currentIp}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Update</p>
                    <p className="text-sm text-muted-foreground">{record.lastUpdate}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
