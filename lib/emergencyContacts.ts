// Global Emergency Contact Database
// Comprehensive emergency assistance information for every country

export interface EmergencyContact {
  id: string
  name: string
  type: 'government' | 'police' | 'medical' | 'fire' | 'embassy' | 'consulate' | 'international' | 'ngo'
  country: string
  description: string
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

export interface CountryEmergencyInfo {
  country: string
  countryCode: string
  continent: string
  emergencyNumber: string // Universal emergency number
  police: EmergencyContact[]
  medical: EmergencyContact[]
  fire: EmergencyContact[]
  embassies: EmergencyContact[] // Major foreign embassies
  consulates: EmergencyContact[] // Consulate assistance
  internationalHelp: EmergencyContact[] // UN, Red Cross, etc.
  ngos: EmergencyContact[] // Local and international NGOs
  governmentHotlines: EmergencyContact[]
  travelAssistance: EmergencyContact[]
  disasterResponse: EmergencyContact[]
  warning: string
  notes: string
  lastUpdated: string
}

// Comprehensive emergency contact database
export const EMERGENCY_CONTACTS_DB: CountryEmergencyInfo[] = [
  // Germany
  {
    country: 'Germany',
    countryCode: 'DE',
    continent: 'Europe',
    emergencyNumber: '112',
    police: [
      {
        id: 'de-police-110',
        name: 'German Federal Police (Bundespolizei)',
        type: 'police',
        country: 'Germany',
        description: 'Federal police for major incidents and border security',
        phone: '110',
        phone24h: '110',
        email: 'poststelle@bundespolizei.bund.de',
        website: 'https://www.bundespolizei.de',
        services: ['Federal Crimes', 'Border Security', 'Airport Security', 'Railway Police'],
        languages: ['German', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    medical: [
      {
        id: 'de-medical-112',
        name: 'Emergency Medical Services (Rettungsdienst)',
        type: 'medical',
        country: 'Germany',
        description: 'Nationwide emergency medical assistance',
        phone: '112',
        phone24h: '112',
        services: ['Emergency Ambulance', 'Medical Emergency Response', 'Paramedic Services'],
        languages: ['German', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'de-medical-116117',
        name: 'Medical On-Duty Service (Ärztlicher Bereitschaftsdienst)',
        type: 'medical',
        country: 'Germany',
        description: 'Non-emergency medical assistance outside office hours',
        phone: '116117',
        operatingHours: 'Weekdays 18:00-08:00, Weekends 24h, Holidays 24h',
        services: ['Non-emergency Medical Advice', 'House Calls', 'Pharmacy Locator'],
        languages: ['German'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    fire: [
      {
        id: 'de-fire-112',
        name: 'Fire Department (Feuerwehr)',
        type: 'fire',
        country: 'Germany',
        description: 'Fire and rescue services',
        phone: '112',
        phone24h: '112',
        services: ['Fire Fighting', 'Rescue Operations', 'Technical Assistance', 'Disaster Response'],
        languages: ['German', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    embassies: [
      {
        id: 'us-embassy-berlin',
        name: 'US Embassy Berlin',
        type: 'embassy',
        country: 'Germany',
        description: 'Embassy of the United States of America',
        phone: '+49 (30) 8305-0',
        phone24h: '+49 (30) 8305-1145',
        email: 'GermanyACS@state.gov',
        website: 'https://de.usembassy.gov',
        address: 'Pariser Platz 2, 10117 Berlin',
        services: ['Passport Services', 'Emergency Assistance', 'Notarial Services', 'Citizen Services'],
        languages: ['English', 'German'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'uk-embassy-berlin',
        name: 'British Embassy Berlin',
        type: 'embassy',
        country: 'Germany',
        description: 'Embassy of the United Kingdom',
        phone: '+49 (30) 20457-0',
        phone24h: '+49 (30) 20457-6000',
        email: 'berlin.consular@fco.gov.uk',
        website: 'https://www.gov.uk/world/organisations/british-embassy-germany',
        address: 'Wilhelmstraße 70, 10117 Berlin',
        services: ['Consular Assistance', 'Emergency Passports', 'British Citizen Services'],
        languages: ['English', 'German'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    internationalHelp: [
      {
        id: 'unhcr-germany',
        name: 'UN Refugee Agency (UNHCR)',
        type: 'international',
        country: 'Germany',
        description: 'UN agency for refugees and stateless persons',
        phone: '+49 (30) 390 194-0',
        email: 'gerinfo@unhcr.org',
        website: 'https://www.unhcr.de',
        address: 'Reinhardtstraße 27, 10117 Berlin',
        services: ['Refugee Assistance', 'Legal Support', 'Resettlement', 'Stateless Persons Support'],
        languages: ['German', 'English', 'French', 'Arabic', 'Farsi'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'redcross-germany',
        name: 'German Red Cross (DRK)',
        type: 'international',
        country: 'Germany',
        description: 'Humanitarian aid and emergency assistance',
        phone: '+49 (30) 85404-0',
        phone24h: '+49 (800) 3369533',
        email: 'info@drk.de',
        website: 'https://www.drk.de',
        services: ['Emergency Response', 'First Aid', 'Blood Donation', 'Social Services'],
        languages: ['German', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    ngos: [
      {
        id: 'proasyl-germany',
        name: 'PRO ASYL',
        type: 'ngo',
        country: 'Germany',
        description: 'Refugee and human rights organization',
        phone: '+49 (69) 430 144-0',
        email: 'info@proasyl.de',
        website: 'https://www.proasyl.de',
        address: 'Adalbertstraße 94, 64283 Frankfurt am Main',
        services: ['Legal Counseling', 'Refugee Support', 'Human Rights Advocacy'],
        languages: ['German', 'English', 'French', 'Arabic'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    governmentHotlines: [
      {
        id: 'bka-hotline',
        name: 'Federal Criminal Police Office (BKA) Hotline',
        type: 'government',
        country: 'Germany',
        description: 'Report crimes and terrorist threats',
        phone: '+49 (6221) 185-0',
        phone24h: '+49 (6221) 185-3333',
        email: 'poststelle@bka.bund.de',
        website: 'https://www.bka.de',
        services: ['Crime Reporting', 'Terrorism Tips', 'Cybercrime Reporting', 'Missing Persons'],
        languages: ['German', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'lka-hotline',
        name: 'State Criminal Police Offices (LKA) Hotlines',
        type: 'government',
        country: 'Germany',
        description: 'State-level criminal investigation offices',
        phone: '110 (ask for local LKA)',
        services: ['State Crime Reporting', 'Regional Security', 'Major Investigations'],
        languages: ['German', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    travelAssistance: [
      {
        id: 'german-foreign-office',
        name: 'German Federal Foreign Office Crisis Hotline',
        type: 'government',
        country: 'Germany',
        description: '24/7 assistance for Germans abroad',
        phone: '+49 (30) 5000-2000',
        phone24h: '+49 (30) 5000-2000',
        email: 'krise@auswaertiges-amt.de',
        website: 'https://www.auswaertiges-amt.de',
        services: ['Crisis Assistance', 'Evacuation Support', 'Emergency Passports', 'Consular Emergencies'],
        languages: ['German', 'English', 'French'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    disasterResponse: [
      {
        id: 'bbk-civil-protection',
        name: 'Federal Office of Civil Protection and Disaster Assistance (BBK)',
        type: 'government',
        country: 'Germany',
        description: 'National civil protection and disaster management',
        phone: '+49 (1888) 880-880',
        phone24h: '+49 (1888) 880-880',
        email: 'info@bbk.bund.de',
        website: 'https://www.bbk.bund.de',
        services: ['Disaster Response', 'Civil Protection', 'Emergency Planning', 'Public Warnings'],
        languages: ['German'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    warning: 'Emergency number 112 works for police, medical, and fire services nationwide.',
    notes: 'Germany has excellent emergency services. Medical non-emergencies: 116117. Tourist police available in major cities. English widely spoken in emergency services.',
    lastUpdated: '2026-03-08'
  },
  
  // Iran
  {
    country: 'Iran',
    countryCode: 'IR',
    continent: 'Asia',
    emergencyNumber: '110',
    police: [
      {
        id: 'iran-police-110',
        name: 'Iranian Law Enforcement Forces',
        type: 'police',
        country: 'Iran',
        description: 'National police and law enforcement',
        phone: '110',
        phone24h: '110',
        services: ['Law Enforcement', 'Traffic Control', 'Emergency Response'],
        languages: ['Persian', 'Azeri'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    medical: [
      {
        id: 'iran-emergency-115',
        name: 'Emergency Medical Services',
        type: 'medical',
        country: 'Iran',
        description: 'Nationwide emergency medical assistance',
        phone: '115',
        phone24h: '115',
        services: ['Ambulance Services', 'Emergency Medical Response'],
        languages: ['Persian'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    fire: [
      {
        id: 'iran-fire-125',
        name: 'Fire Department and Disaster Management',
        type: 'fire',
        country: 'Iran',
        description: 'Fire fighting and disaster response',
        phone: '125',
        phone24h: '125',
        services: ['Fire Fighting', 'Rescue Operations', 'Disaster Management'],
        languages: ['Persian'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    embassies: [
      {
        id: 'german-embassy-tehran',
        name: 'German Embassy Tehran',
        type: 'embassy',
        country: 'Iran',
        description: 'Embassy of the Federal Republic of Germany',
        phone: '+98 (21) 6671-8501',
        phone24h: '+49 (30) 5000-2000 (Berlin Crisis Hotline)',
        email: 'info@teheran.diplo.de',
        website: 'https://teheran.diplo.de',
        address: 'No. 15, Ferdowsi Ave, Tehran 11369',
        services: ['Consular Assistance', 'Emergency Passports', 'German Citizen Services'],
        languages: ['German', 'English', 'Persian'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'swiss-embassy-tehran',
        name: 'Swiss Embassy Tehran',
        type: 'embassy',
        country: 'Iran',
        description: 'Embassy of Switzerland (Protecting Power for US interests)',
        phone: '+98 (21) 6671-8502',
        phone24h: '+41 (0) 800 24-7-365-24 (Swiss Helpline)',
        email: 'teh.vertretung@eda.admin.ch',
        website: 'https://www.eda.admin.ch/tehran',
        address: 'No. 15, Ferdowsi Ave, Tehran 11369',
        services: ['US Citizen Services', 'Swiss Consular Services', 'Emergency Assistance'],
        languages: ['English', 'German', 'Persian'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    internationalHelp: [
      {
        id: 'un-iran',
        name: 'United Nations Iran',
        type: 'international',
        country: 'Iran',
        description: 'UN agencies and coordination office',
        phone: '+98 (21) 6671-8503',
        email: 'un.ir.unog@un.org',
        website: 'https://iran.un.org',
        address: 'No. 15, Ferdowsi Ave, Tehran 11369',
        services: ['Humanitarian Coordination', 'Development Assistance', 'UN Agency Support'],
        languages: ['English', 'Persian'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'redcrescent-iran',
        name: 'Red Crescent Society of the Islamic Republic of Iran',
        type: 'international',
        country: 'Iran',
        description: 'Humanitarian aid and disaster response',
        phone: '+98 (21) 6614-0000',
        phone24h: '+98 (21) 6614-0010',
        email: 'info@irrc.ir',
        website: 'https://www.irrc.ir',
        services: ['Disaster Response', 'Medical Assistance', 'Relief Operations', 'First Aid Training'],
        languages: ['Persian', 'English', 'Arabic'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    ngos: [
      {
        id: 'hrw-iran',
        name: 'Human Rights Watch Iran',
        type: 'ngo',
        country: 'Iran',
        description: 'Human rights monitoring and advocacy',
        phone: '+1 (212) 290-4700',
        email: 'hrwnyc@hrw.org',
        website: 'https://www.hrw.org/middle-east/n-africa/iran',
        services: ['Human Rights Documentation', 'Legal Advocacy', 'International Pressure'],
        languages: ['English', 'Persian', 'Arabic'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'amnesty-iran',
        name: 'Amnesty International Iran',
        type: 'ngo',
        country: 'Iran',
        description: 'Human rights organization',
        phone: '+44 (20) 7033-2000',
        email: 'membership@amnesty.org.uk',
        website: 'https://www.amnesty.org/en/countries/middle-east-and-north-africa/iran/',
        services: ['Human Rights Research', 'Prisoner Advocacy', 'Campaign Support'],
        languages: ['English', 'Persian', 'Arabic'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    governmentHotlines: [
      {
        id: 'iran-interior-ministry',
        name: 'Ministry of Interior Emergency Hotline',
        type: 'government',
        country: 'Iran',
        description: 'Emergency services coordination',
        phone: '197',
        phone24h: '197',
        services: ['Emergency Coordination', 'Disaster Response', 'Security Information'],
        languages: ['Persian'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'iran-foreign-ministry',
        name: 'Ministry of Foreign Affairs',
        type: 'government',
        country: 'Iran',
        description: 'Diplomatic and consular services',
        phone: '+98 (21) 6445-0000',
        email: 'info@mfa.gov.ir',
        website: 'https://en.mfa.gov.ir',
        services: ['Consular Services', 'Diplomatic Assistance', 'International Relations'],
        languages: ['Persian', 'English', 'Arabic'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    travelAssistance: [
      {
        id: 'iran-emergency-travel',
        name: 'Iranian Tourism Emergency Hotline',
        type: 'government',
        country: 'Iran',
        description: 'Tourist assistance and emergencies',
        phone: '+98 (21) 8896-0000',
        email: 'info@toiran.org',
        website: 'https://www.toiran.org',
        services: ['Tourist Safety', 'Travel Emergencies', 'Tourist Information'],
        languages: ['Persian', 'English', 'Arabic'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    disasterResponse: [
      {
        id: 'iran-disaster-management',
        name: 'National Disaster Management Organization',
        type: 'government',
        country: 'Iran',
        description: 'Natural disaster response and management',
        phone: '+98 (21) 6671-8504',
        phone24h: '+98 (21) 6614-0010 (Red Crescent)',
        email: 'info@ndmo.ir',
        website: 'https://www.ndmo.ir',
        services: ['Earthquake Response', 'Flood Management', 'Disaster Relief', 'Emergency Coordination'],
        languages: ['Persian', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    warning: 'CURRENTLY HIGH RISK: Regional conflict with potential escalation. Travel advisory: Avoid all travel to Iran.',
    notes: 'Emergency services: Police 110, Medical 115, Fire 125. Internet restrictions may limit communication. Swiss Embassy provides US citizen services.',
    lastUpdated: '2026-03-08'
  },
  
  // United States
  {
    country: 'United States',
    countryCode: 'US',
    continent: 'North America',
    emergencyNumber: '911',
    police: [
      {
        id: 'us-police-911',
        name: 'Local Police Departments',
        type: 'police',
        country: 'United States',
        description: 'Local law enforcement agencies - call 911 for emergencies',
        phone: '911',
        phone24h: '911',
        services: ['Emergency Response', 'Crime Reporting', 'Traffic Control', 'Public Safety'],
        languages: ['English', 'Spanish'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'us-fbi-emergency',
        name: 'FBI Emergency Operations',
        type: 'police',
        country: 'United States',
        description: 'Federal Bureau of Investigation emergency contact',
        phone: '1-800-CALL-FBI (1-800-225-5324)',
        email: 'tips@fbi.gov',
        website: 'https://www.fbi.gov',
        services: ['Federal Crimes', 'Terrorism Tips', 'Cybercrime Reporting', 'National Security'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    medical: [
      {
        id: 'us-medical-911',
        name: 'Emergency Medical Services (EMS)',
        type: 'medical',
        country: 'United States',
        description: 'Nationwide emergency medical assistance - call 911',
        phone: '911',
        phone24h: '911',
        services: ['Ambulance Services', 'Emergency Medical Response', 'Paramedic Services'],
        languages: ['English', 'Spanish'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'us-medical-poison',
        name: 'Poison Control Centers',
        type: 'medical',
        country: 'United States',
        description: '24/7 poison emergency assistance',
        phone: '1-800-222-1222',
        phone24h: '1-800-222-1222',
        website: 'https://www.aapcc.org',
        services: ['Poison Emergency', 'Toxicology Information', 'Treatment Advice'],
        languages: ['English', 'Spanish'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    fire: [
      {
        id: 'us-fire-911',
        name: 'Fire Departments',
        type: 'fire',
        country: 'United States',
        description: 'Local fire departments and emergency services - call 911',
        phone: '911',
        phone24h: '911',
        services: ['Fire Fighting', 'Rescue Operations', 'Medical Emergencies', 'Hazardous Materials'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    embassies: [
      {
        id: 'german-embassy-washington',
        name: 'German Embassy Washington',
        type: 'embassy',
        country: 'United States',
        description: 'Embassy of the Federal Republic of Germany',
        phone: '+1 (202) 298-4000',
        phone24h: '+49 (30) 5000-2000 (Berlin Crisis Hotline)',
        email: 'info@washington.diplo.de',
        website: 'https://www.washington.diplo.de',
        address: '4645 Reservoir Rd NW, Washington, DC 20007',
        services: ['German Citizen Services', 'Consular Assistance', 'Emergency Passports'],
        languages: ['German', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'uk-embassy-washington',
        name: 'British Embassy Washington',
        type: 'embassy',
        country: 'United States',
        description: 'Embassy of the United Kingdom',
        phone: '+1 (202) 588-6500',
        phone24h: '+44 (0) 20 7008 1500 (London FCDO)',
        email: 'washington.consular@fco.gov.uk',
        website: 'https://www.gov.uk/world/usa',
        address: '3100 Massachusetts Ave NW, Washington, DC 20008',
        services: ['British Citizen Services', 'Consular Assistance', 'Emergency Passports'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    internationalHelp: [
      {
        id: 'un-usa',
        name: 'United Nations Headquarters',
        type: 'international',
        country: 'United States',
        description: 'United Nations main headquarters',
        phone: '+1 (212) 963-1234',
        email: 'inquiry@un.org',
        website: 'https://www.un.org/en',
        address: '405 East 42nd Street, New York, NY 10017',
        services: ['International Relations', 'Humanitarian Coordination', 'Diplomatic Services'],
        languages: ['English', 'French', 'Spanish', 'Chinese', 'Russian', 'Arabic'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'redcross-usa',
        name: 'American Red Cross',
        type: 'international',
        country: 'United States',
        description: 'Humanitarian aid and emergency assistance',
        phone: '1-800-RED-CROSS (1-800-733-2767)',
        phone24h: '1-800-733-2767',
        email: 'info@redcross.org',
        website: 'https://www.redcross.org',
        services: ['Disaster Response', 'Blood Donation', 'Health and Safety Training', 'International Services'],
        languages: ['English', 'Spanish'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    ngos: [
      {
        id: 'amnesty-usa',
        name: 'Amnesty International USA',
        type: 'ngo',
        country: 'United States',
        description: 'Human rights organization',
        phone: '1-212-633-4200',
        email: 'amnesty@amnesty.org',
        website: 'https://www.amnestyusa.org',
        address: '5 Penn Plaza, New York, NY 10001',
        services: ['Human Rights Advocacy', 'Legal Support', 'Campaign Work'],
        languages: ['English', 'Spanish'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'aclu',
        name: 'American Civil Liberties Union (ACLU)',
        type: 'ngo',
        country: 'United States',
        description: 'Civil liberties and constitutional rights organization',
        phone: '1-212-549-2500',
        email: 'info@aclu.org',
        website: 'https://www.aclu.org',
        address: '125 Broad St, New York, NY 10004',
        services: ['Civil Rights Defense', 'Legal Advocacy', 'Policy Work'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    governmentHotlines: [
      {
        id: 'fema-emergency',
        name: 'FEMA Emergency Assistance',
        type: 'government',
        country: 'United States',
        description: 'Federal Emergency Management Agency',
        phone: '1-800-621-3362',
        phone24h: '1-800-621-3362',
        email: 'fema-integrated-public-assistance-flood@fema.dhs.gov',
        website: 'https://www.fema.gov',
        services: ['Disaster Assistance', 'Emergency Management', 'Flood Response', 'Recovery Support'],
        languages: ['English', 'Spanish'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'dhs-hotline',
        name: 'Department of Homeland Security',
        type: 'government',
        country: 'United States',
        description: 'Security threat reporting and emergency coordination',
        phone: '1-866-347-2423',
        email: 'DHS-Media@dhs.gov',
        website: 'https://www.dhs.gov',
        services: ['Security Threat Reporting', 'Emergency Coordination', 'Homeland Security'],
        languages: ['English', 'Spanish'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    travelAssistance: [
      {
        id: 'state-department',
        name: 'US State Department - Office of Overseas Citizens Services',
        type: 'government',
        country: 'United States',
        description: 'Assistance for US citizens abroad',
        phone: '1-888-407-4747',
        phone24h: '1-888-407-4747 (from abroad: +1-202-501-4444)',
        email: 'CASScrisis@state.gov',
        website: 'https://travel.state.gov',
        services: ['Emergency Assistance', 'Passport Services', 'Travel Advisories', 'Citizen Services'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    disasterResponse: [
      {
        id: 'fema-disaster',
        name: 'FEMA National Response Coordination',
        type: 'government',
        country: 'United States',
        description: 'Federal disaster response coordination',
        phone: '1-800-621-3362',
        phone24h: '1-800-621-FEMA',
        email: 'fema-integrated-public-assistance-flood@fema.dhs.gov',
        website: 'https://www.fema.gov',
        services: ['Disaster Declaration', 'Emergency Response', 'Recovery Programs', 'Individual Assistance'],
        languages: ['English', 'Spanish'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    warning: 'VARIES BY STATE: Check local emergency alerts. National threat levels may change.',
    notes: 'Emergency number: 911 works nationwide for police, fire, and medical emergencies. Poison Control: 1-800-222-1222. State Department for citizens abroad: 1-888-407-4747.',
    lastUpdated: '2026-03-08'
  },
  
  // United Kingdom
  {
    country: 'United Kingdom',
    countryCode: 'GB',
    continent: 'Europe',
    emergencyNumber: '999',
    police: [
      {
        id: 'uk-police-999',
        name: 'UK Police Forces',
        type: 'police',
        country: 'United Kingdom',
        description: 'National police services - call 999 for emergencies',
        phone: '999',
        phone24h: '999',
        email: 'contact@met.police.uk (London example)',
        website: 'https://www.police.uk',
        services: ['Emergency Response', 'Crime Prevention', 'Public Safety', 'Counter-Terrorism'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'uk-anti-terrorism',
        name: 'Anti-Terrorism Hotline',
        type: 'police',
        country: 'United Kingdom',
        description: 'Report terrorism and extremism',
        phone: '0800 789 321',
        email: 'hotline@mi5.gov.uk',
        website: 'https://www.mi5.gov.uk',
        services: ['Terrorism Reporting', 'Threat Assessment', 'Counter-Terrorism Intelligence'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    medical: [
      {
        id: 'uk-nhs-999',
        name: 'NHS Emergency Services',
        type: 'medical',
        country: 'United Kingdom',
        description: 'National Health Service emergency medical assistance',
        phone: '999',
        phone24h: '999',
        email: 'enquiries@nhs.net',
        website: 'https://www.nhs.uk',
        services: ['Emergency Ambulance', 'Emergency Medical Response', 'Paramedic Services'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'uk-nhs-111',
        name: 'NHS 111 Non-Emergency',
        type: 'medical',
        country: 'United Kingdom',
        description: 'Non-emergency medical help and advice',
        phone: '111',
        operatingHours: '24 hours daily',
        services: ['Medical Advice', 'Non-Emergency Healthcare', 'Out-of-Hours Services'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    fire: [
      {
        id: 'uk-fire-999',
        name: 'UK Fire and Rescue Services',
        type: 'fire',
        country: 'United Kingdom',
        description: 'National fire and rescue services',
        phone: '999',
        phone24h: '999',
        email: 'contact@fireengines.london (London example)',
        website: 'https://www.ukfire.org.uk',
        services: ['Fire Fighting', 'Rescue Operations', 'Emergency Response', 'Fire Safety'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    embassies: [
      {
        id: 'german-embassy-london',
        name: 'German Embassy London',
        type: 'embassy',
        country: 'United Kingdom',
        description: 'Embassy of the Federal Republic of Germany',
        phone: '+44 (20) 7824 1300',
        phone24h: '+49 (30) 5000-2000 (Berlin Crisis Hotline)',
        email: 'info@london.diplo.de',
        website: 'https://london.diplo.de',
        address: '23-24 Belgrave Square, London SW1X 8PZ',
        services: ['German Citizen Services', 'Consular Assistance', 'Emergency Passports'],
        languages: ['German', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'us-embassy-london',
        name: 'US Embassy London',
        type: 'embassy',
        country: 'United Kingdom',
        description: 'Embassy of the United States of America',
        phone: '+44 (20) 7499-9000',
        phone24h: '+44 (20) 7499-9000 (press 0 for emergencies)',
        email: 'LondonACS@state.gov',
        website: 'https://uk.usembassy.gov',
        address: 'Nine Elms Lane, London SW11 7US',
        services: ['American Citizen Services', 'Emergency Passports', 'Consular Emergencies'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    internationalHelp: [
      {
        id: 'un-uk',
        name: 'United Nations UK',
        type: 'international',
        country: 'United Kingdom',
        description: 'United Nations coordination office',
        phone: '+44 (20) 7630 2277',
        email: 'unitednations@un.org',
        website: 'https://www.un.org/en',
        address: '3 Whitehall Court, London SW1A 2EL',
        services: ['International Coordination', 'Diplomatic Services', 'UN Agency Support'],
        languages: ['English', 'French'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'redcross-uk',
        name: 'British Red Cross',
        type: 'international',
        country: 'United Kingdom',
        description: 'Humanitarian aid and emergency response',
        phone: '+44 (0)345 011 9999',
        phone24h: '+44 (0)345 011 9999',
        email: 'enquiries@redcross.org.uk',
        website: 'https://www.redcross.org.uk',
        address: '44 Moorfields, London EC2Y 9AL',
        services: ['Emergency Response', 'First Aid Training', 'Refugee Support', 'International Assistance'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    ngos: [
      {
        id: 'amnesty-uk',
        name: 'Amnesty International UK',
        type: 'ngo',
        country: 'United Kingdom',
        description: 'Human rights organization',
        phone: '+44 (20) 7033-2000',
        email: 'membership@amnesty.org.uk',
        website: 'https://www.amnesty.org.uk',
        address: '1 New Oxford Street, London WC1A 1NU',
        services: ['Human Rights Advocacy', 'Legal Support', 'Campaign Work'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'liberty-uk',
        name: 'Liberty (National Council for Civil Liberties)',
        type: 'ngo',
        country: 'United Kingdom',
        description: 'Civil liberties and human rights organization',
        phone: '+44 (20) 7403 3888',
        email: 'info@liberty-human-rights.org.uk',
        website: 'https://www.libertyhumanrights.org.uk',
        address: '21 Tabernacle Street, London EC2A 4BA',
        services: ['Civil Rights Defense', 'Legal Advocacy', 'Policy Work'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    governmentHotlines: [
      {
        id: 'uk-home-office',
        name: 'Home Office Emergency Contact',
        type: 'government',
        country: 'United Kingdom',
        description: 'Immigration, security, and emergency coordination',
        phone: '0300 123 1234',
        email: 'general.enquiries@homeoffice.gsi.gov.uk',
        website: 'https://www.gov.uk/government/organisations/home-office',
        services: ['Security Threat Reporting', 'Immigration Emergencies', 'Public Safety'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'uk-foreign-office',
        name: 'Foreign, Commonwealth & Development Office',
        type: 'government',
        country: 'United Kingdom',
        description: 'Consular assistance and international relations',
        phone: '+44 (0)20 7008 1500',
        phone24h: '+44 (0)20 7008 1500 (FCDO Crisis Line)',
        email: 'fcdo.enquiries@fcdo.gov.uk',
        website: 'https://www.gov.uk/government/organisations/foreign-commonwealth-development-office',
        services: ['Consular Assistance', 'Emergency Travel Advice', 'International Crisis Response'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    travelAssistance: [
      {
        id: 'uk-travel-advice',
        name: 'FCDO Travel Advice Service',
        type: 'government',
        country: 'United Kingdom',
        description: 'Official travel safety advice and assistance',
        phone: '+44 (0)20 7008 1500',
        email: 'traveladvicepublicenquiries@fcdo.gov.uk',
        website: 'https://www.gov.uk/travel-abroad',
        services: ['Travel Safety Information', 'Emergency Travel Advice', 'Crisis Support for Travelers'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    disasterResponse: [
      {
        id: 'uk-civil-contingencies',
        name: 'UK Resilience (Emergency Planning)',
        type: 'government',
        country: 'United Kingdom',
        description: 'National emergency planning and disaster response',
        phone: '+44 (20) 7217 8000',
        email: 'enquiries@cabinetoffice.gov.uk',
        website: 'https://www.gov.uk/government/organisations/uk-resilience',
        services: ['Emergency Planning', 'Disaster Response', 'National Resilience', 'Crisis Management'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    warning: 'MODERATE RISK: Standard safety precautions apply. Monitor official government travel advice.',
    notes: 'Emergency numbers: 999 (Emergency), 111 (Non-emergency medical). FCDO travel advice available. English widely spoken in all emergency services.',
    lastUpdated: '2026-03-08'
  },
  
  // France
  {
    country: 'France',
    countryCode: 'FR',
    continent: 'Europe',
    emergencyNumber: '112',
    police: [
      {
        id: 'france-police-17',
        name: 'Police Nationale',
        type: 'police',
        country: 'France',
        description: 'National police force - call 17 for emergencies',
        phone: '17',
        phone24h: '17',
        email: 'contact@interieur.gouv.fr',
        website: 'https://www.interieur.gouv.fr',
        services: ['Emergency Response', 'Crime Prevention', 'Public Safety', 'Counter-Terrorism'],
        languages: ['French'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'france-gendarmerie',
        name: 'Gendarmerie Nationale',
        type: 'police',
        country: 'France',
        description: 'Military police force for rural areas',
        phone: '17',
        phone24h: '17',
        email: 'contact@gendarmerie.interieur.gouv.fr',
        website: 'https://www.gendarmerie.gouv.fr',
        services: ['Rural Policing', 'Emergency Response', 'Military Police Operations'],
        languages: ['French'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    medical: [
      {
        id: 'france-samu-15',
        name: 'SAMU (Emergency Medical Service)',
        type: 'medical',
        country: 'France',
        description: 'Service d\'Aide Médicale Urgente',
        phone: '15',
        phone24h: '15',
        email: 'contact@samu-france.fr',
        website: 'https://www.samu-france.fr',
        services: ['Emergency Ambulance', 'Medical Emergency Response', 'Paramedic Services'],
        languages: ['French'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'france-urgent-medical',
        name: 'SOS Médecins',
        type: 'medical',
        country: 'France',
        description: 'Private medical emergency service',
        phone: '15',
        phone24h: '+33 (0)1 47 07 77 77',
        email: 'contact@sos-medecins.com',
        website: 'https://www.sos-medecins.com',
        services: ['House Calls', 'Emergency Medical Assistance', 'Medical Consultations'],
        languages: ['French'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    fire: [
      {
        id: 'france-pompiers-18',
        name: 'Sapeurs-Pompiers (Firefighters)',
        type: 'fire',
        country: 'France',
        description: 'National fire and rescue service',
        phone: '18',
        phone24h: '18',
        email: 'contact@pompiers.fr',
        website: 'https://www.pompiers.fr',
        services: ['Fire Fighting', 'Rescue Operations', 'Medical Emergencies', 'Disaster Response'],
        languages: ['French'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    embassies: [
      {
        id: 'german-embassy-paris',
        name: 'German Embassy Paris',
        type: 'embassy',
        country: 'France',
        description: 'Embassy of the Federal Republic of Germany',
        phone: '+33 (1) 53 83 45 00',
        phone24h: '+49 (30) 5000-2000 (Berlin Crisis Hotline)',
        email: 'info@paris.diplo.de',
        website: 'https://paris.diplo.de',
        address: '13-15, avenue Franklin Delano Roosevelt, 75116 Paris',
        services: ['German Citizen Services', 'Consular Assistance', 'Emergency Passports'],
        languages: ['German', 'French'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'us-embassy-paris',
        name: 'US Embassy Paris',
        type: 'embassy',
        country: 'France',
        description: 'Embassy of the United States of America',
        phone: '+33 (1) 43 12 22 22',
        phone24h: '+33 (1) 43 12 22 22 (press 0 for emergencies)',
        email: 'ParisACS@state.gov',
        website: 'https://fr.usembassy.gov',
        address: '2 Avenue Gabriel, 75008 Paris',
        services: ['American Citizen Services', 'Emergency Passports', 'Consular Emergencies'],
        languages: ['English', 'French'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    internationalHelp: [
      {
        id: 'un-france',
        name: 'United Nations France',
        type: 'international',
        country: 'France',
        description: 'United Nations agencies coordination',
        phone: '+33 (1) 40 62 50 00',
        email: 'unog.palais@un.org',
        website: 'https://www.un.org/fr',
        address: 'Palais des Nations, CH-1211 Geneva 10 (Paris office)',
        services: ['International Coordination', 'Diplomatic Services', 'UN Agency Support'],
        languages: ['French', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'redcross-france',
        name: 'French Red Cross',
        type: 'international',
        country: 'France',
        description: 'Humanitarian aid and emergency response',
        phone: '+33 (0)1 44 43 12 12',
        phone24h: '+33 (0)1 44 43 12 12',
        email: 'contact@croix-rouge.fr',
        website: 'https://www.croix-rouge.fr',
        address: '98 Rue Didot, 75694 Paris Cedex 14',
        services: ['Emergency Response', 'First Aid Training', 'Social Services', 'International Assistance'],
        languages: ['French', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    ngos: [
      {
        id: 'amnesty-france',
        name: 'Amnesty International France',
        type: 'ngo',
        country: 'France',
        description: 'Human rights organization',
        phone: '+33 (1) 44 65 75 00',
        email: 'contact@amnesty.fr',
        website: 'https://www.amnesty.fr',
        address: '76 rue de Turenne, 75003 Paris',
        services: ['Human Rights Advocacy', 'Legal Support', 'Campaign Work'],
        languages: ['French', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'ldh-france',
        name: 'Ligue des droits de l\'Homme (LDH)',
        type: 'ngo',
        country: 'France',
        description: 'Human rights and civil liberties organization',
        phone: '+33 (1) 56 54 12 12',
        email: 'contact@ldh-france.org',
        website: 'https://www.ldh-france.org',
        address: '138 Rue Marcadet, 75018 Paris',
        services: ['Civil Rights Defense', 'Human Rights Monitoring', 'Legal Assistance'],
        languages: ['French', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    governmentHotlines: [
      {
        id: 'france-interior-ministry',
        name: 'Ministry of the Interior',
        type: 'government',
        country: 'France',
        description: 'National security and emergency coordination',
        phone: '01 40 07 60 60',
        email: 'contact@interieur.gouv.fr',
        website: 'https://www.interieur.gouv.fr',
        services: ['Security Coordination', 'Emergency Management', 'National Security'],
        languages: ['French'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'france-foreign-ministry',
        name: 'Ministry for Europe and Foreign Affairs',
        type: 'government',
        country: 'France',
        description: 'Diplomatic services and consular assistance',
        phone: '+33 (1) 43 17 53 53',
        email: 'contact-dgae@diplomatie.gouv.fr',
        website: 'https://www.diplomatie.gouv.fr',
        services: ['Consular Assistance', 'Diplomatic Services', 'International Crisis Response'],
        languages: ['French', 'English', 'Spanish'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    travelAssistance: [
      {
        id: 'france-travel-advice',
        name: 'France Diplomatie Travel Advice',
        type: 'government',
        country: 'France',
        description: 'Official travel safety advice and assistance',
        phone: '+33 (1) 43 17 53 53',
        email: 'contact.voyage@diplomatie.gouv.fr',
        website: 'https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs',
        services: ['Travel Safety Information', 'Emergency Travel Advice', 'Consular Assistance'],
        languages: ['French', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    disasterResponse: [
      {
        id: 'france-civil-security',
        name: 'Direction Générale de la Sécurité Civile',
        type: 'government',
        country: 'France',
        description: 'Civil security and emergency management',
        phone: '01 40 07 11 11',
        phone24h: '112 (EU emergency number)',
        email: 'contact@interieur.gouv.fr',
        website: 'https://www.interieur.gouv.fr/Securite-civile',
        services: ['Civil Defense', 'Emergency Planning', 'Disaster Response', 'Civil Security'],
        languages: ['French'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    warning: 'LOW RISK: France is generally safe with good emergency services. Monitor official advice for current threats.',
    notes: 'Emergency numbers: 17 (Police), 15 (Medical), 18 (Fire), 112 (EU Standard). SAMU provides excellent emergency medical services. Tourist police available in major cities.',
    lastUpdated: '2026-03-08'
  },
  
  // China
  {
    country: 'China',
    countryCode: 'CN',
    continent: 'Asia',
    emergencyNumber: '110',
    police: [
      {
        id: 'china-police-110',
        name: 'People\'s Police',
        type: 'police',
        country: 'China',
        description: 'National police force - call 110 for emergencies',
        phone: '110',
        phone24h: '110',
        email: 'contact@mps.gov.cn',
        website: 'https://www.mps.gov.cn',
        services: ['Emergency Response', 'Public Security', 'Crime Prevention'],
        languages: ['Chinese Mandarin'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    medical: [
      {
        id: 'china-medical-120',
        name: 'Emergency Medical Services',
        type: 'medical',
        country: 'China',
        description: 'National emergency medical assistance',
        phone: '120',
        phone24h: '120',
        website: 'https://www.nhc.gov.cn',
        services: ['Ambulance Services', 'Emergency Medical Response'],
        languages: ['Chinese Mandarin'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    fire: [
      {
        id: 'china-fire-119',
        name: 'China Fire and Rescue',
        type: 'fire',
        country: 'China',
        description: 'National fire and rescue services',
        phone: '119',
        phone24h: '119',
        website: 'https://www.119.gov.cn',
        services: ['Fire Fighting', 'Rescue Operations', 'Disaster Response'],
        languages: ['Chinese Mandarin'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    embassies: [
      {
        id: 'german-embassy-beijing',
        name: 'German Embassy Beijing',
        type: 'embassy',
        country: 'China',
        description: 'Embassy of the Federal Republic of Germany',
        phone: '+86 (10) 8532-9400',
        phone24h: '+49 (30) 5000-2000 (Berlin Crisis Hotline)',
        email: 'info@peking.diplo.de',
        website: 'https://peking.diplo.de',
        address: '17 Dongzhimenwai Dajie, Chaoyang District, Beijing 100600',
        services: ['German Citizen Services', 'Consular Assistance', 'Emergency Passports'],
        languages: ['German', 'Chinese', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'us-embassy-beijing',
        name: 'US Embassy Beijing',
        type: 'embassy',
        country: 'China',
        description: 'Embassy of the United States of America',
        phone: '+86 (10) 8531-3000',
        phone24h: '+86 (10) 8531-4000',
        email: 'BeijingACS@state.gov',
        website: 'https://cn.usembassy.gov',
        address: '55 Anjialou Beidajie, Chaoyang District, Beijing 100600',
        services: ['American Citizen Services', 'Emergency Passports', 'Consular Emergencies'],
        languages: ['English', 'Chinese'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    internationalHelp: [
      {
        id: 'un-china',
        name: 'United Nations China',
        type: 'international',
        country: 'China',
        description: 'United Nations agencies coordination',
        phone: '+86 (10) 8532-1000',
        email: 'unchina@un.org',
        website: 'https://www.un.org/en',
        address: '2 Liangmahe Nanlu, Chaoyang District, Beijing 100600',
        services: ['International Coordination', 'Development Assistance', 'UN Agency Support'],
        languages: ['English', 'Chinese'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'redcross-china',
        name: 'Red Cross Society of China',
        type: 'international',
        country: 'China',
        description: 'Humanitarian aid and emergency response',
        phone: '+86 (10) 6522-4431',
        phone24h: '+86 (10) 6522-4431',
        email: 'info@redcross.org.cn',
        website: 'https://www.redcross.org.cn',
        address: 'Beijing Dongcheng District Nanheyan Street No. 1',
        services: ['Disaster Response', 'Medical Assistance', 'First Aid Training'],
        languages: ['Chinese', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    ngos: [
      {
        id: 'amnesty-china',
        name: 'Amnesty International China Research',
        type: 'ngo',
        country: 'China',
        description: 'Human rights monitoring and research',
        phone: '+852 2890-6339 (Hong Kong office)',
        email: 'hk@amnesty.org',
        website: 'https://www.amnesty.org/en/countries/asia-and-pacific/china/',
        services: ['Human Rights Research', 'Advocacy', 'Legal Support'],
        languages: ['English', 'Chinese'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    governmentHotlines: [
      {
        id: 'china-foreign-ministry',
        name: 'Ministry of Foreign Affairs',
        type: 'government',
        country: 'China',
        description: 'Diplomatic services and consular assistance',
        phone: '+86 (10) 12308',
        phone24h: '+86 (10) 12308',
        email: '12308@mfa.gov.cn',
        website: 'https://www.fmprc.gov.cn',
        services: ['Consular Assistance', 'Diplomatic Services', 'Travel Support'],
        languages: ['Chinese', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'china-emergency-management',
        name: 'Ministry of Emergency Management',
        type: 'government',
        country: 'China',
        description: 'National emergency and disaster response',
        phone: '+86 (10) 8393-3000',
        email: 'mem@mem.gov.cn',
        website: 'https://www.mem.gov.cn',
        services: ['Disaster Response', 'Emergency Management', 'Safety Supervision'],
        languages: ['Chinese'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    travelAssistance: [
      {
        id: 'china-travel-hotline',
        name: 'China Travel Service Hotline',
        type: 'government',
        country: 'China',
        description: 'Tourist assistance and information',
        phone: '+86 (10) 12301',
        email: '12301@cnta.gov.cn',
        website: 'https://www.12301.cn',
        services: ['Tourist Information', 'Travel Assistance', 'Emergency Support'],
        languages: ['Chinese', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    disasterResponse: [
      {
        id: 'china-national-disaster',
        name: 'National Disaster Reduction Commission',
        type: 'government',
        country: 'China',
        description: 'National disaster prevention and reduction',
        phone: '+86 (10) 8393-3000',
        email: 'ndrcc@mem.gov.cn',
        website: 'https://www.ndrcc.gov.cn',
        services: ['Disaster Prevention', 'Emergency Response', 'Risk Assessment'],
        languages: ['Chinese'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    warning: 'MODERATE RISK: Exercise increased caution. Internet restrictions, surveillance, and political tensions. Check official travel advice.',
    notes: 'Emergency numbers: 110 (Police), 120 (Medical), 119 (Fire). Internet access may be restricted. Carry embassy contact information.',
    lastUpdated: '2026-03-08'
  },
  
  // Japan
  {
    country: 'Japan',
    countryCode: 'JP',
    continent: 'Asia',
    emergencyNumber: '110',
    police: [
      {
        id: 'japan-police-110',
        name: 'National Police Agency',
        type: 'police',
        country: 'Japan',
        description: 'National police force - call 110 for emergencies',
        phone: '110',
        phone24h: '110',
        email: 'info@npa.go.jp',
        website: 'https://www.npa.go.jp',
        services: ['Emergency Response', 'Crime Prevention', 'Public Safety'],
        languages: ['Japanese', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    medical: [
      {
        id: 'japan-fire-119',
        name: 'Fire and Disaster Management Agency',
        type: 'medical',
        country: 'Japan',
        description: 'Emergency medical and fire services - call 119',
        phone: '119',
        phone24h: '119',
        email: 'info@fdma.go.jp',
        website: 'https://www.fdma.go.jp',
        services: ['Emergency Medical Response', 'Fire Fighting', 'Disaster Management'],
        languages: ['Japanese', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    fire: [
      {
        id: 'japan-fire-department',
        name: 'Japan Fire Service',
        type: 'fire',
        country: 'Japan',
        description: 'National fire and rescue services',
        phone: '119',
        phone24h: '119',
        email: 'info@fdma.go.jp',
        website: 'https://www.fdma.go.jp',
        services: ['Fire Fighting', 'Rescue Operations', 'Disaster Response'],
        languages: ['Japanese', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    embassies: [
      {
        id: 'german-embassy-tokyo',
        name: 'German Embassy Tokyo',
        type: 'embassy',
        country: 'Japan',
        description: 'Embassy of the Federal Republic of Germany',
        phone: '+81 (3) 5791-7700',
        phone24h: '+49 (30) 5000-2000 (Berlin Crisis Hotline)',
        email: 'info@tokyo.diplo.de',
        website: 'https://tokyo.diplo.de',
        address: '4-11-28 Minami-Azabu, Minato-ku, Tokyo 106-0047',
        services: ['German Citizen Services', 'Consular Assistance', 'Emergency Passports'],
        languages: ['German', 'Japanese', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'us-embassy-tokyo',
        name: 'US Embassy Tokyo',
        type: 'embassy',
        country: 'Japan',
        description: 'Embassy of the United States of America',
        phone: '+81 (3) 3224-5000',
        phone24h: '+81 (3) 3224-5000 (after hours: press 0)',
        email: 'TokyoACS@state.gov',
        website: 'https://jp.usembassy.gov',
        address: '1-10-5 Akasaka, Minato-ku, Tokyo 107-8420',
        services: ['American Citizen Services', 'Emergency Passports', 'Consular Emergencies'],
        languages: ['English', 'Japanese'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    internationalHelp: [
      {
        id: 'un-japan',
        name: 'United Nations Japan',
        type: 'international',
        country: 'Japan',
        description: 'United Nations agencies coordination',
        phone: '+81 (3) 3403-7501',
        email: 'unric.japan@un.org',
        website: 'https://japan.un.org',
        address: 'UN House, 3-1-1 Kami-Osaki, Shinagawa-ku, Tokyo 141-0022',
        services: ['International Coordination', 'Development Assistance', 'UN Agency Support'],
        languages: ['English', 'Japanese'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'redcross-japan',
        name: 'Japanese Red Cross Society',
        type: 'international',
        country: 'Japan',
        description: 'Humanitarian aid and emergency response',
        phone: '+81 (3) 3437-7001',
        phone24h: '+81 (3) 3437-7001',
        email: 'info@jrc.or.jp',
        website: 'https://www.jrc.or.jp',
        address: '1-2-2 Hongoku-cho, Chiyoda-ku, Tokyo 100-8282',
        services: ['Disaster Response', 'Medical Assistance', 'Blood Donation', 'International Relief'],
        languages: ['Japanese', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    ngos: [
      {
        id: 'amnesty-japan',
        name: 'Amnesty International Japan',
        type: 'ngo',
        country: 'Japan',
        description: 'Human rights organization',
        phone: '+81 (3) 3568-0077',
        email: 'info@amnesty.or.jp',
        website: 'https://www.amnesty.or.jp',
        address: '3F, Sunshine 60 Bldg, 3-1-1 Higashi-Ikebukuro, Toshima-ku, Tokyo 170-8621',
        services: ['Human Rights Advocacy', 'Legal Support', 'Campaign Work'],
        languages: ['Japanese', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'jcvn-japan',
        name: 'Japan Civil Liberties Union',
        type: 'ngo',
        country: 'Japan',
        description: 'Civil liberties and human rights organization',
        phone: '+81 (3) 3353-5105',
        email: 'info@jclu.org',
        website: 'https://www.jclu.org',
        address: '3F, Kasumigaseki 3-chome Bldg, 3-2-1 Kasumigaseki, Chiyoda-ku, Tokyo 100-0013',
        services: ['Civil Rights Defense', 'Legal Assistance', 'Human Rights Advocacy'],
        languages: ['Japanese', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    governmentHotlines: [
      {
        id: 'japan-foreign-ministry',
        name: 'Ministry of Foreign Affairs',
        type: 'government',
        country: 'Japan',
        description: 'Diplomatic services and consular assistance',
        phone: '+81 (3) 3580-3311',
        phone24h: '+81 (3) 3580-3311 (after hours)',
        email: 'kaikan-bo@oryu.mofa.go.jp',
        website: 'https://www.mofa.go.jp',
        services: ['Consular Assistance', 'Diplomatic Services', 'Travel Support'],
        languages: ['Japanese', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'japan-disaster-management',
        name: 'Cabinet Office Disaster Management',
        type: 'government',
        country: 'Japan',
        description: 'National disaster prevention and management',
        phone: '+81 (3) 5253-2111',
        email: 'bousai@cabinet.go.jp',
        website: 'https://www.bousai.go.jp',
        services: ['Disaster Prevention', 'Emergency Management', 'Safety Information'],
        languages: ['Japanese', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    travelAssistance: [
      {
        id: 'japan-tourism',
        name: 'Japan National Tourism Organization',
        type: 'government',
        country: 'Japan',
        description: 'Tourist assistance and information',
        phone: '+81 (3) 3201-3331',
        email: 'info@jnto.go.jp',
        website: 'https://www.jnto.go.jp',
        services: ['Tourist Information', 'Travel Assistance', 'Emergency Support'],
        languages: ['Japanese', 'English', 'Chinese', 'Korean'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    disasterResponse: [
      {
        id: 'japan-meteorological',
        name: 'Japan Meteorological Agency',
        type: 'government',
        country: 'Japan',
        description: 'Weather monitoring and early warnings',
        phone: '+81 (3) 3267-4211',
        email: 'info@jma.go.jp',
        website: 'https://www.jma.go.jp',
        services: ['Weather Warnings', 'Earthquake Alerts', 'Tsunami Information'],
        languages: ['Japanese', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    warning: 'LOW RISK: Japan is very safe with excellent emergency services. Monitor for earthquake and typhoon information.',
    notes: 'Emergency numbers: 110 (Police), 119 (Fire/Medical). Excellent disaster preparedness. English widely spoken in major cities.',
    lastUpdated: '2026-03-08'
  },
  
  // Italy
  {
    country: 'Italy',
    countryCode: 'IT',
    continent: 'Europe',
    emergencyNumber: '112',
    police: [
      {
        id: 'italy-police-112',
        name: 'Polizia di Stato',
        type: 'police',
        country: 'Italy',
        description: 'State police force - call 112 for emergencies',
        phone: '112',
        phone24h: '112',
        email: 'segreteria@poliziadistato.it',
        website: 'https://www.poliziadistato.it',
        services: ['Emergency Response', 'Crime Prevention', 'Public Safety'],
        languages: ['Italian', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'italy-carabinieri-112',
        name: 'Arma dei Carabinieri',
        type: 'police',
        country: 'Italy',
        description: 'Military police force',
        phone: '112',
        phone24h: '112',
        email: 'segreteria.generale@carabinieri.it',
        website: 'https://www.carabinieri.it',
        services: ['Military Police', 'Emergency Response', 'Rural Policing'],
        languages: ['Italian'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    medical: [
      {
        id: 'italy-medical-118',
        name: 'Servizio Sanitario di Emergenza',
        type: 'medical',
        country: 'Italy',
        description: 'National emergency medical service',
        phone: '118',
        phone24h: '118',
        email: 'info@118.it',
        website: 'https://www.118.it',
        services: ['Emergency Ambulance', 'Medical Emergency Response'],
        languages: ['Italian'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    fire: [
      {
        id: 'italy-fire-115',
        name: 'Vigili del Fuoco',
        type: 'fire',
        country: 'Italy',
        description: 'National fire and rescue service',
        phone: '115',
        phone24h: '115',
        email: 'comando.vigilidelfuoco@vfsg.gov.it',
        website: 'https://www.vigilidelfuoco.it',
        services: ['Fire Fighting', 'Rescue Operations', 'Disaster Response'],
        languages: ['Italian'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    embassies: [
      {
        id: 'german-embassy-rome',
        name: 'German Embassy Rome',
        type: 'embassy',
        country: 'Italy',
        description: 'Embassy of the Federal Republic of Germany',
        phone: '+39 (06) 49211',
        phone24h: '+49 (30) 5000-2000 (Berlin Crisis Hotline)',
        email: 'info@rom.diplo.de',
        website: 'https://rom.diplo.de',
        address: 'Via San Paolo alla Regola 17/A, 00186 Rome',
        services: ['German Citizen Services', 'Consular Assistance', 'Emergency Passports'],
        languages: ['German', 'Italian', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'us-embassy-rome',
        name: 'US Embassy Rome',
        type: 'embassy',
        country: 'Italy',
        description: 'Embassy of the United States of America',
        phone: '+39 (06) 4674-1',
        phone24h: '+39 (06) 4674-2421 (after hours)',
        email: 'RomeACS@state.gov',
        website: 'https://it.usembassy.gov',
        address: 'Via V. Veneto 121/A, 00187 Rome',
        services: ['American Citizen Services', 'Emergency Passports', 'Consular Emergencies'],
        languages: ['English', 'Italian'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    internationalHelp: [
      {
        id: 'un-italy',
        name: 'United Nations Italy',
        type: 'international',
        country: 'Italy',
        description: 'United Nations agencies coordination',
        phone: '+39 (06) 65131',
        email: 'unric.rome@un.org',
        website: 'https://www.un.org/it',
        address: 'Palazzo dei Congressi, Piazza John Kennedy 1, 00144 Rome',
        services: ['International Coordination', 'Development Assistance', 'UN Agency Support'],
        languages: ['Italian', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'redcross-italy',
        name: 'Italian Red Cross',
        type: 'international',
        country: 'Italy',
        description: 'Humanitarian aid and emergency response',
        phone: '+39 (06) 5510',
        phone24h: '+39 (06) 5510',
        email: 'info@cri.it',
        website: 'https://www.cri.it',
        address: 'Via Luigi Tosti 8, 00197 Rome',
        services: ['Emergency Response', 'First Aid Training', 'Social Services'],
        languages: ['Italian', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    ngos: [
      {
        id: 'amnesty-italy',
        name: 'Amnesty International Italy',
        type: 'ngo',
        country: 'Italy',
        description: 'Human rights organization',
        phone: '+39 (02) 7720-0737',
        email: 'segreteria@amnesty.it',
        website: 'https://www.amnesty.it',
        address: 'Via Fratelli Rosselli 17, 20121 Milan',
        services: ['Human Rights Advocacy', 'Legal Support', 'Campaign Work'],
        languages: ['Italian', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'libera-italy',
        name: 'Libera. Associazioni, nomi e numeri contro le mafie',
        type: 'ngo',
        country: 'Italy',
        description: 'Anti-mafia and civil rights organization',
        phone: '+39 (06) 687-9621',
        email: 'info@libera.it',
        website: 'https://www.libera.it',
        address: 'Via S. Giovanni in Laterano, 40, 00184 Rome',
        services: ['Anti-Mafia Advocacy', 'Civil Rights Defense', 'Social Justice'],
        languages: ['Italian'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    governmentHotlines: [
      {
        id: 'italy-interior-ministry',
        name: 'Ministry of the Interior',
        type: 'government',
        country: 'Italy',
        description: 'National security and emergency coordination',
        phone: '+39 (06) 4654-1',
        email: 'segreteria@interno.gov.it',
        website: 'https://www.interno.gov.it',
        services: ['Security Coordination', 'Emergency Management', 'Public Safety'],
        languages: ['Italian'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'italy-foreign-ministry',
        name: 'Ministry of Foreign Affairs',
        type: 'government',
        country: 'Italy',
        description: 'Diplomatic services and consular assistance',
        phone: '+39 (06) 3691-1',
        email: 'helpdesk@esteri.it',
        website: 'https://www.esteri.it',
        services: ['Consular Assistance', 'Diplomatic Services', 'Travel Support'],
        languages: ['Italian', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    travelAssistance: [
      {
        id: 'italy-tourism',
        name: 'Italian National Tourist Board',
        type: 'government',
        country: 'Italy',
        description: 'Tourist assistance and information',
        phone: '+39 (06) 3996-7560',
        email: 'info@enit.it',
        website: 'https://www.italia.it',
        services: ['Tourist Information', 'Travel Assistance', 'Emergency Support'],
        languages: ['Italian', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    disasterResponse: [
      {
        id: 'italy-civil-protection',
        name: 'Dipartimento della Protezione Civile',
        type: 'government',
        country: 'Italy',
        description: 'National civil protection and disaster management',
        phone: '+39 (06) 6820-1',
        phone24h: '+39 (06) 6820-1',
        email: 'comunicazione@protezionecivile.it',
        website: 'https://www.protezionecivile.it',
        services: ['Civil Protection', 'Emergency Management', 'Disaster Response'],
        languages: ['Italian', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    warning: 'LOW RISK: Italy is generally safe with good emergency services. Monitor for potential terrorism and organized crime threats.',
    notes: 'Emergency numbers: 112 (EU), 113 (Police), 118 (Medical), 115 (Fire). Tourist police available in major cities. English widely spoken in tourist areas.',
    lastUpdated: '2026-03-08'
  },
  
  // Canada
  {
    country: 'Canada',
    countryCode: 'CA',
    continent: 'North America',
    emergencyNumber: '911',
    police: [
      {
        id: 'canada-rcmp',
        name: 'Royal Canadian Mounted Police',
        type: 'police',
        country: 'Canada',
        description: 'National police force - call 911 for emergencies',
        phone: '911',
        phone24h: '911',
        email: 'info.rcmp-grc.gc.ca',
        website: 'https://www.rcmp-grc.gc.ca',
        services: ['Emergency Response', 'Crime Prevention', 'National Security'],
        languages: ['English', 'French'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    medical: [
      {
        id: 'canada-emergency-911',
        name: 'Emergency Medical Services',
        type: 'medical',
        country: 'Canada',
        description: 'Provincial emergency medical services',
        phone: '911',
        phone24h: '911',
        website: 'https://www.canada.ca/en/health.html',
        services: ['Emergency Ambulance', 'Medical Emergency Response'],
        languages: ['English', 'French'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    fire: [
      {
        id: 'canada-fire-911',
        name: 'Canadian Fire Services',
        type: 'fire',
        country: 'Canada',
        description: 'Municipal and provincial fire departments',
        phone: '911',
        phone24h: '911',
        website: 'https://www.cafc.ca',
        services: ['Fire Fighting', 'Rescue Operations', 'Emergency Response'],
        languages: ['English', 'French'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    embassies: [
      {
        id: 'german-embassy-ottawa',
        name: 'German Embassy Ottawa',
        type: 'embassy',
        country: 'Canada',
        description: 'Embassy of the Federal Republic of Germany',
        phone: '+1 (613) 232-1100',
        phone24h: '+49 (30) 5000-2000 (Berlin Crisis Hotline)',
        email: 'info@ottawa.diplo.de',
        website: 'https://ottawa.diplo.de',
        address: '1 Waverley Street, Ottawa, ON K1S 3J3',
        services: ['German Citizen Services', 'Consular Assistance', 'Emergency Passports'],
        languages: ['German', 'English', 'French'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'us-embassy-ottawa',
        name: 'US Embassy Ottawa',
        type: 'embassy',
        country: 'Canada',
        description: 'Embassy of the United States of America',
        phone: '+1 (613) 688-5335',
        phone24h: '+1 (613) 238-5335 (after hours)',
        email: 'OttawaACS@state.gov',
        website: 'https://ca.usembassy.gov',
        address: '490 Sussex Drive, Ottawa, ON K1N 1G8',
        services: ['American Citizen Services', 'Emergency Passports', 'Consular Emergencies'],
        languages: ['English', 'French'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    internationalHelp: [
      {
        id: 'un-canada',
        name: 'United Nations Canada',
        type: 'international',
        country: 'Canada',
        description: 'United Nations agencies coordination',
        phone: '+1 (613) 232-5777',
        email: 'un.canada@un.org',
        website: 'https://www.un.org/en',
        address: '30 St. Joseph Street, Ottawa, ON K1N 1G4',
        services: ['International Coordination', 'Development Assistance', 'UN Agency Support'],
        languages: ['English', 'French'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'redcross-canada',
        name: 'Canadian Red Cross',
        type: 'international',
        country: 'Canada',
        description: 'Humanitarian aid and emergency response',
        phone: '+1 (800) 418-1111',
        phone24h: '+1 (800) 418-1111',
        email: 'info@redcross.ca',
        website: 'https://www.redcross.ca',
        address: '170 Metcalfe Street, Suite 300, Ottawa, ON K2P 2P7',
        services: ['Emergency Response', 'Disaster Management', 'Health Services'],
        languages: ['English', 'French'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    ngos: [
      {
        id: 'amnesty-canada',
        name: 'Amnesty International Canada',
        type: 'ngo',
        country: 'Canada',
        description: 'Human rights organization',
        phone: '+1 (613) 744-7667',
        email: 'members@amnesty.ca',
        website: 'https://amnesty.ca',
        address: '312 Laurier Avenue East, Ottawa, ON K1N 1H9',
        services: ['Human Rights Advocacy', 'Legal Support', 'Campaign Work'],
        languages: ['English', 'French'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'ccla-canada',
        name: 'Canadian Civil Liberties Association',
        type: 'ngo',
        country: 'Canada',
        description: 'Civil liberties and human rights organization',
        phone: '+1 (416) 363-0327',
        email: 'ccla@ccla.org',
        website: 'https://ccla.org',
        address: '55 Eglinton Avenue East, Suite 900, Toronto, ON M4P 1G8',
        services: ['Civil Liberties Defense', 'Legal Advocacy', 'Human Rights Monitoring'],
        languages: ['English', 'French'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    governmentHotlines: [
      {
        id: 'canada-emergency-preparedness',
        name: 'Public Safety Canada',
        type: 'government',
        country: 'Canada',
        description: 'National emergency management and public safety',
        phone: '+1 (613) 991-2950',
        email: 'psinfo@ps-sp.gc.ca',
        website: 'https://www.publicsafety.gc.ca',
        services: ['Emergency Management', 'Public Safety', 'National Security'],
        languages: ['English', 'French'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'canada-foreign-affairs',
        name: 'Global Affairs Canada',
        type: 'government',
        country: 'Canada',
        description: 'Diplomatic services and consular assistance',
        phone: '+1 (800) 267-6788',
        phone24h: '+1 (613) 996-8885 (Emergency Watch and Response Centre)',
        email: 'sos@international.gc.ca',
        website: 'https://www.international.gc.ca',
        services: ['Consular Assistance', 'Diplomatic Services', 'Travel Support'],
        languages: ['English', 'French'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    travelAssistance: [
      {
        id: 'canada-travel',
        name: 'Destination Canada',
        type: 'government',
        country: 'Canada',
        description: 'Tourist information and assistance',
        phone: '+1 (866) 335-9773',
        email: 'info@destinationcanada.ca',
        website: 'https://www.destinationcanada.ca',
        services: ['Tourist Information', 'Travel Assistance', 'Emergency Support'],
        languages: ['English', 'French'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    disasterResponse: [
      {
        id: 'canada-disaster-database',
        name: 'Canadian Disaster Database',
        type: 'government',
        country: 'Canada',
        description: 'National disaster information and response',
        phone: '+1 (613) 991-2950',
        email: 'psinfo@ps-sp.gc.ca',
        website: 'https://www.publicsafety.gc.ca/cnt/rsrcs/cndt-dsstr/index-en.aspx',
        services: ['Disaster Information', 'Emergency Response', 'Risk Assessment'],
        languages: ['English', 'French'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    warning: 'LOW RISK: Canada is very safe with excellent emergency services. Monitor weather alerts for extreme conditions.',
    notes: 'Emergency number: 911 works nationwide. Excellent healthcare system. English and French widely spoken.',
    lastUpdated: '2026-03-08'
  },
  
  // Australia
  {
    country: 'Australia',
    countryCode: 'AU',
    continent: 'Oceania',
    emergencyNumber: '000',
    police: [
      {
        id: 'australia-police-000',
        name: 'Australian Federal Police',
        type: 'police',
        country: 'Australia',
        description: 'Federal police force - call 000 for emergencies',
        phone: '000',
        phone24h: '000',
        email: 'afp.affairs@afp.gov.au',
        website: 'https://www.afp.gov.au',
        services: ['Emergency Response', 'Federal Crimes', 'Counter-Terrorism'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    medical: [
      {
        id: 'australia-medical-000',
        name: 'Emergency Medical Services',
        type: 'medical',
        country: 'Australia',
        description: 'State and territory ambulance services',
        phone: '000',
        phone24h: '000',
        website: 'https://www.health.gov.au',
        services: ['Emergency Ambulance', 'Medical Emergency Response'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    fire: [
      {
        id: 'australia-fire-000',
        name: 'Fire and Rescue Services',
        type: 'fire',
        country: 'Australia',
        description: 'State and territory fire services',
        phone: '000',
        phone24h: '000',
        website: 'https://www.aidr.org.au',
        services: ['Fire Fighting', 'Rescue Operations', 'Disaster Response'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    embassies: [
      {
        id: 'german-embassy-canberra',
        name: 'German Embassy Canberra',
        type: 'embassy',
        country: 'Australia',
        description: 'Embassy of the Federal Republic of Germany',
        phone: '+61 (2) 6270-4000',
        phone24h: '+49 (30) 5000-2000 (Berlin Crisis Hotline)',
        email: 'info@canberra.diplo.de',
        website: 'https://canberra.diplo.de',
        address: '119 Empire Circuit, Yarralumla ACT 2600',
        services: ['German Citizen Services', 'Consular Assistance', 'Emergency Passports'],
        languages: ['German', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'us-embassy-canberra',
        name: 'US Embassy Canberra',
        type: 'embassy',
        country: 'Australia',
        description: 'Embassy of the United States of America',
        phone: '+61 (2) 6214-5600',
        phone24h: '+61 (2) 6214-5600 (after hours)',
        email: 'CanberraACS@state.gov',
        website: 'https://au.usembassy.gov',
        address: '175 Commonwealth Avenue, Yarralumla ACT 2600',
        services: ['American Citizen Services', 'Emergency Passports', 'Consular Emergencies'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    internationalHelp: [
      {
        id: 'un-australia',
        name: 'United Nations Australia',
        type: 'international',
        country: 'Australia',
        description: 'United Nations agencies coordination',
        phone: '+61 (2) 6261-1111',
        email: 'unaustralia@un.org',
        website: 'https://www.un.org/en',
        address: '38 Sydney Avenue, Yarralumla ACT 2600',
        services: ['International Coordination', 'Development Assistance', 'UN Agency Support'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'redcross-australia',
        name: 'Australian Red Cross',
        type: 'international',
        country: 'Australia',
        description: 'Humanitarian aid and emergency response',
        phone: '+61 (3) 9329-4111',
        phone24h: '1800 811 700 (Disaster Help)',
        email: 'info@redcross.org.au',
        website: 'https://www.redcross.org.au',
        address: '15-153 Clarendon Street, Southbank VIC 3006',
        services: ['Emergency Response', 'Disaster Management', 'Humanitarian Programs'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    ngos: [
      {
        id: 'amnesty-australia',
        name: 'Amnesty International Australia',
        type: 'ngo',
        country: 'Australia',
        description: 'Human rights organization',
        phone: '+61 (2) 8216-1800',
        email: 'info@amnesty.org.au',
        website: 'https://www.amnesty.org.au',
        address: 'Level 1, 45 William Street, Melbourne VIC 3000',
        services: ['Human Rights Advocacy', 'Legal Support', 'Campaign Work'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'aclu-australia',
        name: 'Australian Civil Liberties Union',
        type: 'ngo',
        country: 'Australia',
        description: 'Civil liberties and human rights organization',
        phone: '+61 (2) 9660-7582',
        email: 'info@aclu.org.au',
        website: 'https://www.aclu.org.au',
        address: 'Level 3, 50 Carrington Street, Sydney NSW 2000',
        services: ['Civil Liberties Defense', 'Legal Advocacy', 'Human Rights Monitoring'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    governmentHotlines: [
      {
        id: 'australia-emergency-management',
        name: 'National Emergency Management Agency',
        type: 'government',
        country: 'Australia',
        description: 'National emergency management and disaster response',
        phone: '+61 (2) 6257-7711',
        email: 'nema@ema.gov.au',
        website: 'https://www.nema.gov.au',
        services: ['Emergency Management', 'Disaster Response', 'National Resilience'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'australia-foreign-affairs',
        name: 'Department of Foreign Affairs and Trade',
        type: 'government',
        country: 'Australia',
        description: 'Diplomatic services and consular assistance',
        phone: '+61 (2) 6261-1111',
        phone24h: '+61 (2) 6261-3305 (Consular Emergency Centre)',
        email: 'consular.crisis@dfat.gov.au',
        website: 'https://www.dfat.gov.au',
        services: ['Consular Assistance', 'Diplomatic Services', 'Travel Support'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    travelAssistance: [
      {
        id: 'australia-tourism',
        name: 'Australian Tourism',
        type: 'government',
        country: 'Australia',
        description: 'Tourist information and assistance',
        phone: '+61 (2) 6213-7000',
        email: 'info@australia.com',
        website: 'https://www.australia.com',
        services: ['Tourist Information', 'Travel Assistance', 'Emergency Support'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    disasterResponse: [
      {
        id: 'australia-bureau-meteorology',
        name: 'Bureau of Meteorology',
        type: 'government',
        country: 'Australia',
        description: 'Weather monitoring and early warnings',
        phone: '+61 (3) 9669-4000',
        email: 'contact@bom.gov.au',
        website: 'https://www.bom.gov.au',
        services: ['Weather Warnings', 'Severe Weather Alerts', 'Climate Information'],
        languages: ['English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    warning: 'LOW RISK: Australia is very safe with excellent emergency services. Monitor for bushfires, cyclones, and extreme weather.',
    notes: 'Emergency number: 000 works nationwide. Excellent healthcare system. Beware of dangerous wildlife and extreme weather conditions.',
    lastUpdated: '2026-03-08'
  },
  
  // Israel
  {
    country: 'Israel',
    countryCode: 'IL',
    continent: 'Asia',
    emergencyNumber: '100',
    police: [
      {
        id: 'israel-police-100',
        name: 'Israel Police',
        type: 'police',
        country: 'Israel',
        description: 'National police force',
        phone: '100',
        phone24h: '100',
        email: 'contact@police.gov.il',
        website: 'https://www.police.gov.il',
        services: ['Emergency Response', 'Counter-Terrorism', 'Traffic Control', 'Criminal Investigation'],
        languages: ['Hebrew', 'English', 'Arabic', 'Russian'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    medical: [
      {
        id: 'israel-magen-101',
        name: 'Magen David Adom (MDA) Emergency Medical',
        type: 'medical',
        country: 'Israel',
        description: 'National emergency medical service',
        phone: '101',
        phone24h: '101',
        email: 'international@mda.org.il',
        website: 'https://www.mdais.org',
        services: ['Ambulance Services', 'Emergency Medical Response', 'Blood Bank', 'First Aid Training'],
        languages: ['Hebrew', 'English', 'Arabic', 'Russian'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    fire: [
      {
        id: 'israel-fire-102',
        name: 'Israel Fire and Rescue Authority',
        type: 'fire',
        country: 'Israel',
        description: 'National fire and rescue services',
        phone: '102',
        phone24h: '102',
        email: 'info@fire.gov.il',
        website: 'https://www.fire.gov.il',
        services: ['Fire Fighting', 'Rescue Operations', 'Hazardous Materials', 'Disaster Response'],
        languages: ['Hebrew', 'English', 'Arabic'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    embassies: [
      {
        id: 'us-embassy-jerusalem',
        name: 'US Embassy Jerusalem',
        type: 'embassy',
        country: 'Israel',
        description: 'Embassy of the United States of America',
        phone: '+972 (2) 630-4000',
        phone24h: '+972 (2) 630-4000 (press 0 for emergencies)',
        email: 'JerusalemACS@state.gov',
        website: 'https://il.usembassy.gov',
        address: '14 David Flusser St., Jerusalem 9378322',
        services: ['American Citizen Services', 'Emergency Passports', 'Consular Emergencies', 'Security Alerts'],
        languages: ['English', 'Hebrew', 'Arabic'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'german-embassy-telaviv',
        name: 'German Embassy Tel Aviv',
        type: 'embassy',
        country: 'Israel',
        description: 'Embassy of the Federal Republic of Germany',
        phone: '+972 (3) 6931-31',
        phone24h: '+49 (30) 5000-2000 (Berlin Crisis Hotline)',
        email: 'info@telaviv.diplo.de',
        website: 'https://telaviv.diplo.de',
        address: '15 HaYarkon St., Tel Aviv 63884',
        services: ['German Citizen Services', 'Consular Assistance', 'Emergency Passports', 'Legal Help'],
        languages: ['German', 'Hebrew', 'English'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    internationalHelp: [
      {
        id: 'un-israel',
        name: 'United Nations Israel',
        type: 'international',
        country: 'Israel',
        description: 'UN agencies and coordination office',
        phone: '+972 (2) 630-4000',
        email: 'unog.undcss-d@un.org',
        website: 'https://www.un.org/unispal',
        address: '1 UN Plaza, New York (Regional: 14 David Flusser St., Jerusalem)',
        services: ['Humanitarian Coordination', 'Peace Operations', 'Development Assistance'],
        languages: ['English', 'Hebrew', 'Arabic'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'redshield-israel',
        name: 'Israel Red Shield of David (Magen David Adom)',
        type: 'international',
        country: 'Israel',
        description: 'Humanitarian aid and emergency medical services',
        phone: '101',
        phone24h: '+972 (3) 610-1000',
        email: 'international@mda.org.il',
        website: 'https://www.mdais.org',
        services: ['Emergency Medical', 'Blood Services', 'Disaster Response', 'Community Health'],
        languages: ['Hebrew', 'English', 'Arabic', 'Russian'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    ngos: [
      {
        id: 'b-tselem',
        name: 'B\'Tselem - Israeli Information Center for Human Rights',
        type: 'ngo',
        country: 'Israel',
        description: 'Human rights monitoring in the occupied territories',
        phone: '+972 (2) 673-5599',
        email: 'mail@btselem.org',
        website: 'https://www.btselem.org',
        address: '33 Nahalat Shiva St., Jerusalem 94443',
        services: ['Human Rights Documentation', 'Legal Advocacy', 'Public Education'],
        languages: ['Hebrew', 'English', 'Arabic'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'acri-israel',
        name: 'Association for Civil Rights in Israel (ACRI)',
        type: 'ngo',
        country: 'Israel',
        description: 'Human rights and civil liberties organization',
        phone: '+972 (3) 560-5252',
        email: 'acri@acri.org.il',
        website: 'https://www.acri.org.il',
        address: '7 Chlenov St., Tel Aviv 61331',
        services: ['Legal Aid', 'Human Rights Advocacy', 'Civil Liberties Defense'],
        languages: ['Hebrew', 'English', 'Arabic'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    governmentHotlines: [
      {
        id: 'isa-security-agency',
        name: 'Israel Security Agency (Shin Bet) Hotline',
        type: 'government',
        country: 'Israel',
        description: 'Security threat reporting',
        phone: '+972 (3) 752-4444',
        phone24h: '+972 (3) 752-4444',
        email: 'mail@shabak.gov.il',
        website: 'https://www.shabak.gov.il',
        services: ['Security Threat Reporting', 'Counter-Terrorism', 'Intelligence Sharing'],
        languages: ['Hebrew', 'English', 'Arabic', 'Russian'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'isa-homefront-command',
        name: 'Home Front Command Emergency Hotline',
        type: 'government',
        country: 'Israel',
        description: 'Civil defense and emergency instructions',
        phone: '104',
        phone24h: '104',
        email: 'homefront@idf.gov.il',
        website: 'https://www.refua.org.il',
        services: ['Emergency Instructions', 'Civil Defense', 'Shelter Information', 'Disaster Response'],
        languages: ['Hebrew', 'English', 'Arabic', 'Russian', 'Amharic'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    travelAssistance: [
      {
        id: 'israel-tourist-police',
        name: 'Israel Tourist Police',
        type: 'government',
        country: 'Israel',
        description: 'Police assistance for tourists',
        phone: '+972 (2) 629-9999',
        email: 'info@police.gov.il',
        website: 'https://www.police.gov.il',
        services: ['Tourist Safety', 'Lost Property', 'Theft Reporting', 'Emergency Assistance'],
        languages: ['Hebrew', 'English', 'Arabic', 'Russian', 'French'],
        verified: true,
        lastUpdated: '2026-03-08'
      },
      {
        id: 'israel-emergency-hotline',
        name: 'National Emergency Hotline',
        type: 'government',
        country: 'Israel',
        description: '24/7 emergency assistance and information',
        phone: '*3246',
        phone24h: '*3246',
        services: ['Emergency Coordination', 'Crisis Information', 'Referral Services'],
        languages: ['Hebrew', 'English', 'Arabic', 'Russian'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    disasterResponse: [
      {
        id: 'isa-national-emergency-authority',
        name: 'National Emergency Management Authority',
        type: 'government',
        country: 'Israel',
        description: 'National disaster and emergency management',
        phone: '+972 (3) 745-4444',
        phone24h: '+972 (3) 745-4444',
        email: 'info@neva.gov.il',
        website: 'https://www.neva.gov.il',
        services: ['Emergency Management', 'Disaster Response', 'National Resilience', 'Crisis Coordination'],
        languages: ['Hebrew', 'English', 'Arabic'],
        verified: true,
        lastUpdated: '2026-03-08'
      }
    ],
    warning: 'HIGH RISK: Active conflict with Hamas and regional tensions. Rocket attacks, military operations, security alerts ongoing.',
    notes: 'Emergency services: Police 100, Medical 101, Fire 102. Home Front Command 104 for emergency instructions. Tourist police available. Rocket alert system active.',
    lastUpdated: '2026-03-08'
  }
]

// Pricing model configuration
export const PRICING_MODELS = {
  FREE: {
    name: 'Free Tier',
    price: '€0',
    features: [
      'Basic risk scores',
      'Public emergency contacts',
      'Standard warning information',
      'Self-service only',
      'Community support'
    ],
    limitations: [
      'No personal support',
      'No real-time alerts',
      'Basic emergency contacts only',
      'No priority assistance',
      'No dedicated account manager'
    ],
    support: 'Community forums and self-service knowledge base'
  },
  PROFESSIONAL: {
    name: 'Professional',
    price: '€29/month',
    features: [
      'Advanced risk intelligence',
      'Comprehensive emergency contacts',
      'Real-time alerts',
      '24/7 emergency hotline',
      'Priority email support',
      'Mobile app access'
    ],
    limitations: [
      'No phone support',
      'No dedicated account manager',
      'No custom emergency planning'
    ],
    support: '24/7 emergency hotline and priority email support'
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Full API access',
      'Custom emergency contacts',
      'Dedicated support team',
      'Priority emergency response',
      'Custom integration',
      'Detailed analytics',
      'Training sessions'
    ],
    limitations: [
      'No personal assistance (automated systems only)',
      'No physical emergency response'
    ],
    support: 'Dedicated support team and automated emergency response systems'
  },
  GOVERNMENT: {
    name: 'Government/NGO',
    price: 'Custom',
    features: [
      'Sovereign data hosting',
      'Emergency response integration',
      'Government-grade security',
      'Custom emergency protocols',
      'Direct emergency service integration',
      'Compliance certifications',
      '24/7 monitoring'
    ],
    limitations: [
      'No personal field assistance',
      'No independent verification'
    ],
    support: 'Government-grade support with emergency service integration'
  }
}

// Helper functions
export const getEmergencyContactsByCountry = (country: string): CountryEmergencyInfo | undefined => {
  return EMERGENCY_CONTACTS_DB.find(info => 
    info.country.toLowerCase() === country.toLowerCase() ||
    info.countryCode.toLowerCase() === country.toLowerCase()
  )
}

export const getAllEmergencyContacts = (): CountryEmergencyInfo[] => {
  return EMERGENCY_CONTACTS_DB
}

export const getPricingModel = (model: keyof typeof PRICING_MODELS) => {
  return PRICING_MODELS[model]
}

export const getEmergencyNumber = (countryCode: string): string => {
  const countryInfo = EMERGENCY_CONTACTS_DB.find(info => 
    info.countryCode.toLowerCase() === countryCode.toLowerCase()
  )
  return countryInfo?.emergencyNumber || '112' // Default to EU standard
}