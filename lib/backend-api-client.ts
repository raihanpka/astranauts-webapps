// Simple client for calling backend APIs directly
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

// SARANA API Endpoints Configuration
const SARANA_ENDPOINTS = {
  HEALTH_CHECK: "/api/v1/sarana/health",
  DOCUMENT_PARSE: "/api/v1/sarana/document/parse",
  OCR_UPLOAD: "/api/v1/sarana/ocr/upload",
  EXTRACT_DATA: "/api/v1/sarana/extract",
  // Document management endpoints
  GET_DOCUMENTS: "/api/v1/sarana/documents",
  GET_DOCUMENT_DETAIL: "/api/v1/sarana/documents/{id}",
  GET_EXTRACTED_TEXT: "/api/v1/sarana/documents/{id}/extracted-text",
  GET_FINANCIAL_DATA: "/api/v1/sarana/documents/{id}/financial-data",
  GET_STATS: "/api/v1/sarana/stats",
  // Company-based endpoints
  GET_COMPANIES: "/api/v1/companies",
  GET_COMPANY_DOCUMENTS: "/api/v1/companies/{company_identifier}/documents",
  GET_COMPANY_LATEST: "/api/v1/companies/{company_identifier}/latest",
  GET_COMPANY_FINANCIAL_DATA: "/api/v1/companies/{company_identifier}/financial-data",
}

interface FinancialParsingResult {
  success: boolean
  data?: {
    currentYear: any[]
    previousYear: any[]
    hasIncompleteData: boolean
    missingFields: string[]
  }
  error?: string
}

// New interfaces for company-based management
interface CompanyFinancialParsingResult {
  success: boolean
  data?: {
    company: string
    uploadId: string
    timestamp: string
    currentYear: any[]
    previousYear: any[]
    hasIncompleteData: boolean
    missingFields: string[]
    structuredData?: any
    financialKeywords?: any
  }
  error?: string
}

interface CompanyFinancialData {
  success: boolean
  data?: {
    company: string
    latestUpload: string
    structuredData: any
    financialKeywords: any
    allDocuments: any[]
    summary: {
      totalDocuments: number
      latestTimestamp: string
      hasCurrentYear: boolean
      hasPreviousYear: boolean
    }
  }
  error?: string
}

interface CompanyListResult {
  success: boolean
  data?: {
    companies: string[]
    totalCompanies: number
  }
  error?: string
}

export class BackendAPIClient {
  // Enhanced parseFinancialDocument with automatic company extraction (primary method)
  static async parseFinancialDocument(file: File, companyIdentifier?: string): Promise<FinancialParsingResult> {
    try {
      // Validate file first
      const validation = BackendAPIClient.validateFileForUpload(file)
      if (!validation.valid) {
        throw new Error(`File validation failed: ${validation.errors.join(', ')}`)
      }

      // Enhanced parsing logic with proper FastAPI backend integration
      console.log('🚀 Preparing financial document upload...')
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified).toISOString()
      })

      const formData = new FormData()
      formData.append('file', file)
      
      // company_identifier is REQUIRED in the backend - extract from filename if not provided
      let finalCompanyIdentifier = companyIdentifier
      if (!finalCompanyIdentifier) {
        // Try to extract company name from filename
        finalCompanyIdentifier = file.name
          .replace(/\.(pdf|jpg|jpeg|png)$/i, '') // Remove extension
          .replace(/[^a-zA-Z0-9_\-]/g, '_') // Replace special chars with underscore
          .replace(/_{2,}/g, '_') // Replace multiple underscores with single
          .replace(/^_|_$/g, '') // Remove leading/trailing underscores
        
        if (!finalCompanyIdentifier || finalCompanyIdentifier.length < 2) {
          finalCompanyIdentifier = `COMPANY_${Date.now()}`
        }
        
        console.log('📌 Auto-extracted company identifier:', finalCompanyIdentifier)
      }
      
      // Required fields per FastAPI backend
      formData.append('company_identifier', finalCompanyIdentifier)
      
      // Optional fields with defaults matching backend
      // Fix: Use simple file type instead of MIME type for PDF support
      const fileExtension = file.name.toLowerCase().split('.').pop()
      const simpleFileType = fileExtension === 'pdf' ? 'pdf' : (file.type || 'auto-detected')
      formData.append('file_type', simpleFileType)
      formData.append('ocr_engine', 'tesseract')
      formData.append('pdf_parsing_method', 'pymupdf')
      formData.append('output_format', 'structured_json')
      formData.append('jenis_pengaju', 'korporat')
      formData.append('ollama_vision_model_name', 'llama3.2-vision')
      formData.append('ollama_llm_model_json_name', 'llama3')

      console.log('📤 Sending request to:', `${API_BASE_URL}${SARANA_ENDPOINTS.DOCUMENT_PARSE}`)
      console.log('📋 FormData contents:', {
        file: file.name,
        company_identifier: finalCompanyIdentifier,
        file_type: file.type || 'auto-detected',
        ocr_engine: 'tesseract',
        pdf_parsing_method: 'pymupdf',
        output_format: 'structured_json',
        jenis_pengaju: 'korporat'
      })

      const response = await fetch(`${API_BASE_URL}${SARANA_ENDPOINTS.DOCUMENT_PARSE}`, {
        method: 'POST',
        body: formData,
      })

      console.log('📥 Response status:', response.status, response.statusText)
      
      if (!response.ok) {
        // Get detailed error information
        let errorDetails = `HTTP ${response.status} ${response.statusText}`
        try {
          const errorBody = await response.text()
          console.error('❌ Error response body:', errorBody)
          
          // Try to parse as JSON for more details
          try {
            const errorJson = JSON.parse(errorBody)
            if (errorJson.detail) {
              errorDetails += ` - ${JSON.stringify(errorJson.detail)}`
            }
          } catch (e) {
            errorDetails += ` - ${errorBody}`
          }
        } catch (e) {
          console.error('❌ Could not read error response body')
        }
        throw new Error(`Financial parsing error: ${errorDetails}`)
      }

      const result = await response.json()
      
      // Enhanced Debug: Log the complete response structure from SARANA API
      console.log('✅ SARANA API Response (Full):', JSON.stringify(result, null, 2))
      console.log('🔍 Response Keys:', Object.keys(result))
      console.log('📊 structured_data:', result.structured_data)
      console.log('📈 financial_keywords_data:', result.financial_keywords_data)
      console.log('📋 document_id:', result.document_id)
      console.log('📄 document_status:', result.document_status)
      console.log('🔗 All available fields:', result)
      
      // Parse response according to actual SARANA API response structure
      let currentYear: any[] = []
      let previousYear: any[] = []
      
      // Handle hasil_ekstraksi_terstruktur from actual backend response
      if (result.hasil_ekstraksi_terstruktur) {
        console.log('📊 Found hasil_ekstraksi_terstruktur:', result.hasil_ekstraksi_terstruktur)
        
        // Check if it's an error first
        if (result.hasil_ekstraksi_terstruktur.error) {
          console.warn('⚠️ Structured extraction error:', result.hasil_ekstraksi_terstruktur.error)
        } else {
          // Convert structured financial data with t/t-1 format to our format
          const structuredData = result.hasil_ekstraksi_terstruktur
          const currentYearData: { [key: string]: any } = {}
          const previousYearData: { [key: string]: any } = {}
          
          // Extract current year (t) and previous year (t-1) data
          Object.keys(structuredData).forEach(fieldName => {
            const fieldData = structuredData[fieldName]
            if (fieldData && typeof fieldData === 'object') {
              if (fieldData.t !== null && fieldData.t !== undefined) {
                currentYearData[fieldName] = fieldData.t
              }
              if (fieldData['t-1'] !== null && fieldData['t-1'] !== undefined) {
                previousYearData[fieldName] = fieldData['t-1']
              }
            }
          })
          
          // Add to arrays if we have data
          if (Object.keys(currentYearData).length > 0) {
            currentYear = [{ 
              nama_file: result.nama_file || file.name,
              hasil_ekstraksi: currentYearData 
            }]
          }
          
          if (Object.keys(previousYearData).length > 0) {
            previousYear = [{ 
              nama_file: result.nama_file || file.name + ' (Previous Year)',
              hasil_ekstraksi: previousYearData 
            }]
          }
          
          console.log('📋 Converted currentYear data:', currentYear)
          console.log('📋 Converted previousYear data:', previousYear)
        }
      }
      
      // Fallback to hasil_ekstraksi_kata_kunci if no structured data
      if (currentYear.length === 0 && result.hasil_ekstraksi_kata_kunci) {
        console.log('📈 Using hasil_ekstraksi_kata_kunci as fallback:', result.hasil_ekstraksi_kata_kunci)
        currentYear = [{ 
          nama_file: result.nama_file || file.name,
          hasil_ekstraksi: result.hasil_ekstraksi_kata_kunci 
        }]
      }
      
      // Legacy fallback for old field names (structured_data, financial_keywords_data)
      if (currentYear.length === 0) {
        if (result.structured_data) {
          console.log('📊 Using structured_data (legacy):', result.structured_data)
          currentYear = Array.isArray(result.structured_data) ? result.structured_data : [result.structured_data]
        } else if (result.financial_keywords_data) {
          console.log('📈 Using financial_keywords_data (legacy):', result.financial_keywords_data)
          currentYear = [result.financial_keywords_data]
        }
      }
      
      // Additional fallbacks for various response formats
      if (currentYear.length === 0) {
        if (result.hasil_ekstraksi_semua_dokumen) {
          currentYear = result.hasil_ekstraksi_semua_dokumen
        } else if (result.extracted_data) {
          currentYear = Array.isArray(result.extracted_data) ? result.extracted_data : [result.extracted_data]
        } else if (result.financial_data) {
          currentYear = Array.isArray(result.financial_data) ? result.financial_data : [result.financial_data]
        }
      }
      
      console.log('📋 Parsed currentYear:', currentYear)
      console.log('📋 Parsed previousYear:', previousYear)
      
      // Check for incomplete data
      const { hasIncompleteData, missingFields } = BackendAPIClient.validateFinancialData([...currentYear, ...previousYear])
      
      return {
        success: true,
        data: {
          currentYear: BackendAPIClient.parseFinancialArray(currentYear),
          previousYear: BackendAPIClient.parseFinancialArray(previousYear),
          hasIncompleteData,
          missingFields
        }
      }
    } catch (error) {
      console.error('❌ Financial document parsing error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  static async uploadToSarana(file: File) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('extract_structured', 'true')
      formData.append('language', 'id')

      const response = await fetch(`${API_BASE_URL}${SARANA_ENDPOINTS.OCR_UPLOAD}`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`)
      }

      const result = await response.json()
      
      return {
        success: true,
        data: {
          fileId: Date.now().toString() + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '_'),
          fileName: file.name,
          fileSize: file.size,
          contentType: file.type,
          uploadedAt: new Date().toISOString(),
          ocrResult: {
            extractedText: result.extracted_text || "",
            confidence: result.confidence || 0,
            processingTime: result.processing_time || 0,
            ocrEngine: result.ocr_engine || "tesseract",
            status: result.status
          }
        }
      }
    } catch (error) {
      console.error('SARANA upload error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  static parseFinancialArray(dataArray: any[]) {
    console.log('Parsing financial array:', dataArray)
    
    if (!Array.isArray(dataArray)) {
      console.warn('Data is not an array:', dataArray)
      return []
    }
    
    return dataArray.map((item: any, index: number) => {
      console.log(`Processing item ${index}:`, item)
      
      // Handle different possible data structures
      let financialData = null
      let fileName = `Document ${index + 1}`
      
      // Try to extract filename
      if (item.nama_file) {
        fileName = item.nama_file
      } else if (item.filename) {
        fileName = item.filename
      } else if (item.file_name) {
        fileName = item.file_name
      } else if (item.name) {
        fileName = item.name
      }
      
      // Try to extract financial data
      if (item.hasil_ekstraksi) {
        financialData = item.hasil_ekstraksi
      } else if (item.extracted_data) {
        financialData = item.extracted_data
      } else if (item.financial_data) {
        financialData = item.financial_data
      } else if (item.data) {
        financialData = item.data
      } else {
        // If item itself contains financial fields, use it directly
        financialData = item
      }
      
      if (!financialData) {
        console.warn(`No financial data found in item ${index}:`, item)
        return {
          fileName,
          financialMetrics: null
        }
      }
      
      // Map financial fields with multiple possible field names
      const getFieldValue = (fieldNames: string[]) => {
        for (const fieldName of fieldNames) {
          if (financialData[fieldName] !== undefined && financialData[fieldName] !== null) {
            return financialData[fieldName]
          }
        }
        return null
      }
      
      const mappedData = {
        // Assets
        currentAssets: getFieldValue([
          "Jumlah aset lancar", "current_assets", "currentAssets", "aset_lancar"
        ]),
        nonCurrentAssets: getFieldValue([
          "Jumlah aset tidak lancar", "non_current_assets", "nonCurrentAssets", "aset_tidak_lancar"
        ]),
        totalAssets: getFieldValue([
          "Jumlah aset", "total_assets", "totalAssets", "aset_total"
        ]),
        accountsReceivable: getFieldValue([
          "Piutang usaha", "accounts_receivable", "accountsReceivable", "piutang"
        ]),
        fixedAssetsGross: getFieldValue([
          "Aset tetap bruto", "fixed_assets_gross", "fixedAssetsGross", "aset_tetap"
        ]),
        
        // Liabilities
        currentLiabilities: getFieldValue([
          "Jumlah liabilitas jangka pendek", "current_liabilities", "currentLiabilities", "liabilitas_pendek"
        ]),
        longTermLiabilities: getFieldValue([
          "Jumlah liabilitas jangka panjang", "long_term_liabilities", "longTermLiabilities", "liabilitas_panjang"
        ]),
        totalLiabilities: getFieldValue([
          "Jumlah liabilitas", "total_liabilities", "totalLiabilities", "liabilitas_total"
        ]),
        
        // Equity
        totalEquity: getFieldValue([
          "Jumlah ekuitas", "total_equity", "totalEquity", "ekuitas"
        ]),
        totalLiabilitiesAndEquity: getFieldValue([
          "Jumlah liabilitas dan ekuitas", "total_liabilities_and_equity", "totalLiabilitiesAndEquity"
        ]),
        retainedEarnings: getFieldValue([
          "Laba ditahan", "retained_earnings", "retainedEarnings", "laba_ditahan"
        ]),
        
        // Income Statement
        netRevenue: getFieldValue([
          "Pendapatan bersih", "net_revenue", "netRevenue", "revenue", "pendapatan"
        ]),
        costOfGoodsSold: getFieldValue([
          "Beban pokok pendapatan", "cost_of_goods_sold", "costOfGoodsSold", "cogs", "beban_pokok"
        ]),
        grossProfit: getFieldValue([
          "Laba bruto", "gross_profit", "grossProfit", "laba_bruto"
        ]),
        profitBeforeTax: getFieldValue([
          "Laba sebelum pajak penghasilan", "profit_before_tax", "profitBeforeTax", "laba_sebelum_pajak"
        ]),
        incomeTaxExpense: getFieldValue([
          "Beban pajak penghasilan", "income_tax_expense", "incomeTaxExpense", "pajak"
        ]),
        netIncome: getFieldValue([
          "Laba tahun berjalan", "net_income", "netIncome", "laba_bersih", "net_profit"
        ]),
        interestExpense: getFieldValue([
          "Beban bunga", "interest_expense", "interestExpense", "bunga"
        ]),
        sellingExpense: getFieldValue([
          "Beban penjualan", "selling_expense", "sellingExpense", "beban_penjualan"
        ]),
        adminGeneralExpense: getFieldValue([
          "Beban administrasi dan umum", "admin_general_expense", "adminGeneralExpense", "beban_admin"
        ]),
        
        // Keep raw data for debugging
        rawData: financialData
      }
      
      console.log(`Mapped financial data for ${fileName}:`, mappedData)
      
      return {
        fileName,
        financialMetrics: mappedData
      }
    })
  }

  static validateFinancialData(dataArray: any[]) {
    let hasIncompleteData = false
    const missingFields: string[] = []
    
    console.log('Validating financial data:', dataArray)
    
    dataArray.forEach((item, index) => {
      let financialData = null
      
      // Extract financial data from different possible structures
      if (item.hasil_ekstraksi) {
        financialData = item.hasil_ekstraksi
      } else if (item.extracted_data) {
        financialData = item.extracted_data
      } else if (item.financial_data) {
        financialData = item.financial_data
      } else if (item.data) {
        financialData = item.data
      } else {
        financialData = item
      }
      
      if (financialData) {
        // Check for critical fields (simplified validation)
        const criticalFields = [
          ["Jumlah aset", "total_assets", "totalAssets"],
          ["Jumlah ekuitas", "total_equity", "totalEquity"],
          ["Pendapatan bersih", "net_revenue", "netRevenue", "revenue"],
          ["Laba tahun berjalan", "net_income", "netIncome", "net_profit"]
        ]
        
        criticalFields.forEach(fieldGroup => {
          const hasValue = fieldGroup.some(field => {
            const value = financialData[field]
            return value !== null && value !== undefined && value !== 0
          })
          
          if (!hasValue) {
            hasIncompleteData = true
            const missingField = fieldGroup[0] // Use the first (Indonesian) name for missing field
            if (!missingFields.includes(missingField)) {
              missingFields.push(missingField)
            }
          }
        })
      } else {
        console.warn(`No financial data found in validation for item ${index}`)
        hasIncompleteData = true
        missingFields.push('No financial data found')
      }
    })
    
    console.log('Validation result:', { hasIncompleteData, missingFields })
    return { hasIncompleteData, missingFields }
  }

  static async checkSaranaHealth() {
    try {
      // Try the health endpoint first
      const healthResponse = await fetch(`${API_BASE_URL}${SARANA_ENDPOINTS.HEALTH_CHECK}`)
      
      if (healthResponse.ok) {
        const result = await healthResponse.json()
        return { 
          healthy: true, 
          data: result,
          endpoint: SARANA_ENDPOINTS.HEALTH_CHECK
        }
      }
      
      // If that fails, try alternative endpoints
      const alternativeEndpoints = [
        '/health',
        '/api/v1/health',
        '/sarana/health'
      ]
      
      for (const endpoint of alternativeEndpoints) {
        try {
          const response = await fetch(`${API_BASE_URL}${endpoint}`)
          if (response.ok) {
            const result = await response.json()
            return { 
              healthy: true, 
              data: result,
              endpoint: endpoint
            }
          }
        } catch (e) {
          // Continue to next endpoint
        }
      }
      
      return { 
        healthy: false, 
        error: `All health endpoints failed. Last status: ${healthResponse.status}`,
        attempted_endpoints: [SARANA_ENDPOINTS.HEALTH_CHECK, ...alternativeEndpoints]
      }
      
    } catch (error) {
      return { 
        healthy: false, 
        error: error instanceof Error ? error.message : 'Connection failed',
        attempted_endpoints: [SARANA_ENDPOINTS.HEALTH_CHECK]
      }
    }
  }

  static formatCurrency(amount: number | null | undefined): string {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  static formatPercentage(ratio: number | null | undefined): string {
    if (ratio === null || ratio === undefined) return 'N/A'
    return `${(ratio * 100).toFixed(2)}%`
  }

  static formatRatio(ratio: number | null | undefined): string {
    if (ratio === null || ratio === undefined) return 'N/A'
    return ratio.toFixed(2)
  }

  // Calculate financial ratios
  static calculateRatios(metrics: any) {
    if (!metrics) return {}
    
    return {
      currentRatio: metrics.currentAssets && metrics.currentLiabilities 
        ? metrics.currentAssets / metrics.currentLiabilities : null,
      debtToEquityRatio: metrics.totalLiabilities && metrics.totalEquity
        ? metrics.totalLiabilities / metrics.totalEquity : null,
      returnOnAssets: metrics.netIncome && metrics.totalAssets
        ? metrics.netIncome / metrics.totalAssets : null,
      returnOnEquity: metrics.netIncome && metrics.totalEquity
        ? metrics.netIncome / metrics.totalEquity : null,
      grossProfitMargin: metrics.grossProfit && metrics.netRevenue
        ? metrics.grossProfit / metrics.netRevenue : null,
      netProfitMargin: metrics.netIncome && metrics.netRevenue
        ? metrics.netIncome / metrics.netRevenue : null
    }
  }

  // Company-based document parsing with automatic company identifier
  static async parseFinancialDocumentWithCompany(file: File, companyIdentifier?: string): Promise<CompanyFinancialParsingResult> {
    try {
      console.log('🏢 Starting company-based financial document parsing...')
      console.log('Company identifier:', companyIdentifier)
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type
      })

      // company_identifier is REQUIRED - extract from filename if not provided
      let finalCompanyIdentifier = companyIdentifier
      if (!finalCompanyIdentifier) {
        finalCompanyIdentifier = file.name
          .replace(/\.(pdf|jpg|jpeg|png)$/i, '') // Remove extension
          .replace(/[^a-zA-Z0-9_\-]/g, '_') // Replace special chars with underscore
          .replace(/_{2,}/g, '_') // Replace multiple underscores with single
          .replace(/^_|_$/g, '') // Remove leading/trailing underscores
        
        if (!finalCompanyIdentifier || finalCompanyIdentifier.length < 2) {
          finalCompanyIdentifier = `COMPANY_${Date.now()}`
        }
        
        console.log('🔍 Auto-extracted company identifier:', finalCompanyIdentifier)
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('company_identifier', finalCompanyIdentifier)
      
      // Optional fields with defaults matching backend
      // Fix: Use simple file type instead of MIME type for PDF support
      const fileExtension = file.name.toLowerCase().split('.').pop()
      const simpleFileType = fileExtension === 'pdf' ? 'pdf' : (file.type || 'auto-detected')
      formData.append('file_type', simpleFileType)
      formData.append('ocr_engine', 'tesseract')
      formData.append('pdf_parsing_method', 'pymupdf')
      formData.append('output_format', 'structured_json')
      formData.append('jenis_pengaju', 'korporat')
      formData.append('ollama_vision_model_name', 'llama3.2-vision')
      formData.append('ollama_llm_model_json_name', 'llama3')

      console.log('📤 Sending request to:', `${API_BASE_URL}${SARANA_ENDPOINTS.DOCUMENT_PARSE}`)

      const response = await fetch(`${API_BASE_URL}${SARANA_ENDPOINTS.DOCUMENT_PARSE}`, {
        method: 'POST',
        body: formData,
      })

      console.log('📥 Response status:', response.status, response.statusText)

      if (!response.ok) {
        // Enhanced error handling for 422 and other errors
        let errorDetails = `HTTP ${response.status} ${response.statusText}`
        try {
          const errorBody = await response.text()
          console.error('❌ Company parsing error response body:', errorBody)
          
          // Try to parse as JSON for more details
          try {
            const errorJson = JSON.parse(errorBody)
            if (errorJson.detail) {
              errorDetails += ` - ${JSON.stringify(errorJson.detail)}`
            }
          } catch (e) {
            errorDetails += ` - ${errorBody}`
          }
        } catch (e) {
          console.error('❌ Could not read error response body')
        }
        
        throw new Error(`Company financial parsing error: ${errorDetails}`)
      }

      const result = await response.json()
      
      // Debug: Log the company-based response from SARANA API
      console.log('✅ SARANA API Company Response:', result)
      
      // Extract company and document information from SaranaParseDocumentResponse
      const company = finalCompanyIdentifier
      const uploadId = result.document_id || `${Date.now()}-${file.name}`
      const timestamp = new Date().toISOString()
      
      // Parse financial data from actual SARANA response structure
      let currentYear = []
      let previousYear = []
      
      // Handle hasil_ekstraksi_terstruktur from actual backend response
      if (result.hasil_ekstraksi_terstruktur) {
        console.log('📊 Found hasil_ekstraksi_terstruktur:', result.hasil_ekstraksi_terstruktur)
        
        // Check if it's an error first
        if (result.hasil_ekstraksi_terstruktur.error) {
          console.warn('⚠️ Structured extraction error:', result.hasil_ekstraksi_terstruktur.error)
        } else {
          // If hasil_ekstraksi_terstruktur contains currentYear/previousYear arrays
          if (result.hasil_ekstraksi_terstruktur.currentYear) {
            currentYear = Array.isArray(result.hasil_ekstraksi_terstruktur.currentYear) 
              ? result.hasil_ekstraksi_terstruktur.currentYear 
              : [result.hasil_ekstraksi_terstruktur.currentYear]
          }
          
          if (result.hasil_ekstraksi_terstruktur.previousYear) {
            previousYear = Array.isArray(result.hasil_ekstraksi_terstruktur.previousYear) 
              ? result.hasil_ekstraksi_terstruktur.previousYear 
              : [result.hasil_ekstraksi_terstruktur.previousYear]
          }
          
          // If hasil_ekstraksi_terstruktur is the financial data itself
          if (currentYear.length === 0 && previousYear.length === 0 && typeof result.hasil_ekstraksi_terstruktur === 'object') {
            currentYear = [result.hasil_ekstraksi_terstruktur]
          }
        }
      }
      
      // Fallback to hasil_ekstraksi_kata_kunci if no structured data
      if (currentYear.length === 0 && result.hasil_ekstraksi_kata_kunci) {
        console.log('📈 Using hasil_ekstraksi_kata_kunci as fallback:', result.hasil_ekstraksi_kata_kunci)
        currentYear = [result.hasil_ekstraksi_kata_kunci]
      }
      
      console.log(`📋 Parsed data for company ${company}:`, { currentYear, previousYear })
      
      // Check for incomplete data
      const { hasIncompleteData, missingFields } = BackendAPIClient.validateFinancialData([...currentYear, ...previousYear])
      
      return {
        success: true,
        data: {
          company,
          uploadId,
          timestamp,
          currentYear: BackendAPIClient.parseFinancialArray(currentYear),
          previousYear: BackendAPIClient.parseFinancialArray(previousYear),
          hasIncompleteData,
          missingFields,
          structuredData: result.hasil_ekstraksi_terstruktur,
          financialKeywords: result.hasil_ekstraksi_kata_kunci
        }
      }
    } catch (error) {
      console.error('❌ Company financial document parsing error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get latest financial data by company
  static async getLatestFinancialDataByCompany(companyIdentifier: string): Promise<CompanyFinancialData> {
    try {
      const endpoint = SARANA_ENDPOINTS.GET_COMPANY_FINANCIAL_DATA.replace('{company_identifier}', encodeURIComponent(companyIdentifier))
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Get company financial data error: ${response.status}`)
      }

      const result = await response.json()
      
      console.log(`Financial data for company ${companyIdentifier}:`, result)
      
      return {
        success: true,
        data: {
          company: result.company || companyIdentifier,
          latestUpload: result.latest_upload,
          structuredData: result.structured_data,
          financialKeywords: result.financial_keywords,
          allDocuments: result.all_documents || [],
          summary: {
            totalDocuments: result.total_documents || 0,
            latestTimestamp: result.latest_timestamp,
            hasCurrentYear: !!(result.structured_data?.currentYear?.length),
            hasPreviousYear: !!(result.structured_data?.previousYear?.length)
          }
        }
      }
    } catch (error) {
      console.error(`Get financial data error for company ${companyIdentifier}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get all companies that have been processed
  static async getAllCompanies(): Promise<CompanyListResult> {
    try {
      const response = await fetch(`${API_BASE_URL}${SARANA_ENDPOINTS.GET_COMPANIES}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Get all companies error: ${response.status}`)
      }

      const result = await response.json()
      
      console.log('All companies:', result)
      
      return {
        success: true,
        data: {
          companies: result.companies || [],
          totalCompanies: result.total_companies || 0
        }
      }
    } catch (error) {
      console.error('Get all companies error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get documents by company
  static async getCompanyDocuments(companyIdentifier: string): Promise<any> {
    try {
      const endpoint = SARANA_ENDPOINTS.GET_COMPANY_DOCUMENTS.replace('{company_identifier}', encodeURIComponent(companyIdentifier))
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Get company documents error: ${response.status}`)
      }

      const result = await response.json()
      console.log(`Documents for company ${companyIdentifier}:`, result)
      
      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error(`Get company documents error for ${companyIdentifier}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get latest document by company
  static async getCompanyLatest(companyIdentifier: string): Promise<any> {
    try {
      const endpoint = SARANA_ENDPOINTS.GET_COMPANY_LATEST.replace('{company_identifier}', encodeURIComponent(companyIdentifier))
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Get company latest error: ${response.status}`)
      }

      const result = await response.json()
      console.log(`Latest data for company ${companyIdentifier}:`, result)
      
      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error(`Get company latest error for ${companyIdentifier}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get all documents
  static async getAllDocuments(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}${SARANA_ENDPOINTS.GET_DOCUMENTS}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Get all documents error: ${response.status}`)
      }

      const result = await response.json()
      console.log('All documents:', result)
      
      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error('Get all documents error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get document detail by ID
  static async getDocumentDetail(documentId: string): Promise<any> {
    try {
      const endpoint = SARANA_ENDPOINTS.GET_DOCUMENT_DETAIL.replace('{id}', encodeURIComponent(documentId))
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Get document detail error: ${response.status}`)
      }

      const result = await response.json()
      console.log(`Document detail for ${documentId}:`, result)
      
      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error(`Get document detail error for ${documentId}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get extracted text by document ID
  static async getExtractedText(documentId: string): Promise<any> {
    try {
      const endpoint = SARANA_ENDPOINTS.GET_EXTRACTED_TEXT.replace('{id}', encodeURIComponent(documentId))
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Get extracted text error: ${response.status}`)
      }

      const result = await response.json()
      console.log(`Extracted text for ${documentId}:`, result)
      
      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error(`Get extracted text error for ${documentId}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get financial data by document ID
  static async getDocumentFinancialData(documentId: string): Promise<any> {
    try {
      const endpoint = SARANA_ENDPOINTS.GET_FINANCIAL_DATA.replace('{id}', encodeURIComponent(documentId))
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Get document financial data error: ${response.status}`)
      }

      const result = await response.json()
      console.log(`Financial data for document ${documentId}:`, result)
      
      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error(`Get document financial data error for ${documentId}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get SARANA stats
  static async getSaranaStats(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}${SARANA_ENDPOINTS.GET_STATS}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Get SARANA stats error: ${response.status}`)
      }

      const result = await response.json()
      console.log('SARANA stats:', result)
      
      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error('Get SARANA stats error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Debug helper function to test API requirements
  static async debugApiRequirements() {
    try {
      console.log('🔍 Testing API requirements and endpoints...')
      
      // Test health check first
      const healthResult = await BackendAPIClient.checkSaranaHealth()
      console.log('🏥 Health check result:', healthResult)
      
      // Test if endpoint accepts OPTIONS request to check CORS and requirements
      try {
        const optionsResponse = await fetch(`${API_BASE_URL}${SARANA_ENDPOINTS.DOCUMENT_PARSE}`, {
          method: 'OPTIONS'
        })
        console.log('⚙️ OPTIONS response:', {
          status: optionsResponse.status,
          headers: Object.fromEntries(optionsResponse.headers.entries())
        })
      } catch (e) {
        console.log('❌ OPTIONS request failed:', e)
      }
      
      // Test with minimal form data to see what's required
      try {
        const testFormData = new FormData()
        testFormData.append('test', 'true')
        
        const testResponse = await fetch(`${API_BASE_URL}${SARANA_ENDPOINTS.DOCUMENT_PARSE}`, {
          method: 'POST',
          body: testFormData,
        })
        
        const testResult = await testResponse.text()
        console.log('🧪 Minimal test response:', {
          status: testResponse.status,
          body: testResult
        })
      } catch (e) {
        console.log('❌ Minimal test failed:', e)
      }
      
      return {
        success: true,
        healthCheck: healthResult,
        message: 'Debug information logged to console'
      }
    } catch (error) {
      console.error('❌ Debug API requirements error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Test function specifically for debugging response structure
  static async testApiResponseStructure(file: File): Promise<any> {
    try {
      console.log('🧪 Testing API response structure with real file...')
      
      const formData = new FormData()
      formData.append('file', file)
      
      // Required field - use simple company identifier
      const companyId = 'TEST_COMPANY_DEBUG'
      formData.append('company_identifier', companyId)
      
      // Add other required fields
      formData.append('file_type', file.type || 'auto-detected')
      formData.append('ocr_engine', 'tesseract')
      formData.append('pdf_parsing_method', 'pymupdf')
      formData.append('output_format', 'structured_json')
      formData.append('jenis_pengaju', 'korporat')

      console.log('📤 Sending test request to:', `${API_BASE_URL}${SARANA_ENDPOINTS.DOCUMENT_PARSE}`)
      console.log('📋 Test FormData:', {
        file: file.name,
        company_identifier: companyId,
        file_type: file.type,
        ocr_engine: 'tesseract',
        pdf_parsing_method: 'pymupdf',
        output_format: 'structured_json',
        jenis_pengaju: 'korporat'
      })

      const response = await fetch(`${API_BASE_URL}${SARANA_ENDPOINTS.DOCUMENT_PARSE}`, {
        method: 'POST',
        body: formData,
      })

      console.log('📥 Test Response Status:', response.status, response.statusText)
      console.log('📥 Test Response Headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Test API Error Response:', errorText)
        try {
          const errorJson = JSON.parse(errorText)
          console.error('❌ Test API Error JSON:', errorJson)
        } catch (e) {
          console.error('❌ Error response is not JSON')
        }
        throw new Error(`Test API call failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      // Comprehensive logging of response structure
      console.log('🎯 === COMPLETE API RESPONSE ANALYSIS ===')
      console.log('📊 Full Response:', JSON.stringify(result, null, 2))
      console.log('🔑 Top-level Keys:', Object.keys(result))
      
      // Check each possible data location
      console.log('📋 Direct Fields Check:')
      console.log('  - result.structured_data:', result.structured_data)
      console.log('  - result.financial_keywords_data:', result.financial_keywords_data)
      console.log('  - result.document_id:', result.document_id)
      console.log('  - result.document_status:', result.document_status)
      console.log('  - result.file_path:', result.file_path)
      console.log('  - result.company_identifier:', result.company_identifier)
      console.log('  - result.timestamp:', result.timestamp)
      console.log('  - result.success:', result.success)
      console.log('  - result.message:', result.message)
      console.log('  - result.data:', result.data)
      console.log('  - result.financial_data:', result.financial_data)
      console.log('  - result.extracted_data:', result.extracted_data)
      console.log('  - result.hasil_ekstraksi:', result.hasil_ekstraksi)
      console.log('  - result.hasil_ekstraksi_semua_dokumen:', result.hasil_ekstraksi_semua_dokumen)
      
      // Check nested structures
      if (result.structured_data && typeof result.structured_data === 'object') {
        console.log('🏗️ structured_data Keys:', Object.keys(result.structured_data))
        console.log('🏗️ structured_data Content:', result.structured_data)
      }
      
      if (result.financial_keywords_data && typeof result.financial_keywords_data === 'object') {
        console.log('💰 financial_keywords_data Keys:', Object.keys(result.financial_keywords_data))
        console.log('💰 financial_keywords_data Content:', result.financial_keywords_data)
      }
      
      console.log('🎯 === END API RESPONSE ANALYSIS ===')
      
      return {
        success: true,
        rawResponse: result,
        structure: {
          topLevelKeys: Object.keys(result),
          hasStructuredData: !!result.structured_data,
          hasFinancialKeywords: !!result.financial_keywords_data,
          structuredDataKeys: result.structured_data ? Object.keys(result.structured_data) : null,
          financialKeywordsKeys: result.financial_keywords_data ? Object.keys(result.financial_keywords_data) : null
        }
      }
    } catch (error) {
      console.error('❌ Test API Response Structure Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Validate file before sending to API
  static validateFileForUpload(file: File): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      errors.push('File size exceeds 10MB limit')
    }
    
    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} not supported. Allowed: ${allowedTypes.join(', ')}`)
    }
    
    // Check filename
    if (!file.name || file.name.length < 3) {
      errors.push('Filename is too short or empty')
    }
    
    console.log('📋 File validation result:', {
      file: file.name,
      size: file.size,
      type: file.type,
      valid: errors.length === 0,
      errors
    })
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
}

// Utility functions for easy import
export const parseFinancialDocument = BackendAPIClient.parseFinancialDocument
export const parseFinancialDocumentWithCompany = BackendAPIClient.parseFinancialDocumentWithCompany
export const getLatestFinancialDataByCompany = BackendAPIClient.getLatestFinancialDataByCompany
export const getAllCompanies = BackendAPIClient.getAllCompanies
export const getCompanyDocuments = BackendAPIClient.getCompanyDocuments
export const getCompanyLatest = BackendAPIClient.getCompanyLatest
export const getAllDocuments = BackendAPIClient.getAllDocuments
export const getDocumentDetail = BackendAPIClient.getDocumentDetail
export const getExtractedText = BackendAPIClient.getExtractedText
export const getDocumentFinancialData = BackendAPIClient.getDocumentFinancialData
export const getSaranaStats = BackendAPIClient.getSaranaStats
export const uploadToSarana = BackendAPIClient.uploadToSarana
export const checkSaranaHealth = BackendAPIClient.checkSaranaHealth
export const debugApiRequirements = BackendAPIClient.debugApiRequirements
export const testApiResponseStructure = BackendAPIClient.testApiResponseStructure
export const validateFileForUpload = BackendAPIClient.validateFileForUpload
export const formatCurrency = BackendAPIClient.formatCurrency
export const formatPercentage = BackendAPIClient.formatPercentage
export const formatRatio = BackendAPIClient.formatRatio
export const calculateRatios = BackendAPIClient.calculateRatios

// Type exports for easier usage
export type { FinancialParsingResult, CompanyFinancialParsingResult, CompanyFinancialData, CompanyListResult }

// Export the endpoints configuration for direct usage
export { SARANA_ENDPOINTS }
