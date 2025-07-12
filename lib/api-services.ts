import { httpClient } from "./http-client"
import { API_CONFIG } from "./api-config"
import type { Application, SystemStats } from "./firestore-schema"

// SARANA Module API Service
export class SaranaService {
  static async uploadDocument(file: File): Promise<any> {
    const formData = new FormData()
    formData.append("file", file)

    return httpClient.upload(API_CONFIG.ENDPOINTS.SARANA.OCR_UPLOAD, formData)
  }

  static async parseDocument(documentId: string): Promise<any> {
    return httpClient.post(API_CONFIG.ENDPOINTS.SARANA.DOCUMENT_PARSE, { documentId })
  }

  static async extractData(documentData: any): Promise<any> {
    return httpClient.post(API_CONFIG.ENDPOINTS.SARANA.EXTRACT_DATA, documentData)
  }
}

// PRABU Module API Service
export class PrabuService {
  static async calculateCreditScore(financialData: any): Promise<any> {
    return httpClient.post(API_CONFIG.ENDPOINTS.PRABU.CALCULATE_SCORE, financialData)
  }

  static async calculateMScore(data: any): Promise<number> {
    const response = await httpClient.post(API_CONFIG.ENDPOINTS.PRABU.M_SCORE, data)
    return response.mScore
  }

  static async calculateAltmanZScore(data: any): Promise<number> {
    const response = await httpClient.post(API_CONFIG.ENDPOINTS.PRABU.ALTMAN_Z_SCORE, data)
    return response.zScore
  }

  static async getFinancialMetrics(companyId: string): Promise<any> {
    return httpClient.get(API_CONFIG.ENDPOINTS.PRABU.FINANCIAL_METRICS, { id: companyId })
  }
}

// SETIA Module API Service
export class SetiaService {
  static async analyzeSentiment(keyword: string): Promise<any> {
    return httpClient.post(API_CONFIG.ENDPOINTS.SETIA.SENTIMENT_ANALYSIS, { keyword })
  }

  static async monitorNews(companyName: string): Promise<any> {
    return httpClient.post(API_CONFIG.ENDPOINTS.SETIA.NEWS_MONITORING, { companyName })
  }

  static async getExternalRisk(companyId: string): Promise<any> {
    return httpClient.get(API_CONFIG.ENDPOINTS.SETIA.EXTERNAL_RISK, { id: companyId })
  }
}

// Application API Service
export class ApplicationService {
  static async createApplication(applicationData: Partial<Application>): Promise<Application> {
    return httpClient.post(API_CONFIG.ENDPOINTS.APPLICATIONS.CREATE, applicationData)
  }

  static async getAllApplications(): Promise<Application[]> {
    return httpClient.get(API_CONFIG.ENDPOINTS.APPLICATIONS.GET_ALL)
  }

  static async getApplicationById(id: string): Promise<Application> {
    return httpClient.get(API_CONFIG.ENDPOINTS.APPLICATIONS.GET_BY_ID, { id })
  }

  static async updateApplication(id: string, data: Partial<Application>): Promise<Application> {
    return httpClient.put(API_CONFIG.ENDPOINTS.APPLICATIONS.UPDATE, data, { id })
  }

  static async deleteApplication(id: string): Promise<void> {
    return httpClient.delete(API_CONFIG.ENDPOINTS.APPLICATIONS.DELETE, { id })
  }
}

// Analytics API Service
export class AnalyticsService {
  static async getDashboardStats(): Promise<SystemStats> {
    return httpClient.get(API_CONFIG.ENDPOINTS.ANALYTICS.DASHBOARD_STATS)
  }

  static async getCompanyAnalysis(companyId: string): Promise<any> {
    return httpClient.get(API_CONFIG.ENDPOINTS.ANALYTICS.COMPANY_ANALYSIS, { id: companyId })
  }

  static async getRiskReports(): Promise<any> {
    return httpClient.get(API_CONFIG.ENDPOINTS.ANALYTICS.RISK_REPORTS)
  }
}
