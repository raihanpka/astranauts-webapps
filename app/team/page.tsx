import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0887A0] via-[#0887A0] to-[#0EBC84]">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <Link href="/" className="inline-block mb-8">
            <Image
              src="/logos/satria-main.png"
              alt="Satria Logo"
              width={200}
              height={60}
              className="h-16 w-auto brightness-0 invert mx-auto"
            />
          </Link>

          <h1 className="text-4xl font-bold mb-8">Tim SATRIA</h1>

          <div className="max-w-4xl mx-auto text-lg leading-relaxed space-y-6">
            <p>
              Tim pengembang SATRIA terdiri dari para ahli di bidang teknologi finansial, artificial intelligence, dan
              analisis risiko kredit.
            </p>

            <p>
              Kami berkomitmen untuk menghadirkan solusi terbaik dalam analisis risiko kredit yang dapat membantu PT
              SANF dalam mengambil keputusan pembiayaan yang tepat.
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
