"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react"
import { uploadFile } from "@/lib/api-handlers"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onUploadComplete?: (files: UploadedFile[]) => void
  maxFiles?: number
  maxSize?: number
  acceptedTypes?: string[]
  folder?: string
  className?: string
}

interface UploadedFile {
  id: string
  name: string
  size: number
  url: string
  status: "uploading" | "completed" | "error"
  progress: number
  error?: string
}

export default function FileUpload({
  onUploadComplete,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  folder = "documents",
  className,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Validasi jumlah file
      if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
        toast.error(`Maksimal ${maxFiles} file yang dapat diupload`, { duration: 2000 })
        return
      }

      // Buat file objects dengan status uploading
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        url: "",
        status: "uploading",
        progress: 0,
      }))

      setUploadedFiles((prev) => [...prev, ...newFiles])

      // Upload setiap file
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i]
        const fileObj = newFiles[i]

        try {
          const result = await uploadFile(file, folder, (progress) => {
            setUploadedFiles((prev) => prev.map((f) => (f.id === fileObj.id ? { ...f, progress } : f)))
          })

          // Update status menjadi completed
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id ? { ...f, status: "completed", progress: 100, url: result.fileUrl } : f,
            ),
          )

          toast.success(`${file.name} berhasil diupload`, { duration: 2000 })
        } catch (error) {
          // Update status menjadi error
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? {
                    ...f,
                    status: "error",
                    error: error instanceof Error ? error.message : "Upload gagal",
                  }
                : f,
            ),
          )

          toast.error(`Gagal upload ${file.name}`, { duration: 2000 })
        }
      }

      // Panggil callback jika ada
      if (onUploadComplete) {
        const completedFiles = uploadedFiles.filter((f) => f.status === "completed")
        onUploadComplete(completedFiles)
      }
    },
    [uploadedFiles, maxFiles, folder, onUploadComplete],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple: true,
  })

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive
                ? "border-[#0887A0] bg-[#0887A0]/5"
                : "border-gray-300 hover:border-[#0887A0] hover:bg-gray-50",
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-[#0887A0] font-medium">Lepaskan file di sini...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  Drag & drop file di sini, atau <span className="text-[#0887A0] font-medium">klik untuk browse</span>
                </p>
                <p className="text-sm text-gray-500">
                  Maksimal {maxFiles} file, ukuran maksimal {formatFileSize(maxSize)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Format yang didukung: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-4">File yang diupload ({uploadedFiles.length})</h4>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {file.status === "completed" && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {file.status === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
                    {file.status === "uploading" && <File className="h-5 w-5 text-blue-500" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>

                    {file.status === "uploading" && <Progress value={file.progress} className="mt-2 h-2" />}

                    {file.status === "error" && <p className="text-xs text-red-500 mt-1">{file.error}</p>}

                    {file.status === "completed" && <p className="text-xs text-green-500 mt-1">Upload berhasil</p>}
                  </div>

                  <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)} className="flex-shrink-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
