import { NextResponse } from 'next/server'
// import { getEmergencyContactsByCountry, getPricingModel } from '@/lib/emergencyContacts'

export async function GET(
  request: Request,
  { params }: { params: { country: string } }
) {
  const countryName = decodeURIComponent(params.country)
  
  try {
    // Get comprehensive emergency contacts for the country
    const emergencyInfo = getEmergencyContactsByCountry(countryName)
    
    if (!emergencyInfo) {
      return NextResponse.json({
        error: 'Emergency information not found for this country',
        country: countryName,
        available: emergencyInfo ? undefined : 'Contact support to add this country'
      }, { status: 404 })
    }
    
    // Get pricing models
    const pricingModels = {
      FREE: getPricingModel('FREE'),
      PROFESSIONAL: getPricingModel('PROFESSIONAL'),
      ENTERPRISE: getPricingModel('ENTERPRISE'),
      GOVERNMENT: getPricingModel('GOVERNMENT')
    }
    
    // Generate emergency contact cards
    const generateContactCard = (contacts: any[], category: string) => {
      if (!contacts || contacts.length === 0) {
        return {
          category,
          hasContacts: false,
          message: `No specific ${category.toLowerCase()} contacts available in our database`
        }
      }
      
      return {
        category,
        hasContacts: true,
        contacts: contacts.map(contact => ({
          id: contact.id,
          name: contact.name,
          type: contact.type,
          description: contact.description,
          phone: contact.phone,
          phone24h: contact.phone24h || contact.phone,
          alternatePhone: contact.alternatePhone,
          email: contact.email,
          website: contact.website,
          address: contact.address,
          operatingHours: contact.operatingHours,
          services: contact.services,
          languages: contact.languages,
          verified: contact.verified,
          lastUpdated: contact.lastUpdated
        }))
      }
    }
    
    // Compile all emergency information
    const emergencyData = {
      country: emergencyInfo.country,
      countryCode: emergencyInfo.countryCode,
      continent: emergencyInfo.continent,
      emergencyNumber: emergencyInfo.emergencyNumber,
      warning: emergencyInfo.warning,
      notes: emergencyInfo.notes,
      
      // Emergency services categories
      services: {
        police: generateContactCard(emergencyInfo.police, 'Police'),
        medical: generateContactCard(emergencyInfo.medical, 'Medical'),
        fire: generateContactCard(emergencyInfo.fire, 'Fire & Rescue'),
        embassies: generateContactCard(emergencyInfo.embassies, 'Embassies'),
        consulates: generateContactCard(emergencyInfo.consulates, 'Consulates'),
        international: generateContactCard(emergencyInfo.internationalHelp, 'International Organizations'),
        ngos: generateContactCard(emergencyInfo.ngos, 'Non-Governmental Organizations'),
        government: generateContactCard(emergencyInfo.governmentHotlines, 'Government Hotlines'),
        travel: generateContactCard(emergencyInfo.travelAssistance, 'Travel Assistance'),
        disaster: generateContactCard(emergencyInfo.disasterResponse, 'Disaster Response')
      },
      
      // Quick emergency reference
      quickReference: {
        emergencyNumber: emergencyInfo.emergencyNumber,
        police: emergencyInfo.police[0]?.phone || 'Not available',
        medical: emergencyInfo.medical[0]?.phone || 'Not available',
        fire: emergencyInfo.fire[0]?.phone || 'Not available',
        mostCriticalEmergency: emergencyInfo.warning || 'No current emergency',
        recommendedActions: emergencyInfo.notes.split('. ').filter(s => s.trim().length > 0)
      },
      
      // Support and pricing information
      support: {
        pricing: pricingModels,
        importantNotice: '⚠️ NO PERSONAL SUPPORT PROVIDED: This service provides verified emergency contact information but does not offer personal assistance, field support, or individual emergency response. All support is automated or self-service.',
        selfServiceResources: [
          'Verify emergency numbers with local authorities before use',
          'Contact emergency services directly - this platform provides contact information only',
          'For medical emergencies, call local emergency numbers immediately',
          'For consular emergencies, contact your country\'s embassy or consulate directly',
          'Keep multiple copies of emergency contacts in different formats'
        ],
        limitations: [
          'No personal field assistance available',
          'No direct emergency response services',
          'No verification of emergency contact accuracy in real-time',
          'No personal crisis counseling',
          'No emergency translation services'
        ]
      },
      
      // Data verification
      dataVerification: {
        lastUpdated: emergencyInfo.lastUpdated,
        verificationStatus: 'Contacts are verified periodically but may change without notice',
        userResponsibility: 'Users must verify emergency numbers before relying on them for critical situations',
        updateFrequency: 'Emergency contact database is updated quarterly with the latest available information'
      },
      
      // Emergency protocol
      emergencyProtocol: [
        '1. CALL EMERGENCY SERVICES: Dial the universal emergency number for immediate assistance',
        '2. CONTACT YOUR EMBASSY: For international emergencies, contact your country\'s embassy or consulate',
        '3. USE INTERNATIONAL HELP: Contact UN agencies, Red Cross/Red Crescent for humanitarian emergencies',
        '4. SEEK LOCAL ASSISTANCE: Local emergency services and hospitals are often fastest for immediate needs',
        '5. STAY INFORMED: Monitor local news and official government channels for emergency information',
        '6. KEEP DOCUMENTS READY: Have passport, visas, insurance documents and emergency contacts accessible',
        '7. STAY CONNECTED: Maintain communication with family and inform them of your status'
      ],
      
      lastUpdated: new Date().toISOString(),
      dataTimestamp: emergencyInfo.lastUpdated
    }
    
    return NextResponse.json(emergencyData)
    
  } catch (error) {
    console.error('Emergency API error:', error)
    
    return NextResponse.json({
      error: 'Failed to fetch emergency information',
      country: countryName,
      support: 'Please try again or contact technical support if the issue persists'
    }, { status: 500 })
  }
}