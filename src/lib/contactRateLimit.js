const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 8;

function buckets() {
  if (!globalThis.__contactRateBuckets) {
    globalThis.__contactRateBuckets = new Map();
  }
  return globalThis.__contactRateBuckets;
}

export function clientIp(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const hop = forwarded.split(",")[0].trim();
    if (hop) return hop;
  }
  const real = req.headers.get("x-real-ip");
  if (real && real.trim()) return real.trim();
  return "unknown";
}

export function allowContactRequest(ip, now = Date.now()) {
  const map = buckets();
  const cutoff = now - WINDOW_MS;
  for (const [key, stamps] of map) {
    const fresh = stamps.filter((t) => t > cutoff);
    if (fresh.length) map.set(key, fresh);
    else map.delete(key);
  }
  const recent = map.get(ip) || [];
  if (recent.length >= MAX_REQUESTS) return false;
  recent.push(now);
  map.set(ip, recent);
  return true;
}
