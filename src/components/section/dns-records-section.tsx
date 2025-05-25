"use client"

import { useEffect, useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
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
import { Credential } from "./credentials-section"
import { createDnsRecord, updateDnsRecord, deleteDnsRecord, getAllDnsRecords } from "@/actions/ddns-record-actions"

export interface DnsRecord {
  id: string
  credentialId: string
  credentialName: string
  domain: string
  currentIp: string
  lastUpdate: string
}

interface DnsRecordsSectionProps {
  credentials: Credential[]
  dnsRecords: DnsRecord[]
  setDnsRecords: React.Dispatch<React.SetStateAction<DnsRecord[]>>
}

export function DnsRecordsSection({ credentials, dnsRecords, setDnsRecords }: DnsRecordsSectionProps) {
  const [recordDialog, setRecordDialog] = useState(false)
  const [editingRecord, setEditingRecord] = useState<DnsRecord | null>(null)
  const [recordForm, setRecordForm] = useState({
    credentialId: "",
    domain: "",
  })

  // Fetch DNS records on component mount
  useEffect(() => {
    const fetchDnsRecords = async () => {
      const result = await getAllDnsRecords()
      if (result.success) {
        setDnsRecords(result.data)
      } else {
        console.error("Failed to fetch DNS records:", result.error)
      }
    }

    fetchDnsRecords()
  }, [setDnsRecords])

  const handleRecordSubmit = async () => {
    if (!recordForm.credentialId || !recordForm.domain) return

    const credential = credentials.find((cred) => cred.id === recordForm.credentialId)
    if (!credential) return

    if (editingRecord) {
      const result = await updateDnsRecord(editingRecord.id, {
        credentialId: recordForm.credentialId,
        credentialName: credential.name,
        domain: recordForm.domain,
        currentIp: editingRecord.currentIp,
        lastUpdate: new Date().toLocaleString(),
      })

      if (result.success) {
        setDnsRecords((prev) =>
          prev.map((record) => (record.id === editingRecord.id ? result.data : record))
        )
        resetRecordForm()
      } else {
        console.error("Failed to update DNS record:", result.error)
      }
    } else {
      const result = await createDnsRecord({
        credentialId: recordForm.credentialId,
        credentialName: credential.name,
        domain: recordForm.domain,
        currentIp: "192.168.1.100", // Mock IP
        lastUpdate: new Date().toLocaleString(),
      })

      if (result.success) {
        setDnsRecords((prev) => [...prev, result.data])
        resetRecordForm()
      } else {
        console.error("Failed to create DNS record:", result.error)
      }
    }
  }

  const resetRecordForm = () => {
    setRecordForm({ credentialId: "", domain: "" })
    setEditingRecord(null)
    setRecordDialog(false)
  }

  const handleEditRecord = (record: DnsRecord) => {
    setEditingRecord(record)
    setRecordForm({
      credentialId: record.credentialId,
      domain: record.domain,
    })
    setRecordDialog(true)
  }

  const handleDeleteRecord = async (recordId: string) => {
    const result = await deleteDnsRecord(recordId)
    if (result.success) {
      setDnsRecords((prev) => prev.filter((record) => record.id !== recordId))
    } else {
      console.error("Failed to delete DNS record:", result.error)
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">DNS Records</h2>
        <Dialog open={recordDialog} onOpenChange={setRecordDialog}>
          <DialogTrigger asChild>
            <Button disabled={credentials.length === 0} onClick={() => setEditingRecord(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingRecord ? "Edit DNS Record" : "Add DNS Record"}</DialogTitle>
              <DialogDescription>
                {editingRecord ? "Update the DNS record for your domain." : "Create a new dynamic DNS record for your domain."}
              </DialogDescription>
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
              <Button variant="outline" onClick={resetRecordForm}>
                Cancel
              </Button>
              <Button onClick={handleRecordSubmit}>{editingRecord ? "Update" : "Create"} Record</Button>
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
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{record.domain}</CardTitle>
                    <CardDescription>via {record.credentialName}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEditRecord(record)}>
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
                          <AlertDialogTitle>Delete DNS Record</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this DNS record? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteRecord(record.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
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
  )
}
