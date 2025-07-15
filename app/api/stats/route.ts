import { NextResponse } from "next/server"
import { serverDb } from "@/lib/firestore-operations"

export async function GET() {
  try {
    const stats = await serverDb.getSystemStats()

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ success: false, error: "Gagal mengambil statistik sistem" }, { status: 500 })
  }
}
