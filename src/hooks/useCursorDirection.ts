'use client';
import { useEffect, useRef, useState } from 'react';
import { frameFor, GLANCE_KEYS, type FrameKey } from '../lib/avatarFrames';

// Normalised distance from the avatar's centre at which the head steps to the
// next yaw/pitch bucket. HYSTERESIS widens whichever band we're currently in,
// so a cursor resting exactly on a boundary can't strobe between two frames.
const YAW_STOPS = [0.1, 0.34];
const PITCH_STOPS = [0.18];
const HYSTERESIS = 0.04;

// How often the cached avatar centre is refreshed while the pointer is moving.
const REMEASURE_MS = 200;

// Touch devices: glance somewhere at random, hold, then return to centre.
const GLANCE_MIN_MS = 2500;
const GLANCE_MAX_MS = 5000;
const GLANCE_HOLD_MS = 900;

/**
 * Buckets a signed normalised offset into 0 / ±1 / ±2. Entering a band costs a
 * little more than staying in it (HYSTERESIS), which is what stops a cursor
 * parked on a threshold from flickering the avatar between two frames.
 */
function bucket(v: number, stops: number[], prev: number): number {
  const mag = Math.abs(v);
  const prevMag = Math.abs(prev);
  const sign = v < 0 ? -1 : 1;
  for (let i = stops.length - 1; i >= 0; i--) {
    const threshold = prevMag >= i + 1 ? stops[i] - HYSTERESIS : stops[i] + HYSTERESIS;
    if (mag >= threshold) return sign * (i + 1);
  }
  return 0;
}

/**
 * Picks which avatar frame should be showing based on where the cursor is
 * relative to `ref`, and writes the continuous `--ax` / `--ay` offsets straight
 * onto that element for the CSS parallax tilt.
 *
 * The tilt is written imperatively rather than returned as state on purpose:
 * it updates every frame, and pushing that through React would mean ~60
 * re-renders a second. Only the discrete frame key — which changes rarely — is
 * state. Same trade-off as useScrollVelocity's `--vblur`.
 */
export function useCursorDirection(
  ref: React.RefObject<HTMLElement>,
  enabled: boolean,
): FrameKey {
  const [frame, setFrame] = useState<FrameKey>('c');
  const frameRef = useRef<FrameKey>('c');
  const yawRef = useRef(0);
  const pitchRef = useRef(0); // cursor space: +1 = cursor sits below the avatar

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = ref.current;
    if (!el) return;

    const apply = (next: FrameKey) => {
      if (frameRef.current === next) return;
      frameRef.current = next;
      setFrame(next);
    };

    // ---- touch devices: no cursor to follow, so glance around on a timer ----
    if (window.matchMedia('(pointer: coarse)').matches) {
      let holdTimer: ReturnType<typeof setTimeout>;
      let nextTimer: ReturnType<typeof setTimeout>;
      const schedule = () => {
        nextTimer = setTimeout(() => {
          apply(GLANCE_KEYS[Math.floor(Math.random() * GLANCE_KEYS.length)]);
          holdTimer = setTimeout(() => {
            apply('c');
            schedule();
          }, GLANCE_HOLD_MS);
        }, GLANCE_MIN_MS + Math.random() * (GLANCE_MAX_MS - GLANCE_MIN_MS));
      };
      schedule();
      return () => {
        clearTimeout(holdTimer);
        clearTimeout(nextTimer);
      };
    }

    // ---- pointer devices: follow the cursor ----
    let raf = 0;
    let queued = false;
    let px = 0;
    let py = 0;
    let cx = 0;
    let cy = 0;
    let lastMeasure = 0;

    const measure = () => {
      const r = el.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
    };
    measure();

    const tick = (t: number) => {
      queued = false;
      // The avatar scrolls with the page, so its centre moves — but far more
      // slowly than the pointer. Re-measure on a slow cadence instead of every
      // frame so the hot path isn't forcing layout 60 times a second.
      if (t - lastMeasure > REMEASURE_MS) {
        measure();
        lastMeasure = t;
      }

      // Normalise each direction against the distance actually available on
      // that side, not half the viewport. The avatar is left-of-centre in the
      // hero, so a shared denominator made the outer left bucket unreachable
      // (the left edge only got to ~0.23) while the right saturated past 1.
      // Per-side scaling means every frame is reachable wherever it sits.
      const dx = px - cx;
      const dy = py - cy;
      const spanX = dx < 0 ? cx : window.innerWidth - cx;
      const spanY = dy < 0 ? cy : window.innerHeight - cy;
      const nx = spanX > 1 ? Math.max(-1, Math.min(1, dx / spanX)) : 0;
      const ny = spanY > 1 ? Math.max(-1, Math.min(1, dy / spanY)) : 0;

      el.style.setProperty('--ax', nx.toFixed(3));
      el.style.setProperty('--ay', ny.toFixed(3));

      const yaw = bucket(nx, YAW_STOPS, yawRef.current);
      const pitchRaw = bucket(ny, PITCH_STOPS, pitchRef.current);
      yawRef.current = yaw;
      pitchRef.current = pitchRaw;

      // pitchRaw is in cursor space (+1 = cursor below); frameFor wants +1 = looking up
      apply(frameFor(yaw, -pitchRaw));
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(raf);
      el.style.removeProperty('--ax');
      el.style.removeProperty('--ay');
    };
  }, [enabled, ref]);

  return frame;
}
