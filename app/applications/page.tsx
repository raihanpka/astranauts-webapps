import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import ApplicationsTable from "@/components/applications-table"

export default function ApplicationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="md:ml-64">
        <Header title="Semua Pengajuan" subtitle="Daftar lengkap pengajuan kredit" />
        <main className="p-6">
          <ApplicationsTable />
        </main>
      </div>
    </div>
  )
}
