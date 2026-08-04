'use client';
import { useEffect, useRef } from 'react';
import { useStageContext } from '../context/StageContext';

export type StageHue = 'lime' | 'violet' | 'cyan' | 'amber' | 'rose';

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
