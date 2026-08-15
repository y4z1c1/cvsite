// Live platform counts for Boğaziçi Çim, from its public stats endpoint.
// Contract: cv/bogazicicim-stats-api-prompt.md and the published API doc.
//
// Everything here is written against two of that contract's invariants, both
// of which are easy to get wrong:
//
//   1. An ABSENT metric key means "this count failed" — it does NOT mean zero.
//      Zero is a real value and is reported as 0. So a missing key must fall
//      through to our own last-known-good number, never render as 0.
//   2. Keys are additive-only. New ones may appear at any time, so nothing
//      here validates against a closed schema or rejects unknown keys.

export const STATS_ENDPOINT = 'https://bogazicicim.com/api/public/stats';

// Upstream recomputes at most once per 900s and returns identical bytes in
// between (generatedAt included), so fetching faster than this buys nothing.
export const STATS_TTL_SECONDS = 900;

/** Metric keys this site renders. Upstream may send more; we ignore those. */
export type MetricKey =
  | 'users'
  | 'courseTeacherReviews'
  | 'teachers'
  | 'courses'
  | 'clubs'
  | 'clubReviews'
  | 'forumPosts';

export type Metrics = Partial<Record<MetricKey, number>> & Record<string, number>;

export type StatsPayload = {
  metrics: Metrics;
  /** Upstream compute time (ISO 8601 UTC), or null when we're on fallbacks. */
  generatedAt: string | null;
  /** False when the upstream call failed and every number is a local fallback. */
  live: boolean;
};

/**
 * Keeps only clean non-negative integers.
 *
 * Anything malformed is dropped rather than coerced: a dropped key falls back
 * to our hardcoded last-known-good value, whereas coercing (Number(x) || 0)
 * would publish a confidently wrong number — and "0 users" on a CV reads as a
 * dead project rather than as a broken fetch.
 */
export function sanitizeMetrics(raw: unknown): Metrics {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return {};
  const out: Metrics = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value === 'number' && Number.isInteger(value) && value >= 0) {
      out[key] = value;
    }
  }
  return out;
}
