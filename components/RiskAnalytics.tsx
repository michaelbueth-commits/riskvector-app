'use client'

import { useState, useEffect } from 'react'
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts'
import { format, parseISO, subDays } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus, BarChart3, Activity, AlertTriangle } from 'lucide-react'

interface HistoricalDataPoint {
  date: string
  riskScore: number
  alerts: number
  policeReports: number
  category: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'MINIMAL'
}

interface AnalyticsResponse {
  success: boolean
  country: string
  city?: string
  period: string
  data: HistoricalDataPoint[]
  analytics: {
    averageRiskScore: number
    maxRiskScore: number
    minRiskScore: number
    totalAlerts: number
    totalPoliceReports: number
    trend: 'increasing' | 'decreasing' | 'stable'
    riskCategory: string
  }
}

interface RiskAnalyticsProps {
  country: string
  city?: string
  className?: string
}

const COLORS = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#eab308',
  LOW: '#22c55e',
  MINIMAL: '#3b82f6'
}

export default function RiskAnalytics({ country, city, className }: RiskAnalyticsProps) {
  const [data, setData] = useState<AnalyticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [country, city, period])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/risk/${encodeURIComponent(country)}/historical?period=${period}${city ? `&city=${encodeURIComponent(city)}` : ''}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className={className}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-40 bg-gray-700 rounded mb-4"></div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (!data || !data.success) {
    return (
      <Card className={className}>
        <div className="p-6">
          <div className="text-center text-gray-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-2" />
            <p>Analytics data unavailable</p>
          </div>
        </div>
      </Card>
    )
  }

  const { analytics } = data

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM dd')
  }

  const TrendIcon = analytics.trend === 'increasing' ? TrendingUp : 
                     analytics.trend === 'decreasing' ? TrendingDown : Minus

  return (
    <Card className={className}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Risk Analytics
              {city && <span className="text-sm text-gray-400">for {city}</span>}
            </h3>
            <p className="text-sm text-gray-400">
              {data.country} • {data.period === '30d' ? 'Last 30 Days' : data.period}
            </p>
          </div>
          
          {/* Period Selector */}
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-md text-sm transition ${
                  period === p 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{analytics.averageRiskScore}</div>
            <div className="text-sm text-gray-400">Avg Risk Score</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendIcon className={`w-3 h-3 ${
                analytics.trend === 'increasing' ? 'text-red-500' : 
                analytics.trend === 'decreasing' ? 'text-green-500' : 'text-gray-500'
              }`} />
              <span className="text-xs">{analytics.trend}</span>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-400">{analytics.totalAlerts}</div>
            <div className="text-sm text-gray-400">Total Alerts</div>
            <div className="text-xs text-gray-500 mt-1">
              {Math.round(analytics.totalAlerts / 30)} daily avg
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{analytics.totalPoliceReports}</div>
            <div className="text-sm text-gray-400">Police Reports</div>
            <div className="text-xs text-gray-500 mt-1">
              {Math.round(analytics.totalPoliceReports / 30)} daily avg
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <Badge className={`${
              analytics.riskCategory === 'CRITICAL' ? 'border-red-500 text-red-500' :
              analytics.riskCategory === 'HIGH' ? 'border-orange-500 text-orange-500' :
              analytics.riskCategory === 'MEDIUM' ? 'border-yellow-500 text-yellow-500' :
              analytics.riskCategory === 'LOW' ? 'border-green-500 text-green-500' :
              'border-blue-500 text-blue-500'
            }`}>
              {analytics.riskCategory} RISK
            </Badge>
            <div className="text-sm text-gray-400 mt-1">Category</div>
          </div>
        </div>

        {/* Risk Score Trend Chart */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Risk Score Trend</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  stroke="#9CA3AF"
                />
                <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelFormatter={(label) => format(parseISO(label), 'MMM dd, yyyy')}
                />
                <Area
                  type="monotone"
                  dataKey="riskScore"
                  stroke={COLORS[analytics.riskCategory] || COLORS.LOW}
                  fill={COLORS[analytics.riskCategory] || COLORS.LOW}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <ReferenceLine 
                  y={analytics.averageRiskScore} 
                  stroke="#6B7280" 
                  strokeDasharray="3 3"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts & Police Reports Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Daily Incidents</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  stroke="#9CA3AF"
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelFormatter={(label) => format(parseISO(label), 'MMM dd, yyyy')}
                />
                <Bar dataKey="alerts" fill="#ef4444" name="Global Alerts" radius={[2, 2, 0, 0]} />
                <Bar dataKey="policeReports" fill="#3b82f6" name="Police Reports" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  )
}