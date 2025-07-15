export interface CreditApplication {
  id: string
  companyName: string
  applicantName: string
  email: string
  phone: string
  position: string
  gender: "male" | "female"

  // Company information
  businessType?: string
  establishedYear?: string
  numberOfEmployees?: string
  monthlyRevenue?: string
  businessLocation?: string
  businessDescription?: string

  // Assessment data
  operationalStability: string
  complianceLevel: string
  expansionPlans: string
  reputation: string

  // Credit information
  financingPurpose: string
  amount: string | number
  tenor: string
  financingType: string
  collateral: string
  usagePlan: string

  // Document metadata (file names for now)
  balanceSheetName?: string | null
  incomeStatementName?: string | null
  cashFlowStatementName?: string | null
  financialReportName?: string | null
  collateralDocumentName?: string | null

  // System data
  status: "pending" | "approved" | "rejected" | "processing"
  createdAt: Date
  updatedAt: Date
  processedAt?: Date

  // Analysis results
  riskScore?: number
  riskLevel?: "low" | "medium" | "high"
  confidenceRate?: number

  // ML Analysis Results
  financialMetrics?: {
    dsri: number
    gmi: number
    aqi: number
    sgi: number
    depi: number
    mScore: number
    altmanZScore: number
    calculatedAt: Date
  }

  // Extracted Financial Data from Documents
  extractedFinancialData?: {
    [fieldName: string]: {
      currentYear: Array<{
        fileName: string
        financialMetrics: Record<string, any>
      }>
      previousYear: Array<{
        fileName: string
        financialMetrics: Record<string, any>
      }>
      hasIncompleteData: boolean
      missingFields: string[]
    }
  }

  sentimentAnalysis?: {
    overallSentiment: "positive" | "negative" | "neutral"
    score: number
    confidence: number
    sources: Array<{
      source: string
      sentiment: "positive" | "negative" | "neutral"
      score: number
      content: string
      date: string
    }>
    analyzedAt: Date
  }

  // File references
  documentIds?: string[]
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

export interface DocumentMetadata {
  id: string
  applicationId: string
  fileName: string
  originalFileName: string
  fileType: string
  fileSize: number
  fileUrl: string
  uploadedAt: Date

  // OCR Results (from SARANA)
  ocrResults?: {
    extractedText: string
    confidence: number
    structuredData: any
    processingTime: number
    processedAt: Date
  }

  // Validation status
  validationStatus: "pending" | "valid" | "invalid" | "requires_review"
  validationErrors?: string[]
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

// ML Service Response Types
export interface MLServiceResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  processingTime?: number
  timestamp?: string
}

export interface FinancialMetrics {
  dsri: number // Days Sales Receivables Index
  gmi: number // Gross Margin Index
  aqi: number // Asset Quality Index
  sgi: number // Sales Growth Index
  depi: number // Depreciation Index
  sgai: number // Sales General and Administrative expenses Index
  lvgi: number // Leverage Index
  tata: number // Total Accruals to Total Assets
}

export interface AltmanZScoreComponents {
  x1: number // Working Capital / Total Assets
  x2: number // Retained Earnings / Total Assets
  x3: number // EBIT / Total Assets
  x4: number // Market Value Equity / Total Liabilities
  x5: number // Sales / Total Assets
}

export interface SentimentAnalysis {
  keyword: string
  sentiment: "positive" | "negative" | "neutral"
  score: number
  confidence: number
  sources: Array<{
    source: string
    sentiment: "positive" | "negative" | "neutral"
    score: number
    content: string
    date: string
    relevance: number
  }>
}
