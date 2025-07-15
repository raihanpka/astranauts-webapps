import { buildModuleURL, API_CONFIG, checkServiceHealth } from "./api-config"
import { toast } from "sonner"

// Base ML Service Class
class MLService {
  protected moduleName: "SARANA" | "PRABU" | "SETIA"
  protected apiKey?: string

  constructor(moduleName: "SARANA" | "PRABU" | "SETIA") {
    this.moduleName = moduleName
    this.apiKey = process.env[`${moduleName}_API_KEY`]
  }

  protected async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = buildModuleURL(this.moduleName, endpoint)

    const headers = {
      ...API_CONFIG.HEADERS,
      ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT.ANALYSIS),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`${this.moduleName} API Error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`${this.moduleName} Service Error:`, error)

      if (error instanceof Error) {
        if (error.name === "TimeoutError") {
          toast.error(`${this.moduleName} service timeout. Silakan coba lagi.`, { duration: 2000 })
        } else {
          toast.error(`${this.moduleName} service error: ${error.message}`, { duration: 2000 })
        }
      }

      throw error
    }
  }

  async healthCheck(): Promise<boolean> {
    return checkServiceHealth(this.moduleName)
  }
}

// SARANA Service (OCR & NLP)
export class SaranaService extends MLService {
  constructor() {
    super("SARANA")
  }

  async uploadDocument(file: File): Promise<{
    success: boolean
    data?: {
      extractedText: string
      confidence: number
      structuredData: any
      processingTime: number
    }
    error?: string
  }> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("extract_structured", "true")
    formData.append("language", "id") // Indonesian language

    return this.makeRequest(API_CONFIG.ENDPOINTS.SARANA.OCR_UPLOAD, {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    })
  }

  async parseDocument(documentData: {
    text: string
    documentType: "financial_statement" | "bank_statement" | "tax_report" | "other"
  }): Promise<{
    success: boolean
    data?: {
      parsedData: any
      confidence: number
      fields: Record<string, any>
    }
    error?: string
  }> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.SARANA.DOCUMENT_PARSE, {
      method: "POST",
      body: JSON.stringify(documentData),
    })
  }

  async extractFinancialData(documentText: string): Promise<{
    success: boolean
    data?: {
      revenue: number
      assets: number
      liabilities: number
      equity: number
      netIncome: number
      confidence: number
    }
    error?: string
  }> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.SARANA.EXTRACT_DATA, {
      method: "POST",
      body: JSON.stringify({
        text: documentText,
        extractionType: "financial_metrics",
      }),
    })
  }
}

// PRABU Service (Credit Scoring)
export class PrabuService extends MLService {
  constructor() {
    super("PRABU")
  }

  async calculateCreditScore(financialData: {
    revenue: number
    assets: number
    liabilities: number
    equity: number
    netIncome: number
    workingCapital: number
    retainedEarnings: number
    ebit: number
    marketValue?: number
    sales: number
  }): Promise<{
    success: boolean
    data?: {
      mScore: number
      altmanZScore: number
      riskLevel: "low" | "medium" | "high"
      confidence: number
      factors: Record<string, number>
    }
    error?: string
  }> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.PRABU.CALCULATE_SCORE, {
      method: "POST",
      body: JSON.stringify(financialData),
    })
  }

  async calculateMScore(financialRatios: {
    dsri: number // Days Sales Receivables Index
    gmi: number // Gross Margin Index
    aqi: number // Asset Quality Index
    sgi: number // Sales Growth Index
    depi: number // Depreciation Index
    sgai: number // Sales General and Administrative expenses Index
    lvgi: number // Leverage Index
    tata: number // Total Accruals to Total Assets
  }): Promise<{
    success: boolean
    data?: {
      mScore: number
      probability: number
      interpretation: string
    }
    error?: string
  }> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.PRABU.M_SCORE, {
      method: "POST",
      body: JSON.stringify(financialRatios),
    })
  }

  async calculateAltmanZScore(financialData: {
    workingCapital: number
    totalAssets: number
    retainedEarnings: number
    ebit: number
    marketValueEquity: number
    totalLiabilities: number
    sales: number
  }): Promise<{
    success: boolean
    data?: {
      zScore: number
      zone: "safe" | "gray" | "distress"
      components: {
        x1: number // Working Capital / Total Assets
        x2: number // Retained Earnings / Total Assets
        x3: number // EBIT / Total Assets
        x4: number // Market Value Equity / Total Liabilities
        x5: number // Sales / Total Assets
      }
    }
    error?: string
  }> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.PRABU.ALTMAN_Z_SCORE, {
      method: "POST",
      body: JSON.stringify(financialData),
    })
  }

  async getFinancialMetrics(companyData: any): Promise<{
    success: boolean
    data?: {
      ratios: Record<string, number>
      trends: Record<string, number[]>
      benchmarks: Record<string, number>
    }
    error?: string
  }> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.PRABU.FINANCIAL_METRICS, {
      method: "POST",
      body: JSON.stringify(companyData),
    })
  }
}

// SETIA Service (Sentiment Analysis)
export class SetiaService extends MLService {
  constructor() {
    super("SETIA")
  }

  async analyzeSentiment(
    keyword: string,
    sources: string[] = ["news", "social"],
  ): Promise<{
    success: boolean
    data?: {
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
    }
    error?: string
  }> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.SETIA.SENTIMENT_ANALYSIS, {
      method: "POST",
      body: JSON.stringify({
        keyword,
        sources,
        language: "id",
        limit: 50,
      }),
    })
  }

  async monitorNews(
    companyName: string,
    timeRange: "1d" | "7d" | "30d" = "7d",
  ): Promise<{
    success: boolean
    data?: {
      articles: Array<{
        title: string
        content: string
        source: string
        date: string
        sentiment: "positive" | "negative" | "neutral"
        score: number
        relevance: number
      }>
      summary: {
        totalArticles: number
        sentimentDistribution: {
          positive: number
          negative: number
          neutral: number
        }
        averageScore: number
      }
    }
    error?: string
  }> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.SETIA.NEWS_MONITORING, {
      method: "POST",
      body: JSON.stringify({
        companyName,
        timeRange,
        language: "id",
      }),
    })
  }

  async getExternalRisk(companyName: string): Promise<{
    success: boolean
    data?: {
      riskLevel: "low" | "medium" | "high"
      riskScore: number
      factors: Array<{
        factor: string
        impact: "positive" | "negative" | "neutral"
        score: number
        description: string
      }>
      recommendations: string[]
    }
    error?: string
  }> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.SETIA.EXTERNAL_RISK, {
      method: "POST",
      body: JSON.stringify({
        companyName,
        includeNews: true,
        includeSocial: true,
        includeMarket: true,
      }),
    })
  }
}

// Service instances
export const saranaService = new SaranaService()
export const prabuService = new PrabuService()
export const setiaService = new SetiaService()

// Health check for all services
export const checkAllServicesHealth = async (): Promise<{
  sarana: boolean
  prabu: boolean
  setia: boolean
  allHealthy: boolean
}> => {
  const [sarana, prabu, setia] = await Promise.all([
    saranaService.healthCheck(),
    prabuService.healthCheck(),
    setiaService.healthCheck(),
  ])

  return {
    sarana,
    prabu,
    setia,
    allHealthy: sarana && prabu && setia,
  }
}

// Server-side ML Service functions
export async function processWithSarana(file: File): Promise<any> {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("extract_structured", "true")
    formData.append("language", "id")

    const url = buildModuleURL("SARANA", API_CONFIG.ENDPOINTS.SARANA.OCR_UPLOAD)

    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        ...(process.env.SARANA_API_KEY && { Authorization: `Bearer ${process.env.SARANA_API_KEY}` }),
      },
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT.ANALYSIS),
    })

    if (!response.ok) {
      throw new Error(`SARANA API Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("SARANA Service Error:", error)
    throw error
  }
}

export async function processWithPrabu(financialData: any): Promise<any> {
  try {
    const url = buildModuleURL("PRABU", API_CONFIG.ENDPOINTS.PRABU.CALCULATE_SCORE)

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.PRABU_API_KEY && { Authorization: `Bearer ${process.env.PRABU_API_KEY}` }),
      },
      body: JSON.stringify(financialData),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT.ANALYSIS),
    })

    if (!response.ok) {
      throw new Error(`PRABU API Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("PRABU Service Error:", error)
    throw error
  }
}

export async function processWithSetia(keyword: string): Promise<any> {
  try {
    const url = buildModuleURL("SETIA", API_CONFIG.ENDPOINTS.SETIA.SENTIMENT_ANALYSIS)

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.SETIA_API_KEY && { Authorization: `Bearer ${process.env.SETIA_API_KEY}` }),
      },
      body: JSON.stringify({
        keyword,
        sources: ["news", "social"],
        language: "id",
        limit: 50,
      }),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT.ANALYSIS),
    })

    if (!response.ok) {
      throw new Error(`SETIA API Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("SETIA Service Error:", error)
    throw error
  }
}
