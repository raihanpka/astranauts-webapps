"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface FinancialMetric {
  name: string
  value: number
  description: string
  interpretation: string
  risk: "rendah" | "sedang" | "tinggi"
}

interface FinancialIndexTableProps {
  mScore: number
  altmanZScore: number
}

export default function FinancialIndexTable({ mScore, altmanZScore }: FinancialIndexTableProps) {
  const [selectedScoreType, setSelectedScoreType] = useState<"beneish" | "altman">("beneish")

  const beneishMetrics: FinancialMetric[] = [
    {
      name: "DSRI",
      value: 0.965,
      description: "Days Sales Receivables Index",
      interpretation: "Penurunan piutang relatif terhadap penjualan",
      risk: "sedang",
    },
    {
      name: "GMI",
      value: 1.084,
      description: "Gross Margin Index",
      interpretation: "Margin menurun, potensi tekanan profitabilitas",
      risk: "rendah",
    },
    {
      name: "AQI",
      value: 0.986,
      description: "Asset Quality Index",
      interpretation: "Aset tidak produktif relatif stabil",
      risk: "tinggi",
    },
    {
      name: "SGI",
      value: 1.139,
      description: "Sales Growth Index",
      interpretation: "Pertumbuhan penjualan cepat, bisa memberi insentif manipulasi",
      risk: "sedang",
    },
    {
      name: "DEPI",
      value: 1.0,
      description: "Depreciation Index",
      interpretation: "Tidak ada perubahan depresiasi",
      risk: "rendah",
    },
  ]

  const altmanMetrics: FinancialMetric[] = [
    {
      name: "X1",
      value: 0.247,
      description: "Working Capital ÷ Total Assets",
      interpretation: "The working capital to total assets ratio measures the company's short-term liquidity.",
      risk: "rendah",
    },
    {
      name: "X2",
      value: 0.847,
      description: "Retained Earnings ÷ Total Assets",
      interpretation:
        "The retained earnings to total assets ratio measure a company's reliance on debt financing to fund operations, so a higher ratio indicates the company can fund its operations using its earnings rather than borrowings.",
      risk: "rendah",
    },
    {
      name: "X3",
      value: 0.107,
      description: "EBIT ÷ Total Assets",
      interpretation:
        "The operating income to total assets ratio measures a company's ability to generate operating profits using its assets, meaning that a higher ratio indicates greater profits and asset-utilization efficiency.",
      risk: "sedang",
    },
    {
      name: "X4",
      value: 0.42,
      description: "Market Capitalization ÷ Total Liabilities",
      interpretation:
        "The market cap to total liabilities ratio measures the potential downside in the market value of equity given the risk of insolvency. Hence, a low market cap relative to its liabilities reflects weak market sentiment regarding the company's outlook.",
      risk: "tinggi",
    },
    {
      name: "X5",
      value: 0.998,
      description: "Sales ÷ Total Assets",
      interpretation:
        "The sales to total assets ratio measure the sales generated compared to a company's asset base. Thus, a higher percentage means more efficiency in producing revenue (and higher profitability due to reduced reliance on reinvestments).",
      risk: "rendah",
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

  const getScoreInterpretation = () => {
    if (selectedScoreType === "beneish") {
      return {
        score: mScore,
        interpretation: mScore > -2.22 ? "Low Risk" : "High Risk",
        description: "Skor M-Score di atas -2.22 menunjukkan kemungkinan manipulasi earnings yang rendah",
        color: mScore > -2.22 ? "text-green-600" : "text-red-600",
      }
    } else {
      let interpretation = "Distress Zone"
      let color = "text-red-600"

      if (altmanZScore > 2.99) {
        interpretation = "Safe Zone"
        color = "text-green-600"
      } else if (altmanZScore > 1.81) {
        interpretation = "Gray Zone"
        color = "text-yellow-600"
      }

      return {
        score: altmanZScore,
        interpretation,
        description: "Z-Score di atas 2.99 menunjukkan zona aman, 1.81-2.99 zona abu-abu, di bawah 1.81 zona distress",
        color,
      }
    }
  }

  const currentMetrics = selectedScoreType === "beneish" ? beneishMetrics : altmanMetrics
  const scoreInfo = getScoreInterpretation()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Financial Index</h3>
        <div className="flex space-x-2">
          <Button
            variant={selectedScoreType === "beneish" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedScoreType("beneish")}
            className={selectedScoreType === "beneish" ? "bg-[#0887A0] text-white" : ""}
          >
            Beneish M-Score
          </Button>
          <Button
            variant={selectedScoreType === "altman" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedScoreType("altman")}
            className={selectedScoreType === "altman" ? "bg-[#0887A0] text-white" : ""}
          >
            Altman Z-Score
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Nilai</th>
              <th className="text-left py-2">Financial Index</th>
              <th className="text-left py-2">Interpretasi</th>
              <th className="text-left py-2">Risiko</th>
            </tr>
          </thead>
          <tbody>
            {currentMetrics.map((metric) => (
              <tr key={metric.name} className="border-b">
                <td className="py-2 font-medium">{metric.value.toFixed(3)}</td>
                <td className="py-2">
                  <div>
                    <span className="font-medium">{metric.name}</span>
                    <p className="text-sm text-gray-600">{metric.description}</p>
                  </div>
                </td>
                <td className="py-2 text-sm">{metric.interpretation}</td>
                <td className="py-2">{getRiskBadge(metric.risk)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Score Summary */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">
              {selectedScoreType === "beneish" ? "Beneish M-Score" : "Altman Z-Score"} Summary
            </h4>
            <p className="text-sm text-gray-600">{scoreInfo.description}</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${scoreInfo.color}`}>{scoreInfo.score.toFixed(2)}</p>
            <p className={`text-sm font-medium ${scoreInfo.color}`}>{scoreInfo.interpretation}</p>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">
            {selectedScoreType === "beneish" ? "M-Score Analysis" : "Z-Score Analysis"}
          </h5>
          <p className="text-sm text-blue-700">
            {selectedScoreType === "beneish"
              ? "Model Beneish menggunakan 8 variabel keuangan untuk mendeteksi kemungkinan manipulasi earnings."
              : "Model Altman menggunakan 5 rasio keuangan untuk memprediksi kemungkinan kebangkrutan perusahaan."}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h5 className="font-medium text-green-900 mb-2">Rekomendasi</h5>
          <p className="text-sm text-green-700">
            {selectedScoreType === "beneish"
              ? scoreInfo.score > -2.22
                ? "Laporan keuangan menunjukkan indikasi yang baik, risiko manipulasi rendah."
                : "Perlu review lebih mendalam terhadap kualitas earnings dan praktik akuntansi."
              : scoreInfo.score > 2.99
                ? "Kondisi keuangan perusahaan dalam zona aman dengan risiko kebangkrutan rendah."
                : "Perlu monitoring ketat terhadap kondisi keuangan dan arus kas perusahaan."}
          </p>
        </div>
      </div>
    </div>
  )
}
