import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const stripe = new Stripe(secretKey, { apiVersion: '2026-03-25.dahlia' });
  const body = await req.json();
  const { customerId } = body;

  if (!customerId) {
    return NextResponse.json({ error: 'Missing customerId' }, { status: 400 });
  }

  const origin = req.headers.get('origin') || 'https://riskvector.app';

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/dashboard`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe portal error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
