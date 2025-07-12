"use client"

import { Button } from "@/components/ui/button"
import { Bell, Search, User, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { slugToText, slugToDate } from "@/lib/utils"

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const pathname = usePathname()

  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean)
    const breadcrumbs = []

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i]
      const href = "/" + paths.slice(0, i + 1).join("/")
      const isLast = i === paths.length - 1

      let displayName = path

      // Format display name based on path type
      if (path === "analysis") {
        displayName = "Analysis"
      } else if (path === "dashboard") {
        displayName = "Dashboard"
      } else if (path === "applications") {
        displayName = "Applications"
      } else if (path === "chatbot") {
        displayName = "Chatbot"
      } else if (i === paths.length - 1 && paths[i - 1] === "analysis") {
        // This is a date slug
        displayName = slugToDate(path)
      } else if (i === paths.length - 2 && paths[i + 1] && paths[0] === "analysis") {
        // This is a company slug
        displayName = slugToText(path)
      } else {
        displayName = slugToText(path)
      }

      breadcrumbs.push({
        name: displayName,
        href,
        isLast,
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
            <Link href="/dashboard" className="hover:text-gray-700">
              Home
            </Link>
            {breadcrumbs.map((crumb) => (
              <div key={crumb.href} className="flex items-center space-x-2">
                <ChevronRight className="h-4 w-4" />
                {crumb.isLast ? (
                  <span className="text-gray-900 font-medium">{crumb.name}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-gray-700">
                    {crumb.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <h1 className="text-2xl font-semibold text-[#252525]">{title}</h1>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
