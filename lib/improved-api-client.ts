import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios"
import { toast } from "sonner"

// Extend AxiosRequestConfig to include metadata
declare module "axios" {
  interface AxiosRequestConfig {
    metadata?: {
      startTime?: Date
    }
  }
}

// Enhanced API Response Interface
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  statusCode?: number
  timestamp?: string
}

// Request/Response Interceptor Types
interface RequestInterceptor {
  onFulfilled?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
  onRejected?: (error: any) => any
}

interface ResponseInterceptor {
  onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
  onRejected?: (error: AxiosError) => any
}

// Enhanced HTTP Client with Axios
export class ImprovedAPIClient {
  private client: AxiosInstance
  private baseURL: string
  private retryAttempts = 3
  private retryDelay = 1000

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "/api") {
    this.baseURL = baseURL
    this.client = this.createAxiosInstance()
    this.setupInterceptors()
  }

  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      // Enable automatic request/response transformation
      transformRequest: [
        (data, headers) => {
          // Auto-transform data based on content type
          if (headers["Content-Type"] === "application/json") {
            return JSON.stringify(data)
          }
          return data
        },
      ],
      transformResponse: [
        (data) => {
          try {
            return JSON.parse(data)
          } catch {
            return data
          }
        },
      ],
    })
  }

  private setupInterceptors(): void {
    // Request Interceptor
    this.client.interceptors.request.use(
      (config) => {
        // For now, no auth token required
        // This can be enabled later when authentication is implemented

        // Add request timestamp
        config.metadata = { startTime: new Date() }

        // Log request in development
        if (process.env.NODE_ENV === "development") {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
        }

        return config
      },
      (error) => {
        console.error("❌ Request Error:", error)
        return Promise.reject(error)
      },
    )

    // Response Interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Calculate request duration
        const duration = response.config.metadata?.startTime
          ? new Date().getTime() - response.config.metadata.startTime.getTime()
          : 0

        if (process.env.NODE_ENV === "development") {
          console.log(`✅ API Response: ${response.status} ${response.config.url} (${duration}ms)`)
        }

        return response
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any

        // Handle different error types
        if (error.response) {
          // Server responded with error status
          await this.handleResponseError(error)
        } else if (error.request) {
          // Request was made but no response received
          this.handleNetworkError(error)
        } else {
          // Something else happened
          this.handleUnknownError(error)
        }

        // Retry logic for specific errors
        if (this.shouldRetry(error) && !originalRequest._retry) {
          originalRequest._retry = true
          await this.delay(this.retryDelay)
          return this.client(originalRequest)
        }

        return Promise.reject(error)
      },
    )
  }

  private async handleResponseError(error: AxiosError): Promise<void> {
    const status = error.response?.status
    const message = (error.response?.data as any)?.message || error.message

    switch (status) {
      case 401:
        toast.error("Akses tidak diizinkan. Silakan coba lagi.", { duration: 2000 })
        break
      case 403:
        toast.error("Anda tidak memiliki akses untuk melakukan tindakan ini.", { duration: 2000 })
        break
      case 404:
        toast.error("Data yang diminta tidak ditemukan.", { duration: 2000 })
        break
      case 422:
        toast.error("Data yang dikirim tidak valid.", { duration: 2000 })
        break
      case 429:
        toast.error("Terlalu banyak permintaan. Silakan coba lagi nanti.", { duration: 2000 })
        break
      case 500:
        toast.error("Terjadi kesalahan server. Tim teknis telah diberitahu.", { duration: 2000 })
        break
      default:
        toast.error(message || "Terjadi kesalahan yang tidak diketahui.", { duration: 2000 })
    }
  }

  private handleNetworkError(error: AxiosError): void {
    toast.error("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.", { duration: 2000 })
    console.error("🌐 Network Error:", error)
  }

  private handleUnknownError(error: AxiosError): void {
    toast.error("Terjadi kesalahan yang tidak diketahui.", { duration: 2000 })
    console.error("❓ Unknown Error:", error)
  }

  private shouldRetry(error: AxiosError): boolean {
    const status = error.response?.status
    const retryableStatuses = [408, 429, 500, 502, 503, 504]
    return retryableStatuses.includes(status || 0)
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Enhanced HTTP Methods
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<T>(endpoint, config)
      return this.formatResponse(response)
    } catch (error) {
      return this.formatError(error as AxiosError)
    }
  }

  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<T>(endpoint, data, config)
      return this.formatResponse(response)
    } catch (error) {
      return this.formatError(error as AxiosError)
    }
  }

  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<T>(endpoint, data, config)
      return this.formatResponse(response)
    } catch (error) {
      return this.formatError(error as AxiosError)
    }
  }

  async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<T>(endpoint, data, config)
      return this.formatResponse(response)
    } catch (error) {
      return this.formatError(error as AxiosError)
    }
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<T>(endpoint, config)
      return this.formatResponse(response)
    } catch (error) {
      return this.formatError(error as AxiosError)
    }
  }

  // Enhanced file upload with progress tracking
  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>,
    onProgress?: (progress: number) => void,
  ): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData()
      formData.append("file", file)

      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value)
        })
      }

      const response = await this.client.post<T>(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(progress)
          }
        },
      })

      return this.formatResponse(response)
    } catch (error) {
      return this.formatError(error as AxiosError)
    }
  }

  // Batch requests
  async batch<T>(requests: Array<() => Promise<AxiosResponse<T>>>): Promise<ApiResponse<T[]>> {
    try {
      const responses = await Promise.allSettled(requests.map((req) => req()))
      const results = responses
        .map((result) => (result.status === "fulfilled" ? result.value.data : null))
        .filter((item): item is T => item !== null)

      return {
        success: true,
        data: results,
        message: "Batch request completed",
      }
    } catch (error) {
      return this.formatError(error as AxiosError)
    }
  }

  private formatResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      success: true,
      data: response.data,
      statusCode: response.status,
      timestamp: new Date().toISOString(),
    }
  }

  private formatError(error: AxiosError): ApiResponse {
    return {
      success: false,
      error: error.message,
      statusCode: error.response?.status,
      timestamp: new Date().toISOString(),
    }
  }

  // Utility methods - simplified without auth
  // Add custom interceptors
  addRequestInterceptor(interceptor: RequestInterceptor): number {
    return this.client.interceptors.request.use(interceptor.onFulfilled, interceptor.onRejected)
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): number {
    return this.client.interceptors.response.use(interceptor.onFulfilled, interceptor.onRejected)
  }
}

// Export singleton instance
export const apiClient = new ImprovedAPIClient()
