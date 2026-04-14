import { NextRequest, NextResponse } from 'next/server'
import { getCountrySafetyProfile, getAllCountryProfiles } from '@/lib/safetyRules'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ country: string }> }
) {
  try {
    const { country } = await params

    if (country.toLowerCase() === 'list') {
      return NextResponse.json({
        countries: getAllCountryProfiles(),
        count: getAllCountryProfiles().length,
      })
    }

    const profile = getCountrySafetyProfile(country)

    if (!profile) {
      return NextResponse.json({
        error: `No safety profile for "${country}"`,
        availableCountries: getAllCountryProfiles(),
      }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Safety rules error:', error)
    return NextResponse.json({ error: 'Failed to fetch safety rules' }, { status: 500 })
  }
}
