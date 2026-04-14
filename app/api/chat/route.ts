import { NextRequest, NextResponse } from 'next/server'
import { findCountry } from '@/lib/emergency-data'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

function detectIntent(msg: string): string {
  const m = msg.toLowerCase()
  if (/notruf|emergency|112|911|polizei|police|feuer|fire|ambulanz/.test(m)) return 'emergency'
  if (/krankenhaus|hospital|klinik|clinic|arzt|doctor|verletzt|wunde|blut|schmerz|weh/.test(m)) return 'medical'
  if (/apotheke|pharmacy|medikament|medicine|pille|rezept/.test(m)) return 'pharmacy'
  if (/botschaft|embassy|konsulat|consulate|pass|passport|ausweis|dokument/.test(m)) return 'embassy'
  if (/bestohlen|gestohlen|robbed|stolen|dieb|theft/.test(m)) return 'crime'
  if (/sicher|safe|sicherheit|safety|gefahrlich|danger|risiko|risk/.test(m)) return 'safety'
  if (/ubersetz|translation|phrase|sprache|language|wie sagt man/.test(m)) return 'translation'
  if (/erdbeben|earthquake|flut|flood|tsunami|sturm|storm|hurrikan|hurricane/.test(m)) return 'disaster'
  if (/allergi|allerg|anaphylax|schock/.test(m)) return 'allergic'
  return 'general'
}

function buildResponse(intent: string, message: string, countryName: string | null): string {
  const country = countryName ? findCountry(countryName) : null
  const cName = country?.country || countryName || 'deinem Standort'

  switch (intent) {
    case 'emergency':
      return country
        ? `🚨 **NOTRUF in ${cName}:**\n\n• Allgemeiner Notruf: **${country.general}**\n• Polizei: **${country.police}**\n• Rettungsdienst: **${country.ambulance}**\n• Feuerwehr: **${country.fire}**${country.poisonControl ? `\n• Giftnotruf: **${country.poisonControl}**` : ''}\n\n⚠️ **WICHTIG:** Bei akuter Lebensgefall sofort den örtlichen Notruf **${country.general}** wählen!\n\n📱 Notfallphrase: **"${country.emergencyPhrases.help.local}"** (${country.emergencyPhrases.help.phonetic})`
        : '🚨 Wähle zuerst ein Land aus, damit ich dir die richtigen Notrufnummern anzeigen kann. Gehe zu "Notrufnummern" oben.'

    case 'medical':
      return country
        ? `🏥 **Medizinische Hilfe in ${cName}:**\n\n1. Rettungsdienst anrufen: **${country.ambulance}**\n2. Nächstes Krankenhaus suchen (Tab "Krankenhaus")\n3. Versicherungsdienst anrufen (falls vorhanden)\n\n🗣️ Notfallphrasen:\n• "Ich brauche einen Krankenwagen": **"${country.emergencyPhrases.ambulance.local}"** (${country.emergencyPhrases.ambulance.phonetic})\n• "Wo ist das Krankenhaus?": **"${country.emergencyPhrases.hospital.local}"** (${country.emergencyPhrases.hospital.phonetic})\n• "Ich habe Schmerzen": **"${country.emergencyPhrases.pain.local}"** (${country.emergencyPhrases.pain.phonetic})\n\n💡 Tipp: Zeige diese Phrasen demTaxifahrer oder Passanten vor!`
        : '🏥 Wähle ein Land aus, um medizinische Informationen und Notfallphrasen zu erhalten.'

    case 'pharmacy':
      return `💊 **Apotheken-Suche:**\n\nWechsle zum Tab "Apotheke" oben, um die nächsten Apotheken auf OpenStreetMap zu finden.\n\n💡 **Tipp:** In vielen Ländern gibt es einen Notapotheke-Service (Bereitschaftsdienst). Suche online nach "Notapotheke" + deine Stadt.\n\n${country ? `In ${cName} kannst du auch den Rettungsdienst unter **${country.ambulance}** nach der nächsten Apotheke fragen.` : ''}`

    case 'embassy':
      return country
        ? `🛡️ **Deutsche Botschaft in ${cName}:**\n\n📍 ${country.germanEmbassy.address}\n📞 ${country.germanEmbassy.phone}\n📧 ${country.germanEmbassy.email}\n🌐 ${country.germanEmbassy.website}\n🕐 ${country.germanEmbassy.hours}\n\n**Pass verloren?**\n1. Polizei-Verlustanzeige erstellen (${country.police})\n2. Botschaft anrufen für Notpass\n3. Reiseunterlagen mitnehmen (Kopien, Fotos)\n\n🗣️ "Ich habe meinen Pass verloren": **"${country.emergencyPhrases.lost.local}"** (${country.emergencyPhrases.lost.phonetic})`
        : '🛡️ Wähle ein Land aus, um die Botschaftsinformationen zu erhalten.'

    case 'crime':
      return country
        ? `🚔 **Nach einem Diebstahl/Überfall in ${cName}:**\n\n**Sofortmaßnahmen:**\n1. **Sicherheit zuerst** — bring dich in Sicherheit\n2. **Polizei anrufen:** **${country.police}**\n3. **Anzeige erstatten** — wichtig für Versicherung\n4. **Kreditkarten sperren** — Hotline deiner Bank\n5. **Botschaft kontaktieren:** ${country.germanEmbassy.phone}\n\n**Dokumente sichern:**\n• Polizeibericht (Kopie!)\n• Fotos von Verletzungen (falls vorhanden)\n• Zeugenkontaktdaten\n\n🗣️ "Hilfe, ich wurde bestohlen": **"${country.emergencyPhrases.police.local}"** (${country.emergencyPhrases.police.phonetic})`
        : '🚔 Wähle ein Land aus, um die richtigen Schritte und Notrufnummern zu erhalten.'

    case 'safety':
      return country
        ? `🛡️ **Sicherheit in ${cName}:**\n\n**Allgemeine Sicherheitstipps:**\n• Wertsachen nicht sichtbar tragen\n• Ausweise/Kopien getrennt aufbewahren\n• Notfall-App installieren (Offline-Karten!)\n• Lokale Nachrichten verfolgen\n• Verdächtige Situationen meiden\n\n**Notrufnummern immer griffbereit:**\n• Notruf: **${country.general}**\n• Polizei: **${country.police}**\n• Botschaft: ${country.germanEmbassy.phone}\n\n💡 RiskVector zeigt dir das aktuelle Sicherheitsrisiko — schau im Dashboard nach!`
        : '🛡️ Wähle ein Land aus, um spezifische Sicherheitshinweise zu erhalten.'

    case 'disaster':
      return `⚠️ **Naturkatastrophe — Verhaltensregeln:**\n\n**Erdbeben:**\n• "Drop, Cover, Hold On" — unter Tisch kauern\n• Nicht ins Freie rennen (Gefahr durch herabfallende Teile)\n• Nach dem Beben: Gebäude verlassen, offenes Feld suchen\n\n**Flut/Tsunami:**\n• Sofort in höhere Stockwerke/Hügel\n• Nicht durch Wasser watEN — auch 30cm können gefährlich sein\n• Nicht zurückkehren bis Entwarnung\n\n**Sturm/Hurrikan:**\n• Fenster sichern, Innenraum aufsuchen\n• Notgepäck bereithalten\n• Lokale Warnungen beachten\n\n${country ? `📱 Notruf in ${cName}: **${country.general}**` : ''}\n\n🚨 Bei akuter Gefahr SOFORT den örtlichen Notruf wählen!`

    case 'allergic':
      return country
        ? `⚡ **ALLERGISCHER SCHOCK — Sofortmaßnahmen in ${cName}:**\n\n**1. NOTRUF WÄHLEN: ${country.ambulance}**\n\n**2. Erste Hilfe:**\n• Betroffenen hinlegen, Beine hochlegen\n• EpiPen/Notfallmedikament verabreichen (falls vorhanden)\n• Person nicht alleine lassen\n• Bewusstsein und Atmung überwachen\n\n**3. Dem Rettungsdienst sagen:**\n🗣️ "Allergischer Schock": **"${country.emergencyPhrases.allergic.local}"** (${country.emergencyPhrases.allergic.phonetic})\n🗣️ "Brauche Hilfe": **"${country.emergencyPhrases.help.local}"** (${country.emergencyPhrases.help.phonetic})\n\n⚠️ **ZEIT IST KRITISCH — Sofort den Rettungsdienst rufen!**`
        : '⚡ Wähle ein Land aus, um die korrekte Notrufnummer für einen allergischen Schock zu erhalten. Im Zweifel: **112** wählen (international)!'

    default:
      return country
        ? `ℹ️ **KI-Notfall-Assistent für ${cName}:**\n\nIch kann dir helfen bei:\n• 🚨 Notrufnummern — frage nach "Notruf"\n• 🏥 Krankenhaus/Arzt — frage nach "Krankenhaus"\n• 💊 Apotheke — frage nach "Apotheke"\n• 🛡️ Botschaft/Pass — frage nach "Botschaft" oder "Pass"\n• 🗣️ Übersetzung — frage nach "Übersetzung"\n• ⚠️ Katastrophe — sage "Erdbeben", "Flut" etc.\n\n📱 Notruf in ${cName}: **${country.general}**\n\n⚠️ Bei Notfällen IMMER zuerst den örtlichen Notruf wählen!`
        : 'ℹ️ **KI-Notfall-Assistent:**\n\nWähle oben ein Land aus, um länderspezifische Notfallinformationen zu erhalten.\n\nIch kann dir helfen bei Notrufnummern, Krankenhaus-Suche, Apotheken, Botschaftskontakt, Übersetzungen und mehr.\n\n⚠️ Bei Notfällen IMMER zuerst den örtlichen Notruf wählen!'
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, country, city, context } = body as {
      message: string
      country?: string
      city?: string
      context?: ChatMessage[]
    }

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    const intent = detectIntent(message)
    const countryData = country ? findCountry(country) : null
    const response = buildResponse(intent, message, country || null)

    return NextResponse.json({
      response,
      intent,
      country: countryData?.country || country || null,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
  }
}
