// Documents Collection Schema
import type { Timestamp } from "firebase-admin/firestore"

export interface DocumentDocument {
  // Document ID: auto-generated

  // Basic Information
  id: string
  applicationId: string
  companyId: string

  // File Information
  fileName: string
  originalFileName: string
  fileType: string
  fileSize: number
  mimeType: string

  // Storage Information
  storagePath: string
  downloadURL: string
  thumbnailURL?: string

  // Document Classification
  documentType: "financial_statement" | "tax_report" | "bank_statement" | "legal_document" | "other"
  category: "required" | "supporting" | "additional"

  // OCR Results (SARANA Module)
  ocrResults?: {
    extractedText: string
    confidence: number
    structuredData: any
    processedAt: Timestamp
    processingTime: number
  }

  // Validation Status
  validationStatus: "pending" | "valid" | "invalid" | "requires_review"
  validationErrors?: string[]
  validatedBy?: string
  validatedAt?: Timestamp

  // System Fields
  uploadedBy: string
  uploadedAt: Timestamp
  updatedAt: Timestamp

  // Security
  accessLevel: "public" | "internal" | "confidential"
  encryptionStatus: boolean

  // Audit Trail
  auditTrail: Array<{
    action: "uploaded" | "processed" | "validated" | "downloaded" | "deleted"
    userId: string
    timestamp: Timestamp
    details?: any
  }>
}
