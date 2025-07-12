// Applications Collection Schema
import type { FirebaseFirestore } from "firebase-admin/firestore"

export interface ApplicationDocument {
  // Document ID: auto-generated

  // Basic Information
  id: string
  companyName: string
  applicantName: string
  email: string
  phone: string
  position: string
  gender: "male" | "female"

  // Assessment Data
  operationalStability: "sangat-stabil" | "cukup-stabil" | "tidak-stabil" | "tidak-tahu"
  complianceLevel: "selalu-patuh" | "patuh-kadang-terlambat" | "sering-terlambat" | "tidak-tahu-2"
  expansionPlans: "ya-strategi-jelas" | "ya-tahap-awal" | "tidak-ada-rencana" | "tidak-tahu-3"
  reputation: "sangat-baik" | "baik-belum-terdokumentasi" | "pernah-keluhan" | "tidak-tahu-tidak-menilai"

  // Credit Information
  financingPurpose: string
  amount: number
  tenor: string
  financingType: string
  collateral: string
  usagePlan: string

  // System Fields
  status: "pending" | "processing" | "approved" | "rejected"
  createdAt: FirebaseFirestore.Timestamp
  updatedAt: FirebaseFirestore.Timestamp
  processedAt?: FirebaseFirestore.Timestamp

  // Analysis Results
  riskScore?: number
  riskLevel?: "low" | "medium" | "high"
  confidenceRate?: number

  // Financial Metrics (PRABU Results)
  financialMetrics?: {
    dsri: number
    gmi: number
    aqi: number
    sgi: number
    depi: number
    mScore: number
    altmanZScore: number
    calculatedAt: FirebaseFirestore.Timestamp
  }

  // Sentiment Analysis (SETIA Results)
  sentimentAnalysis?: {
    overallSentiment: "positive" | "negative" | "neutral"
    score: number
    sources: string[]
    highlights: Array<{
      title: string
      description: string
      sentiment: "positive" | "negative" | "neutral"
      source: string
    }>
    analyzedAt: FirebaseFirestore.Timestamp
  }

  // Document References
  documentIds?: string[]

  // Audit Trail
  auditTrail: Array<{
    action: string
    userId: string
    timestamp: FirebaseFirestore.Timestamp
    details?: any
  }>
}

// Firestore Indexes Required
export const APPLICATIONS_INDEXES = [
  {
    collectionGroup: "applications",
    fields: [
      { fieldPath: "status", order: "ASCENDING" },
      { fieldPath: "createdAt", order: "DESCENDING" },
    ],
  },
  {
    collectionGroup: "applications",
    fields: [
      { fieldPath: "companyName", order: "ASCENDING" },
      { fieldPath: "createdAt", order: "DESCENDING" },
    ],
  },
  {
    collectionGroup: "applications",
    fields: [
      { fieldPath: "riskLevel", order: "ASCENDING" },
      { fieldPath: "createdAt", order: "DESCENDING" },
    ],
  },
]
