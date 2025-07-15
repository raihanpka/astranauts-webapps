import { type NextRequest, NextResponse } from "next/server"
import { getApplicationsServer, createApplicationServer } from "@/lib/firestore-operations"

export async function GET() {
  try {
    const applications = await getApplicationsServer()

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

    // Buat aplikasi baru di Firestore
    const application = await createApplicationServer({
      companyName: body.companyName,
      applicantName: body.applicantName || body.fullName,
      email: body.email,
      phone: body.phone,
      position: body.position,
      gender: body.gender,
      operationalStability: body.operationalStability,
      complianceLevel: body.complianceLevel,
      expansionPlans: body.expansionPlans,
      reputation: body.reputation,
      financingPurpose: body.financingPurpose,
      amount: typeof body.amount === "string" ? body.amount : Number(body.amount),
      tenor: body.tenor,
      financingType: body.financingType,
      collateral: body.collateral,
      usagePlan: body.usagePlan,
      status: "pending",
    })

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
