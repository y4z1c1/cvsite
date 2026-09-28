'use client';
import { useEffect, useRef } from 'react';
import { useStageContext } from '../context/StageContext';

export type StageHue = 'wine' | 'violet' | 'glacier' | 'amber' | 'rose';

type Props = {
  id: string;
  kicker?: string;
  title?: string;
  hue: StageHue;
  group?: string;
  /** Accessible + nav label; falls back to `title`. */
  navLabel: string;
  /** Widens .stage-inner beyond the default 44rem column — for grid layouts (e.g. the recap stage). */
  wide?: boolean;
  children: React.ReactNode;
};

// One full-viewport "chapter". Registers with the shared StageContext
// IntersectionObserver on mount; the observer toggles is-in/is-ahead/is-behind
// on the section element itself, which stages.css turns into the
// blur/scale/fade reveal on .stage-inner and the velocity blur on .stage-vel.
const Stage = ({ id, kicker, title, hue, group, navLabel, wide, children }: Props) => {
  const ref = useRef<HTMLElement>(null);
  const { register } = useStageContext();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return register(el);
  }, [register]);

  // Flags stages that don't fit the viewport so stages.css can drop their snap
  // point (see .stage[data-tall]). Re-measured on every box change — viewport
  // resize and mobile URL-bar collapse both resize the section via 100svh, and
  // a language switch or late webfont can push a borderline stage over.
  // Setting the attribute only changes scroll-snap-align, which has no layout
  // effect, so this can't feed back into the observer.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    // Measured against the stage's OWN resolved min-height, not
    // window.innerHeight. min-height is 100svh/100dvh, so "taller than its
    // min-height" and "taller than the viewport" mean the same thing here —
    // but both numbers now come off the same element in the same layout pass.
    // Comparing the box to the window instead races: the two settle on
    // different frames during a resize, so a fresh height gets paired with a
    // stale viewport and the stage is mislabelled until something else nudges
    // it.
    const measure = () => {
      const minH = parseFloat(getComputedStyle(el).minHeight) || 0;
      el.dataset.tall = String(el.offsetHeight > minH + 1);
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    window.addEventListener('resize', schedule);
    // iOS collapses the URL bar without firing window resize; visualViewport is
    // the event that actually reports it, and it's exactly the case that
    // changes whether a borderline stage still fits.
    window.visualViewport?.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('resize', schedule);
    };
  }, []);

  const titleId = title ? `${id}-t` : undefined;

  return (
    <section
      ref={ref}
      id={id}
      className="stage"
      data-hue={hue}
      data-group={group}
      aria-label={titleId ? undefined : navLabel}
      aria-labelledby={titleId}
    >
      <div className="stage-vel">
        <div className={`stage-inner${wide ? ' is-wide' : ''}`}>
          {kicker && <p className="stage-kicker">{kicker}</p>}
          {title && (
            <h2 id={titleId} className="stage-title">
              {title}
            </h2>
          )}
          {children}
        </div>
      </div>
    </section>
  );
};

export default Stage;
