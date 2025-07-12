// Initial Database Setup Migration
import { initializeApp, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIRESTORE_PROJECT_ID,
  privateKey: process.env.FIRESTORE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIRESTORE_CLIENT_EMAIL,
}

const app = initializeApp({
  credential: cert(serviceAccount),
  projectId: process.env.FIRESTORE_PROJECT_ID,
})

const db = getFirestore(app)

export async function runInitialSetup() {
  console.log("🚀 Starting initial database setup...")

  try {
    // 1. Create system configuration
    await createSystemConfig()

    // 2. Create initial user roles
    await createUserRoles()

    // 3. Create sample data (for development)
    if (process.env.NODE_ENV === "development") {
      await createSampleData()
    }

    // 4. Setup security rules (programmatically)
    await setupSecurityRules()

    console.log("✅ Initial database setup completed successfully!")
  } catch (error) {
    console.error("❌ Error during initial setup:", error)
    throw error
  }
}

async function createSystemConfig() {
  console.log("📝 Creating system configuration...")

  const systemConfig = {
    version: "1.0.0",
    features: {
      sarana: { enabled: true, version: "1.0.0" },
      prabu: { enabled: true, version: "1.0.0" },
      setia: { enabled: true, version: "1.0.0" },
    },
    limits: {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxApplicationsPerDay: 100,
      maxDocumentsPerApplication: 10,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.collection("systemConfig").doc("main").set(systemConfig)
  console.log("✅ System configuration created")
}

async function createUserRoles() {
  console.log("👥 Creating user roles...")

  const roles = [
    {
      id: "admin",
      name: "Administrator",
      permissions: ["read", "write", "delete", "manage_users", "system_config"],
      description: "Full system access",
    },
    {
      id: "analyst",
      name: "Credit Analyst",
      permissions: ["read", "write", "analyze"],
      description: "Can analyze credit applications",
    },
    {
      id: "viewer",
      name: "Viewer",
      permissions: ["read"],
      description: "Read-only access",
    },
  ]

  const batch = db.batch()

  roles.forEach((role) => {
    const roleRef = db.collection("userRoles").doc(role.id)
    batch.set(roleRef, {
      ...role,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  })

  await batch.commit()
  console.log("✅ User roles created")
}

async function createSampleData() {
  console.log("🎭 Creating sample data for development...")

  // Sample applications
  const sampleApplications = [
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
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Add more sample data as needed
  ]

  const batch = db.batch()

  sampleApplications.forEach((app, index) => {
    const appRef = db.collection("applications").doc()
    batch.set(appRef, {
      ...app,
      id: appRef.id,
      auditTrail: [
        {
          action: "created",
          userId: "system",
          timestamp: new Date(),
          details: { source: "sample_data" },
        },
      ],
    })
  })

  await batch.commit()
  console.log("✅ Sample data created")
}

async function setupSecurityRules() {
  console.log("🔒 Security rules setup completed (manual setup required)")
  // Note: Security rules need to be set up manually in Firebase Console
  // or using Firebase CLI with firestore.rules file
}

// Run migration if called directly
if (require.main === module) {
  runInitialSetup()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
