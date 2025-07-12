import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET() {
  try {
    const applications = await db.getApplications()

    return NextResponse.json({
      success: true,
      data: applications,
    })
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ success: false, error: "Gagal mengambil data aplikasi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validasi data yang diperlukan
    const requiredFields = [
      "companyName",
      "applicantName",
      "email",
      "phone",
      "position",
      "gender",
      "operationalStability",
      "complianceLevel",
      "expansionPlans",
      "reputation",
      "financingPurpose",
      "amount",
      "tenor",
      "financingType",
      "collateral",
      "usagePlan",
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Field ${field} wajib diisi` }, { status: 400 })
      }
    }

    // Buat aplikasi baru
    const application = await db.createApplication(body)

    // Simulasi proses analisis (dalam production, ini akan memanggil AI services)
    setTimeout(async () => {
      const analysisResults = {
        riskScore: Math.random() * 100,
        riskLevel: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
        confidenceRate: 75 + Math.random() * 20,
        status: "approved" as const,
        processedAt: new Date(),
      }

      await db.updateApplication(application.id, analysisResults)
    }, 2000)

    return NextResponse.json({
      success: true,
      data: application,
      message: "Aplikasi berhasil disimpan dan sedang diproses",
    })
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json({ success: false, error: "Gagal menyimpan aplikasi" }, { status: 500 })
  }
}
