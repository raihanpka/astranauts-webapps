import { z } from "zod"

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap minimal 2 karakter").max(100, "Nama terlalu panjang"),
  email: z.string().email("Format email tidak valid"),
  phone: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(15, "Nomor telepon maksimal 15 digit")
    .regex(/^(\+62|62|0)[0-9]{8,13}$/, "Format nomor telepon Indonesia tidak valid"),
  position: z.string().min(2, "Jabatan minimal 2 karakter"),
  gender: z.enum(["male", "female"], {
    required_error: "Pilih jenis kelamin",
  }),
})

export const assessmentSchema = z.object({
  operationalStability: z.enum(["sangat-stabil", "cukup-stabil", "tidak-stabil", "tidak-tahu"], {
    required_error: "Pilih tingkat stabilitas operasional",
  }),
  complianceLevel: z.enum(["selalu-patuh", "patuh-kadang-terlambat", "sering-terlambat", "tidak-tahu-2"], {
    required_error: "Pilih tingkat kepatuhan",
  }),
  expansionPlans: z.enum(["ya-strategi-jelas", "ya-tahap-awal", "tidak-ada-rencana", "tidak-tahu-3"], {
    required_error: "Pilih rencana ekspansi",
  }),
  reputation: z.enum(["sangat-baik", "baik-belum-terdokumentasi", "pernah-keluhan", "tidak-tahu-tidak-menilai"], {
    required_error: "Pilih reputasi perusahaan",
  }),
})

export const creditInfoSchema = z.object({
  financingPurpose: z.string().min(10, "Tujuan pembiayaan minimal 10 karakter"),
  amount: z.string().min(1, "Pilih jumlah dana yang diajukan"),
  tenor: z
    .string()
    .min(1, "Tenor harus diisi")
    .regex(/^\d+\s*(bulan|tahun)$/i, "Format tenor tidak valid (contoh: 36 bulan)"),
  financingType: z.string().min(1, "Pilih jenis pembiayaan"),
  collateral: z.string().min(5, "Jaminan minimal 5 karakter"),
  usagePlan: z.string().min(20, "Rencana penggunaan dana minimal 20 karakter"),
})

export const documentUploadSchema = z.object({
  balanceSheet: z.any().optional(),
  incomeStatement: z.any().optional(),
  cashFlowStatement: z.any().optional(),
  financialReport: z.any().optional(),
  collateralDocument: z.any().optional(),
})

export const companyProfileSchema = z.object({
  companyName: z.string().min(2, "Nama perusahaan minimal 2 karakter"),
  businessType: z.string().min(1, "Pilih jenis usaha"),
  establishedYear: z.string().min(4, "Tahun berdiri harus valid"),
  numberOfEmployees: z.string().min(1, "Pilih jumlah karyawan"),
  monthlyRevenue: z.string().min(1, "Pilih estimasi pendapatan bulanan"),
  businessLocation: z.string().min(5, "Lokasi usaha minimal 5 karakter"),
  businessDescription: z.string().min(20, "Deskripsi usaha minimal 20 karakter"),
})

export type PersonalInfoForm = z.infer<typeof personalInfoSchema>
export type AssessmentForm = z.infer<typeof assessmentSchema>
export type CreditInfoForm = z.infer<typeof creditInfoSchema>
export type DocumentUploadForm = z.infer<typeof documentUploadSchema>
export type CompanyProfileForm = z.infer<typeof companyProfileSchema>
