// Firestore Database Schema untuk SATRIA

export interface Application {
  id: string
  companyName: string
  applicantName: string
  email: string
  phone: string
  position: string
  gender: "male" | "female"

  // Assessment data
  operationalStability: string
  complianceLevel: string
  expansionPlans: string
  reputation: string

  // Credit information
  financingPurpose: string
  amount: number
  tenor: string
  financingType: string
  collateral: string
  usagePlan: string

  // System data
  status: "pending" | "approved" | "rejected" | "processing"
  createdAt: Date
  updatedAt: Date
  processedAt?: Date

  // Analysis results
  riskScore?: number
  riskLevel?: "low" | "medium" | "high"
  confidenceRate?: number

  // Financial metrics
  financialMetrics?: {
    dsri: number
    gmi: number
    aqi: number
    sgi: number
    depi: number
    mScore: number
    altmanZScore: number
  }

  // Sentiment analysis
  sentimentAnalysis?: {
    overallSentiment: "positive" | "negative" | "neutral"
    score: number
    sources: string[]
    highlights: Array<{
      title: string
      description: string
      sentiment: "positive" | "negative" | "neutral"
    }>
  }
}

export interface SystemStats {
  id: string
  date: string
  totalApplications: number
  successfulApplications: number
  errorRate: number
  averageProcessingTime: number // in minutes
  updatedAt: Date
}

export interface DocumentUpload {
  id: string
  applicationId: string
  fileName: string
  fileType: string
  fileSize: number
  downloadURL: string
  ocrResult?: any
  uploadedAt: Date
}

export interface ChatHistory {
  id: string
  userId: string
  messages: Array<{
    id: string
    content: string
    sender: "user" | "bot"
    timestamp: Date
  }>
  createdAt: Date
  updatedAt: Date
}
