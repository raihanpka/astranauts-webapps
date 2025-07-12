"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw, Home, AlertTriangle, Bug } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("Application Error:", error)

    // You can send error to monitoring service like Sentry here
    // Sentry.captureException(error)
  }, [error])

  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-red-700 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/logos/satria-main.png"
              alt="Satria Logo"
              width={200}
              height={60}
              className="h-16 w-auto brightness-0 invert mx-auto"
            />
          </Link>
        </div>

        {/* Error Card */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardContent className="p-12">
            <div className="text-white">
              {/* Error Icon */}
              <div className="mb-6">
                <AlertTriangle className="h-20 w-20 mx-auto text-white/80" />
              </div>

              {/* Error Message */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Oops! Terjadi Kesalahan</h1>

              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-md mx-auto">
                Maaf, terjadi kesalahan yang tidak terduga. Tim teknis kami telah diberitahu dan sedang menangani
                masalah ini.
              </p>

              {/* Error Details (Development Only) */}
              {isDevelopment && (
                <div className="bg-black/20 rounded-lg p-4 mb-8 text-left">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Bug className="mr-2 h-5 w-5" />
                    Error Details (Development)
                  </h3>
                  <div className="text-sm font-mono text-white/80 break-all">
                    <p>
                      <strong>Message:</strong> {error.message}
                    </p>
                    {error.digest && (
                      <p>
                        <strong>Digest:</strong> {error.digest}
                      </p>
                    )}
                    {error.stack && (
                      <details className="mt-2">
                        <summary className="cursor-pointer hover:text-white">Stack Trace</summary>
                        <pre className="mt-2 text-xs overflow-auto max-h-40 bg-black/20 p-2 rounded">{error.stack}</pre>
                      </details>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={reset}
                  className="bg-white text-red-600 hover:bg-gray-100 font-medium px-8 py-3 w-full sm:w-auto"
                >
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Coba Lagi
                </Button>

                <Link href="/">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-red-600 bg-transparent font-medium px-8 py-3 w-full sm:w-auto"
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Kembali ke Beranda
                  </Button>
                </Link>
              </div>

              {/* Error ID for Support */}
              {error.digest && (
                <div className="mt-8 pt-8 border-t border-white/20">
                  <p className="text-sm text-white/80">
                    Error ID: <code className="bg-black/20 px-2 py-1 rounded text-xs">{error.digest}</code>
                  </p>
                  <p className="text-xs text-white/60 mt-2">
                    Berikan Error ID ini kepada tim support untuk bantuan lebih lanjut
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <div className="text-white/80 text-sm">
          <p>
            Masalah berlanjut?
            <a href="mailto:support@satria.com" className="text-white hover:underline ml-1">
              Hubungi Tim Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
