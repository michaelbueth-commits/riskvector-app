'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Code, 
  Calendar,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Shield
} from 'lucide-react'

interface ReportGeneratorProps {
  country: string
  city?: string
  riskData?: any
  className?: string
}

type ReportFormat = 'pdf' | 'excel' | 'json'

export default function ReportGenerator({ country, city, riskData, className }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>('pdf')
  const [reportResult, setReportResult] = useState<any>(null)

  const generateReport = async () => {
    setIsGenerating(true)
    setReportResult(null)

    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country,
          city,
          format: selectedFormat
        })
      })

      const result = await response.json()

      if (result.success) {
        setReportResult(result)
        
        // For JSON format, trigger download
        if (result.format === 'json' && result.download) {
          const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `risk-report-${country.toLowerCase()}${city ? `-${city.toLowerCase()}` : ''}-${new Date().toISOString().split('T')[0]}.json`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      }
    } catch (error) {
      setReportResult({
        success: false,
        error: 'Failed to generate report'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const getFormatIcon = (format: ReportFormat) => {
    switch (format) {
      case 'pdf': return <FileText className="w-5 h-5" />
      case 'excel': return <FileSpreadsheet className="w-5 h-5" />
      case 'json': return <Code className="w-5 h-5" />
    }
  }

  const getFormatDescription = (format: ReportFormat) => {
    switch (format) {
      case 'pdf': return 'Professional PDF report with charts and detailed analysis'
      case 'excel': return 'Raw data in Excel format for custom analysis'
      case 'json': return 'Structured JSON data for developers and API integration'
    }
  }

  return (
    <Card className={className}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Download className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold">Generate Risk Report</h3>
        </div>

        {/* Report Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Location</span>
            </div>
            <div className="font-medium">
              {city ? `${city}, ${country}` : country}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Generated</span>
            </div>
            <div className="font-medium">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Format Selection */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Select Format</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(['pdf', 'excel', 'json'] as ReportFormat[]).map(format => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedFormat === format
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {getFormatIcon(format)}
                  <span className="font-medium uppercase">{format}</span>
                </div>
                <p className="text-xs text-gray-400">
                  {getFormatDescription(format)}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={generateReport}
          disabled={isGenerating}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating {selectedFormat.toUpperCase()}...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Generate {selectedFormat.toUpperCase()} Report
            </>
          )}
        </Button>

        {/* Report Result */}
        {reportResult && (
          <div className={`mt-4 p-4 rounded-lg ${
            reportResult.success 
              ? 'bg-green-500/10 border border-green-500/30' 
              : 'bg-red-500/10 border border-red-500/30'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {reportResult.success ? (
                <Shield className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              )}
              <span className={`font-medium ${
                reportResult.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {reportResult.success ? 'Report Generated Successfully' : 'Generation Failed'}
              </span>
            </div>
            
            {reportResult.message && (
              <p className="text-sm text-gray-400">{reportResult.message}</p>
            )}

            {reportResult.success && reportResult.format !== 'json' && (
              <div className="mt-3 text-xs text-gray-400">
                <p>The {reportResult.format} generation is not yet fully implemented.</p>
                <p>Download the JSON format now or check back soon for full PDF/Excel support.</p>
              </div>
            )}
          </div>
        )}

        {/* Report Preview */}
        {riskData && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Report Preview</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold">{riskData.overall || 0}</div>
                <div className="text-xs text-gray-400">Overall Risk</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{riskData.weather || 0}</div>
                <div className="text-xs text-gray-400">Weather</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{riskData.political || 0}</div>
                <div className="text-xs text-gray-400">Political</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{riskData.health || 0}</div>
                <div className="text-xs text-gray-400">Health</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{riskData.infrastructure || 0}</div>
                <div className="text-xs text-gray-400">Infrastructure</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}