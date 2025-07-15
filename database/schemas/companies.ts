// Companies Collection Schema
import type { Timestamp } from "firebase-admin/firestore"

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
  establishedDate: Timestamp
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
    lastUpdated: Timestamp
  }

  // Risk Profile
  riskProfile: {
    currentRiskLevel: "low" | "medium" | "high"
    riskScore: number
    lastAssessment: Timestamp
    factors: string[]
  }

  // Application History
  applicationHistory: Array<{
    applicationId: string
    date: Timestamp
    amount: number
    status: "approved" | "rejected" | "pending"
    riskScore: number
  }>

  // System Fields
  createdAt: Timestamp
  updatedAt: Timestamp
  isActive: boolean

  // Metadata
  metadata: {
    source: "manual" | "api" | "import"
    tags: string[]
    notes?: string
  }
}
