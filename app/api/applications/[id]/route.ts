import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const application = await db.getApplicationById(params.id)

    if (!application) {
      return NextResponse.json({ success: false, error: "Aplikasi tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: application,
    })
  } catch (error) {
    console.error("Error fetching application:", error)
    return NextResponse.json({ success: false, error: "Gagal mengambil data aplikasi" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const application = await db.updateApplication(params.id, body)

    if (!application) {
      return NextResponse.json({ success: false, error: "Aplikasi tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: application,
      message: "Aplikasi berhasil diperbarui",
    })
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ success: false, error: "Gagal memperbarui aplikasi" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await db.deleteApplication(params.id)

    if (!success) {
      return NextResponse.json({ success: false, error: "Aplikasi tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Aplikasi berhasil dihapus",
    })
  } catch (error) {
    console.error("Error deleting application:", error)
    return NextResponse.json({ success: false, error: "Gagal menghapus aplikasi" }, { status: 500 })
  }
}
