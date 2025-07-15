"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatPercentage, formatRatio, calculateRatios } from '@/lib/backend-api-client'

interface FinancialMetrics {
  currentAssets?: number
  nonCurrentAssets?: number
  totalAssets?: number
  accountsReceivable?: number
  fixedAssetsGross?: number
  currentLiabilities?: number
  longTermLiabilities?: number
  totalLiabilities?: number
  totalEquity?: number
  retainedEarnings?: number
  netRevenue?: number
  costOfGoodsSold?: number
  grossProfit?: number
  profitBeforeTax?: number
  incomeTaxExpense?: number
  netIncome?: number
  interestExpense?: number
  sellingExpense?: number
  adminGeneralExpense?: number
  currentRatio?: number
  debtToEquityRatio?: number
  returnOnAssets?: number
  returnOnEquity?: number
  grossProfitMargin?: number
  netProfitMargin?: number
}

interface FinancialDataItem {
  fileName: string
  financialMetrics?: FinancialMetrics
}

interface FinancialDataDisplayProps {
  data: {
    currentYear: any[]
    previousYear: any[]
    hasIncompleteData: boolean
    missingFields: string[]
  } | any
  fileName?: string
}

export function FinancialDataDisplay({ data, fileName }: FinancialDataDisplayProps) {
  if (!data) return null

  // Handle the new structure with currentYear and previousYear
  if (data.currentYear || data.previousYear) {
    return (
      <div className="space-y-4">
        {data.hasIncompleteData && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-amber-800">
              <span className="text-sm">⚠️</span>
              <span className="font-medium">Incomplete Financial Data Detected</span>
            </div>
            <p className="text-sm text-amber-700 mt-1">
              Missing or zero values found in: {data.missingFields.slice(0, 5).join(', ')}
              {data.missingFields.length > 5 && ` and ${data.missingFields.length - 5} more`}
            </p>
            <p className="text-xs text-amber-600 mt-2">
              Please review and manually fill in the missing data if needed.
            </p>
          </div>
        )}
        
        {data.currentYear && data.currentYear.length > 0 && (
          <div>
            <h4 className="font-semibold text-green-800 mb-3">Current Year Financial Data</h4>
            <div className="space-y-3">
              {data.currentYear.map((item: any, index: number) => (
                <FinancialDataCard 
                  key={`current-${index}`} 
                  item={item} 
                  fileName={`Current Year - ${item.fileName || fileName || 'Financial Data'}`} 
                />
              ))}
            </div>
          </div>
        )}
        
        {data.previousYear && data.previousYear.length > 0 && (
          <div>
            <h4 className="font-semibold text-blue-800 mb-3">Previous Year Financial Data (T-1)</h4>
            <div className="space-y-3">
              {data.previousYear.map((item: any, index: number) => (
                <FinancialDataCard 
                  key={`previous-${index}`} 
                  item={item} 
                  fileName={`Previous Year - ${item.fileName || fileName || 'Financial Data'}`} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Handle legacy structure
  if (Array.isArray(data)) {
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <FinancialDataCard 
            key={index} 
            item={item} 
            fileName={fileName || item.fileName} 
          />
        ))}
      </div>
    )
  }

  // Handle single financial data object
  return <FinancialDataCard item={data} fileName={fileName || 'Financial Data'} />
}

function FinancialDataCard({ item, fileName }: { item: FinancialDataItem | any, fileName: string }) {
  const metrics = item.financialMetrics || item

  if (!metrics) {
    return (
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">📊</Badge>
            {fileName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No financial data extracted</p>
        </CardContent>
      </Card>
    )
  }

  // Calculate ratios using the backend client
  const ratios = calculateRatios(metrics)

  return (
    <Card className="border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="default">📊</Badge>
          {fileName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Assets Section */}
          <div className="space-y-3">
            <h4 className="font-semibold text-green-800 border-b border-green-200 pb-1">
              Assets
            </h4>
            <div className="space-y-2 text-sm">
              {metrics.currentAssets && (
                <div className="flex justify-between">
                  <span>Current Assets:</span>
                  <span className="font-medium">{formatCurrency(metrics.currentAssets)}</span>
                </div>
              )}
              {metrics.nonCurrentAssets && (
                <div className="flex justify-between">
                  <span>Non-Current Assets:</span>
                  <span className="font-medium">{formatCurrency(metrics.nonCurrentAssets)}</span>
                </div>
              )}
              {metrics.totalAssets && (
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="font-medium">Total Assets:</span>
                  <span className="font-bold">{formatCurrency(metrics.totalAssets)}</span>
                </div>
              )}
              {metrics.accountsReceivable && (
                <div className="flex justify-between">
                  <span>Accounts Receivable:</span>
                  <span className="font-medium">{formatCurrency(metrics.accountsReceivable)}</span>
                </div>
              )}
              {metrics.fixedAssetsGross && (
                <div className="flex justify-between">
                  <span>Fixed Assets (Gross):</span>
                  <span className="font-medium">{formatCurrency(metrics.fixedAssetsGross)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Liabilities & Equity Section */}
          <div className="space-y-3">
            <h4 className="font-semibold text-red-800 border-b border-red-200 pb-1">
              Liabilities & Equity
            </h4>
            <div className="space-y-2 text-sm">
              {metrics.currentLiabilities && (
                <div className="flex justify-between">
                  <span>Current Liabilities:</span>
                  <span className="font-medium">{formatCurrency(metrics.currentLiabilities)}</span>
                </div>
              )}
              {metrics.longTermLiabilities && (
                <div className="flex justify-between">
                  <span>Long-term Liabilities:</span>
                  <span className="font-medium">{formatCurrency(metrics.longTermLiabilities)}</span>
                </div>
              )}
              {metrics.totalLiabilities && (
                <div className="flex justify-between">
                  <span>Total Liabilities:</span>
                  <span className="font-medium">{formatCurrency(metrics.totalLiabilities)}</span>
                </div>
              )}
              {metrics.totalEquity && (
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="font-medium">Total Equity:</span>
                  <span className="font-bold">{formatCurrency(metrics.totalEquity)}</span>
                </div>
              )}
              {metrics.totalLiabilitiesAndEquity && (
                <div className="flex justify-between">
                  <span>Liab. + Equity:</span>
                  <span className="font-medium">{formatCurrency(metrics.totalLiabilitiesAndEquity)}</span>
                </div>
              )}
              {metrics.retainedEarnings && (
                <div className="flex justify-between">
                  <span>Retained Earnings:</span>
                  <span className="font-medium">{formatCurrency(metrics.retainedEarnings)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Income Statement Section */}
          <div className="space-y-3">
            <h4 className="font-semibold text-blue-800 border-b border-blue-200 pb-1">
              Income Statement
            </h4>
            <div className="space-y-2 text-sm">
              {metrics.netRevenue && (
                <div className="flex justify-between">
                  <span>Net Revenue:</span>
                  <span className="font-medium">{formatCurrency(metrics.netRevenue)}</span>
                </div>
              )}
              {metrics.costOfGoodsSold && (
                <div className="flex justify-between">
                  <span>Cost of Goods Sold:</span>
                  <span className="font-medium text-red-600">{formatCurrency(metrics.costOfGoodsSold)}</span>
                </div>
              )}
              {metrics.grossProfit && (
                <div className="flex justify-between">
                  <span>Gross Profit:</span>
                  <span className="font-medium">{formatCurrency(metrics.grossProfit)}</span>
                </div>
              )}
              {metrics.profitBeforeTax && (
                <div className="flex justify-between">
                  <span>Profit Before Tax:</span>
                  <span className="font-medium">{formatCurrency(metrics.profitBeforeTax)}</span>
                </div>
              )}
              {metrics.incomeTaxExpense && (
                <div className="flex justify-between">
                  <span>Income Tax Expense:</span>
                  <span className="font-medium text-red-600">{formatCurrency(metrics.incomeTaxExpense)}</span>
                </div>
              )}
              {metrics.netIncome && (
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="font-medium">Net Income:</span>
                  <span className="font-bold">{formatCurrency(metrics.netIncome)}</span>
                </div>
              )}
              {metrics.sellingExpense && (
                <div className="flex justify-between">
                  <span>Selling Expense:</span>
                  <span className="font-medium text-red-600">{formatCurrency(metrics.sellingExpense)}</span>
                </div>
              )}
              {metrics.adminGeneralExpense && (
                <div className="flex justify-between">
                  <span>Admin & General:</span>
                  <span className="font-medium text-red-600">{formatCurrency(metrics.adminGeneralExpense)}</span>
                </div>
              )}
              {metrics.interestExpense && (
                <div className="flex justify-between">
                  <span>Interest Expense:</span>
                  <span className="font-medium text-red-600">{formatCurrency(metrics.interestExpense)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Financial Ratios Section */}
          <div className="space-y-3 md:col-span-2 lg:col-span-3">
            <h4 className="font-semibold text-purple-800 border-b border-purple-200 pb-1">
              Financial Ratios
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
              {ratios.currentRatio !== null && ratios.currentRatio !== undefined && (
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-purple-700 font-medium">Current Ratio</div>
                  <div className="text-lg font-bold">{formatRatio(ratios.currentRatio)}</div>
                </div>
              )}
              {ratios.debtToEquityRatio !== null && ratios.debtToEquityRatio !== undefined && (
                <div className="bg-red-50 p-3 rounded">
                  <div className="text-red-700 font-medium">Debt-to-Equity</div>
                  <div className="text-lg font-bold">{formatRatio(ratios.debtToEquityRatio)}</div>
                </div>
              )}
              {ratios.returnOnAssets !== null && ratios.returnOnAssets !== undefined && (
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-green-700 font-medium">ROA</div>
                  <div className="text-lg font-bold">{formatPercentage(ratios.returnOnAssets)}</div>
                </div>
              )}
              {ratios.returnOnEquity !== null && ratios.returnOnEquity !== undefined && (
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-blue-700 font-medium">ROE</div>
                  <div className="text-lg font-bold">{formatPercentage(ratios.returnOnEquity)}</div>
                </div>
              )}
              {ratios.grossProfitMargin !== null && ratios.grossProfitMargin !== undefined && (
                <div className="bg-amber-50 p-3 rounded">
                  <div className="text-amber-700 font-medium">Gross Margin</div>
                  <div className="text-lg font-bold">{formatPercentage(ratios.grossProfitMargin)}</div>
                </div>
              )}
              {ratios.netProfitMargin !== null && ratios.netProfitMargin !== undefined && (
                <div className="bg-indigo-50 p-3 rounded">
                  <div className="text-indigo-700 font-medium">Net Margin</div>
                  <div className="text-lg font-bold">{formatPercentage(ratios.netProfitMargin)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
