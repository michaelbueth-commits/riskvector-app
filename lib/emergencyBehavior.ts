export type EmergencyType = 'rocket' | 'airstrike' | 'earthquake' | 'terrorism' | 'civil_unrest' | 'nuclear' | 'biochemical' | 'flood' | 'fire'

export interface EmergencyGuide {
  type: EmergencyType
  title: string
  icon: string
  steps: string[]
  donts: string[]
  duration: string
  aftermathSteps?: string[]
}

const guides: Record<EmergencyType, EmergencyGuide> = {
  rocket: {
    type: 'rocket',
    title: 'Rocket / Missile Attack',
    icon: '🚀',
    steps: [
      'Hear siren → Move to shelter IMMEDIATELY',
      'If no shelter nearby: Enter building, stairwell, or interior room',
      'Stay away from windows and exterior walls',
      'Lie flat on the floor, protect head with hands',
      'Wait 10 minutes after last boom before leaving shelter',
      'Follow instructions from Home Front Command or local authorities',
    ],
    donts: [
      'Do NOT stay outside or near windows',
      'Do NOT film or photograph during active attack',
      'Do NOT assume the threat is over after one boom',
      'Do NOT use elevators',
    ],
    duration: 'Stay in shelter for 10 minutes after last explosion or until all-clear given',
    aftermathSteps: [
      'Check for injuries — yourself first, then others',
      'Stay away from damaged buildings',
      'Follow emergency services instructions',
      'Contact family to confirm you are safe',
    ],
  },
  airstrike: {
    type: 'airstrike',
    title: 'Airstrike Warning',
    icon: '✈️',
    steps: [
      'Move to basement or underground area immediately',
      'Stay away from windows and exterior walls',
      'Stay low — lie flat on the floor',
      'Keep phone charged for emergency information',
      'Monitor official channels (radio, official apps)',
      'If trapped: tap on pipes or walls so rescuers can find you',
    ],
    donts: [
      'Do NOT film or take photos',
      'Do NOT go outside to look at what happened',
      'Do NOT use elevators',
      'Do NOT light matches or lighters (gas leak risk)',
    ],
    duration: 'Stay sheltered until official all-clear',
  },
  earthquake: {
    type: 'earthquake',
    title: 'Earthquake',
    icon: '🌍',
    steps: [
      'DROP to the ground',
      'Take COVER under sturdy furniture (desk, table)',
      'HOLD ON until shaking stops',
      'Stay away from windows, outside walls, and anything that could fall',
      'If outdoors: Move to open area, away from buildings',
      'If in a vehicle: Pull over, stay inside, avoid overpasses',
    ],
    donts: [
      'Do NOT use elevators',
      'Do NOT stand in a doorway (modern buildings — not safer)',
      'Do NOT run outside during shaking',
    ],
    duration: 'Shaking typically lasts 10-30 seconds. Be prepared for aftershocks.',
    aftermathSteps: [
      'Check for injuries',
      'Check for gas leaks (smell) — do NOT use matches',
      'Be prepared for aftershocks',
      'Tune to emergency radio/TV',
      'Do not enter damaged buildings',
    ],
  },
  terrorism: {
    type: 'terrorism',
    title: 'Terrorist Attack',
    icon: '⚠️',
    steps: [
      'RUN — Leave the area as fast as possible. Drop belongings.',
      'HIDE — If you cannot run, find a secure room. Barricade the door.',
      'FIGHT — Last resort only. Act with aggression.',
      'Silence your phone (vibrate off too)',
      'Leave belongings behind — your life is more important',
      'Call emergency services when it is safe to do so',
    ],
    donts: [
      'Do NOT stop to film or take photos',
      'Do NOT confront attackers unless as absolute last resort',
      'Do NOT gather in groups (makes you a bigger target)',
    ],
    duration: 'Situations vary — stay hidden until police give all-clear',
    aftermathSteps: [
      'Follow police instructions exactly',
      'Keep hands visible and empty',
      'Do not make sudden movements',
      'Help injured if you can do so safely',
    ],
  },
  civil_unrest: {
    type: 'civil_unrest',
    title: 'Civil Unrest / Protests',
    icon: '👥',
    steps: [
      'Avoid crowds, demonstrations, and protest areas',
      'Stay in your hotel or a safe indoor location',
      'Monitor local news and social media for updates',
      'Contact your embassy for guidance',
      'Keep your passport and essential documents with you',
      'Have an evacuation plan ready',
    ],
    donts: [
      'Do NOT photograph protesters or police',
      'Do NOT engage in political discussions publicly',
      'Do NOT go near government buildings during unrest',
      'Do NOT post about the situation on social media',
    ],
    duration: 'Unrest can last hours to weeks — maintain readiness',
  },
  nuclear: {
    type: 'nuclear',
    title: 'Nuclear / Radiation Emergency',
    icon: '☢️',
    steps: [
      'Get inside immediately — go to the deepest part of a building',
      'Seal windows and doors with plastic and duct tape if possible',
      'Stay inside for at least 24 hours (fallout diminishes rapidly)',
      'Take potassium iodide ONLY if instructed by authorities',
      'Remove outer clothing and shower if exposed',
      'Monitor official emergency broadcasts',
    ],
    donts: [
      'Do NOT go outside',
      'Do NOT consume food or water that may be contaminated',
      'Do NOT look at the flash or blast',
    ],
    duration: 'Stay sheltered minimum 24 hours, follow official guidance',
  },
  biochemical: {
    type: 'biochemical',
    title: 'Chemical / Biological Incident',
    icon: '🧪',
    steps: [
      'Move UPWIND and uphill from the affected area',
      'Cover mouth and nose with cloth (wet if possible)',
      'Get inside and close all windows and doors',
      'Remove contaminated clothing and put in sealed bag',
      'Wash body thoroughly with soap and water',
      'Seek medical attention immediately',
    ],
    donts: [
      'Do NOT touch your face or eyes',
      'Do NOT eat or drink anything that may be contaminated',
      'Do NOT try to clean up the substance yourself',
    ],
    duration: 'Evacuate until authorities declare area safe',
  },
  flood: {
    type: 'flood',
    title: 'Flood Emergency',
    icon: '🌊',
    steps: [
      'Move to higher ground immediately',
      'Do not walk through moving water (6 inches can knock you down)',
      'Do not drive through flooded roads',
      'If trapped, go to highest level (NOT attic unless you have roof access)',
      'Monitor emergency broadcasts',
    ],
    donts: [
      'Do NOT walk or drive through flood water',
      'Do NOT touch electrical equipment in wet areas',
    ],
    duration: 'Varies — flash floods are fast; river floods can last days',
  },
  fire: {
    type: 'fire',
    title: 'Fire Emergency',
    icon: '🔥',
    steps: [
      'Evacuate immediately via stairs (NOT elevators)',
      'Stay low — smoke rises',
      'Feel doors before opening (if hot, do not open)',
      'If trapped: seal door cracks with cloth, signal from window',
      'Call emergency services once safe',
    ],
    donts: [
      'Do NOT use elevators',
      'Do NOT go back inside for belongings',
      'Do NOT break windows (oxygen feeds fire)',
    ],
    duration: 'Get out and stay out until fire department gives all-clear',
  },
}

export function getEmergencyGuide(type: EmergencyType): EmergencyGuide | null {
  return guides[type] || null
}

export function getAllEmergencyGuides(): EmergencyGuide[] {
  return Object.values(guides)
}
