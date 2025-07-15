// API Configuration for modular REST API integration with Google Cloud Run
export const API_CONFIG = {
  // Base URLs for different environments
  BASE_URL: {
    development:
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://your-local-dev-url.com",
    production:
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://your-production-url.com",
    staging:
      process.env.NEXT_PUBLIC_API_STAGING_URL || "https://your-staging-url.com",
  },

  // Module-specific URLs
  MODULE_URLS: {
    SARANA:
      process.env.NEXT_PUBLIC_SARANA_API_URL ||
      "https://your-api-url.com/api/v1/sarana",
    PRABU:
      process.env.NEXT_PUBLIC_PRABU_API_URL ||
      "https://your-api-url.com/api/v1/prabu",
    SETIA:
      process.env.NEXT_PUBLIC_SETIA_API_URL ||
      "https://your-api-url.com/api/v1/setia",
  },

  // API Endpoints
  ENDPOINTS: {
    // SARANA Module (OCR & NLP)
    SARANA: {
      OCR_UPLOAD: "/ocr/upload",
      DOCUMENT_PARSE: "/document/parse",
      EXTRACT_DATA: "/extract",
      HEALTH_CHECK: "/health",
    },

    // PRABU Module (Credit Scoring)
    PRABU: {
      CALCULATE_SCORE: "/calculate",
      M_SCORE: "/m-score",
      ALTMAN_Z_SCORE: "/altman-z",
      FINANCIAL_METRICS: "/metrics",
      HEALTH_CHECK: "/health",
    },

    // SETIA Module (Sentiment Analysis)
    SETIA: {
      SENTIMENT_ANALYSIS: "/sentiment",
      NEWS_MONITORING: "/news",
      EXTERNAL_RISK: "/external-risk",
      HEALTH_CHECK: "/health",
    },

    // Application Management (Local API)
    APPLICATIONS: {
      CREATE: "/api/applications",
      GET_ALL: "/api/applications",
      GET_BY_ID: "/api/applications/:id",
      UPDATE: "/api/applications/:id",
      DELETE: "/api/applications/:id",
    },

    // Analytics & Reports (Local API)
    ANALYTICS: {
      DASHBOARD_STATS: "/api/stats",
      COMPANY_ANALYSIS: "/api/analytics/company/:id",
      RISK_REPORTS: "/api/analytics/risk-reports",
    },

    // File Upload (Local API)
    UPLOAD: "/api/upload",
  },

  // Request Headers
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-API-Version": "v1",
    "User-Agent": "SATRIA-Frontend/1.0.0",
  },

  // Timeout configurations (longer for Cloud Run cold starts)
  TIMEOUT: {
    DEFAULT: 60000, // 60 seconds for Cloud Run
    UPLOAD: 300000, // 5 minutes for file uploads
    ANALYSIS: 120000, // 2 minutes for ML analysis
    HEALTH_CHECK: 10000, // 10 seconds for health checks
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

// Get module-specific URL
export const getModuleURL = (module: "SARANA" | "PRABU" | "SETIA"): string => {
  return API_CONFIG.MODULE_URLS[module]
}

// Build full URL for local API
export const buildURL = (endpoint: string): string => {
  // For local API endpoints, use current domain
  if (endpoint.startsWith("/api/")) {
    return endpoint
  }
  return `${getBaseURL()}${endpoint}`
}

// Build full URL for ML modules
export const buildModuleURL = (module: "SARANA" | "PRABU" | "SETIA", endpoint: string): string => {
  return `${getModuleURL(module)}${endpoint}`
}

// Replace URL parameters
export const replaceURLParams = (url: string, params: Record<string, string>): string => {
  let finalUrl = url
  Object.entries(params).forEach(([key, value]) => {
    finalUrl = finalUrl.replace(`:${key}`, value)
  })
  return finalUrl
}

// Health check function for ML services
export const checkServiceHealth = async (module: "SARANA" | "PRABU" | "SETIA"): Promise<boolean> => {
  try {
    const url = buildModuleURL(module, API_CONFIG.ENDPOINTS[module].HEALTH_CHECK)
    const response = await fetch(url, {
      method: "GET",
      headers: API_CONFIG.HEADERS,
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT.HEALTH_CHECK),
    })
    return response.ok
  } catch (error) {
    console.error(`Health check failed for ${module}:`, error)
    return false
  }
}
