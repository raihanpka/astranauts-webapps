"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function LandingHeader() {
  const pathname = usePathname()

  const navItems = [
    { name: "Beranda", href: "/" },
    { name: "Tentang Kami", href: "/about" },
    { name: "Produk", href: "/products" },
    { name: "Team", href: "/team" },
  ]

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logos/satria-main.png" alt="Satria Logo" width={120} height={40} className="h-8 w-auto" />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[#0887A0]",
                pathname === item.href ? "text-[#0887A0]" : "text-gray-600",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <Link href="/form">
          <Button className="bg-[#0EBC84] hover:bg-[#0EBC84]/90 text-white px-6 py-2 rounded-full font-medium">
            Mulai Sekarang
          </Button>
        </Link>
      </div>
    </header>
  )
}
