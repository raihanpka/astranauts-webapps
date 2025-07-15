"use client"

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
} from "firebase/firestore"
import { db } from "./firebase"
import type { CreditApplication, DocumentMetadata } from "./types"

// Client-side Firestore operations (safe for browser)
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
  async addDocument(data: Omit<DocumentMetadata, "id" | "uploadedAt">): Promise<DocumentMetadata> {
    try {
      const docRef = await addDoc(collection(db, "documents"), {
        ...data,
        uploadedAt: serverTimestamp(),
        validationStatus: "pending",
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
