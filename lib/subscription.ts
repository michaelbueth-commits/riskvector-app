// Client-side subscription helpers (placeholder until real auth)

export type Tier = 'free' | 'pro' | 'enterprise';

const TIER_KEY = 'rv_subscription_tier';
const SIM_COUNT_KEY = 'rv_sim_count';

export function getSubscriptionTier(): Tier {
  if (typeof window === 'undefined') return 'free';
  return (localStorage.getItem(TIER_KEY) as Tier) || 'free';
}

export function setSubscriptionTier(tier: Tier): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TIER_KEY, tier);
}

export function getSimulationCount(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(SIM_COUNT_KEY) || '0', 10);
}

export function incrementSimulationCount(): number {
  const count = getSimulationCount() + 1;
  localStorage.setItem(SIM_COUNT_KEY, String(count));
  return count;
}

const FREE_TIER_LIMIT = 5;

export function canRunSimulation(currentCount?: number): boolean {
  const tier = getSubscriptionTier();
  if (tier !== 'free') return true;
  const count = currentCount ?? getSimulationCount();
  return count < FREE_TIER_LIMIT;
}
