"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { textToSlug, dateToSlug } from "@/lib/utils"

export default function OverviewDashboard() {
  const stats = [
    {
      title: "Total Pengajuan",
      value: "140",
      subtitle: "Terdapat peningkatan",
      change: "Terdapat peningkatan",
      icon: Users,
      color: "bg-[#0887A0]/10 text-[#0887A0]",
    },
    {
      title: "Jumlah Berhasil",
      value: "126",
      subtitle: "Terdapat peningkatan",
      change: "Terdapat peningkatan",
      icon: CheckCircle,
      color: "bg-[#0EBC84]/10 text-[#0EBC84]",
    },
    {
      title: "Jumlah Error",
      value: "10%",
      subtitle: "Terdapat peningkatan",
      change: "Terdapat peningkatan",
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600",
    },
    {
      title: "Average Pemrosesan",
      value: "5min",
      subtitle: "Terdapat peningkatan",
      change: "Terdapat peningkatan",
      icon: Clock,
      color: "bg-blue-50 text-blue-600",
    },
  ]

  const recentApplications = [
    {
      name: "PT Andalan Niaga",
      date: "10 Juni 2025",
      creditRisk: "sedang",
      externalRisk: "sedang",
      status: "approved",
    },
    {
      name: "CV Sukses Bersama",
      date: "9 Juni 2025",
      creditRisk: "rendah",
      externalRisk: "rendah",
      status: "approved",
    },
    {
      name: "PT Sumber Sejahtera",
      date: "8 Juni 2025",
      creditRisk: "tinggi",
      externalRisk: "tinggi",
      status: "rejected",
    },
    {
      name: "PT Maju Bersama",
      date: "7 Juni 2025",
      creditRisk: "tinggi",
      externalRisk: "sedang",
      status: "pending",
    },
    {
      name: "CV Berkah Jaya",
      date: "6 Juni 2025",
      creditRisk: "rendah",
      externalRisk: "rendah",
      status: "approved",
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Overview SATRIA</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-l-4 border-l-[#0887A0]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#0887A0]">{stat.title}</p>
                  <p className="text-3xl font-bold text-[#252525]">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.subtitle}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pengajuan Terakhir</CardTitle>
              <Link href="/applications">
                <Button variant="link" className="text-[#0887A0]">
                  Lihat Selengkapnya
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Table Headers */}
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                <div>Financial Metrics</div>
                <div>Tanggal Pengajuan</div>
                <div>Risiko Kredit</div>
                <div>Risiko Eksternal</div>
              </div>

              {/* Table Rows */}
              {recentApplications.map((app, index) => {
                const companySlug = textToSlug(app.name)
                const dateSlug = dateToSlug(app.date)

                return (
                  <div key={index} className="grid grid-cols-4 gap-4 items-center py-3 border-b last:border-b-0">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(app.status)}
                      <Link
                        href={`/analysis/${companySlug}/${dateSlug}`}
                        className="font-medium hover:text-[#0887A0] transition-colors"
                      >
                        {app.name}
                      </Link>
                    </div>
                    <div className="text-sm text-gray-600">{app.date}</div>
                    <div>{getRiskBadge(app.creditRisk)}</div>
                    <div>{getRiskBadge(app.externalRisk)}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifikasi Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-[#0887A0] to-[#0EBC84] text-white p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90">System Update</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <h3 className="font-semibold">PRABU Model Updated</h3>
              <p className="text-sm opacity-90 mt-1">
                Model analisis risiko kredit telah diperbarui dengan akurasi 95.2%
              </p>
            </div>

            <div className="bg-gradient-to-r from-[#0887A0] to-[#0EBC84] text-white p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90">Alert</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <h3 className="font-semibold">High Risk Applications</h3>
              <p className="text-sm opacity-90 mt-1">3 pengajuan dengan risiko tinggi memerlukan review manual</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
