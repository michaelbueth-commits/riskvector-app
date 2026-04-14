// Simple in-memory TTL cache for Vercel serverless (persists within cold starts)
const store = new Map<string, { value: unknown; expires: number }>();

export function getCached<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    store.delete(key);
    return null;
  }
  return entry.value as T;
}

export function setCache<T>(key: string, value: T, ttlMs: number): void {
  store.delete(key); // reset insertion order
  store.set(key, { value, expires: Date.now() + ttlMs });
}

// Periodic cleanup of expired entries (runs lazily)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of store) {
      if (now > v.expires) store.delete(k);
    }
  }, 60_000).unref?.();
}

export const TTL_15_MIN = 15 * 60 * 1000;
export const TTL_5_MIN = 5 * 60 * 1000;
