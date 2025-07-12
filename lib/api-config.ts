// API Configuration for modular REST API integration
export const API_CONFIG = {
  // Base URLs for different environments
  BASE_URL: {
    development: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
    production: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.satria.com",
    staging: process.env.NEXT_PUBLIC_API_STAGING_URL || "https://staging-api.satria.com",
  },

  // API Endpoints
  ENDPOINTS: {
    // SARANA Module (OCR & NLP)
    SARANA: {
      OCR_UPLOAD: "/api/v1/sarana/ocr/upload",
      DOCUMENT_PARSE: "/api/v1/sarana/document/parse",
      EXTRACT_DATA: "/api/v1/sarana/extract",
    },

    // PRABU Module (Credit Scoring)
    PRABU: {
      CALCULATE_SCORE: "/api/v1/prabu/calculate",
      M_SCORE: "/api/v1/prabu/m-score",
      ALTMAN_Z_SCORE: "/api/v1/prabu/altman-z",
      FINANCIAL_METRICS: "/api/v1/prabu/metrics",
    },

    // SETIA Module (Sentiment Analysis)
    SETIA: {
      SENTIMENT_ANALYSIS: "/api/v1/setia/sentiment",
      NEWS_MONITORING: "/api/v1/setia/news",
      EXTERNAL_RISK: "/api/v1/setia/external-risk",
    },

    // Application Management
    APPLICATIONS: {
      CREATE: "/api/v1/applications",
      GET_ALL: "/api/v1/applications",
      GET_BY_ID: "/api/v1/applications/:id",
      UPDATE: "/api/v1/applications/:id",
      DELETE: "/api/v1/applications/:id",
    },

    // Analytics & Reports
    ANALYTICS: {
      DASHBOARD_STATS: "/api/v1/analytics/dashboard",
      COMPANY_ANALYSIS: "/api/v1/analytics/company/:id",
      RISK_REPORTS: "/api/v1/analytics/risk-reports",
    },
  },

  // Request Headers
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-API-Version": "v1",
  },

  // Timeout configurations
  TIMEOUT: {
    DEFAULT: 30000, // 30 seconds
    UPLOAD: 120000, // 2 minutes for file uploads
    ANALYSIS: 60000, // 1 minute for analysis
  },
}

// Get current environment
export const getCurrentEnvironment = (): "development" | "production" | "staging" => {
  return (process.env.NODE_ENV as "development" | "production") || "development"
}

// Get base URL for current environment
export const getBaseURL = (): string => {
  const env = getCurrentEnvironment()
  return API_CONFIG.BASE_URL[env]
}

// Build full URL
export const buildURL = (endpoint: string): string => {
  return `${getBaseURL()}${endpoint}`
}

// Replace URL parameters
export const replaceURLParams = (url: string, params: Record<string, string>): string => {
  let finalUrl = url
  Object.entries(params).forEach(([key, value]) => {
    finalUrl = finalUrl.replace(`:${key}`, value)
  })
  return finalUrl
}
