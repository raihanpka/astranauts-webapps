import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0887A0] via-[#0887A0] to-[#0EBC84]">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <Link href="/" className="inline-block mb-8">
            <Image
              src="/logos/satria.png"
              alt="Satria Logo"
              width={200}
              height={60}
              className="h-16 w-auto brightness-0 invert mx-auto"
            />
          </Link>

          <h1 className="text-4xl font-bold mb-8">Tentang SATRIA</h1>

          <div className="max-w-4xl mx-auto text-lg leading-relaxed space-y-6">
            <p>
              SATRIA (Sistem Analisis Risiko Kredit Terintegrasi dan Adaptif) adalah solusi inovatif untuk analisis
              risiko kredit modern yang dikembangkan khusus untuk PT SANF (Surya Artha Nusantara Finance).
            </p>

            <p>
              Sistem ini menggabungkan teknologi AI terdepan dengan pendekatan analisis yang komprehensif untuk
              memberikan penilaian risiko kredit yang akurat dan dapat diandalkan.
            </p>
          </div>

          <div className="mt-12">
            <Link href="/">
              <Button size="lg" className="bg-white text-[#0887A0] hover:bg-gray-100">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
