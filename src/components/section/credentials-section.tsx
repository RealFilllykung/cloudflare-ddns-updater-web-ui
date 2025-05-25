"use client"

import { useEffect, useState } from "react"
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
import { createCredential, updateCredential, deleteCredential, getAllCredentials } from "@/actions/credential-actions"

export interface Credential {
  id: string
  name: string
  zoneId: string
  apiKey: string
  email: string
}

interface CredentialsSectionProps {
  credentials: Credential[]
  setCredentials: React.Dispatch<React.SetStateAction<Credential[]>>
  setDnsRecords: React.Dispatch<React.SetStateAction<any[]>>
}

export function CredentialsSection({ credentials, setCredentials, setDnsRecords }: CredentialsSectionProps) {
  const [credentialDialog, setCredentialDialog] = useState(false)
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null)
  const [credentialForm, setCredentialForm] = useState({
    name: "",
    zoneId: "",
    apiKey: "",
    email: "",
  })
  const [showZoneId, setShowZoneId] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  // Fetch credentials on component mount
  useEffect(() => {
    const fetchCredentials = async () => {
      const result = await getAllCredentials()
      if (result.success) {
        setCredentials(result.data)
      } else {
        console.error("Failed to fetch credentials:", result.error)
      }
    }

    fetchCredentials()
  }, [setCredentials])

  const handleCredentialSubmit = async () => {
    if (!credentialForm.name || !credentialForm.zoneId || !credentialForm.apiKey) return

    if (editingCredential) {
      const result = await updateCredential(editingCredential.id, credentialForm)
      if (result.success) {
        setCredentials((prev) =>
          prev.map((cred) => (cred.id === editingCredential.id ? result.data : cred))
        )
        resetCredentialForm()
      } else {
        console.error("Failed to update credential:", result.error)
      }
    } else {
      const result = await createCredential(credentialForm)
      if (result.success) {
        setCredentials((prev) => [...prev, result.data])
        resetCredentialForm()
      } else {
        console.error("Failed to create credential:", result.error)
      }
    }
  }

  const resetCredentialForm = () => {
    setCredentialForm({ name: "", zoneId: "", apiKey: "", email: "" })
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
      email: credential.email
    })
    setCredentialDialog(true)
  }

  const handleDeleteCredential = async (credentialId: string) => {
    const result = await deleteCredential(credentialId)
    if (result.success) {
      setCredentials((prev) => prev.filter((cred) => cred.id !== credentialId))
      setDnsRecords((prev) => prev.filter((record) => record.credentialId !== credentialId))
    } else {
      console.error("Failed to delete credential:", result.error)
    }
  }

  return (
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
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={credentialForm.email}
                  onChange={(e) => setCredentialForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
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
  )
}
