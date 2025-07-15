// API Configuration for modular REST API integration with Google Cloud Run
export const API_CONFIG = {
  // Base URLs for different environments
  // Set NEXT_PUBLIC_API_BASE_URL=https://your-production-url.run.app for production
  BASE_URL: {
    development: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
    production: process.env.NEXT_PUBLIC_API_BASE_URL || "https://astranauts-mlserving-186881677532.europe-west1.run.app",
    staging: process.env.NEXT_PUBLIC_API_STAGING_URL || "https://astranauts-mlserving-186881677532.europe-west1.run.app",
  },

  // Module-specific URLs (relative paths)
  // These will be combined with BASE_URL to form complete URLs
  MODULE_URLS: {
    PRABU: "/api/v1/prabu",
    SARANA: "/api/v1/sarana", 
    SETIA: "/api/v1/setia",
  },

  // API Endpoints
  ENDPOINTS: {
    // SARANA Module (OCR & NLP)
    SARANA: {
      HEALTH_CHECK: "/health",
      DOCUMENT_PARSE: "/document/parse",
      OCR_UPLOAD: "/ocr/upload",
      EXTRACT_DATA: "/extract",
    },

    // PRABU Module (Credit Scoring)
    PRABU: {
      HEALTH_CHECK: "/health",
      CALCULATE_SCORE: "/calculate",
      ALTMAN_Z_SCORE: "/altman-z",
      M_SCORE: "/m-score",
      FINANCIAL_METRICS: "/metrics",
    },

    // SETIA Module (Sentiment Analysis)
    SETIA: {
      HEALTH_CHECK: "/health",
      SENTIMENT_ANALYSIS: "/sentiment",
      NEWS_MONITORING: "/news",
      EXTERNAL_RISK: "/external-risk",
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
  const baseUrl = getBaseURL()
  return `${baseUrl}${API_CONFIG.MODULE_URLS[module]}`
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
