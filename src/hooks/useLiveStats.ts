'use client';
import { useEffect, useState } from 'react';
import type { StatsPayload } from '../lib/liveStats';

// Module-scoped so every ProjectCard on the page shares one request. The card
// renders in two places at once (its own stage and, potentially, a chat
// bubble), and without this each mount would fire its own fetch.
let inflight: Promise<StatsPayload | null> | null = null;

const load = (): Promise<StatsPayload | null> => {
  inflight ??= fetch('/api/stats')
    .then((res) => (res.ok ? (res.json() as Promise<StatsPayload>) : null))
    .catch(() => null);
  return inflight;
};

/**
 * Live Boğaziçi Çim counts, or null until they arrive (and forever, if the
 * fetch fails). Callers merge whatever comes back over their own hardcoded
 * values rather than replacing wholesale — see useLiveStats' contract notes in
 * lib/liveStats.ts: a missing key means the upstream count failed, not zero.
 */
export function useLiveStats(): StatsPayload | null {
  const [stats, setStats] = useState<StatsPayload | null>(null);

  useEffect(() => {
    let active = true;
    load().then((payload) => {
      if (active && payload?.live) setStats(payload);
    });
    return () => {
      active = false;
    };
  }, []);

  return stats;
}
