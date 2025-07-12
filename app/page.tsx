import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import LandingHeader from "@/components/landing-header"
import { Facebook, Instagram, Linkedin } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0887A0] to-[#0EBC84] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Large S Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                <div className="text-6xl font-bold text-white">
                  <Image
                    src="/logos/satria.png"
                    alt="Satria Logo"
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            SATRIA AI:
            <br />
            <span className="text-4xl md:text-5xl">AI Credit Intelligence</span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-white text-opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
            SATRIA membantu lembaga keuangan mengambil keputusan yang lebih tepat berbasis data, mengurangi risiko dan
            mendorong pertumbuhan dengan pesat
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/form">
              <Button
                size="lg"
                className="bg-white text-[#0887A0] hover:bg-gray-100 font-medium px-8 py-3 rounded-full text-lg"
              >
                Mulai Sekarang
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[#0887A0] bg-transparent font-medium px-8 py-3 rounded-full text-lg"
              >
                Jelajahi Satria
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start">
            {/* Left Side - Logo and Description */}
            <div className="mb-8 md:mb-0">
              <Link href="/" className="flex items-center mb-4">
                <Image src="/logos/satria-main.png" alt="Satria Logo" width={120} height={40} className="h-8 w-auto" />
              </Link>
              <p className="text-gray-600 max-w-sm leading-relaxed">
                AI Credit Intelligence yang Dapat Diandalkan.
                <br />
                SATRIA membantu lembaga keuangan mengambil keputusan yang lebih tepat berbasis data, mengurangi risiko
              </p>

              {/* Social Media Icons */}
              <div className="flex space-x-4 mt-6">
                <Link
                  href="#"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#0887A0] hover:text-white transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#0887A0] hover:text-white transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#0887A0] hover:text-white transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-100 pt-8 mt-8 text-center">
            <p className="text-gray-500 text-sm">Copyrighted © 2025 by THE BEYONDERS</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
