import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, countries } = await request.json()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }
    if (!countries || !Array.isArray(countries) || countries.length === 0) {
      return NextResponse.json({ error: 'Select at least one country' }, { status: 400 })
    }
    // In production, save to DB and set up email alerts
    console.log(`Alert subscription: ${email} -> ${countries.join(', ')}`)
    return NextResponse.json({ success: true, message: `Subscribed ${email} to alerts for ${countries.length} countries`, countries })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
