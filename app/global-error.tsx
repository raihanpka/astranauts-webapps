"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log critical error
    console.error("Critical Application Error:", error)

    // Send to monitoring service
    // Sentry.captureException(error, { level: 'fatal' })
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
          <div className="max-w-lg mx-auto text-center text-white">
            {/* Critical Error Icon */}
            <div className="mb-8">
              <AlertTriangle className="h-24 w-24 mx-auto text-red-500" />
            </div>

            {/* Error Message */}
            <h1 className="text-4xl font-bold mb-4">Sistem Error</h1>

            <p className="text-xl text-gray-300 mb-8">
              Terjadi kesalahan kritis pada sistem. Silakan muat ulang halaman atau hubungi administrator.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={reset}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-8 py-3"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Muat Ulang
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 font-medium px-8 py-3 bg-transparent"
                onClick={() => (window.location.href = "/")}
              >
                <Home className="mr-2 h-5 w-5" />
                Beranda
              </Button>
            </div>

            {/* Contact Support */}
            {error.digest && (
              <div className="mt-8 pt-8 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  Error ID: <code className="bg-gray-800 px-2 py-1 rounded text-xs">{error.digest}</code>
                </p>
                <p className="text-xs text-gray-300 mt-2">
                  Hubungi support@satria.com dengan Error ID ini untuk bantuan
                </p>
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
