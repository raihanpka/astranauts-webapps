import { apiClient } from "./improved-api-client"
import type { Application, SystemStats } from "./database"

// Get system statistics
export const getSystemStats = async (): Promise<SystemStats | null> => {
  try {
    const response = await apiClient.get<SystemStats>("/stats")
    return response.success ? response.data! : null
  } catch (error) {
    console.error("Error fetching system stats:", error)
    return null
  }
}

// Get all applications
export const getApplications = async (): Promise<Application[]> => {
  try {
    const response = await apiClient.get<Application[]>("/applications")
    return response.success ? response.data! : []
  } catch (error) {
    console.error("Error fetching applications:", error)
    return []
  }
}

// Get application by ID
export const getApplicationById = async (id: string): Promise<Application | null> => {
  try {
    const response = await apiClient.get<Application>(`/applications/${id}`)
    return response.success ? response.data! : null
  } catch (error) {
    console.error("Error fetching application:", error)
    return null
  }
}

// Save application
export const saveApplication = async (applicationData: Partial<Application>): Promise<string> => {
  try {
    const response = await apiClient.post<Application>("/applications", applicationData)

    if (!response.success) {
      throw new Error(response.error || "Gagal menyimpan aplikasi")
    }

    return response.data!.id
  } catch (error) {
    console.error("Error saving application:", error)
    throw error
  }
}

// Upload file
export const uploadFile = async (
  file: File,
  folder = "documents",
  onProgress?: (progress: number) => void,
): Promise<{ fileUrl: string; fileName: string }> => {
  try {
    const response = await apiClient.uploadFile<{
      fileUrl: string
      fileName: string
      fileSize: number
      originalName: string
    }>("/upload", file, { folder }, onProgress)

    if (!response.success) {
      throw new Error(response.error || "Gagal upload file")
    }

    return {
      fileUrl: response.data!.fileUrl,
      fileName: response.data!.fileName,
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

// OCR API Handler (SARANA Module)
export const uploadAndParseDocument = async (file: File) => {
  try {
    // Upload file terlebih dahulu
    const uploadResult = await uploadFile(file, "documents")

    // Simulasi OCR processing (dalam production, panggil service OCR)
    const ocrResult = {
      extractedText: "Sample extracted text from document...",
      confidence: 0.95,
      structuredData: {
        companyName: "Sample Company",
        revenue: 1000000000,
        assets: 2000000000,
      },
      downloadURL: uploadResult.fileUrl,
    }

    return ocrResult
  } catch (error) {
    console.error("OCR API Error:", error)
    throw error
  }
}

// Credit Scoring API Handler (PRABU Module)
export const calculateCreditScore = async (financialData: any) => {
  try {
    // Simulasi perhitungan credit score
    const result = {
      mScore: -1.48 + Math.random() * 0.5,
      altmanZScore: 5.89 + Math.random() * 1.0,
      riskLevel: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
      confidence: 0.85 + Math.random() * 0.1,
    }

    return result
  } catch (error) {
    console.error("Credit Scoring API Error:", error)
    throw error
  }
}

// Sentiment Analysis API Handler (SETIA Module)
export const fetchSentimentAnalysis = async (keyword: string) => {
  try {
    // Simulasi sentiment analysis
    const result = {
      overallSentiment: ["positive", "negative", "neutral"][Math.floor(Math.random() * 3)],
      score: Math.random() * 100,
      sources: ["Media Online", "Social Media", "News Portal"],
      highlights: [
        {
          title: "Kinerja Keuangan",
          description: "Perusahaan menunjukkan pertumbuhan yang stabil",
          sentiment: "positive" as const,
        },
      ],
    }

    return result
  } catch (error) {
    console.error("Sentiment Analysis API Error:", error)
    throw error
  }
}
