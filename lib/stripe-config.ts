// Stripe Pricing Configuration for RiskVector
// New B2B pricing tiers - April 2026

export interface PricingTier {
  name: string;
  price: string;
  priceId: string;
  features: string[];
  popular?: boolean;
  cta: string;
  disabled?: boolean;
}

export const tiers: PricingTier[] = [
  {
    name: 'Starter',
    price: '€49',
    priceId: 'price_1TM5CCPrxEA5GFLKHCktVmxs',
    features: ['Basic API access', '5 countries', 'Daily updates', '100 API calls/day', 'Email alerts', 'Dashboard access'],
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: '€149',
    priceId: 'price_1TM5CDPrxEA5GFLK2xa4uUmq',
    features: ['Full API access', 'All 195 countries', 'Real-time updates', 'Unlimited API calls', 'Real-time alerts', 'Webhook integrations', 'Priority support'],
    popular: true,
    cta: 'Upgrade to Pro',
  },
  {
    name: 'Enterprise',
    price: '€499',
    priceId: 'price_1TM5CEPrxEA5GFLKRyxapmNQ',
    features: ['Everything in Pro', 'White-label reports', 'Unlimited API', 'Custom reports', 'SLA guarantee', 'Dedicated support', 'Team access', 'Custom integrations'],
    cta: 'Contact Sales',
  },
];
