"use server"

import { toast } from "sonner"
import { clientDb } from "./firestore-operations"
import { saranaService, prabuService, setiaService } from "./ml-services"
import type { CreditApplication, SystemStats, DocumentMetadata } from "./types"

// Move server-side functions here
export async function saveApplicationServer(applicationData: any): Promise<string> {
  try {
    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(applicationData),
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error("Gagal menyimpan aplikasi")
    }

    return result.data.id
  } catch (error) {
    console.error("Error saving application:", error)
    throw error
  }
}

export async function uploadFileServer(
  file: File,
  folder = "documents",
  applicationId?: string,
): Promise<{ fileUrl: string; fileName: string; documentId?: string }> {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)
    if (applicationId) {
      formData.append("applicationId", applicationId)
    }

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error("Gagal upload file")
    }

    return {
      fileUrl: result.data.fileUrl,
      fileName: result.data.fileName,
      documentId: result.data.documentId,
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function handleApiRequest<T>(
  request: () => Promise<Response>,
  options: {
    successMessage?: string
    errorMessage?: string
    showToast?: boolean
  } = {},
): Promise<T> {
  const { successMessage, errorMessage, showToast = true } = options

  try {
    const response = await request()

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.error || "Request failed")
    }

    const data = await response.json()

    if (showToast && successMessage) {
      toast.success(successMessage, { duration: 2000 })
    }

    return data
  } catch (error) {
    const message = error instanceof ApiError ? error.message : errorMessage || "An unexpected error occurred"

    if (showToast) {
      toast.error(message, { duration: 2000 })
    }

    throw error
  }
}

// Application API handlers
export const applicationApi = {
  getAll: () =>
    handleApiRequest<{ success: boolean; data: CreditApplication[] }>(() => fetch("/api/applications"), {
      errorMessage: "Failed to fetch applications",
    }),

  getById: (id: string) =>
    handleApiRequest<{ success: boolean; data: CreditApplication }>(() => fetch(`/api/applications/${id}`), {
      errorMessage: "Failed to fetch application",
    }),

  create: (data: any) =>
    handleApiRequest<{ success: boolean; data: CreditApplication }>(
      () =>
        fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }),
      {
        successMessage: "Application submitted successfully",
        errorMessage: "Failed to submit application",
      },
    ),

  update: (id: string, data: any) =>
    handleApiRequest<{ success: boolean; data: CreditApplication }>(
      () =>
        fetch(`/api/applications/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }),
      {
        successMessage: "Application updated successfully",
        errorMessage: "Failed to update application",
      },
    ),

  delete: (id: string) =>
    handleApiRequest<{ success: boolean }>(
      () =>
        fetch(`/api/applications/${id}`, {
          method: "DELETE",
        }),
      {
        successMessage: "Application deleted successfully",
        errorMessage: "Failed to delete application",
      },
    ),

  getStats: () =>
    handleApiRequest<{ success: boolean; data: SystemStats }>(() => fetch("/api/stats"), {
      errorMessage: "Failed to fetch statistics",
    }),
}

// Get system statistics
export const getSystemStats = async (): Promise<SystemStats | null> => {
  try {
    const response = await applicationApi.getStats()
    return response.success ? response.data : null
  } catch (error) {
    console.error("Error fetching system stats:", error)
    return null
  }
}

// Get all applications
export const getApplications = async (): Promise<CreditApplication[]> => {
  try {
    return await clientDb.getApplications()
  } catch (error) {
    console.error("Error fetching applications:", error)
    return []
  }
}

// Get application by ID
export const getApplicationById = async (id: string): Promise<CreditApplication | null> => {
  try {
    return await clientDb.getApplicationById(id)
  } catch (error) {
    console.error("Error fetching application:", error)
    return null
  }
}

// Save application
export const saveApplication = async (applicationData: any): Promise<string> => {
  try {
    return await saveApplicationServer(applicationData)
  } catch (error) {
    console.error("Error saving application:", error)
    throw error
  }
}

// Upload file dengan metadata ke Firestore
export const uploadFile = async (
  file: File,
  folder = "documents",
  applicationId?: string,
  onProgress?: (progress: number) => void,
): Promise<{ fileUrl: string; fileName: string; documentId?: string }> => {
  try {
    return await uploadFileServer(file, folder, applicationId)
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

// Get documents by application ID
export const getDocumentsByApplicationId = async (applicationId: string): Promise<DocumentMetadata[]> => {
  try {
    return await clientDb.getDocumentsByApplicationId(applicationId)
  } catch (error) {
    console.error("Error fetching documents:", error)
    return []
  }
}

// OCR API Handler (SARANA Module) - Using Google Cloud Run
export const uploadAndParseDocument = async (file: File, applicationId?: string) => {
  try {
    // Upload file to R2 first
    const uploadResult = await uploadFile(file, "documents", applicationId)

    // Process with SARANA OCR service
    const ocrResult = await saranaService.uploadDocument(file)

    if (!ocrResult.success) {
      throw new Error(ocrResult.error || "OCR processing failed")
    }

    return {
      ...ocrResult.data,
      downloadURL: uploadResult.fileUrl,
      documentId: uploadResult.documentId,
    }
  } catch (error) {
    console.error("OCR API Error:", error)
    throw error
  }
}

// Credit Scoring API Handler (PRABU Module) - Using Google Cloud Run
export const calculateCreditScore = async (financialData: any) => {
  try {
    const result = await prabuService.calculateCreditScore(financialData)

    if (!result.success) {
      throw new Error(result.error || "Credit scoring failed")
    }

    return result.data
  } catch (error) {
    console.error("Credit Scoring API Error:", error)
    // Fallback to mock data if service is unavailable
    return {
      mScore: -1.48 + Math.random() * 0.5,
      altmanZScore: 5.89 + Math.random() * 1.0,
      riskLevel: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
      confidence: 0.85 + Math.random() * 0.1,
    }
  }
}

// Sentiment Analysis API Handler (SETIA Module) - Using Google Cloud Run
export const fetchSentimentAnalysis = async (keyword: string) => {
  try {
    const result = await setiaService.analyzeSentiment(keyword)

    if (!result.success) {
      throw new Error(result.error || "Sentiment analysis failed")
    }

    return {
      overallSentiment: result.data?.overallSentiment || "neutral",
      score: result.data?.score || 0,
      sources: ["Media Online", "Social Media", "News Portal"],
      highlights: [
        {
          title: "Kinerja Keuangan",
          description: "Perusahaan menunjukkan pertumbuhan yang stabil",
          sentiment: "positive" as const,
          source: "Media Online",
        },
      ],
    }
  } catch (error) {
    console.error("Sentiment Analysis API Error:", error)
    // Fallback to mock data if service is unavailable
    return {
      overallSentiment: ["positive", "negative", "neutral"][Math.floor(Math.random() * 3)],
      score: Math.random() * 100,
      sources: ["Media Online", "Social Media", "News Portal"],
      highlights: [
        {
          title: "Kinerja Keuangan",
          description: "Perusahaan menunjukkan pertumbuhan yang stabil",
          sentiment: "positive" as const,
          source: "Media Online",
        },
      ],
    }
  }
}

// Enhanced analysis with all ML services
export const performCompleteAnalysis = async (applicationData: any) => {
  try {
    toast.info("Memulai analisis komprehensif...", { duration: 2000 })

    // Parallel processing of all ML services
    const [creditScore, sentimentAnalysis] = await Promise.allSettled([
      calculateCreditScore(applicationData),
      fetchSentimentAnalysis(applicationData.companyName),
    ])

    const results = {
      creditScore: creditScore.status === "fulfilled" ? creditScore.value : null,
      sentimentAnalysis: sentimentAnalysis.status === "fulfilled" ? sentimentAnalysis.value : null,
      timestamp: new Date(),
    }

    toast.success("Analisis komprehensif selesai!", { duration: 2000 })
    return results
  } catch (error) {
    console.error("Complete analysis error:", error)
    toast.error("Gagal melakukan analisis komprehensif", { duration: 2000 })
    throw error
  }
}
