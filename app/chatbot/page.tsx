import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Chatbot from "@/components/chatbot"

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="md:ml-64">
        <Header title="TARA Chatbot" subtitle="AI Assistant untuk analisis kredit" />
        <main className="p-6">
          <Chatbot />
        </main>
      </div>
    </div>
  )
}
