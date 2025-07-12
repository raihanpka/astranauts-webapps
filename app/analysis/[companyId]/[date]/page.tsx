import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import CompanyAnalysis from "@/components/company-analysis"
import { slugToText, slugToDate } from "@/lib/utils"

interface PageProps {
  params: {
    companyId: string
    date: string
  }
}

export default function CompanyAnalysisPage({ params }: PageProps) {
  const { companyId, date } = params

  // Convert slugs back to proper text
  const companyName = slugToText(companyId)
  const dateText = slugToDate(date)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="md:ml-64">
        <Header title={`Analisis ${companyName}`} subtitle={`Pengajuan tanggal ${dateText}`} />
        <main className="p-6">
          <CompanyAnalysis companyId={companyName} date={dateText} />
        </main>
      </div>
    </div>
  )
}
