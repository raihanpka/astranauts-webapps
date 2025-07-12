"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, Clock, Home } from "lucide-react"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
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

        {/* Maintenance Card */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardContent className="p-12">
            <div className="text-white">
              {/* Maintenance Icon */}
              <div className="mb-6">
                <Settings
                  className="h-20 w-20 mx-auto text-white/80 animate-spin"
                  style={{ animationDuration: "3s" }}
                />
              </div>

              {/* Maintenance Message */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Sistem Dalam Pemeliharaan</h1>

              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-md mx-auto">
                SATRIA sedang dalam pemeliharaan terjadwal untuk meningkatkan performa dan keamanan sistem.
              </p>

              {/* Maintenance Info */}
              <div className="bg-white/10 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Clock className="mr-2 h-5 w-5" />
                  <span className="font-semibold">Estimasi Waktu Pemeliharaan</span>
                </div>
                <p className="text-2xl font-bold mb-2">2 Jam</p>
                <p className="text-sm text-white/80">Mulai: 02:00 WIB - Selesai: 04:00 WIB</p>
              </div>

              {/* What's Being Updated */}
              <div className="bg-white/10 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Yang sedang diperbaharui:</h3>
                <ul className="text-left space-y-2 text-white/90">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    Peningkatan keamanan sistem
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    Optimasi performa database
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    Update model AI PRABU dan SETIA
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    Perbaikan bug dan stabilitas
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <div className="flex justify-center">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-700 bg-transparent font-medium px-8 py-3"
                  onClick={() => window.location.reload()}
                >
                  <Home className="mr-2 h-5 w-5" />
                  Coba Lagi
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="text-white/80 text-sm">
          <p>
            Untuk informasi lebih lanjut, hubungi:
            <a href="mailto:support@satria.com" className="text-white hover:underline ml-1">
              support@satria.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
