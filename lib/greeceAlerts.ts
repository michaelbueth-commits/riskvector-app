import { RealAlert } from './alertsService';

// Manually created high-priority alerts for Greece to address data inconsistency
// This reflects the current high-risk assessment (80/100)

export const greeceAlerts: RealAlert[] = [
  {
    id: 'GR-POLITICAL-2026-03-09-01',
    type: 'high',
    category: 'Political',
    title: 'ATHENS PROTEST ESCALATION',
    location: 'Athens, Greece',
    country: 'Greece',
    timestamp: new Date().toISOString(),
    description: 'Protests in Athens have escalated, leading to clashes with police in the city center. Expect significant travel disruptions and a heavy security presence. Avoid Syntagma Square and surrounding areas.',
    source: 'RiskVector Internal Assessment',
    sourceId: 'RV-Internal'
  },
  {
    id: 'GR-ECONOMIC-2026-03-09-02',
    type: 'medium',
    category: 'Economic',
    title: 'BANK RUN WARNING',
    location: 'Nationwide, Greece',
    country: 'Greece',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    description: 'Increased financial instability has led to warnings of potential bank runs. ATM cash withdrawals may be limited. Monitor financial news closely.',
    source: 'Financial Times',
    sourceId: 'FT-Alert',
    url: 'https://www.ft.com'
  },
  {
    id: 'GR-HUMANITARIAN-2026-03-09-03',
    type: 'critical',
    category: 'Humanitarian',
    title: 'MIGRANT CAMP CONFRONTATION',
    location: 'Lesbos, Greece',
    country: 'Greece',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    description: 'Severe overcrowding and resource shortages at the Lesbos migrant camp have led to violent confrontations. Humanitarian operations are strained. The area is considered highly volatile.',
    source: 'UNHCR',
    sourceId: 'UNHCR-Alert',
    url: 'https://www.unhcr.org'
  },
  {
    id: 'GR-TRANSPORT-2026-03-09-04',
    type: 'high',
    category: 'Transport',
    title: 'MAJOR FERRY STRIKES',
    location: 'Piraeus Port, Greece',
    country: 'Greece',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    description: 'Nationwide ferry services are suspended due to ongoing labor strikes, causing major disruptions to island transport and supply chains. Strikes are expected to continue for 48 hours.',
    source: 'Reuters',
    sourceId: 'RTRS-Alert'
  },
    {
    id: 'GR-HEALTH-2026-03-09-05',
    type: 'medium',
    category: 'Health',
    title: 'HOSPITAL OVERCROWDING',
    location: 'Thessaloniki, Greece',
    country: 'Greece',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    description: 'Hospitals in Thessaloniki are reporting critical levels of overcrowding, leading to long wait times and delayed medical procedures. Emergency services are under severe strain.',
    source: 'Hellenic National Public Health Organization',
    sourceId: 'EODY-Alert'
  },
  {
    id: 'GR-SECURITY-2026-03-09-06',
    type: 'high',
    category: 'Security',
    title: 'EMBASSY SECURITY ALERT',
    location: 'Athens, Greece',
    country: 'Greece',
    timestamp: new Date(Date.now() - 1 day * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Several embassies have issued security alerts for their citizens in Athens, citing the unpredictable nature of ongoing protests and the potential for spontaneous violence.',
    source: 'U.S. Embassy in Greece',
    sourceId: 'USEMB-GR-Alert'
  },
  {
    id: 'GR-NATURAL-2026-03-09-07',
    type: 'critical',
    category: 'Natural Disaster',
    title: 'WILDFIRE WARNING',
    location: 'Crete, Greece',
    country: 'Greece',
    timestamp: new Date(Date.now() - 2 days * 24 * 60 * 60 * 1000).toISOString(),
    description: 'A critical wildfire warning is in effect for the island of Crete due to high winds and dry conditions. Several villages are on evacuation alert. Air travel may be affected.',
    source: 'Hellenic Fire Service',
    sourceId: 'HFS-Alert'
  }
];
