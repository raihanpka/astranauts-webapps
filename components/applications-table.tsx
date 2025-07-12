"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, Clock, Search, Filter } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ApplicationsTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const textToSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "")
  }

  const dateToSlug = (date: string) => {
    return date
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "")
  }

  const allApplications = [
    {
      name: "PT Andalan Niaga",
      date: "10 Juni 2025",
      amount: "Rp2.500.000.000",
      creditRisk: "sedang",
      externalRisk: "sedang",
      status: "approved",
      slug: textToSlug("PT Andalan Niaga"),
      dateSlug: dateToSlug("10 Juni 2025"),
    },
    {
      name: "CV Sukses Bersama",
      date: "9 Juni 2025",
      amount: "Rp1.000.000.000",
      creditRisk: "rendah",
      externalRisk: "rendah",
      status: "approved",
      slug: textToSlug("CV Sukses Bersama"),
      dateSlug: dateToSlug("9 Juni 2025"),
    },
    {
      name: "PT Sumber Sejahtera",
      date: "8 Juni 2025",
      amount: "Rp5.000.000.000",
      creditRisk: "tinggi",
      externalRisk: "tinggi",
      status: "rejected",
      slug: textToSlug("PT Sumber Sejahtera"),
      dateSlug: dateToSlug("8 Juni 2025"),
    },
    {
      name: "PT Maju Bersama",
      date: "7 Juni 2025",
      amount: "Rp3.000.000.000",
      creditRisk: "tinggi",
      externalRisk: "sedang",
      status: "pending",
      slug: textToSlug("PT Maju Bersama"),
      dateSlug: dateToSlug("7 Juni 2025"),
    },
    {
      name: "CV Berkah Jaya",
      date: "6 Juni 2025",
      amount: "Rp1.500.000.000",
      creditRisk: "rendah",
      externalRisk: "rendah",
      status: "approved",
      slug: textToSlug("CV Berkah Jaya"),
      dateSlug: dateToSlug("6 Juni 2025"),
    },
    {
      name: "PT Teknologi Maju",
      date: "5 Juni 2025",
      amount: "Rp4.000.000.000",
      creditRisk: "sedang",
      externalRisk: "rendah",
      status: "approved",
      slug: textToSlug("PT Teknologi Maju"),
      dateSlug: dateToSlug("5 Juni 2025"),
    },
    {
      name: "CV Digital Solusi",
      date: "4 Juni 2025",
      amount: "Rp800.000.000",
      creditRisk: "rendah",
      externalRisk: "rendah",
      status: "approved",
      slug: textToSlug("CV Digital Solusi"),
      dateSlug: dateToSlug("4 Juni 2025"),
    },
    {
      name: "PT Konstruksi Prima",
      date: "3 Juni 2025",
      amount: "Rp10.000.000.000",
      creditRisk: "tinggi",
      externalRisk: "tinggi",
      status: "rejected",
      slug: textToSlug("PT Konstruksi Prima"),
      dateSlug: dateToSlug("3 Juni 2025"),
    },
  ]

  const filteredApplications = allApplications.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Disetujui</Badge>
      case "rejected":
        return <Badge variant="destructive">Ditolak</Badge>
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Semua Pengajuan Kredit</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari perusahaan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Perusahaan</th>
                  <th className="text-left py-3 px-2">Tanggal Pengajuan</th>
                  <th className="text-left py-3 px-2">Jumlah Dana</th>
                  <th className="text-left py-3 px-2">Risiko Kredit</th>
                  <th className="text-left py-3 px-2">Risiko Eksternal</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(app.status)}
                        <span className="font-medium">{app.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-sm text-gray-600">{app.date}</td>
                    <td className="py-4 px-2 font-medium">{app.amount}</td>
                    <td className="py-4 px-2">{getRiskBadge(app.creditRisk)}</td>
                    <td className="py-4 px-2">{getRiskBadge(app.externalRisk)}</td>
                    <td className="py-4 px-2">{getStatusBadge(app.status)}</td>
                    <td className="py-4 px-2">
                      <Link href={`/analysis/${app.slug}/${app.dateSlug}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[#0887A0] border-[#0887A0] hover:bg-[#0887A0] hover:text-white bg-transparent"
                        >
                          Lihat Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada pengajuan yang ditemukan</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
