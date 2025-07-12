"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import FinancialIndexTable from "./financial-index-table"

interface CompanyAnalysisProps {
  companyId: string
  date: string
}

export default function CompanyAnalysis({ companyId, date }: CompanyAnalysisProps) {
  const companyData = {
    name: companyId,
    description:
      "PT Andalan Niaga mencatatkan laba bersih naik 15% YoY pada Q1 2025. Perusahaan juga mulai ekspansi ke sektor digital logistik.",
    riskLevel: "Risiko Sedang",
    confidenceRate: "80% Confidence rate",
  }

  const prabuScores = {
    mScore: -1.48,
    altmanZScore: 5.89,
  }

  const setiaAnalysis = {
    title: "SETIA Analysis",
    subtitle: "Ringkasan Eksternal",
    content:
      "Kinerja keuangan PT Alamtri Resources Indonesia Tbk (ADRO) mengalami penurunan pada kuartal 1-2025, dengan laba bersih ani bk 79.5% periode yang sama tahun sebelumnya. Saham ADRO juga terpantau terus mengalami penurunan dalam sebulan terakhir; Perusahaan metaup dari anak usahanya.",
  }

  const highlights = [
    {
      title: "1-Penurunan Laba Bersih",
      description: "Laba bersih ADRO pada kuartal 1-2025 merosot tajam sebesar 79.5% menjadi US$78.6 juta.",
    },
    {
      title: "2-Penurunan Pendapatan",
      description:
        "Pendapatan usaha ADRO juga mengalami penurunan sebesar 22.3% menjadi US$381.6 juta pada kuartal 1-2025.",
    },
  ]

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "tinggi":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            ⚠ Risiko Tinggi
          </Badge>
        )
      case "sedang":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            ⚠ Risiko Sedang
          </Badge>
        )
      case "rendah":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            ✓ Risiko Rendah
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/dashboard">
        <Button variant="outline" className="mb-4 bg-transparent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Dashboard
        </Button>
      </Link>

      {/* Company Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">{companyData.name}</CardTitle>
              <p className="text-sm text-gray-500 mb-2">Pengajuan: {date}</p>
              <p className="text-sm text-gray-600">{companyData.description}</p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                ⚠ {companyData.riskLevel}
              </Badge>
              <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                {companyData.confidenceRate}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-[#0887A0] to-[#0EBC84] text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2">
            <span className="text-sm">Ngobrol dengan TARA</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-xs">tanya lebih jelas lagi!</span>
          </div>
        </CardContent>
      </Card>

      {/* PRABU Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Image src="/logos/prabu.png" alt="PRABU" width={80} height={24} className="h-6 w-auto" />
            <span>Credit Scoring Analysis with PRABU</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#0887A0]/10 p-4 rounded-lg">
              <h3 className="font-semibold text-[#0887A0]">M-Score</h3>
              <p className="text-2xl font-bold text-teal-900">{prabuScores.mScore}</p>
              <p className="text-sm text-teal-600">Terdapat peningkatan</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Altman-Z Score</h3>
              <p className="text-2xl font-bold text-blue-900">{prabuScores.altmanZScore}</p>
              <p className="text-sm text-blue-600">Terdapat peningkatan</p>
            </div>
          </div>

          {/* Financial Index */}
          <FinancialIndexTable mScore={prabuScores.mScore} altmanZScore={prabuScores.altmanZScore} />
        </CardContent>
      </Card>

      {/* SETIA Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Image src="/logos/setia.png" alt="SETIA" width={80} height={24} className="h-6 w-auto" />
              <span>Sentiment Analysis with SETIA</span>
            </CardTitle>
            <p className="text-sm text-gray-600">{setiaAnalysis.subtitle}</p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">{setiaAnalysis.content}</p>

            <div className="space-y-3">
              <h4 className="font-semibold">Highlights</h4>
              {highlights.map((highlight, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="font-medium text-sm">{highlight.title}</h5>
                  <p className="text-xs text-gray-600 mt-1">{highlight.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            ❋ Sentimen Negatif
          </Badge>

          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-gradient-to-r from-[#0887A0] to-[#0EBC84] text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Jumlah Berhasil</p>
                    <p className="text-3xl font-bold">126</p>
                    <p className="text-sm opacity-90">Terdapat peningkatan</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-90">Terdapat peningkatan</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-[#0887A0] to-[#0EBC84] text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Jumlah Berhasil</p>
                    <p className="text-3xl font-bold">126</p>
                    <p className="text-sm opacity-90">Terdapat peningkatan</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-90">Terdapat peningkatan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
