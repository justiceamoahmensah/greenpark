type Bucket = { count: number; resetsAt: number };

const globalBuckets = globalThis as typeof globalThis & { enquiryRateLimits?: Map<string, Bucket> };
const buckets = globalBuckets.enquiryRateLimits ?? new Map<string, Bucket>();
globalBuckets.enquiryRateLimits = buckets;

export function allowRequest(key: string, limit = 8, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetsAt <= now) {
    buckets.set(key, { count: 1, resetsAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (existing.count >= limit) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((existing.resetsAt - now) / 1000)) };
  }
  existing.count += 1;
  return { allowed: true, retryAfter: 0 };
}

