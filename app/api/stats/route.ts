import { NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET() {
  try {
    const stats = await db.getSystemStats()

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ success: false, error: "Gagal mengambil statistik sistem" }, { status: 500 })
  }
}
