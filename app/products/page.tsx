import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function ProductsPage() {
  const products = [
    {
      name: "SARANA",
      logo: "/logos/tara.png",
      description: "OCR & NLP untuk mengubah dokumen laporan keuangan menjadi data terstruktur JSON",
      features: ["Optical Character Recognition", "Natural Language Processing", "Data Extraction", "JSON Output"],
    },
    {
      name: "PRABU",
      logo: "/logos/prabu.png",
      description: "Credit Scoring AI yang menghitung skor risiko kredit dengan explainable ML",
      features: ["M-Score Calculation", "Altman Z-Score", "Risk Assessment", "Explainable AI"],
    },
    {
      name: "SETIA",
      logo: "/logos/setia.png",
      description: "Sentiment & News Monitoring menggunakan Vertex AI untuk analisis sentimen real-time",
      features: ["Sentiment Analysis", "News Monitoring", "Real-time Updates", "Risk Alerts"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0887A0] via-[#0887A0] to-[#0EBC84]">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-12">
          <Link href="/" className="inline-block mb-8">
            <Image
              src="/logos/satria-main.png"
              alt="Satria Logo"
              width={200}
              height={60}
              className="h-16 w-auto brightness-0 invert mx-auto"
            />
          </Link>

          <h1 className="text-4xl font-bold mb-4">Produk SATRIA</h1>
          <p className="text-xl text-white text-opacity-90">
            Tiga modul utama yang membentuk ekosistem analisis risiko kredit yang komprehensif
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {products.map((product) => (
            <Card key={product.name} className="bg-white bg-opacity-10 backdrop-blur-sm border-white border-opacity-20">
              <CardHeader className="text-center">
                <Image
                  src={product.logo || "/placeholder.svg"}
                  alt={`${product.name} Logo`}
                  width={120}
                  height={40}
                  className="h-10 w-auto mx-auto mb-4 brightness-0 invert"
                />
                <CardTitle className="text-white text-xl">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <p className="text-white text-opacity-90 mb-4">{product.description}</p>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/">
            <Button size="lg" className="bg-white text-[#0887A0] hover:bg-gray-100 mr-4">
              Kembali ke Beranda
            </Button>
          </Link>
          <Link href="/form">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#0887A0] bg-transparent"
            >
              Mulai Analisis
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
