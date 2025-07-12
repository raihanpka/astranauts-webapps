import Image from "next/image"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0887A0] via-[#0887A0] to-[#0EBC84] flex items-center justify-center">
      <div className="text-center text-white">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logos/satria-main.png"
            alt="Satria Logo"
            width={200}
            height={60}
            className="h-16 w-auto brightness-0 invert mx-auto"
          />
        </div>

        {/* Loading Animation */}
        <div className="mb-6">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-white" />
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-semibold mb-2">Memuat SATRIA</h2>
        <p className="text-white/80">Sedang mempersiapkan sistem analisis risiko kredit...</p>

        {/* Loading Progress Animation */}
        <div className="mt-8 max-w-xs mx-auto">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div className="bg-white h-full rounded-full animate-pulse" style={{ width: "60%" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
