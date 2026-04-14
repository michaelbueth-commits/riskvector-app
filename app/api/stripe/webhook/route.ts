import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const stripe = new Stripe(secretKey, { apiVersion: '2026-03-25.dahlia' })
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('✅ Checkout completed:', session.id, 'customer:', session.customer, 'metadata:', session.metadata)
      // Activate subscription: create/update user record with plan from session.metadata or line items
      break
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      console.log('🔄 Subscription updated:', sub.id, 'status:', sub.status)
      // Update user plan based on new price/subscription item
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      console.log('❌ Subscription cancelled:', sub.id, 'customer:', sub.customer)
      // Deactivate: downgrade user to free tier
      break
    }
    case 'invoice.paid': {
      const inv = event.data.object as Stripe.Invoice
      console.log('💰 Invoice paid:', inv.id, 'amount:', inv.amount_paid, inv.currency, 'customer:', inv.customer)
      // Log payment for revenue tracking
      break
    }
    case 'invoice.payment_failed': {
      const inv = event.data.object as Stripe.Invoice
      console.log('⚠️ Payment failed:', inv.id, 'customer:', inv.customer)
      // Alert user, maybe suspend after retries
      break
    }
    default:
      console.log('📦 Unhandled event:', event.type)
  }

  return NextResponse.json({ received: true })
}
