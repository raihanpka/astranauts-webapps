"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0887A0] via-[#0887A0] to-[#0EBC84] flex items-center justify-center p-4">
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

        {/* 404 Illustration */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardContent className="p-12">
            <div className="text-white">
              {/* Large 404 */}
              <div className="text-8xl md:text-9xl font-bold mb-4 text-white/80">404</div>

              {/* Error Message */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Halaman Tidak Ditemukan</h1>

              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-md mx-auto">
                Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman telah dipindahkan atau URL salah.
              </p>

              {/* Suggestions */}
              <div className="bg-white/10 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Yang bisa Anda lakukan:</h3>
                <ul className="text-left space-y-2 text-white/90">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    Periksa kembali URL yang Anda masukkan
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    Kembali ke halaman sebelumnya
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    Gunakan menu navigasi untuk menemukan halaman
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    Hubungi tim support jika masalah berlanjut
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button
                    size="lg"
                    className="bg-white text-[#0887A0] hover:bg-gray-100 font-medium px-8 py-3 w-full sm:w-auto"
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Kembali ke Beranda
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#0887A0] bg-transparent font-medium px-8 py-3 w-full sm:w-auto"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Halaman Sebelumnya
                </Button>
              </div>

              {/* Quick Links */}
              <div className="mt-8 pt-8 border-t border-white/20">
                <p className="text-sm text-white/80 mb-4">Atau kunjungi halaman populer:</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/dashboard"
                    className="text-white/90 hover:text-white underline underline-offset-4 text-sm"
                  >
                    Dashboard
                  </Link>
                  <Link href="/form" className="text-white/90 hover:text-white underline underline-offset-4 text-sm">
                    Pengajuan Kredit
                  </Link>
                  <Link href="/about" className="text-white/90 hover:text-white underline underline-offset-4 text-sm">
                    Tentang Kami
                  </Link>
                  <Link
                    href="/products"
                    className="text-white/90 hover:text-white underline underline-offset-4 text-sm"
                  >
                    Produk
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <div className="text-white/80 text-sm">
          <p>
            Butuh bantuan?
            <a href="mailto:support@satria.com" className="text-white hover:underline ml-1">
              Hubungi Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
