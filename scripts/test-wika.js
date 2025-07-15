// Test script for SARANA API with WIKA FY-2024.pdf
const { parseFinancialDocument } = require('../lib/backend-api-client.ts')
const fs = require('fs')
const path = require('path')

async function testWIKAFile() {
  try {
    console.log('🧪 Starting WIKA FY-2024.pdf test...')
    
    // Read the WIKA PDF file
    const filePath = path.join(__dirname, '../documents/WIKA FY-2024.pdf')
    
    if (!fs.existsSync(filePath)) {
      console.error('❌ File not found:', filePath)
      return
    }
    
    // Create a File object (simulate browser File API)
    const fileBuffer = fs.readFileSync(filePath)
    const file = new File([fileBuffer], 'WIKA FY-2024.pdf', { type: 'application/pdf' })
    
    console.log('📄 File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    })
    
    // Call the parsing function
    console.log('📤 Calling parseFinancialDocument...')
    const result = await parseFinancialDocument(file, 'WIKA')
    
    console.log('✅ Parsing result:', JSON.stringify(result, null, 2))
    
    if (result.success && result.data) {
      console.log('📊 Current Year Data:')
      console.log('  - Number of items:', result.data.currentYear.length)
      if (result.data.currentYear.length > 0) {
        console.log('  - First item:', JSON.stringify(result.data.currentYear[0], null, 2))
      }
      
      console.log('📊 Previous Year Data:')
      console.log('  - Number of items:', result.data.previousYear.length)
      if (result.data.previousYear.length > 0) {
        console.log('  - First item:', JSON.stringify(result.data.previousYear[0], null, 2))
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testWIKAFile()
