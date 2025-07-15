"use client"

import { toast } from "sonner"
import type { CreditApplication, SystemStats } from "./types"

// Client-side API handlers (no server dependencies)
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

// Client-side application API handlers
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

// Client-side functions (no server dependencies)
export const saveApplication = async (applicationData: any): Promise<string> => {
  try {
    const response = await applicationApi.create(applicationData)

    if (!response.success) {
      throw new Error("Gagal menyimpan aplikasi")
    }

    return response.data.id
  } catch (error) {
    console.error("Error saving application:", error)
    throw error
  }
}

export const uploadFile = async (
  file: File,
  folder = "documents",
  applicationId?: string,
  onProgress?: (progress: number) => void,
): Promise<{ fileUrl: string; fileName: string; documentId?: string }> => {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)
    if (applicationId) {
      formData.append("applicationId", applicationId)
    }

    const response = await handleApiRequest<{
      success: boolean
      data: {
        fileUrl: string
        fileName: string
        fileSize: number
        originalName: string
        documentId?: string
      }
    }>(
      () =>
        fetch("/api/upload", {
          method: "POST",
          body: formData,
        }),
      { errorMessage: "Gagal upload file" },
    )

    if (!response.success) {
      throw new Error("Gagal upload file")
    }

    return {
      fileUrl: response.data.fileUrl,
      fileName: response.data.fileName,
      documentId: response.data.documentId,
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

export const getSystemStats = async (): Promise<SystemStats | null> => {
  try {
    const response = await applicationApi.getStats()
    return response.success ? response.data : null
  } catch (error) {
    console.error("Error fetching system stats:", error)
    return null
  }
}

// Mock functions for client-side fallbacks
export const uploadAndParseDocument = async (file: File, applicationId?: string) => {
  try {
    // Upload file to R2 first
    const uploadResult = await uploadFile(file, "documents", applicationId)

    // Mock OCR result for client-side
    const ocrResult = {
      extractedText: "Sample extracted text from document...",
      confidence: 0.95,
      structuredData: {
        companyName: "Sample Company",
        revenue: 1000000000,
        assets: 2000000000,
      },
      downloadURL: uploadResult.fileUrl,
      documentId: uploadResult.documentId,
    }

    return ocrResult
  } catch (error) {
    console.error("OCR API Error:", error)
    throw error
  }
}

export const calculateCreditScore = async (financialData: any) => {
  try {
    // Mock credit score calculation for client-side
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

export const fetchSentimentAnalysis = async (keyword: string) => {
  try {
    // Mock sentiment analysis for client-side
    const result = {
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

    return result
  } catch (error) {
    console.error("Sentiment Analysis API Error:", error)
    throw error
  }
}
