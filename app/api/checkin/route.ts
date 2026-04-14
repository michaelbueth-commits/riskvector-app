import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { country, city, message } = body
    if (!country) return NextResponse.json({ error: 'country required' }, { status: 400 })

    const now = new Date()
    const timeStr = now.toLocaleString('de-DE', { timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

    const location = city ? `${city}, ${country}` : country
    const shareText = [
      '🛡️ Ich bin sicher!',
      `📍 ${location}`,
      `🕐 ${timeStr}`,
      message ? `💬 "${message}"` : null,
      '',
      '— Gesendet via RiskVector.app',
    ].filter(Boolean).join('\n')

    const shareUrl = `https://riskvector.app/checkin?country=${encodeURIComponent(country)}${city ? '&city=' + encodeURIComponent(city) : ''}&t=${now.getTime()}`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    const emailSubject = encodeURIComponent('🛡️ Ich bin sicher!')
    const emailBody = encodeURIComponent(shareText)
    const emailUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`

    return NextResponse.json({
      shareText,
      shareUrl,
      whatsappUrl,
      telegramUrl,
      emailUrl,
      timestamp: now.toISOString(),
      location,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
