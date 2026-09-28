// Shared in-memory fixed-window rate limiter. Good enough for a personal site
// on a single long-lived container; on a multi-instance deploy each instance
// keeps its own window, so the effective limit is limit × instances. Swap for
// Redis/Upstash if that ever matters (see DEPLOY.md).
export function createRateLimiter(opts: { limit: number; windowMs: number }) {
  const { limit, windowMs } = opts;
  const hits = new Map<string, { count: number; resetAt: number }>();

  return function rateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = hits.get(ip);
    if (!entry || now >= entry.resetAt) {
      hits.set(ip, { count: 1, resetAt: now + windowMs });
      if (hits.size > 5000) {
        for (const [k, v] of hits) if (now >= v.resetAt) hits.delete(k);
      }
      return false;
    }
    entry.count += 1;
    return entry.count > limit;
  };
}

// The FIRST x-forwarded-for entry is whatever the client sent, so keying on it
// let anyone reset their window with a spoofed header. Prefer the header
// Cloudflare sets itself (and overwrites if a client sends one), then the
// proxy-set x-real-ip, then the LAST XFF hop — the one our own proxy appended.
export function clientIp(req: Request): string {
  const cf = req.headers.get('cf-connecting-ip');
  if (cf) return cf.trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real.trim();
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',').pop()!.trim();
  return 'unknown';
}
