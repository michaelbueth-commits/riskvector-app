/**
 * Bad Kreuznach Police Intelligence Component
 * Displays local police reports and risk assessment for Bad Kreuznach
 */

'use client'

import { useState, useEffect } from 'react'

interface PoliceReport {
  id: string
  title: string
  description: string
  category: string
  severity: string
  timestamp: string
  location: {
    city: string
    district?: string
    street?: string
  }
  status: string
}

interface PoliceStats {
  period: string
  totalIncidents: number
  byCategory: Record<string, number>
  byDistrict: Record<string, number>
  trend: string
  hotspots: Array<{
    district: string
    incidentCount: number
    riskLevel: number
  }>
}

interface RiskAssessment {
  overallRisk: number
  riskLevel: string
  interpretation: string
  recommendations: string[]
}

interface EmergencyInfo {
  policeEmergency: string
  policeStation: {
    address: string
    phone: string
    website: string
  }
  importantNumbers: {
    policeNonEmergency: string
    localCourt: string
    citizenAdvice: string
  }
}

interface BadKreuznachPoliceData {
  city: string
  state: string
  population: string
  policeDepartment: string
  lastUpdated: string
  currentAlerts: PoliceReport[]
  latestReports: PoliceReport[]
  crimeStatistics: PoliceStats
  riskAssessment: RiskAssessment
  districts: Array<{
    name: string
    incidentCount: number
    riskLevel: string
  }>
  emergencyInfo: EmergencyInfo
  dataSources: Array<{
    name: string
    type: string
    url: string
    reliability: string
  }>
  disclaimer: string
}

export default function BadKreuznachPoliceSection({ data }: { data: BadKreuznachPoliceData }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  
  const filteredReports = selectedCategory === 'ALL' 
    ? data.latestReports 
    : data.latestReports.filter(report => report.category === selectedCategory)

  const getSeverityColor = (severity: string) => {
    const colors = {
      'LOW': 'bg-green-100 text-green-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800', 
      'HIGH': 'bg-orange-100 text-orange-800',
      'CRITICAL': 'bg-red-100 text-red-800'
    }
    return colors[severity as keyof typeof colors] || colors['LOW']
  }

  const getRiskLevelColor = (level: string) => {
    const colors = {
      'LOW': 'text-green-600 bg-green-50',
      'MEDIUM': 'text-yellow-600 bg-yellow-50',
      'HIGH': 'text-orange-600 bg-orange-50',
      'CRITICAL': 'text-red-600 bg-red-50'
    }
    return colors[level as keyof typeof colors] || colors['LOW']
  }

  const categories = Array.from(new Set(data.latestReports.map(report => report.category)))

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            🚔 {data.city} Polizei-Intelligenz
          </h2>
          <p className="text-gray-600">
            {data.state} • {data.population} Einwohner • {data.policeDepartment}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(data.riskAssessment.riskLevel)}`}>
          {data.riskAssessment.riskLevel}
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-lg font-semibold text-blue-900">
            Sicherheits-Risiko: {data.riskAssessment.overallRisk}/100
          </span>
          <span className={`px-2 py-1 rounded-full text-sm ${getRiskLevelColor(data.riskAssessment.riskLevel)}`}>
            {data.riskAssessment.riskLevel}
          </span>
        </div>
        <p className="text-blue-800 text-sm mb-3">{data.riskAssessment.interpretation}</p>
        
        <div className="flex flex-wrap gap-2">
          {data.riskAssessment.recommendations.slice(0, 3).map((rec, index) => (
            <span key={index} className="bg-white text-blue-700 px-2 py-1 rounded text-xs">
              💡 {rec}
            </span>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{data.crimeStatistics.totalIncidents}</div>
          <div className="text-xs text-gray-600">Vorfälle (30 Tage)</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{data.currentAlerts.length}</div>
          <div className="text-xs text-gray-600">Aktive Meldungen</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{data.districts.length}</div>
          <div className="text-xs text-gray-600">Stadtteile</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className={`text-lg font-bold ${
            data.crimeStatistics.trend === 'INCREASING' ? 'text-red-600' :
            data.crimeStatistics.trend === 'DECREASING' ? 'text-green-600' : 'text-yellow-600'
          }`}>
            {data.crimeStatistics.trend === 'INCREASING' ? '↗️' :
             data.crimeStatistics.trend === 'DECREASING' ? '↘️' : '➡️'}
          </div>
          <div className="text-xs text-gray-600">Trend</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            selectedCategory === 'ALL' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Alle Kategorien
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedCategory === category 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Latest Reports */}
      <div className="space-y-3 mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Aktuelle Polizeimeldungen</h3>
        {filteredReports.length === 0 ? (
          <p className="text-gray-500 text-sm">Keine aktuellen Meldungen für diese Kategorie</p>
        ) : (
          filteredReports.map(report => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                      {report.severity}
                    </span>
                    <span className="text-xs text-gray-500">{report.category}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(report.timestamp).toLocaleString('de-DE')}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm">{report.title}</h4>
                  {report.location.street && (
                    <p className="text-xs text-gray-600 mt-1">📍 {report.location.street}</p>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  report.status === 'ACTIVE' ? 'bg-red-100 text-red-800' :
                  report.status === 'INVESTIGATING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {report.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* District Risk */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Stadtteile - Risikoübersicht</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.districts.map(district => (
            <div key={district.name} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900 text-sm">{district.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(district.riskLevel)}`}>
                  {district.riskLevel}
                </span>
              </div>
              <p className="text-xs text-gray-600">{district.incidentCount} Vorfälle</p>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Information */}
      <div className="bg-red-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-red-900 mb-3">🚨 Notfallkontakte</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-red-800">Polizei-Notruf</p>
            <p className="text-red-700 text-lg font-bold">{data.emergencyInfo.policeEmergency}</p>
          </div>
          <div>
            <p className="font-medium text-red-800">Polizeistation</p>
            <p className="text-red-700">{data.emergencyInfo.policeStation.address}</p>
            <p className="text-red-700">📞 {data.emergencyInfo.policeStation.phone}</p>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Datenquellen:</strong></p>
        {data.dataSources.map((source, index) => (
          <p key={index}>• {source.name} ({source.type}) - {source.reliability}</p>
        ))}
        <p className="mt-2"><strong>Letzte Aktualisierung:</strong> {new Date(data.lastUpdated).toLocaleString('de-DE')}</p>
        <p className="italic">{data.disclaimer}</p>
      </div>
    </div>
  )
}