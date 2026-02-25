"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"

interface UploadFacturaButtonProps {
  onUpload?: () => void
}

export function UploadFacturaButton({ onUpload }: UploadFacturaButtonProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/facturas/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        alert("Factura procesada correctamente")
        onUpload?.()
      } else {
        const error = await res.json()
        alert(`Error: ${error.error || "Error al procesar factura"}`)
      }
    } catch (err) {
      console.error(err)
      alert("Error al subir factura")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,image/*"
        onChange={handleFileChange}
        className="hidden"
        id="upload-factura"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {uploading ? "Subiendo..." : "Subir Factura"}
      </Button>
    </>
  )
}

