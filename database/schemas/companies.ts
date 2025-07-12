// Companies Collection Schema
import type { FirebaseFirestore } from "firebase-admin/firestore"

export interface CompanyDocument {
  // Document ID: company slug (e.g., "pt-andalan-niaga")

  // Basic Information
  id: string
  name: string
  slug: string
  registrationNumber: string
  taxId: string

  // Contact Information
  address: {
    street: string
    city: string
    province: string
    postalCode: string
    country: string
  }
  phone: string
  email: string
  website?: string

  // Business Information
  industry: string
  businessType: "PT" | "CV" | "UD" | "PD" | "FIRMA" | "FA"
  establishedDate: FirebaseFirestore.Timestamp
  employeeCount: number
  annualRevenue?: number

  // Financial Information
  financialData?: {
    totalAssets: number
    totalLiabilities: number
    workingCapital: number
    retainedEarnings: number
    ebit: number
    marketCapitalization?: number
    sales: number
    lastUpdated: FirebaseFirestore.Timestamp
  }

  // Risk Profile
  riskProfile: {
    currentRiskLevel: "low" | "medium" | "high"
    riskScore: number
    lastAssessment: FirebaseFirestore.Timestamp
    factors: string[]
  }

  // Application History
  applicationHistory: Array<{
    applicationId: string
    date: FirebaseFirestore.Timestamp
    amount: number
    status: "approved" | "rejected" | "pending"
    riskScore: number
  }>

  // System Fields
  createdAt: FirebaseFirestore.Timestamp
  updatedAt: FirebaseFirestore.Timestamp
  isActive: boolean

  // Metadata
  metadata: {
    source: "manual" | "api" | "import"
    tags: string[]
    notes?: string
  }
}
