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
    console.log('📥 Starting application submission...')
    
    const formData = await request.formData()
    const applicationDataStr = formData.get('applicationData') as string
    
    if (!applicationDataStr) {
      console.error('❌ Missing applicationData in request')
      return NextResponse.json({ success: false, error: "Application data is required" }, { status: 400 })
    }

    const applicationData = JSON.parse(applicationDataStr)
    console.log('📋 Parsed application data:', {
      companyName: applicationData.companyName,
      applicantName: applicationData.applicantName,
      email: applicationData.email,
      amount: applicationData.amount
    })

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
      if (!applicationData[field]) {
        return NextResponse.json({ success: false, error: `Field ${field} wajib diisi` }, { status: 400 })
      }
    }

    // Handle file uploads (optional - you can implement file storage later)
    const files = {
      balanceSheet: formData.get('balanceSheet') as File | null,
      incomeStatement: formData.get('incomeStatement') as File | null,
      cashFlowStatement: formData.get('cashFlowStatement') as File | null,
      financialReport: formData.get('financialReport') as File | null,
      collateralDocument: formData.get('collateralDocument') as File | null,
    }

    // Handle extracted financial data
    const financialDataStr = formData.get('financialData') as string | null
    let extractedFinancialData = null
    if (financialDataStr) {
      try {
        extractedFinancialData = JSON.parse(financialDataStr)
        console.log('📊 Parsed financial data for storage:', extractedFinancialData)
      } catch (error) {
        console.error('❌ Error parsing financial data:', error)
      }
    }

    // For now, we'll store file names in the database
    // Later you can implement actual file storage (like Cloudflare R2)
    const documentMetadata = {
      balanceSheetName: files.balanceSheet?.name || null,
      incomeStatementName: files.incomeStatement?.name || null,
      cashFlowStatementName: files.cashFlowStatement?.name || null,
      financialReportName: files.financialReport?.name || null,
      collateralDocumentName: files.collateralDocument?.name || null,
    }

    // Buat aplikasi baru di Firestore
    const application = await createApplicationServer({
      companyName: applicationData.companyName,
      applicantName: applicationData.applicantName,
      email: applicationData.email,
      phone: applicationData.phone,
      position: applicationData.position,
      gender: applicationData.gender,
      businessType: applicationData.businessType,
      establishedYear: applicationData.establishedYear,
      numberOfEmployees: applicationData.numberOfEmployees,
      monthlyRevenue: applicationData.monthlyRevenue,
      businessLocation: applicationData.businessLocation,
      businessDescription: applicationData.businessDescription,
      operationalStability: applicationData.operationalStability,
      complianceLevel: applicationData.complianceLevel,
      expansionPlans: applicationData.expansionPlans,
      reputation: applicationData.reputation,
      financingPurpose: applicationData.financingPurpose,
      amount: typeof applicationData.amount === "string" ? applicationData.amount : Number(applicationData.amount),
      tenor: applicationData.tenor,
      financingType: applicationData.financingType,
      collateral: applicationData.collateral,
      usagePlan: applicationData.usagePlan,
      ...documentMetadata,
      // Include extracted financial data
      extractedFinancialData: extractedFinancialData,
      status: "pending",
    })

    console.log('✅ Application created successfully:', {
      id: application.id,
      companyName: application.companyName,
      hasFinancialData: !!extractedFinancialData,
      financialDataKeys: extractedFinancialData ? Object.keys(extractedFinancialData) : [],
      createdAt: application.createdAt
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
