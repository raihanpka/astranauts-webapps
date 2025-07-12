"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, MessageCircle, Database, Bell, HelpCircle, Menu, X } from "lucide-react"
import Image from "next/image"

const navigation = [
  {
    name: "Credit Overview",
    items: [
      { name: "TARA Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "TARA Chatbot", href: "/chatbot", icon: MessageCircle },
    ],
  },
  {
    name: "Internal System",
    items: [
      { name: "Semua Pengajuan", href: "/applications", icon: Database },
      { name: "Notification List", href: "/notifications", icon: Bell },
      { name: "Bantuan SATRIA", href: "/help", icon: HelpCircle },
    ],
  },
]

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-gray-100">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/logos/satria-main.png" alt="Satria Logo" width={120} height={40} className="h-10 w-auto" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-8">
            {navigation.map((section) => (
              <div key={section.name}>
                <h3 className="px-2 text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">{section.name}</h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-gradient-to-r from-[#0887A0] to-[#0EBC84] text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        )}
                      >
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User info */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#0887A0] to-[#0EBC84] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">GK</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Ghiffari Kenang S</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
