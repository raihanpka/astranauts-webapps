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
  assessmentSchema,
  creditInfoSchema,
  type PersonalInfoForm,
  type AssessmentForm,
  type CreditInfoForm,
} from "@/lib/form-schema"
import { saveApplication } from "@/lib/api-handlers"
import { generateSyntheticData } from "@/lib/utils"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"

const steps = [
  {
    id: 1,
    title: "Identitas yang Terverifikasi, Kepercayaan yang Terbangun",
    subtitle:
      "SATRIA memulai proses analisis dengan memastikan kejelasan identitas perwakilan perusahaan. Data Anda aman, dan digunakan hanya untuk keperluan verifikasi kredit secara transparan.",
    formTitle: "Informasi Pribadi",
    formSubtitle: "Trip Information",
  },
  {
    id: 2,
    title: "Menilai Lebih dari Sekadar Angka",
    subtitle: "Jawaban Anda akan membantu memperkuat Penilaian pengajuan kredit secara lebih menyeluruh.",
    formTitle: "Informasi Pribadi",
    formSubtitle: "Pilih Salah satu",
  },
  {
    id: 3,
    title: "Menyesuaikan Pembiayaan Berdasar Kebutuhan Nyata",
    subtitle:
      "SATRIA memahami bahwa setiap perusahaan memiliki kebutuhan pembiayaan yang unik. Dengan mengumpulkan data secara terstruktur sejak awal, sistem kami dapat mencocokkan skema pembiayaan yang tepat dengan profil risiko yang relevan.",
    formTitle: "Informasi Kredit",
    formSubtitle: "",
  },
]

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const assessmentForm = useForm<AssessmentForm>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      operationalStability: undefined,
      complianceLevel: undefined,
      expansionPlans: undefined,
      reputation: undefined,
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

  const getCurrentForm = () => {
    switch (currentStep) {
      case 1:
        return personalForm
      case 2:
        return assessmentForm
      case 3:
        return creditForm
      default:
        return personalForm
    }
  }

  const nextStep = async () => {
    const currentForm = getCurrentForm()
    const isValid = await currentForm.trigger()

    if (!isValid) {
      toast.error("Mohon periksa kembali data yang Anda masukkan", { duration: 2000 })
      return
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
      toast.success(`Step ${currentStep} berhasil diselesaikan`, { duration: 2000 })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    const isValid = await creditForm.trigger()

    if (!isValid) {
      toast.error("Mohon periksa kembali data yang Anda masukkan", { duration: 2000 })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = {
        ...personalForm.getValues(),
        ...assessmentForm.getValues(),
        ...creditForm.getValues(),
        companyName: personalForm.getValues().fullName + " Company", // Synthetic company name
        amount: Number.parseInt(creditForm.getValues().amount),
      }

      await saveApplication(formData)

      toast.success("Aplikasi berhasil disimpan dan sedang diproses!", { duration: 2000 })

      // Reset forms
      personalForm.reset()
      assessmentForm.reset()
      creditForm.reset()
      setCurrentStep(1)
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
                          index + 1 === currentStep ||
                            (index === 0 && currentStep === 1) ||
                            (index === 1 && currentStep === 2) ||
                            (index === 2 && currentStep === 3)
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
                                <RadioGroup onValueChange={field.onChange} value={field.value}>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="sangat-stabil" id="sangat-stabil" />
                                    <Label htmlFor="sangat-stabil">Sangat Stabil</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="cukup-stabil" id="cukup-stabil" />
                                    <Label htmlFor="cukup-stabil">Cukup Stabil</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="tidak-stabil" id="tidak-stabil" />
                                    <Label htmlFor="tidak-stabil">Tidak Stabil</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="tidak-tahu" id="tidak-tahu" />
                                    <Label htmlFor="tidak-tahu">Tidak Tahu</Label>
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
                                <RadioGroup onValueChange={field.onChange} value={field.value}>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="selalu-patuh" id="selalu-patuh" />
                                    <Label htmlFor="selalu-patuh">Selalu patuh dan teratur</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="patuh-kadang-terlambat" id="patuh-kadang-terlambat" />
                                    <Label htmlFor="patuh-kadang-terlambat">Patuh namun kadang terlambat</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="sering-terlambat" id="sering-terlambat" />
                                    <Label htmlFor="sering-terlambat">Sering terlambat atau bermasalah</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="tidak-tahu-2" id="tidak-tahu-2" />
                                    <Label htmlFor="tidak-tahu-2">Tidak Tahu</Label>
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
                                <RadioGroup onValueChange={field.onChange} value={field.value}>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="ya-strategi-jelas" id="ya-strategi-jelas" />
                                    <Label htmlFor="ya-strategi-jelas">Ya, dengan strategi yang jelas</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="ya-tahap-awal" id="ya-tahap-awal" />
                                    <Label htmlFor="ya-tahap-awal">Ya, namun masih dalam tahap awal</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="tidak-ada-rencana" id="tidak-ada-rencana" />
                                    <Label htmlFor="tidak-ada-rencana">Tidak ada rencana ekspansi</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="tidak-tahu-3" id="tidak-tahu-3" />
                                    <Label htmlFor="tidak-tahu-3">Tidak Tahu</Label>
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
                                <RadioGroup onValueChange={field.onChange} value={field.value}>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="sangat-baik" id="sangat-baik" />
                                    <Label htmlFor="sangat-baik">
                                      Sangat baik (direkomendasikan oleh banyak pihak)
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="baik-belum-terdokumentasi" id="baik-belum-terdokumentasi" />
                                    <Label htmlFor="baik-belum-terdokumentasi">
                                      Baik, meskipun belum terdokumentasi formal
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="pernah-keluhan" id="pernah-keluhan" />
                                    <Label htmlFor="pernah-keluhan">Pernah mendapat keluhan besar</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="tidak-tahu-tidak-menilai" id="tidak-tahu-tidak-menilai" />
                                    <Label htmlFor="tidak-tahu-tidak-menilai">Tidak tahu / Tidak bisa menilai</Label>
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

                  {currentStep === 3 && (
                    <Form {...creditForm}>
                      <form className="space-y-6">
                        <FormField
                          control={creditForm.control}
                          name="financingPurpose"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tujuan Pembiayaan *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Pembelian armada truk baru untuk ekspansi layanan logistik"
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
                                    <SelectItem value="1000000000">Rp1.000.000.000</SelectItem>
                                    <SelectItem value="2500000000">Rp2.500.000.000</SelectItem>
                                    <SelectItem value="5000000000">Rp5.000.000.000</SelectItem>
                                    <SelectItem value="10000000000">Rp10.000.000.000</SelectItem>
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
                                  <SelectItem value="leasing">Leasing</SelectItem>
                                  <SelectItem value="kredit-investasi">Kredit Investasi</SelectItem>
                                  <SelectItem value="kredit-modal-kerja">Kredit Modal Kerja</SelectItem>
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
                                <Input placeholder="5 unit truk Mitsubishi Fuso tahun 2022" {...field} />
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
                                  rows={3}
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
