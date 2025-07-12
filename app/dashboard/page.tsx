import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import OverviewDashboard from "@/components/overview-dashboard"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="md:ml-64">
        <Header title="Dashboard SATRIA" subtitle="Overview sistem analisis risiko kredit" />
        <main className="p-6">
          <OverviewDashboard />
        </main>
      </div>
    </div>
  )
}
