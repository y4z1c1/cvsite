'use client';
import { useEffect } from 'react';

// Cheap motion-blur without a library: while the document is actively
// scrolling, an rAF loop writes a quantized --vblur custom property onto
// <html>. Only .stage.is-in .stage-vel reads it (see stages.css), so at most
// one element repaints per frame no matter how many stages exist.
const MAX_BLUR = 6; // px, desktop ceiling
const VELOCITY_TO_BLUR = 0.055; // px of blur per px/frame of scroll delta
const IDLE_MS = 140; // stop writing (and reset to 0) this long after motion stops

export function useScrollVelocity() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    let raf = 0;
    let running = false;
    let last = window.scrollY;
    let lastWrite = -1;
    let idleSince = 0;

    const write = (v: number) => {
      // Round to 0.5px steps and skip no-op writes — a settled snap
      // shouldn't keep triggering style recalcs.
      const quantized = Math.round(v * 2) / 2;
      if (quantized === lastWrite) return;
      lastWrite = quantized;
      root.style.setProperty('--vblur', `${quantized}px`);
    };

    const tick = (t: number) => {
      const y = window.scrollY;
      const delta = Math.abs(y - last);
      last = y;

      write(Math.min(delta * VELOCITY_TO_BLUR, MAX_BLUR));

      if (delta < 0.5) {
        if (!idleSince) idleSince = t;
      } else {
        idleSince = 0;
      }

      if (idleSince && t - idleSince > IDLE_MS) {
        running = false;
        write(0);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (running) return;
      running = true;
      idleSince = 0;
      last = window.scrollY;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      root.style.removeProperty('--vblur');
    };
  }, []);
}
