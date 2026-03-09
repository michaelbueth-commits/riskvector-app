import { NextResponse } from 'next/server';
import { enhancedAlertService } from '@/lib/enhancedAlertService';
import { AlertFilter } from '@/lib/enhancedAlertTypes';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filter: AlertFilter = {};
    const types = searchParams.get('types');
    if (types) filter.types = types.split(',') as any;
    
    const severities = searchParams.get('severities');
    if (severities) filter.severities = severities.split(',') as any;

    const countries = searchParams.get('countries');
    if (countries) filter.countries = countries.split(',');

    const alerts = await enhancedAlertService.getAllAlerts(filter);

    return NextResponse.json({
      success: true,
      alerts,
      count: alerts.length,
    });
  } catch (error) {
    console.error('Enhanced alerts API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch enhanced alerts' },
      { status: 500 }
    );
  }
}