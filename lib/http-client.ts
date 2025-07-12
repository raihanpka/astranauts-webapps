import { API_CONFIG, buildURL, replaceURLParams } from "./api-config"

// HTTP Client class for API communication
export class HTTPClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor() {
    this.baseURL = buildURL("")
    this.defaultHeaders = {
      ...API_CONFIG.HEADERS,
      ...(process.env.NEXT_PUBLIC_API_KEY && {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      }),
    }
  }

  // Generic request method
  private async request<T>(endpoint: string, options: RequestInit = {}, params?: Record<string, string>): Promise<T> {
    const url = params ? replaceURLParams(endpoint, params) : endpoint
    const fullURL = buildURL(url)

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(fullURL, config)

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        return await response.json()
      }

      return (await response.text()) as T
    } catch (error) {
      console.error("HTTP Request failed:", error)
      throw error
    }
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" }, params)
  }

  // POST request
  async post<T>(endpoint: string, data?: any, params?: Record<string, string>): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      },
      params,
    )
  }

  // PUT request
  async put<T>(endpoint: string, data?: any, params?: Record<string, string>): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      },
      params,
    )
  }

  // DELETE request
  async delete<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" }, params)
  }

  // File upload
  async upload<T>(endpoint: string, formData: FormData, params?: Record<string, string>): Promise<T> {
    const headers = { ...this.defaultHeaders }
    delete headers["Content-Type"] // Let browser set multipart boundary

    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: formData,
        headers,
      },
      params,
    )
  }
}

// Create singleton instance
export const httpClient = new HTTPClient()
