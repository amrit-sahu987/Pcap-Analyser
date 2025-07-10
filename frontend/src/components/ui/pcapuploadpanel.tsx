"use client"

import React, { useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toast } from "@/components/ui/sonner"
import { toast } from "sonner"

interface PcapUploadPanelProps {
  onPacketsReceived: (packets: any[]) => void
}

const PcapUploadPanel: React.FC<PcapUploadPanelProps> = ({ onPacketsReceived }) => {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChooseFile = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null)
  }

  const handleSubmit = async () => {
    if (!file) {
      toast({ title: "No file selected", description: "Please select a .pcap file." })
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData
      })

      if (!res.ok) throw new Error("Upload failed")

      const data = await res.json()
      onPacketsReceived(data)
      toast({ title: "Upload successful", description: `${data.length} packets received.` })
    } catch (err) {
      toast({ title: "Error", description: "Failed to upload PCAP file." })
    } finally {
      setLoading(false)
    }
  }

  return (
<Card className="w-[100%] h-[80vh] p-4 shadow-md">
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Upload PCAP File</Label>
          <div className="flex gap-2">
            <Input
              readOnly
              value={file ? file.name : ""}
              placeholder="No file chosen"
              className="flex-1"
            />
            <Button type="button" variant="outline" onClick={handleChooseFile}>
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pcap"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "Uploading..." : "Submit"}
        </Button>
      </CardContent>
    </Card>
  )
}

export default PcapUploadPanel
