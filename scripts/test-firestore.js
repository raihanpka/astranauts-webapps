// Test script to verify Firestore operations
const { getApplicationsServer } = require('../lib/firestore-operations.ts')

async function testFirestoreConnection() {
  try {
    console.log('🔍 Testing Firestore connection...')
    
    const applications = await getApplicationsServer()
    console.log(`✅ Successfully fetched ${applications.length} applications from Firestore`)
    
    if (applications.length > 0) {
      console.log('📋 Latest application sample:')
      const latest = applications[0]
      console.log({
        id: latest.id,
        companyName: latest.companyName,
        applicantName: latest.applicantName,
        status: latest.status,
        createdAt: latest.createdAt,
        hasFinancialData: !!latest.extractedFinancialData,
        financialDataKeys: latest.extractedFinancialData ? Object.keys(latest.extractedFinancialData) : []
      })
    }
    
  } catch (error) {
    console.error('❌ Firestore connection failed:', error)
  }
}

testFirestoreConnection()
