'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Phone, Mail, Globe, Clock, MapPin, AlertTriangle, Shield, Info, ExternalLink } from 'lucide-react'

interface EmergencyContact {
  id: string
  name: string
  type: 'government' | 'police' | 'medical' | 'fire' | 'embassy' | 'consulate' | 'international' | 'ngo'
  phone?: string
  phone24h?: string
  alternatePhone?: string
  email?: string
  website?: string
  address?: string
  operatingHours?: string
  services?: string[]
  languages?: string[]
  verified?: boolean
  lastUpdated: string
}

interface EmergencyCategory {
  category: string
  hasContacts: boolean
  contacts?: EmergencyContact[]
  message?: string
}

interface PricingModel {
  name: string
  price: string
  features: string[]
  limitations: string[]
  support: string
}

interface EmergencyData {
  country: string
  countryCode: string
  continent: string
  emergencyNumber: string
  warning: string
  notes: string
  services: {
    police: EmergencyCategory
    medical: EmergencyCategory
    fire: EmergencyCategory
    embassies: EmergencyCategory
    consulates: EmergencyCategory
    international: EmergencyCategory
    ngos: EmergencyCategory
    government: EmergencyCategory
    travel: EmergencyCategory
    disaster: EmergencyCategory
  }
  quickReference: {
    emergencyNumber: string
    police: string
    medical: string
    fire: string
    mostCriticalEmergency: string
    recommendedActions: string[]
  }
  support: {
    pricing: Record<string, PricingModel>
    importantNotice: string
    selfServiceResources: string[]
    limitations: string[]
  }
  dataVerification: {
    lastUpdated: string
    verificationStatus: string
    userResponsibility: string
    updateFrequency: string
  }
  emergencyProtocol: string[]
  lastUpdated: string
  dataTimestamp: string
}

export default function EmergencyPage({ data }: { data: EmergencyData }) {
  const [activeTab, setActiveTab] = useState('quick-reference')

  const ContactCard = ({ contact }: { contact: EmergencyContact }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg">{contact.name}</CardTitle>
            <Badge className={`text-xs ${contact.verified ? 'bg-green-500' : 'bg-yellow-500'}`}>
              {contact.verified ? 'Verified' : 'Unverified'}
            </Badge>
          </div>
          <Badge className="text-xs border border-gray-500">
            {contact.type}
          </Badge>
        </div>
        
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {contact.phone24h && (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">24/7 Emergency</p>
                <p className="font-medium">{contact.phone24h}</p>
              </div>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium">{contact.phone}</p>
              </div>
            </div>
          )}
          {contact.email && (
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-sm">{contact.email}</p>
              </div>
            </div>
          )}
          {contact.website && (
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <div>
                <p className="text-xs text-gray-500">Website</p>
                <a 
                  href={contact.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-sm text-blue-600 hover:underline"
                >
                  Visit <ExternalLink className="inline h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          )}
          {contact.address && (
            <div className="flex items-start space-x-2 md:col-span-2">
              <MapPin className="h-4 w-4 mt-1" />
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <p className="font-medium text-sm">{contact.address}</p>
              </div>
            </div>
          )}
        </div>
        
        {contact.operatingHours && (
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="h-4 w-4" />
            <div>
              <p className="text-xs text-gray-500">Hours</p>
              <p className="font-medium text-sm">{contact.operatingHours}</p>
            </div>
          </div>
        )}
        
        {contact.services && contact.services.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Services</p>
            <div className="flex flex-wrap gap-1">
              {contact.services.map((service, index) => (
                <Badge key={index} className="text-xs bg-gray-200 text-gray-800">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {contact.languages && contact.languages.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Languages</p>
            <div className="flex flex-wrap gap-1">
              {contact.languages.map((language, index) => (
                <Badge key={index} className="text-xs border border-gray-500">
                  {language}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const CategorySection = ({ category, data }: { category: string; data: EmergencyCategory }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        {category}
        {!data.hasContacts && (
          <Badge className="ml-2 bg-gray-200 text-gray-800">No Data</Badge>
        )}
      </h3>
      {data.hasContacts && data.contacts ? (
        data.contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))
      ) : (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No Specific Contacts</AlertTitle>
          <AlertDescription>{data.message}</AlertDescription>
        </Alert>
      )}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header with country info and warning */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Emergency Contacts - {data.country}</h1>
            <p className="text-gray-600">Comprehensive emergency assistance information</p>
          </div>
          <Badge className={data.warning.includes('HIGH RISK') || data.warning.includes('CRITICAL') ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'}>
            {data.warning}
          </Badge>
        </div>
        
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Emergency Number</AlertTitle>
          <AlertDescription className="text-lg font-semibold">
            {data.emergencyNumber} - Universal emergency number for {data.country}
          </AlertDescription>
        </Alert>
        
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Notice</AlertTitle>
          <AlertDescription>
            {data.support.importantNotice}
          </AlertDescription>
        </Alert>
      </div>

      {/* Main content tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quick-reference">Quick Reference</TabsTrigger>
          <TabsTrigger value="emergency-services">Emergency Services</TabsTrigger>
          <TabsTrigger value="international">International Support</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Support</TabsTrigger>
        </TabsList>

        <TabsContent value="quick-reference" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Emergency Reference</CardTitle>
              <CardDescription>
                Most critical emergency contacts for immediate assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-red-50 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="h-5 w-5 text-red-600" />
                    <span className="font-semibold">Emergency</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">{data.quickReference.emergencyNumber}</p>
                  <p className="text-sm text-gray-600">Universal</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">Police</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{data.quickReference.police}</p>
                  <p className="text-sm text-gray-600">Law Enforcement</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Medical</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{data.quickReference.medical}</p>
                  <p className="text-sm text-gray-600">Healthcare</p>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span className="font-semibold">Fire</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{data.quickReference.fire}</p>
                  <p className="text-sm text-gray-600">Rescue Services</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">⚠️ Most Critical Emergency</h4>
                <p className="font-medium">{data.quickReference.mostCriticalEmergency}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">Recommended Actions</h4>
                <ul className="list-disc list-inside space-y-1">
                  {data.quickReference.recommendedActions.map((action, index) => (
                    <li key={index} className="text-sm">{action}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">📋 Emergency Protocol</h4>
                <ol className="list-decimal list-inside space-y-1">
                  {data.emergencyProtocol.map((step, index) => (
                    <li key={index} className="text-sm">{step}</li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency-services" className="space-y-6">
          <CategorySection category="Police" data={data.services.police} />
          <CategorySection category="Medical" data={data.services.medical} />
          <CategorySection category="Fire & Rescue" data={data.services.fire} />
          <CategorySection category="Government Hotlines" data={data.services.government} />
          <CategorySection category="Travel Assistance" data={data.services.travel} />
          <CategorySection category="Disaster Response" data={data.services.disaster} />
        </TabsContent>

        <TabsContent value="international" className="space-y-6">
          <CategorySection category="Embassies" data={data.services.embassies} />
          <CategorySection category="Consulates" data={data.services.consulates} />
          <CategorySection category="International Organizations" data={data.services.international} />
          <CategorySection category="Non-Governmental Organizations" data={data.services.ngos} />
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Support Model Notice</AlertTitle>
            <AlertDescription>
              {data.support.importantNotice}
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data.support.pricing).map(([key, model]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {model.name}
                    <Badge className="border border-gray-500">{model.price}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {model.support}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Features</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {model.features.map((feature, index) => (
                          <li key={index} className="text-sm">{feature}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Limitations</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {model.limitations.map((limitation, index) => (
                          <li key={index} className="text-sm">{limitation}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button className="w-full" variant={key === 'FREE' ? 'outline' : 'default'}>
                      {key === 'FREE' ? 'Current Plan' : 'Upgrade'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Self-Service Resources</CardTitle>
              <CardDescription>
                Important information for using this emergency contact service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {data.support.selfServiceResources.map((resource, index) => (
                  <li key={index} className="text-sm">{resource}</li>
                ))}
              </ul>
              
              <div className="mt-4 p-3 bg-red-50 rounded-lg border">
                <h4 className="font-semibold text-red-800 mb-2">Critical Limitations</h4>
                <ul className="list-disc list-inside space-y-1">
                  {data.support.limitations.map((limitation, index) => (
                    <li key={index} className="text-sm text-red-700">{limitation}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium">{data.dataVerification.lastUpdated}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Update Frequency</p>
                  <p className="font-medium">{data.dataVerification.updateFrequency}</p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border">
                <h4 className="font-semibold text-yellow-800 mb-1">User Responsibility</h4>
                <p className="text-sm text-yellow-700">{data.dataVerification.userResponsibility}</p>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                <h4 className="font-semibold text-gray-800 mb-1">Verification Status</h4>
                <p className="text-sm text-gray-700">{data.dataVerification.verificationStatus}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer with timestamps */}
      <div className="text-center text-sm text-gray-500 pt-4 border-t">
        <p>Emergency contact database for {data.country}</p>
        <p>Data last updated: {data.dataTimestamp}</p>
        <p>Page generated: {data.lastUpdated}</p>
        <p className="mt-2">⚠️ Always verify emergency numbers with local authorities before use</p>
      </div>
    </div>
  )
}