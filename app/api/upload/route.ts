import { type NextRequest, NextResponse } from "next/server"
import { uploadFileToR2 } from "@/lib/cloudflare-r2"
import { clientDb } from "@/lib/firestore-operations"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "documents"
    const applicationId = formData.get("applicationId") as string

    if (!file) {
      return NextResponse.json({ success: false, error: "File tidak ditemukan" }, { status: 400 })
    }

    // Validasi file
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: "Ukuran file terlalu besar (maksimal 10MB)" }, { status: 400 })
    }

    // Allowed file types
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: "Tipe file tidak didukung" }, { status: 400 })
    }

    // Upload ke R2
    const result = await uploadFileToR2(file, folder)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    // Simpan metadata ke Firestore jika applicationId tersedia
    let documentId: string | undefined
    if (applicationId && result.fileUrl) {
      try {
        const documentMetadata = await clientDb.createDocument({
          applicationId,
          fileName: result.fileName!,
          originalFileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileUrl: result.fileUrl,
          validationStatus: "pending", // or use the appropriate default value
        })
        documentId = documentMetadata.id
      } catch (error) {
        console.error("Error saving document metadata:", error)
        // Continue without failing the upload
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        fileUrl: result.fileUrl,
        fileName: result.fileName,
        fileSize: result.fileSize,
        originalName: file.name,
        documentId,
      },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ success: false, error: "Terjadi kesalahan saat upload file" }, { status: 500 })
  }
}
