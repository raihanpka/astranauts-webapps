import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"
import { adminDb } from "./firebase-admin"
import { Timestamp as AdminTimestamp } from "firebase-admin/firestore"
import type { CreditApplication, SystemStats, DocumentMetadata } from "./types"

// Client-side Firestore operations
export const clientDb = {
  // Applications
  async createApplication(data: Omit<CreditApplication, "id" | "createdAt" | "updatedAt">): Promise<CreditApplication> {
    try {
      const docRef = await addDoc(collection(db, "applications"), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "pending",
      })

      const docSnap = await getDoc(docRef)
      return {
        id: docRef.id,
        ...docSnap.data(),
        createdAt: docSnap.data()?.createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data()?.updatedAt?.toDate() || new Date(),
      } as CreditApplication
    } catch (error) {
      console.error("Error creating application:", error)
      throw error
    }
  },

  async getApplications(): Promise<CreditApplication[]> {
    try {
      const q = query(collection(db, "applications"), orderBy("createdAt", "desc"), limit(100))
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as CreditApplication[]
    } catch (error) {
      console.error("Error fetching applications:", error)
      return []
    }
  },

  async getApplicationById(id: string): Promise<CreditApplication | null> {
    try {
      const docRef = doc(db, "applications", id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
        } as CreditApplication
      }

      return null
    } catch (error) {
      console.error("Error fetching application:", error)
      return null
    }
  },

  async updateApplication(id: string, data: Partial<CreditApplication>): Promise<CreditApplication | null> {
    try {
      const docRef = doc(db, "applications", id)
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      })

      return this.getApplicationById(id)
    } catch (error) {
      console.error("Error updating application:", error)
      return null
    }
  },

  async deleteApplication(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, "applications", id)
      await deleteDoc(docRef)
      return true
    } catch (error) {
      console.error("Error deleting application:", error)
      return false
    }
  },

  // Documents
  async createDocument(data: Omit<DocumentMetadata, "id" | "uploadedAt">): Promise<DocumentMetadata> {
    try {
      const docRef = await addDoc(collection(db, "documents"), {
        ...data,
        uploadedAt: serverTimestamp(),
      })

      const docSnap = await getDoc(docRef)
      return {
        id: docRef.id,
        ...docSnap.data(),
        uploadedAt: docSnap.data()?.uploadedAt?.toDate() || new Date(),
      } as DocumentMetadata
    } catch (error) {
      console.error("Error creating document:", error)
      throw error
    }
  },

  async getDocumentsByApplicationId(applicationId: string): Promise<DocumentMetadata[]> {
    try {
      const q = query(
        collection(db, "documents"),
        where("applicationId", "==", applicationId),
        orderBy("uploadedAt", "desc"),
      )
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate() || new Date(),
      })) as DocumentMetadata[]
    } catch (error) {
      console.error("Error fetching documents:", error)
      return []
    }
  },

  // Real-time listeners
  subscribeToApplications(callback: (applications: CreditApplication[]) => void) {
    const q = query(collection(db, "applications"), orderBy("createdAt", "desc"), limit(100))

    return onSnapshot(q, (querySnapshot) => {
      const applications = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as CreditApplication[]

      callback(applications)
    })
  },
}

// Server-side Firestore operations (for API routes)
export async function createApplicationServer(
  data: Omit<CreditApplication, "id" | "createdAt" | "updatedAt">,
): Promise<CreditApplication> {
  try {
    const docRef = adminDb.collection("applications").doc()
    const now = AdminTimestamp.now()

    const applicationData = {
      ...data,
      createdAt: now,
      updatedAt: now,
      status: "pending" as const,
    }

    await docRef.set(applicationData)

    return {
      id: docRef.id,
      ...applicationData,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    } as CreditApplication
  } catch (error) {
    console.error("Error creating application:", error)
    throw error
  }
}

export async function getApplicationsServer(): Promise<CreditApplication[]> {
  try {
    const snapshot = await adminDb.collection("applications").orderBy("createdAt", "desc").limit(100).get()

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as CreditApplication[]
  } catch (error) {
    console.error("Error fetching applications:", error)
    return []
  }
}

export async function getApplicationByIdServer(id: string): Promise<CreditApplication | null> {
  try {
    const doc = await adminDb.collection("applications").doc(id).get()

    if (doc.exists) {
      const data = doc.data()!
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as CreditApplication
    }

    return null
  } catch (error) {
    console.error("Error fetching application:", error)
    return null
  }
}

export const serverDb = {
  async createApplication(data: Omit<CreditApplication, "id" | "createdAt" | "updatedAt">): Promise<CreditApplication> {
    try {
      const docRef = adminDb.collection("applications").doc()
      const now = AdminTimestamp.now()

      const applicationData = {
        ...data,
        createdAt: now,
        updatedAt: now,
        status: "pending" as const,
      }

      await docRef.set(applicationData)

      return {
        id: docRef.id,
        ...applicationData,
        createdAt: now.toDate(),
        updatedAt: now.toDate(),
      } as CreditApplication
    } catch (error) {
      console.error("Error creating application:", error)
      throw error
    }
  },

  async getApplications(): Promise<CreditApplication[]> {
    try {
      const snapshot = await adminDb.collection("applications").orderBy("createdAt", "desc").limit(100).get()

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as CreditApplication[]
    } catch (error) {
      console.error("Error fetching applications:", error)
      return []
    }
  },

  async getApplicationById(id: string): Promise<CreditApplication | null> {
    try {
      const doc = await adminDb.collection("applications").doc(id).get()

      if (doc.exists) {
        const data = doc.data()!
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as CreditApplication
      }

      return null
    } catch (error) {
      console.error("Error fetching application:", error)
      return null
    }
  },

  async updateApplication(id: string, data: Partial<CreditApplication>): Promise<CreditApplication | null> {
    try {
      const docRef = adminDb.collection("applications").doc(id)
      await docRef.update({
        ...data,
        updatedAt: AdminTimestamp.now(),
      })

      return this.getApplicationById(id)
    } catch (error) {
      console.error("Error updating application:", error)
      return null
    }
  },

  async deleteApplication(id: string): Promise<boolean> {
    try {
      await adminDb.collection("applications").doc(id).delete()
      return true
    } catch (error) {
      console.error("Error deleting application:", error)
      return false
    }
  },

  // System Stats
  async getSystemStats(): Promise<SystemStats> {
    try {
      const applicationsSnapshot = await adminDb.collection("applications").get()
      const applications = applicationsSnapshot.docs.map((doc) => doc.data())

      const totalApplications = applications.length
      const successfulApplications = applications.filter((app) => app.status === "approved").length
      const errorRate = (applications.filter((app) => app.status === "rejected").length / totalApplications) * 100

      return {
        id: "main",
        date: new Date().toISOString().split("T")[0],
        totalApplications,
        successfulApplications,
        errorRate: Math.round(errorRate),
        averageProcessingTime: 5, // Mock data
        updatedAt: new Date(),
      }
    } catch (error) {
      console.error("Error fetching system stats:", error)
      return {
        id: "main",
        date: new Date().toISOString().split("T")[0],
        totalApplications: 0,
        successfulApplications: 0,
        errorRate: 0,
        averageProcessingTime: 0,
        updatedAt: new Date(),
      }
    }
  },

  // Documents
  async createDocument(data: Omit<DocumentMetadata, "id" | "uploadedAt">): Promise<DocumentMetadata> {
    try {
      const docRef = adminDb.collection("documents").doc()
      const now = AdminTimestamp.now()

      const documentData = {
        ...data,
        uploadedAt: now,
      }

      await docRef.set(documentData)

      return {
        id: docRef.id,
        ...documentData,
        uploadedAt: now.toDate(),
      } as DocumentMetadata
    } catch (error) {
      console.error("Error creating document:", error)
      throw error
    }
  },
}
