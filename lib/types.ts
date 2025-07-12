export interface CreditApplication {
  id: string
  companyName: string
  applicantName: string
  email: string
  phone: string
  position: string
  gender: string
  operationalStability: string
  complianceLevel: string
  expansionPlans: string
  reputation: string
  financingPurpose: string
  amount: number
  tenor: number
  financingType: string
  collateral: string
  usagePlan: string
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  riskScore?: number
  riskLevel?: "low" | "medium" | "high"
}

export interface FinancialMetrics {
  dsri: number
  gmi: number
  aqi: number
  sgi: number
  depi: number
  mScore: number
  altmanZScore: number
  riskLevel: "low" | "medium" | "high"
}

export interface SentimentAnalysis {
  keyword: string
  sentiment: "positive" | "negative" | "neutral"
  score: number
  sources: string[]
}
