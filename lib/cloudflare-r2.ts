import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// Cloudflare R2 Configuration
const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME!

export interface UploadResult {
  success: boolean
  fileUrl?: string
  fileName?: string
  fileSize?: number
  error?: string
}

export interface FileMetadata {
  fileName: string
  fileSize: number
  contentType: string
  uploadedAt: Date
  fileUrl: string
}

// Upload file ke Cloudflare R2
export async function uploadFileToR2(file: File, folder = "documents", customFileName?: string): Promise<UploadResult> {
  try {
    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split(".").pop()
    const fileName = customFileName || `${timestamp}-${randomString}.${fileExtension}`
    const key = `${folder}/${fileName}`

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload command
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ContentLength: file.size,
      Metadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    })

    await r2Client.send(uploadCommand)

    // Generate public URL
    const fileUrl = `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL}/${key}`

    return {
      success: true,
      fileUrl,
      fileName: key,
      fileSize: file.size,
    }
  } catch (error) {
    console.error("Error uploading file to R2:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Generate signed URL untuk download
export async function generateSignedUrl(fileName: string, expiresIn = 3600): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    })

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn })
    return signedUrl
  } catch (error) {
    console.error("Error generating signed URL:", error)
    throw error
  }
}

// Delete file dari R2
export async function deleteFileFromR2(fileName: string): Promise<boolean> {
  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    })

    await r2Client.send(deleteCommand)
    return true
  } catch (error) {
    console.error("Error deleting file from R2:", error)
    return false
  }
}

// Check if file exists
export async function fileExists(fileName: string): Promise<boolean> {
  try {
    const headCommand = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    })

    await r2Client.send(headCommand)
    return true
  } catch (error) {
    return false
  }
}

// Get file metadata
export async function getFileMetadata(fileName: string): Promise<FileMetadata | null> {
  try {
    const headCommand = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    })

    const response = await r2Client.send(headCommand)

    return {
      fileName,
      fileSize: response.ContentLength || 0,
      contentType: response.ContentType || "application/octet-stream",
      uploadedAt: response.LastModified || new Date(),
      fileUrl: `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL}/${fileName}`,
    }
  } catch (error) {
    console.error("Error getting file metadata:", error)
    return null
  }
}

// Upload multiple files
export async function uploadMultipleFiles(files: File[], folder = "documents"): Promise<UploadResult[]> {
  const uploadPromises = files.map((file) => uploadFileToR2(file, folder))
  return Promise.all(uploadPromises)
}

// Generate presigned URL untuk upload langsung dari client
export async function generatePresignedUploadUrl(
  fileName: string,
  contentType: string,
  folder = "documents",
): Promise<string> {
  try {
    const key = `${folder}/${fileName}`

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    })

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 })
    return signedUrl
  } catch (error) {
    console.error("Error generating presigned upload URL:", error)
    throw error
  }
}
