// Text and slug templates for consistent formatting
export interface TextTemplate {
  id: string
  template: string
  variables: string[]
  category: "notification" | "email" | "sms" | "ui" | "error"
}

// Predefined text templates
export const TEXT_TEMPLATES: Record<string, TextTemplate> = {
  // Notification templates
  APPLICATION_SUBMITTED: {
    id: "application_submitted",
    template: "Pengajuan kredit untuk {companyName} telah berhasil disubmit pada {date}",
    variables: ["companyName", "date"],
    category: "notification",
  },

  ANALYSIS_COMPLETED: {
    id: "analysis_completed",
    template: "Analisis risiko kredit untuk {companyName} telah selesai dengan skor risiko {riskScore}",
    variables: ["companyName", "riskScore"],
    category: "notification",
  },

  // Error templates
  VALIDATION_ERROR: {
    id: "validation_error",
    template: "Validasi gagal pada field {fieldName}: {errorMessage}",
    variables: ["fieldName", "errorMessage"],
    category: "error",
  },

  API_ERROR: {
    id: "api_error",
    template: "Terjadi kesalahan pada {endpoint}: {errorMessage}",
    variables: ["endpoint", "errorMessage"],
    category: "error",
  },

  // UI templates
  LOADING_MESSAGE: {
    id: "loading_message",
    template: "Sedang memproses {action}...",
    variables: ["action"],
    category: "ui",
  },
}

// Template processor
export class TextProcessor {
  static process(templateId: string, variables: Record<string, string>): string {
    const template = TEXT_TEMPLATES[templateId]
    if (!template) {
      console.warn(`Template ${templateId} not found`)
      return templateId
    }

    let result = template.template
    template.variables.forEach((variable) => {
      const value = variables[variable] || `{${variable}}`
      result = result.replace(new RegExp(`{${variable}}`, "g"), value)
    })

    return result
  }

  static addTemplate(template: TextTemplate): void {
    TEXT_TEMPLATES[template.id] = template
  }

  static getTemplate(templateId: string): TextTemplate | undefined {
    return TEXT_TEMPLATES[templateId]
  }
}

// Slug utilities (enhanced from previous version)
export class SlugProcessor {
  private static readonly COMPANY_PREFIXES = ["PT", "CV", "UD", "PD", "FIRMA", "FA", "TBK", "PERSERO"]
  private static readonly MONTH_NAMES: Record<string, string> = {
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

  static textToSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  static slugToText(slug: string): string {
    return slug
      .split("-")
      .map((word) => {
        const upperWord = word.toUpperCase()
        return this.COMPANY_PREFIXES.includes(upperWord) ? upperWord : word.charAt(0).toUpperCase() + word.slice(1)
      })
      .join(" ")
  }

  static dateToSlug(date: string): string {
    return date
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  }

  static slugToDate(slug: string): string {
    const parts = slug.split("-")
    if (parts.length >= 3) {
      const [day, month, year] = parts
      return `${day} ${this.MONTH_NAMES[month] || month} ${year}`
    }
    return slug
  }
}
