import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  let requestData: { message: string; context?: any }
  
  try {
    requestData = await request.json()
    const { message, context } = requestData

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 })
    }

    // Try different model names in order of preference
    const modelNames = ["gemini-1.5-flash", "gemini-1.5-pro", "models/gemini-1.5-flash", "models/gemini-1.5-pro"]
    
    for (let i = 0; i < modelNames.length; i++) {
      try {
        const modelName = modelNames[i]
        console.log(`Trying model: ${modelName}`)
        
        const model = genAI.getGenerativeModel({ model: modelName })

        // Context untuk TARA sebagai asisten analisis kredit
        const systemPrompt = `
        Anda adalah TARA, asisten AI khusus untuk sistem analisis risiko kredit SATRIA milik PT SANF. Tugas Anda adalah membantu admin memahami dan menggunakan fitur-fitur SATRIA secara optimal, termasuk:

        1. Analisis Risiko Kredit (misal: M-Score, Altman Z-Score) — jelaskan konsep, interpretasi hasil, dan relevansi untuk penilaian kredit.
        2. Interpretasi Financial Metrics (DSRI, GMI, AQI, SGI, DEPI) — uraikan arti setiap metrik, cara membaca, dan dampaknya terhadap keputusan kredit.
        3. Sentiment Analysis — bantu monitoring eksternal dengan penjelasan hasil analisis sentimen dan rekomendasi tindak lanjut.
        4. Proses Pengajuan Kredit & Dokumentasi — pandu langkah-langkah pengajuan, dokumen yang dibutuhkan, serta tips agar proses berjalan lancar.
        5. Penggunaan Sistem SATRIA — berikan tutorial, solusi atas kendala teknis, dan tips agar admin dapat memanfaatkan sistem secara efisien.

        Jawaban Anda harus informatif, akurat, dan mudah dipahami dalam bahasa Indonesia. Selalu fokus pada konteks finansial dan analisis kredit, serta gunakan bahasa profesional yang ramah.

        Pertanyaan pengguna: ${message}
        `

        const result = await model.generateContent(systemPrompt)
        const response = await result.response
        const text = response.text()

        return NextResponse.json({ response: text })
      } catch (modelError) {
        console.error(`Model ${modelNames[i]} failed:`, modelError)
        
        // If this is the last model to try, throw the error
        if (i === modelNames.length - 1) {
          throw modelError
        }
        // Otherwise, continue to next model
        continue
      }
    }
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ 
      error: "Terjadi kesalahan saat memproses permintaan. Pastikan model Gemini tersedia." 
    }, { status: 500 })
  }
}

// Test endpoint to list available models
export async function GET() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 })
    }

    // Try to get model info
    const testModels = ["gemini-1.5-flash", "gemini-1.5-pro", "models/gemini-1.5-flash", "models/gemini-1.5-pro"]
    const results = []

    for (const modelName of testModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent("Hello")
        results.push({ model: modelName, status: "working" })
      } catch (error) {
        results.push({ 
          model: modelName, 
          status: "failed", 
          error: error instanceof Error ? error.message : "Unknown error" 
        })
      }
    }

    return NextResponse.json({ models: results })
  } catch (error) {
    return NextResponse.json({ error: "Failed to test models" }, { status: 500 })
  }
}
