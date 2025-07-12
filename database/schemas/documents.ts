// Documents Collection Schema
import type { FirebaseFirestore } from "firebase-admin/firestore"

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
    processedAt: FirebaseFirestore.Timestamp
    processingTime: number
  }

  // Validation Status
  validationStatus: "pending" | "valid" | "invalid" | "requires_review"
  validationErrors?: string[]
  validatedBy?: string
  validatedAt?: FirebaseFirestore.Timestamp

  // System Fields
  uploadedBy: string
  uploadedAt: FirebaseFirestore.Timestamp
  updatedAt: FirebaseFirestore.Timestamp

  // Security
  accessLevel: "public" | "internal" | "confidential"
  encryptionStatus: boolean

  // Audit Trail
  auditTrail: Array<{
    action: "uploaded" | "processed" | "validated" | "downloaded" | "deleted"
    userId: string
    timestamp: FirebaseFirestore.Timestamp
    details?: any
  }>
}
