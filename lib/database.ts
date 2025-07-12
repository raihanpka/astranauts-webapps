// Simple in-memory database untuk development
// Dalam production, gunakan database seperti PostgreSQL, MySQL, atau SQLite

export interface Application {
  id: string
  companyName: string
  applicantName: string
  email: string
  phone: string
  position: string
  gender: "male" | "female"

  // Assessment data
  operationalStability: string
  complianceLevel: string
  expansionPlans: string
  reputation: string

  // Credit information
  financingPurpose: string
  amount: number
  tenor: string
  financingType: string
  collateral: string
  usagePlan: string

  // System data
  status: "pending" | "approved" | "rejected" | "processing"
  createdAt: Date
  updatedAt: Date
  processedAt?: Date

  // Analysis results
  riskScore?: number
  riskLevel?: "low" | "medium" | "high"
  confidenceRate?: number

  // File references
  documentUrls?: string[]
}

export interface SystemStats {
  totalApplications: number
  successfulApplications: number
  errorRate: number
  averageProcessingTime: number
  lastUpdated: Date
}

// In-memory storage (untuk development)
const applications: Application[] = []
let systemStats: SystemStats = {
  totalApplications: 140,
  successfulApplications: 126,
  errorRate: 10,
  averageProcessingTime: 5,
  lastUpdated: new Date(),
}

// Database operations
export const db = {
  // Applications
  async createApplication(data: Omit<Application, "id" | "createdAt" | "updatedAt">): Promise<Application> {
    const application: Application = {
      ...data,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "pending",
    }

    applications.push(application)

    // Update stats
    systemStats.totalApplications++
    systemStats.lastUpdated = new Date()

    return application
  },

  async getApplications(): Promise<Application[]> {
    return applications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  async getApplicationById(id: string): Promise<Application | null> {
    return applications.find((app) => app.id === id) || null
  },

  async updateApplication(id: string, data: Partial<Application>): Promise<Application | null> {
    const index = applications.findIndex((app) => app.id === id)
    if (index === -1) return null

    applications[index] = {
      ...applications[index],
      ...data,
      updatedAt: new Date(),
    }

    return applications[index]
  },

  async deleteApplication(id: string): Promise<boolean> {
    const index = applications.findIndex((app) => app.id === id)
    if (index === -1) return false

    applications.splice(index, 1)
    systemStats.totalApplications--
    systemStats.lastUpdated = new Date()

    return true
  },

  // System Stats
  async getSystemStats(): Promise<SystemStats> {
    return systemStats
  },

  async updateSystemStats(data: Partial<SystemStats>): Promise<SystemStats> {
    systemStats = {
      ...systemStats,
      ...data,
      lastUpdated: new Date(),
    }
    return systemStats
  },
}

// Helper function untuk generate ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Seed data untuk development
export function seedDatabase() {
  if (applications.length === 0) {
    const sampleApplications: Omit<Application, "id" | "createdAt" | "updatedAt">[] = [
      {
        companyName: "PT Andalan Niaga",
        applicantName: "Budi Santoso",
        email: "budi@andalanniaga.com",
        phone: "+6281234567890",
        position: "Direktur Utama",
        gender: "male",
        operationalStability: "sangat-stabil",
        complianceLevel: "selalu-patuh",
        expansionPlans: "ya-strategi-jelas",
        reputation: "sangat-baik",
        financingPurpose: "Ekspansi usaha dan pembelian peralatan baru",
        amount: 2500000000,
        tenor: "36 bulan",
        financingType: "kredit-investasi",
        collateral: "Properti komersial senilai Rp 4 miliar",
        usagePlan: "70% pembelian peralatan, 30% modal kerja",
        status: "approved",
        riskLevel: "medium",
        riskScore: 75,
      },
      {
        companyName: "CV Sukses Bersama",
        applicantName: "Siti Nurhaliza",
        email: "siti@suksesbersama.com",
        phone: "+6281234567891",
        position: "Direktur",
        gender: "female",
        operationalStability: "sangat-stabil",
        complianceLevel: "selalu-patuh",
        expansionPlans: "ya-strategi-jelas",
        reputation: "sangat-baik",
        financingPurpose: "Pembelian mesin produksi baru",
        amount: 1000000000,
        tenor: "24 bulan",
        financingType: "kredit-investasi",
        collateral: "Mesin produksi existing senilai Rp 1.5 miliar",
        usagePlan: "80% pembelian mesin, 20% modal kerja",
        status: "approved",
        riskLevel: "low",
        riskScore: 85,
      },
    ]

    sampleApplications.forEach((app) => {
      db.createApplication(app)
    })
  }
}
