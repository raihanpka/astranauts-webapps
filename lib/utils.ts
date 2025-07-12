import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility untuk mengkonversi text ke slug
export function textToSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim()
}

// Utility untuk mengkonversi slug ke text yang proper
export function slugToText(slug: string): string {
  return slug
    .split("-")
    .map((word) => {
      // Handle special cases for company types
      const upperCaseWords = ["PT", "CV", "UD", "PD", "FIRMA", "FA", "TBK", "PERSERO"]
      const upperWord = word.toUpperCase()

      if (upperCaseWords.includes(upperWord)) {
        return upperWord
      }

      // Regular capitalization for other words
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(" ")
}

// Utility untuk format tanggal ke slug
export function dateToSlug(date: string): string {
  return date
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

// Utility untuk format slug tanggal ke text
export function slugToDate(slug: string): string {
  const parts = slug.split("-")
  if (parts.length >= 3) {
    const day = parts[0]
    const month = parts[1]
    const year = parts[2]

    const monthNames: { [key: string]: string } = {
      januari: "Januari",
      februari: "Februari",
      maret: "Maret",
      april: "April",
      mei: "Mei",
      juni: "Juni",
      juli: "Juli",
      agustus: "Agustus",
      september: "September",
      oktober: "Oktober",
      november: "November",
      desember: "Desember",
    }

    return `${day} ${monthNames[month] || month} ${year}`
  }
  return slug
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

// Generate synthetic data
export function generateSyntheticData() {
  return {
    fullName: "Budi Santoso",
    email: "budi.santoso@example.com",
    phone: "+62812345678901",
    position: "Direktur Utama",
    gender: "male" as const,
    operationalStability: "sangat-stabil" as const,
    complianceLevel: "selalu-patuh" as const,
    expansionPlans: "ya-strategi-jelas" as const,
    reputation: "sangat-baik" as const,
    financingPurpose: "Pembelian 10 unit excavator Caterpillar untuk ekspansi proyek konstruksi infrastruktur",
    amount: "5000000000",
    tenor: "48 bulan",
    financingType: "kredit-investasi",
    collateral: "10 unit excavator Caterpillar 320D tahun 2023 senilai Rp7.5 miliar",
    usagePlan:
      "60% pembelian excavator, 25% biaya operasional awal, 15% modal kerja untuk proyek konstruksi jalan dan jembatan",
  }
}
