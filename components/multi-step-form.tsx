"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  personalInfoSchema,
  companyProfileSchema,
  assessmentSchema,
  creditInfoSchema,
  documentUploadSchema,
  type PersonalInfoForm,
  type CompanyProfileForm,
  type AssessmentForm,
  type CreditInfoForm,
  type DocumentUploadForm,
} from "@/lib/form-schema"
import { generateSyntheticData } from "@/lib/utils"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"
import { FinancialDataDisplay } from "@/components/financial-data-display"

const steps = [
  {
    id: 1,
    title: "Identitas yang Terverifikasi, Kepercayaan yang Terbangun",
    subtitle:
      "SATRIA memulai proses analisis dengan memastikan kejelasan identitas perwakilan perusahaan. Data Anda aman, dan digunakan hanya untuk keperluan verifikasi kredit secara transparan.",
    formTitle: "Informasi Pribadi",
    formSubtitle: "Informasi kontak dan identitas",
  },
  {
    id: 2,
    title: "Profil Perusahaan yang Komprehensif",
    subtitle: "Memahami latar belakang dan profil perusahaan Anda untuk analisis yang lebih akurat.",
    formTitle: "Company Profile",
    formSubtitle: "Informasi dasar perusahaan",
  },
  {
    id: 3,
    title: "Menyesuaikan Pembiayaan Berdasar Kebutuhan Nyata",
    subtitle:
      "SATRIA memahami bahwa setiap perusahaan memiliki kebutuhan pembiayaan yang unik. Dengan mengumpulkan data secara terstruktur sejak awal, sistem kami dapat mencocokkan skema pembiayaan yang tepat dengan profil risiko yang relevan.",
    formTitle: "Informasi Kredit",
    formSubtitle: "Detail kebutuhan pembiayaan",
  },
  {
    id: 4,
    title: "Dari Dokumen Ke Data, Otomatis & Akurat",
    subtitle: "SATRIA mengekstraksi informasi penting dari dokumen keuangan membantu mempercepat proses analisis risiko, memastikan keputusan kredit dibuat berdasarkan data aktual, bukan asumsi.",
    formTitle: "Upload Dokumen",
    formSubtitle: "Format yang diterima: PDF, JPG, PNG, XLSX. Maks. ukuran file: 15MB per dokumen.",
  },
  {
    id: 5,
    title: "Menilai Lebih dari Sekadar Angka",
    subtitle: "Jawaban Anda akan membantu memperkuat Penilaian pengajuan kredit secara lebih menyeluruh.",
    formTitle: "Asesmen Survei",
    formSubtitle: "Pilih salah satu jawaban yang paling sesuai",
  },
]

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [financialData, setFinancialData] = useState<Record<string, any>>({})
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'idle' | 'uploading' | 'success' | 'error'>>({})

  // Form instances for each step
  const personalForm = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      position: "",
      gender: undefined,
    },
  })

  const companyForm = useForm<CompanyProfileForm>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      companyName: "",
      businessType: "",
      establishedYear: "",
      numberOfEmployees: "",
      monthlyRevenue: "",
      businessLocation: "",
      businessDescription: "",
    },
  })

  const creditForm = useForm<CreditInfoForm>({
    resolver: zodResolver(creditInfoSchema),
    defaultValues: {
      financingPurpose: "",
      amount: "",
      tenor: "",
      financingType: "",
      collateral: "",
      usagePlan: "",
    },
  })

  const documentForm = useForm<DocumentUploadForm>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      balanceSheet: undefined,
      incomeStatement: undefined,
      cashFlowStatement: undefined,
      financialReport: undefined,
      collateralDocument: undefined,
    },
  })

  const assessmentForm = useForm<AssessmentForm>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      operationalStability: undefined,
      complianceLevel: undefined,
      expansionPlans: undefined,
      reputation: undefined,
    },
  })

  const getCurrentForm = () => {
    switch (currentStep) {
      case 1:
        return personalForm
      case 2:
        return companyForm
      case 3:
        return creditForm
      case 4:
        return documentForm
      case 5:
        return assessmentForm
      default:
        return personalForm
    }
  }

  // Synthetic data generators
  const generatePersonalData = () => {
    const people = [
      {
        fullName: "Ahmad Syahril Ramadhan",
        email: "ahmad.syahril@mitratekno.co.id",
        phone: "081234567890",
        position: "Chief Executive Officer",
        gender: "male" as const
      },
      {
        fullName: "Siti Nurhaliza Putri",
        email: "siti.nurhaliza@sinarlogistik.com",
        phone: "082345678901",
        position: "Managing Director",
        gender: "female" as const
      },
      {
        fullName: "Budi Santoso Wijaya",
        email: "budi.santoso@berkahmandiri.co.id",
        phone: "083456789012",
        position: "General Manager",
        gender: "male" as const
      },
      {
        fullName: "Maya Indira Sari",
        email: "maya.indira@cahayakonstruksi.com",
        phone: "084567890123",
        position: "Chief Operating Officer",
        gender: "female" as const
      },
      {
        fullName: "Rizki Maulana Yusuf",
        email: "rizki.maulana@sejahtera-agro.id",
        phone: "085678901234",
        position: "Direktur Utama",
        gender: "male" as const
      }
    ]
    
    const randomPerson = people[Math.floor(Math.random() * people.length)]
    personalForm.setValue("fullName", randomPerson.fullName)
    personalForm.setValue("email", randomPerson.email)
    personalForm.setValue("phone", randomPerson.phone)
    personalForm.setValue("position", randomPerson.position)
    personalForm.setValue("gender", randomPerson.gender)
    
    toast.success("Data simulasi personal berhasil diisi!")
  }

  const generateCompanyData = () => {
    const companies = [
      {
        companyName: "PT. Mitra Teknologi Nusantara",
        businessType: "technology",
        establishedYear: "2019",
        numberOfEmployees: "51-200",
        monthlyRevenue: "500jt-1m",
        businessLocation: "Jl. Gatot Subroto No. 45, Jakarta Selatan, DKI Jakarta 12930",
        businessDescription: "Perusahaan pengembangan perangkat lunak yang fokus pada solusi digitalisasi untuk UKM dan korporasi. Kami menyediakan sistem manajemen bisnis, aplikasi mobile, dan layanan cloud computing dengan teknologi terdepan untuk meningkatkan efisiensi operasional klien."
      },
      {
        companyName: "PT. Sinar Bahagia Logistik",
        businessType: "logistics",
        establishedYear: "2017",
        numberOfEmployees: "201-500",
        monthlyRevenue: "1-5m",
        businessLocation: "Jl. Raya Bekasi Km. 23, Bekasi Timur, Jawa Barat 17113",
        businessDescription: "Perusahaan jasa logistik dan distribusi yang melayani pengiriman domestik dan ekspor-impor. Memiliki armada lengkap dan gudang strategis di berbagai kota besar, dengan fokus pada layanan cepat, aman, dan terpercaya untuk e-commerce dan industri manufaktur."
      },
      {
        companyName: "PT. Berkah Mandiri Trading",
        businessType: "trading",
        establishedYear: "2015",
        numberOfEmployees: "11-50",
        monthlyRevenue: "100-500jt",
        businessLocation: "Jl. Malioboro No. 156, Yogyakarta, DIY 55271",
        businessDescription: "Perusahaan perdagangan yang bergerak di bidang distribusi produk elektronik, peralatan rumah tangga, dan aksesoris gadget. Melayani retail modern, toko tradisional, dan penjualan online dengan jaringan supplier terpercaya di Asia."
      },
      {
        companyName: "PT. Cahaya Konstruksi Prima",
        businessType: "construction",
        establishedYear: "2020",
        numberOfEmployees: "51-200",
        monthlyRevenue: "500jt-1m",
        businessLocation: "Jl. Ahmad Yani No. 88, Surabaya, Jawa Timur 60234",
        businessDescription: "Kontraktor konstruksi yang mengkhususkan diri pada pembangunan gedung komersial, perumahan, dan infrastruktur. Memiliki tim profesional bersertifikat dan peralatan modern untuk mengerjakan proyek skala menengah hingga besar dengan standar kualitas tinggi."
      },
      {
        companyName: "PT. Sejahtera Agro Makmur",
        businessType: "agriculture",
        establishedYear: "2016",
        numberOfEmployees: "101-500",
        monthlyRevenue: "500jt-1m",
        businessLocation: "Jl. Raya Bogor Km. 32, Cibinong, Bogor, Jawa Barat 16913",
        businessDescription: "Perusahaan agribisnis yang bergerak dalam budidaya, pengolahan, dan distribusi produk pertanian organik. Memiliki lahan seluas 500 hektar dan fasilitas cold storage modern untuk menjamin kualitas produk sayuran, buah-buahan, dan beras organik."
      }
    ]
    
    const randomCompany = companies[Math.floor(Math.random() * companies.length)]
    companyForm.setValue("companyName", randomCompany.companyName)
    companyForm.setValue("businessType", randomCompany.businessType)
    companyForm.setValue("establishedYear", randomCompany.establishedYear)
    companyForm.setValue("numberOfEmployees", randomCompany.numberOfEmployees)
    companyForm.setValue("monthlyRevenue", randomCompany.monthlyRevenue)
    companyForm.setValue("businessLocation", randomCompany.businessLocation)
    companyForm.setValue("businessDescription", randomCompany.businessDescription)
    
    toast.success("Data simulasi perusahaan berhasil diisi!")
  }

  const generateCreditData = () => {
    const creditScenarios = [
      {
        financingPurpose: "Ekspansi usaha dengan membuka cabang baru di Jakarta dan Surabaya untuk meningkatkan market share",
        amount: "1-2m",
        tenor: "36 bulan",
        financingType: "modal-kerja",
        collateral: "Sertifikat tanah dan bangunan kantor pusat seluas 500m² dengan nilai estimasi Rp 2.5 miliar",
        usagePlan: "Dana akan digunakan untuk sewa tempat usaha 30%, renovasi dan peralatan 40%, modal kerja awal 20%, dan marketing campaign 10% untuk memperkenalkan cabang baru kepada target market di kedua kota tersebut."
      },
      {
        financingPurpose: "Pembelian armada truk dan sistem teknologi untuk meningkatkan kapasitas pengiriman logistik",
        amount: "500jt-1m",
        tenor: "48 bulan",
        financingType: "investasi",
        collateral: "BPKB kendaraan operasional existing senilai Rp 800 juta dan deposito berjangka Rp 200 juta",
        usagePlan: "Pembelian 5 unit truk box 60%, implementasi sistem tracking GPS dan warehouse management system 25%, training karyawan 10%, dan working capital untuk operasional awal 5%."
      },
      {
        financingPurpose: "Digitalisasi sistem penjualan dan pengembangan platform e-commerce untuk memperluas jangkauan pasar",
        amount: "200-500jt",
        tenor: "24 bulan",
        financingType: "modal-kerja",
        collateral: "Inventori barang dagangan senilai Rp 400 juta dan piutang usaha yang dapat diverifikasi",
        usagePlan: "Pengembangan website dan aplikasi mobile 50%, integrasi sistem pembayaran digital 20%, digital marketing dan advertising 20%, training tim penjualan 10%."
      },
      {
        financingPurpose: "Pembangunan fasilitas produksi baru dan modernisasi peralatan konstruksi untuk proyek skala besar",
        amount: "2-5m",
        tenor: "60 bulan",
        financingType: "investasi",
        collateral: "Tanah dan bangunan pabrik existing senilai Rp 8 miliar, mesin produksi senilai Rp 2 miliar",
        usagePlan: "Pembangunan fasilitas baru 70%, pembelian alat berat dan crane 20%, working capital untuk operasional awal 10%."
      },
      {
        financingPurpose: "Modernisasi sistem pertanian dan pengembangan cold storage untuk produk organik",
        amount: "500jt-1m",
        tenor: "36 bulan",
        financingType: "investasi",
        collateral: "Sertifikat lahan pertanian 500 hektar senilai Rp 1.5 miliar dan inventori produk organik",
        usagePlan: "Pembangunan cold storage 50%, modernisasi sistem irigasi 30%, pembelian alat pertanian modern 20%."
      }
    ]
    
    const randomCredit = creditScenarios[Math.floor(Math.random() * creditScenarios.length)]
    creditForm.setValue("financingPurpose", randomCredit.financingPurpose)
    creditForm.setValue("amount", randomCredit.amount)
    creditForm.setValue("tenor", randomCredit.tenor)
    creditForm.setValue("financingType", randomCredit.financingType)
    creditForm.setValue("collateral", randomCredit.collateral)
    creditForm.setValue("usagePlan", randomCredit.usagePlan)
    
    toast.success("Data simulasi kredit berhasil diisi!")
  }

  // Navigation functions
  const nextStep = async () => {
    const currentForm = getCurrentForm()
    const isValid = await currentForm.trigger()
    
    if (isValid) {
      setCurrentStep(Math.min(currentStep + 1, steps.length))
    } else {
      toast.error("Mohon lengkapi semua field yang wajib diisi")
    }
  }

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1))
  }

  // Submit function
  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Validate all forms
      const validations = await Promise.all([
        personalForm.trigger(),
        companyForm.trigger(),
        creditForm.trigger(),
        documentForm.trigger(),
        assessmentForm.trigger(),
      ])

      if (!validations.every(Boolean)) {
        toast.error("Mohon lengkapi semua field yang wajib diisi")
        return
      }

      // Create form data
      const formData = new FormData()
      
      // Collect all form data
      const personalData = personalForm.getValues()
      const companyData = companyForm.getValues()
      const creditData = creditForm.getValues()
      const assessmentData = assessmentForm.getValues()
      const documentData = documentForm.getValues()

      // Combine all data into application data object
      const applicationData = {
        // Personal data
        applicantName: personalData.fullName,
        email: personalData.email,
        phone: personalData.phone,
        position: personalData.position,
        gender: personalData.gender,
        
        // Company data
        companyName: companyData.companyName,
        businessType: companyData.businessType,
        establishedYear: companyData.establishedYear,
        numberOfEmployees: companyData.numberOfEmployees,
        monthlyRevenue: companyData.monthlyRevenue,
        businessLocation: companyData.businessLocation,
        businessDescription: companyData.businessDescription,
        
        // Credit data
        financingPurpose: creditData.financingPurpose,
        amount: creditData.amount,
        tenor: creditData.tenor,
        financingType: creditData.financingType,
        collateral: creditData.collateral,
        usagePlan: creditData.usagePlan,
        
        // Assessment data
        operationalStability: assessmentData.operationalStability,
        complianceLevel: assessmentData.complianceLevel,
        expansionPlans: assessmentData.expansionPlans,
        reputation: assessmentData.reputation,
      }

      // Add the application data as JSON string
      formData.append('applicationData', JSON.stringify(applicationData))

      // Debug: Log the application data being sent
      console.log('📤 Submitting application data:', applicationData)
      console.log('📄 FormData contents:', {
        applicationData: JSON.stringify(applicationData),
        hasBalanceSheet: documentData.balanceSheet instanceof File,
        hasIncomeStatement: documentData.incomeStatement instanceof File,
        hasCashFlowStatement: documentData.cashFlowStatement instanceof File,
        hasFinancialReport: documentData.financialReport instanceof File,
        hasCollateralDocument: documentData.collateralDocument instanceof File,
        financialDataKeys: Object.keys(financialData)
      })

      // Add documents as separate files
      if (documentData.balanceSheet instanceof File) {
        formData.append('balanceSheet', documentData.balanceSheet)
      }
      if (documentData.incomeStatement instanceof File) {
        formData.append('incomeStatement', documentData.incomeStatement)
      }
      if (documentData.cashFlowStatement instanceof File) {
        formData.append('cashFlowStatement', documentData.cashFlowStatement)
      }
      if (documentData.financialReport instanceof File) {
        formData.append('financialReport', documentData.financialReport)
      }
      if (documentData.collateralDocument instanceof File) {
        formData.append('collateralDocument', documentData.collateralDocument)
      }

      // Add financial data if available
      if (Object.keys(financialData).length > 0) {
        formData.append('financialData', JSON.stringify(financialData))
      }
      // Submit to API
      const response = await fetch('/api/applications', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        // Get more detailed error information
        let errorMessage = 'Failed to submit application'
        try {
          const errorData = await response.json()
          if (errorData.error) {
            errorMessage = errorData.error
          }
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = `HTTP ${response.status}: ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()

      console.log('✅ Application submitted successfully:', result)
      
      // Show success message with details
      if (result.data?.id) {
        toast.success(`Aplikasi berhasil disimpan ke database dengan ID: ${result.data.id.substring(0, 8)}...`, { 
          duration: 3000 
        })
      } else {
        toast.success("Aplikasi berhasil disimpan dan sedang diproses!", { duration: 2000 })
      }

      // Log the stored data for verification
      console.log('📊 Stored application data:', {
        id: result.data?.id,
        companyName: result.data?.companyName,
        hasFinancialData: !!result.data?.extractedFinancialData,
        financialDataKeys: result.data?.extractedFinancialData ? Object.keys(result.data.extractedFinancialData) : [],
        createdAt: result.data?.createdAt
      })

      // Reset forms
      personalForm.reset()
      companyForm.reset()
      creditForm.reset()
      documentForm.reset()
      assessmentForm.reset()
      creditForm.reset()
      setCurrentStep(1)

      // Redirect to dashboard after successful submission
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 2000)
    } catch (error) {
      console.error("Error saving application:", error)
      toast.error("Gagal menyimpan aplikasi. Silakan coba lagi.", { duration: 2000 })
    } finally {
      setIsSubmitting(false)
    }
  }

  const useSyntheticData = () => {
    const syntheticData = generateSyntheticData()

    // Fill personal info
    personalForm.setValue("fullName", syntheticData.fullName)
    personalForm.setValue("email", syntheticData.email)
    personalForm.setValue("phone", syntheticData.phone)
    personalForm.setValue("position", syntheticData.position)
    personalForm.setValue("gender", syntheticData.gender)

    // Fill assessment
    assessmentForm.setValue("operationalStability", syntheticData.operationalStability)
    assessmentForm.setValue("complianceLevel", syntheticData.complianceLevel)
    assessmentForm.setValue("expansionPlans", syntheticData.expansionPlans)
    assessmentForm.setValue("reputation", syntheticData.reputation)

    // Fill credit info
    creditForm.setValue("financingPurpose", syntheticData.financingPurpose)
    creditForm.setValue("amount", syntheticData.amount)
    creditForm.setValue("tenor", syntheticData.tenor)
    creditForm.setValue("financingType", syntheticData.financingType)
    creditForm.setValue("collateral", syntheticData.collateral)
    creditForm.setValue("usagePlan", syntheticData.usagePlan)

    toast.success("Data simulasi berhasil dimuat!", { duration: 2000 })
  }

  const currentStepData = steps[currentStep - 1]
  const progress = (currentStep / steps.length) * 100

  // Handle file upload with real-time processing
  const handleFileUpload = async (fieldName: string, file: File) => {
    if (!file) return

    setUploadStatus(prev => ({ ...prev, [fieldName]: 'uploading' }))

    try {
      // Only use parseFinancialDocument for financial report
      if (fieldName === 'financialReport') {
        const { parseFinancialDocument } = await import('@/lib/backend-api-client')
        const uploadResult = await parseFinancialDocument(file)
        
        if (uploadResult.success && uploadResult.data) {
          setUploadStatus(prev => ({ ...prev, [fieldName]: 'success' }))
          
          // Debug logging
          console.log('Financial parsing successful:', uploadResult.data)
          
          // Store financial data
          setFinancialData(prev => ({
            ...prev,
            [fieldName]: uploadResult.data
          }))
          
          // Debug: log the updated state
          console.log('Updated financialData state will be:', {
            ...financialData,
            [fieldName]: uploadResult.data
          })
          
          // Show feedback for incomplete data
          if (uploadResult.data.hasIncompleteData) {
            toast.warning(
              `Parsing completed but some financial data is missing: ${uploadResult.data.missingFields.slice(0, 3).join(', ')}${uploadResult.data.missingFields.length > 3 ? '...' : ''}. Please review and fill in manually if needed.`,
              { duration: 5000 }
            )
          } else {
            const totalDocs = uploadResult.data.currentYear.length + uploadResult.data.previousYear.length
            toast.success(`Financial report parsed successfully! ${totalDocs} documents processed.`, { duration: 3000 })
          }
        } else {
          setUploadStatus(prev => ({ ...prev, [fieldName]: 'error' }))
          console.error('Financial parsing failed:', uploadResult.error)
          toast.error(`Failed to parse financial report: ${uploadResult.error}`, { duration: 3000 })
        }
      } else {
        // For other documents, use regular upload
        const { uploadToSarana } = await import('@/lib/backend-api-client')
        const uploadResult = await uploadToSarana(file)
        
        if (uploadResult.success && uploadResult.data) {
          setUploadStatus(prev => ({ ...prev, [fieldName]: 'success' }))
          toast.success(`${fieldName} uploaded successfully!`, { duration: 2000 })
        } else {
          setUploadStatus(prev => ({ ...prev, [fieldName]: 'error' }))
          toast.error(`Failed to upload ${fieldName}: ${uploadResult.error}`, { duration: 3000 })
        }
      }
    } catch (error) {
      setUploadStatus(prev => ({ ...prev, [fieldName]: 'error' }))
      console.error(`Error uploading ${fieldName}:`, error)
      toast.error(`Error uploading ${fieldName}: ${error instanceof Error ? error.message : 'Unknown error'}`, { duration: 3000 })
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#0887A0] via-[#0887A0] to-[#0EBC84] p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between text-white mb-8 pt-4">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/logos/satria-main.png"
                alt="Satria Logo"
                width={120}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <nav className="flex space-x-8">
              <Link href="/" className="text-white hover:text-gray-200 transition-colors">
                Beranda
              </Link>
              <Link href="/about" className="text-white hover:text-gray-200 transition-colors">
                Tentang Kami
              </Link>
              <Link href="/products" className="text-white hover:text-gray-200 transition-colors">
                Produk
              </Link>
              <Link href="/team" className="text-white hover:text-gray-200 transition-colors">
                Team
              </Link>
              <Link href="/dashboard">
                <Button variant="secondary" className="bg-white text-[#0887A0] hover:bg-gray-100 font-medium">
                  Mulai Sekarang
                </Button>
              </Link>
            </nav>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-white text-sm mb-2">
              <span>
                Step {currentStep} of {steps.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2 bg-white bg-opacity-20" />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel */}
            <div className="text-white space-y-6">
              <h1 className="text-4xl font-bold leading-tight">{currentStepData.title}</h1>
              <p className="text-lg text-white text-opacity-90 leading-relaxed">{currentStepData.subtitle}</p>
              {currentStep === 3 && (
                <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">ℹ</span>
                    </div>
                    <p className="text-sm leading-relaxed">
                      Data ini menjadi dasar penting bagi proses analisis risiko dan penyusunan strategi pembiayaan yang
                      sesuai dengan kebutuhan perusahaan Anda.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Form */}
            <Card className="bg-white shadow-2xl">
              <CardContent className="p-8">
                {/* Form Header */}
                <div className="mb-8">
                  <div className="flex space-x-1 mb-6 overflow-x-auto">
                    {[
                      "Personal Information",
                      "Company Profile",
                      "Informasi Kredit",
                      "Upload Dokumen",
                      "Asesmen Survei",
                    ].map((tab, index) => (
                      <div
                        key={tab}
                        className={cn(
                          "px-4 py-2 text-sm border-b-2 cursor-pointer whitespace-nowrap transition-colors",
                          index + 1 === currentStep
                            ? "text-[#0887A0] border-[#0887A0] font-medium"
                            : "text-gray-400 border-transparent hover:text-gray-600",
                        )}
                      >
                        {tab}
                      </div>
                    ))}
                  </div>
                  <h2 className="text-2xl font-semibold text-[#252525]">{currentStepData.formTitle}</h2>
                  {currentStepData.formSubtitle && <p className="text-gray-600 mt-1">{currentStepData.formSubtitle}</p>}
                </div>

                {/* Form Content */}
                <div className="space-y-6">
                  {currentStep === 1 && (
                    <Form {...personalForm}>
                      <form className="space-y-6">
                        {/* Synthetic Data Button */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-green-800">👤 Data Simulasi</h4>
                              <p className="text-sm text-green-600 mt-1">
                                Gunakan data personal contoh untuk mempercepat pengisian form
                              </p>
                            </div>
                            <Button 
                              type="button"
                              variant="outline"
                              onClick={generatePersonalData}
                              className="border-green-300 text-green-700 hover:bg-green-100"
                            >
                              Isi Data Simulasi
                            </Button>
                          </div>
                        </div>

                        <FormField
                          control={personalForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nama Lengkap *</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={personalForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Alamat E-mail *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="contohemail@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={personalForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nomor Telepon *</FormLabel>
                              <FormControl>
                                <Input placeholder="(+62) 8123-4567-8910" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={personalForm.control}
                          name="position"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Jabatan di Perusahaan *</FormLabel>
                              <FormControl>
                                <Input placeholder="CEO" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={personalForm.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Jenis Kelamin *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih jenis kelamin" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Laki-laki</SelectItem>
                                  <SelectItem value="female">Perempuan</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  )}

                  {currentStep === 2 && (
                    <Form {...companyForm}>
                      <form className="space-y-6">
                        {/* Synthetic Data Button */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-blue-800">🎯 Data Simulasi</h4>
                              <p className="text-sm text-blue-600 mt-1">
                                Gunakan data perusahaan contoh untuk mempercepat pengisian form
                              </p>
                            </div>
                            <Button 
                              type="button"
                              variant="outline"
                              onClick={generateCompanyData}
                              className="border-blue-300 text-blue-700 hover:bg-blue-100"
                            >
                              Isi Data Simulasi
                            </Button>
                          </div>
                        </div>

                        <FormField
                          control={companyForm.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nama Perusahaan *</FormLabel>
                              <FormControl>
                                <Input placeholder="PT. Sinar Utama Logistik" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={companyForm.control}
                            name="businessType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Jenis Usaha *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Pilih jenis usaha" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="manufacturing">Manufaktur</SelectItem>
                                    <SelectItem value="trading">Perdagangan</SelectItem>
                                    <SelectItem value="services">Jasa</SelectItem>
                                    <SelectItem value="logistics">Logistik</SelectItem>
                                    <SelectItem value="construction">Konstruksi</SelectItem>
                                    <SelectItem value="agriculture">Pertanian</SelectItem>
                                    <SelectItem value="technology">Teknologi</SelectItem>
                                    <SelectItem value="other">Lainnya</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={companyForm.control}
                            name="establishedYear"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tahun Berdiri *</FormLabel>
                                <FormControl>
                                  <Input placeholder="2018" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={companyForm.control}
                            name="numberOfEmployees"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Jumlah Karyawan *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Pilih jumlah karyawan" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="1-10">1-10 orang</SelectItem>
                                    <SelectItem value="11-50">11-50 orang</SelectItem>
                                    <SelectItem value="51-200">51-200 orang</SelectItem>
                                    <SelectItem value="201-500">201-500 orang</SelectItem>
                                    <SelectItem value="500+">Lebih dari 500 orang</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={companyForm.control}
                            name="monthlyRevenue"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Estimasi Pendapatan Bulanan *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Pilih range pendapatan" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="<100jt">Kurang dari Rp 100 juta</SelectItem>
                                    <SelectItem value="100-500jt">Rp 100 juta - Rp 500 juta</SelectItem>
                                    <SelectItem value="500jt-1m">Rp 500 juta - Rp 1 miliar</SelectItem>
                                    <SelectItem value="1-5m">Rp 1 miliar - Rp 5 miliar</SelectItem>
                                    <SelectItem value=">5m">Lebih dari Rp 5 miliar</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={companyForm.control}
                          name="businessLocation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lokasi Usaha *</FormLabel>
                              <FormControl>
                                <Input placeholder="Jl. Sudirman No. 123, Jakarta Selatan" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={companyForm.control}
                          name="businessDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Deskripsi Usaha *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Jelaskan secara singkat bidang usaha, produk/jasa yang ditawarkan, dan target pasar perusahaan Anda"
                                  className="min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  )}

                  {currentStep === 3 && (
                    <Form {...creditForm}>
                      <form className="space-y-6">
                        {/* Synthetic Data Button */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-amber-800">💰 Data Simulasi</h4>
                              <p className="text-sm text-amber-600 mt-1">
                                Gunakan data kredit contoh untuk mempercepat pengisian form
                              </p>
                            </div>
                            <Button 
                              type="button"
                              variant="outline"
                              onClick={generateCreditData}
                              className="border-amber-300 text-amber-700 hover:bg-amber-100"
                            >
                              Isi Data Simulasi
                            </Button>
                          </div>
                        </div>

                        <FormField
                          control={creditForm.control}
                          name="financingPurpose"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tujuan Pembiayaan *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Pembelian armada truk baru untuk ekspansi layanan logistik"
                                  className="min-h-[80px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={creditForm.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Jumlah Dana yang Diajukan *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Pilih jumlah dana" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="200-500jt">Rp 200 juta - Rp 500 juta</SelectItem>
                                    <SelectItem value="500jt-1m">Rp 500 juta - Rp 1 miliar</SelectItem>
                                    <SelectItem value="1-2m">Rp 1 miliar - Rp 2 miliar</SelectItem>
                                    <SelectItem value="2-5m">Rp 2 miliar - Rp 5 miliar</SelectItem>
                                    <SelectItem value=">5m">Lebih dari Rp 5 miliar</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={creditForm.control}
                            name="tenor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tenor yang Diinginkan *</FormLabel>
                                <FormControl>
                                  <Input placeholder="36 bulan" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={creditForm.control}
                          name="financingType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Jenis Pembiayaan *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih jenis pembiayaan" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="modal-kerja">Modal Kerja</SelectItem>
                                  <SelectItem value="investasi">Investasi</SelectItem>
                                  <SelectItem value="multiguna">Multiguna</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={creditForm.control}
                          name="collateral"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Jaminan yang Disediakan *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="5 unit truk Mitsubishi Fuso tahun 2022"
                                  className="min-h-[80px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={creditForm.control}
                          name="usagePlan"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rencana Penggunaan Dana *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="70% pembelian kendaraan, 30% modifikasi bak dan branding"
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  )}

                  {currentStep === 4 && (
                    <Form {...documentForm}>
                      <form className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                          <FormField
                            control={documentForm.control}
                            name="balanceSheet"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Neraca Keuangan (Balance Sheet) *</FormLabel>
                                <FormControl>
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#0887A0] transition-colors">
                                    <input
                                      type="file"
                                      accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file && file.size <= 15 * 1024 * 1024) {
                                          field.onChange(file)
                                          handleFileUpload('balanceSheet', file)
                                        } else {
                                          toast.error("File maksimal 15MB")
                                        }
                                      }}
                                      className="w-full"
                                      disabled={uploadStatus.balanceSheet === 'uploading'}
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                      Upload file neraca keuangan perusahaan. Format: PDF, JPG, PNG, XLSX. Max: 15MB
                                    </p>
                                    {uploadStatus.balanceSheet === 'uploading' && (
                                      <div className="flex items-center gap-2 mt-2 text-blue-600">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                        <span className="text-sm">Processing financial data...</span>
                                      </div>
                                    )}
                                    {uploadStatus.balanceSheet === 'success' && (
                                      <div className="flex items-center gap-2 mt-2 text-green-600">
                                        <span className="text-sm">✓ File uploaded and processed successfully</span>
                                      </div>
                                    )}
                                    {uploadStatus.balanceSheet === 'error' && (
                                      <div className="flex items-center gap-2 mt-2 text-red-600">
                                        <span className="text-sm">✗ Upload failed</span>
                                      </div>
                                    )}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={documentForm.control}
                            name="incomeStatement"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Laporan Laba Rugi (Income Statement) *</FormLabel>
                                <FormControl>
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#0887A0] transition-colors">
                                    <input
                                      type="file"
                                      accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file && file.size <= 15 * 1024 * 1024) {
                                          field.onChange(file)
                                        } else {
                                          toast.error("File maksimal 15MB")
                                        }
                                      }}
                                      className="w-full"
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                      Upload laporan laba rugi perusahaan. Format: PDF, JPG, PNG, XLSX. Max: 15MB
                                    </p>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={documentForm.control}
                            name="cashFlowStatement"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Laporan Arus Kas (Cash Flow Statement) *</FormLabel>
                                <FormControl>
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#0887A0] transition-colors">
                                    <input
                                      type="file"
                                      accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file && file.size <= 15 * 1024 * 1024) {
                                          field.onChange(file)
                                        } else {
                                          toast.error("File maksimal 15MB")
                                        }
                                      }}
                                      className="w-full"
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                      Upload laporan arus kas perusahaan. Format: PDF, JPG, PNG, XLSX. Max: 15MB
                                    </p>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={documentForm.control}
                            name="financialReport"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Laporan Keuangan *</FormLabel>
                                <FormControl>
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#0887A0] transition-colors">
                                    <input
                                      type="file"
                                      accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file && file.size <= 15 * 1024 * 1024) {
                                          field.onChange(file)
                                          handleFileUpload('financialReport', file)
                                        } else {
                                          toast.error("File maksimal 15MB")
                                        }
                                      }}
                                      className="w-full"
                                      disabled={uploadStatus.financialReport === 'uploading'}
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                      Upload laporan keuangan lengkap untuk parsing otomatis. Format: PDF, JPG, PNG, XLSX. Max: 15MB
                                    </p>
                                    {uploadStatus.financialReport === 'uploading' && (
                                      <div className="flex items-center gap-2 mt-2 text-blue-600">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                        <span className="text-sm">Parsing financial data...</span>
                                      </div>
                                    )}
                                    {uploadStatus.financialReport === 'success' && (
                                      <div className="flex items-center gap-2 mt-2 text-green-600">
                                        <span className="text-sm">✓ Financial report parsed successfully</span>
                                      </div>
                                    )}
                                    {uploadStatus.financialReport === 'error' && (
                                      <div className="flex items-center gap-2 mt-2 text-red-600">
                                        <span className="text-sm">✗ Parsing failed</span>
                                      </div>
                                    )}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={documentForm.control}
                            name="collateralDocument"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Dokumen Collateral *</FormLabel>
                                <FormControl>
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#0887A0] transition-colors">
                                    <input
                                      type="file"
                                      accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file && file.size <= 15 * 1024 * 1024) {
                                          field.onChange(file)
                                        } else {
                                          toast.error("File maksimal 15MB")
                                        }
                                      }}
                                      className="w-full"
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                      Upload dokumen jaminan (sertifikat, BPKB, dll). Format: PDF, JPG, PNG, XLSX. Max: 15MB
                                    </p>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Debug: Show financialData state */}
                        {process.env.NODE_ENV === 'development' && (
                          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                            <h4 className="font-medium text-gray-800 mb-2">Debug: Financial Data State</h4>
                            <pre className="text-xs text-gray-600 overflow-auto max-h-32">
                              {JSON.stringify(financialData, null, 2)}
                            </pre>
                            <p className="text-xs text-gray-500 mt-2">
                              Keys count: {Object.keys(financialData).length}
                            </p>
                          </div>
                        )}

                        {/* Financial Data Display */}
                        {Object.keys(financialData).length > 0 && (
                          <div className="mt-8 space-y-4">
                            <h3 className="text-lg font-semibold text-[#0887A0] border-b border-gray-200 pb-2">
                              📊 Extracted Financial Data
                            </h3>
                            {Object.entries(financialData).map(([fieldName, data]) => (
                              <FinancialDataDisplay 
                                key={fieldName}
                                data={data} 
                                fileName={fieldName}
                              />
                            ))}
                          </div>
                        )}

                        {/* Test button to add dummy financial data */}
                        {process.env.NODE_ENV === 'development' && (
                          <div className="mt-4 space-y-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const dummyData = {
                                  currentYear: [
                                    {
                                      fileName: "Test Financial Report 2024.pdf",
                                      financialMetrics: {
                                        totalAssets: 5000000000,
                                        totalLiabilities: 2000000000,
                                        totalEquity: 3000000000,
                                        netRevenue: 8000000000,
                                        netIncome: 500000000,
                                        currentAssets: 2000000000,
                                        currentLiabilities: 1000000000,
                                        grossProfit: 2000000000,
                                        costOfGoodsSold: 6000000000
                                      }
                                    }
                                  ],
                                  previousYear: [],
                                  hasIncompleteData: false,
                                  missingFields: []
                                }
                                setFinancialData(prev => ({
                                  ...prev,
                                  testData: dummyData
                                }))
                                toast.success("Dummy financial data added for testing!")
                              }}
                              className="text-xs mr-2"
                            >
                              🧪 Add Test Financial Data
                            </Button>
                            
                            <Button
                              type="button"
                              variant="outline"
                              onClick={async () => {
                                const { checkSaranaHealth } = await import('@/lib/backend-api-client')
                                const health = await checkSaranaHealth()
                                console.log('SARANA Health Check:', health)
                                if (health.healthy) {
                                  toast.success(`SARANA API is healthy! (${health.endpoint})`)
                                } else {
                                  toast.error(`SARANA API is not healthy: ${health.error}`)
                                }
                              }}
                              className="text-xs mr-2"
                            >
                              🏥 Test SARANA Connection
                            </Button>
                            
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setFinancialData({})
                                toast.info("Financial data cleared!")
                              }}
                              className="text-xs"
                            >
                              🗑️ Clear Data
                            </Button>
                            
                            <Button
                              type="button"
                              variant="outline"
                              onClick={async () => {
                                try {
                                  const response = await fetch('/api/applications')
                                  const result = await response.json()
                                  if (result.success) {
                                    toast.success(`Found ${result.data.length} applications in Firestore!`)
                                    console.log('Firestore applications:', result.data)
                                  } else {
                                    toast.error(`Firestore error: ${result.error}`)
                                  }
                                } catch (error) {
                                  console.error('Test failed:', error)
                                  toast.error('Failed to connect to Firestore')
                                }
                              }}
                              className="text-xs"
                            >
                              🔍 Test Firestore
                            </Button>
                          </div>
                        )}
                      </form>
                    </Form>
                  )}

                  {currentStep === 5 && (
                    <Form {...assessmentForm}>
                      <form className="space-y-6">
                        <FormField
                          control={assessmentForm.control}
                          name="operationalStability"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Seberapa stabil operasional perusahaan Anda dalam 12 bulan terakhir? *
                              </FormLabel>
                              <FormControl>
                                <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-3">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="sangat-stabil" id="sangat-stabil" />
                                    <Label htmlFor="sangat-stabil" className="font-normal">Sangat Stabil</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="cukup-stabil" id="cukup-stabil" />
                                    <Label htmlFor="cukup-stabil" className="font-normal">Cukup Stabil</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="tidak-stabil" id="tidak-stabil" />
                                    <Label htmlFor="tidak-stabil" className="font-normal">Tidak Stabil</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="tidak-tahu" id="tidak-tahu" />
                                    <Label htmlFor="tidak-tahu" className="font-normal">Tidak Tahu</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={assessmentForm.control}
                          name="complianceLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Bagaimana tingkat kepatuhan perusahaan terhadap regulasi dan pajak? *
                              </FormLabel>
                              <FormControl>
                                <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-3">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="selalu-patuh" id="selalu-patuh" />
                                    <Label htmlFor="selalu-patuh" className="font-normal">Selalu patuh dan teratur</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="patuh-kadang-terlambat" id="patuh-kadang-terlambat" />
                                    <Label htmlFor="patuh-kadang-terlambat" className="font-normal">Patuh namun kadang terlambat</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="sering-terlambat" id="sering-terlambat" />
                                    <Label htmlFor="sering-terlambat" className="font-normal">Sering terlambat atau bermasalah</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="tidak-tahu-2" id="tidak-tahu-2" />
                                    <Label htmlFor="tidak-tahu-2" className="font-normal">Tidak Tahu</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={assessmentForm.control}
                          name="expansionPlans"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Apakah perusahaan Anda memiliki rencana ekspansi dalam 1-2 tahun ke depan? *
                              </FormLabel>
                              <FormControl>
                                <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-3">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="ya-strategi-jelas" id="ya-strategi-jelas" />
                                    <Label htmlFor="ya-strategi-jelas" className="font-normal">Ya, dengan strategi yang jelas</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="ya-tahap-awal" id="ya-tahap-awal" />
                                    <Label htmlFor="ya-tahap-awal" className="font-normal">Ya, namun masih dalam tahap awal</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="tidak-ada-rencana" id="tidak-ada-rencana" />
                                    <Label htmlFor="tidak-ada-rencana" className="font-normal">Tidak ada rencana ekspansi</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="tidak-tahu-3" id="tidak-tahu-3" />
                                    <Label htmlFor="tidak-tahu-3" className="font-normal">Tidak Tahu</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={assessmentForm.control}
                          name="reputation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Bagaimana reputasi perusahaan Anda di mata pelanggan atau mitra saat ini? *
                              </FormLabel>
                              <FormControl>
                                <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-3">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="sangat-baik" id="sangat-baik" />
                                    <Label htmlFor="sangat-baik" className="font-normal">
                                      Sangat baik (direkomendasikan oleh banyak pihak)
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="baik-belum-terdokumentasi" id="baik-belum-terdokumentasi" />
                                    <Label htmlFor="baik-belum-terdokumentasi" className="font-normal">
                                      Baik, meskipun belum terdokumentasi formal
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="pernah-keluhan" id="pernah-keluhan" />
                                    <Label htmlFor="pernah-keluhan" className="font-normal">Pernah mendapat keluhan besar</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="tidak-tahu-tidak-menilai" id="tidak-tahu-tidak-menilai" />
                                    <Label htmlFor="tidak-tahu-tidak-menilai" className="font-normal">Tidak tahu / Tidak bisa menilai</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="border-gray-300 bg-transparent"
                  >
                    ← Back
                  </Button>

                  <div className="flex space-x-3">
                    {currentStep < steps.length ? (
                      <Button
                        onClick={nextStep}
                        className="bg-gradient-to-r from-[#0887A0] to-[#0EBC84] hover:from-[#0887A0]/90 hover:to-[#0EBC84]/90 text-white"
                      >
                        Next →
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-[#0887A0] to-[#0EBC84] hover:from-[#0887A0]/90 hover:to-[#0EBC84]/90 text-white"
                      >
                        {isSubmitting ? "Menyimpan..." : "Submit →"}
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      className="border-gray-300 bg-transparent"
                      onClick={useSyntheticData}
                      type="button"
                    >
                      Gunakan Data Simulasi →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
