import { STATS_ENDPOINT, STATS_TTL_SECONDS, sanitizeMetrics, type StatsPayload } from '@/lib/liveStats';

export const runtime = 'nodejs';
// Not force-dynamic (that would disable caching outright): this route is a
// cache in front of a third party, so it must be cacheable.
export const revalidate = 900;

// Upstream is a hard dependency of nothing — if it hangs, the CV page must
// still render. Cap the wait well under any sane request budget.
const UPSTREAM_TIMEOUT_MS = 4000;

const EMPTY: StatsPayload = { metrics: {}, generatedAt: null, live: false };

/**
 * Server-side cache in front of bogazicicim.com's public stats endpoint.
 *
 * The proxy exists to satisfy the upstream's "cache on your side; do not fetch
 * per page render" rule. Calling it straight from the browser would mean one
 * upstream request per visitor; going through here means one per 900s for the
 * whole site, no matter the traffic.
 *
 * Always answers 200, even when upstream is down — the client then has exactly
 * one code path (merge whatever metrics came back over its own fallbacks) and
 * `live: false` to tell the two apart.
 */
export async function GET() {
  let payload = EMPTY;

  try {
    const res = await fetch(STATS_ENDPOINT, {
      // No cookies, no auth header: upstream ignores them and says they can
      // reduce its cache hit rate.
      credentials: 'omit',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      next: { revalidate: STATS_TTL_SECONDS },
    });

    // 429 and 503 are both documented and both mean "use your fallbacks".
    if (res.ok) {
      const body: unknown = await res.json();
      const root = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>;
      const metrics = sanitizeMetrics(root.metrics);
      // generatedAt is upstream COMPUTE time, not request time — it can lag
      // now by up to 900s. Passed through untouched for staleness display.
      const generatedAt = typeof root.generatedAt === 'string' ? root.generatedAt : null;
      // A 200 carrying no usable metric is not "live" for our purposes.
      if (Object.keys(metrics).length > 0) payload = { metrics, generatedAt, live: true };
    }
  } catch {
    // Timeout, DNS, TLS, malformed JSON — all the same outcome: fall back.
  }

  return Response.json(payload, {
    headers: {
      // Mirrors upstream's own policy so the browser and any edge in front of
      // this origin stop re-asking. stale-while-revalidate keeps a served page
      // fast while the refresh happens behind it.
      'Cache-Control': payload.live
        ? `public, max-age=300, s-maxage=${STATS_TTL_SECONDS}, stale-while-revalidate=3600`
        : // Don't let a failed fetch stick around for 15 minutes.
          'public, max-age=30, s-maxage=60',
    },
  });
}
