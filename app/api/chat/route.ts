import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Context untuk TARA sebagai asisten analisis kredit
    const systemPrompt = `
    Anda adalah TARA, asisten AI untuk sistem analisis risiko kredit SATRIA. Anda membantu pengguna memahami:
    
    1. Analisis Risiko Kredit (M-Score, Altman Z-Score)
    2. Interpretasi Financial Metrics (DSRI, GMI, AQI, SGI, DEPI)
    3. Sentiment Analysis untuk monitoring eksternal
    4. Proses pengajuan kredit dan dokumentasi
    5. Cara menggunakan sistem SATRIA
    
    Berikan jawaban yang informatif, akurat, dan mudah dipahami dalam bahasa Indonesia.
    Fokus pada konteks finansial dan analisis kredit.
    
    Pertanyaan pengguna: ${message}
    `

    const result = await model.generateContent(systemPrompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat memproses permintaan" }, { status: 500 })
  }
}
