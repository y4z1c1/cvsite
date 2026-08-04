'use client';
/* eslint-disable @next/next/no-img-element -- the whole point of this component
   is a hand-managed stack of preloaded frames; next/image's wrapper markup and
   lazy loading would fight both the crossfade and the preload strategy. */
import { useEffect, useRef, useState } from 'react';
import { useStageContext } from '../context/StageContext';
import { useCursorDirection } from '../hooks/useCursorDirection';
import { FRAME_KEYS, frameSrc } from '../lib/avatarFrames';

type Props = { alt: string };

/**
 * The hero avatar, with the head turned toward the cursor.
 *
 * All 13 frames are rendered stacked and toggled via opacity rather than
 * swapping a single `src` — swapping would show a decode flash on every turn,
 * whereas toggling already-decoded layers is instant. The swap is a hard cut,
 * not a fade (see .avatar-frame in stages.css for why).
 *
 * Before the generated frames exist, a single probe request for the centre
 * frame decides whether to render the stack at all; if it 404s we fall back to
 * the original portrait and attach no tracking. That keeps this component safe
 * to ship ahead of the assets, and means dropping the WebPs into
 * public/avatar/ switches the effect on with no code change.
 */
const AvatarTracker = ({ alt }: Props) => {
  const stackRef = useRef<HTMLSpanElement>(null);
  const { activeId } = useStageContext();
  const [assets, setAssets] = useState<'probing' | 'ready' | 'missing'>('probing');

  useEffect(() => {
    const probe = new Image();
    probe.onload = () => setAssets('ready');
    probe.onerror = () => setAssets('missing');
    probe.src = frameSrc('c');
    return () => {
      probe.onload = null;
      probe.onerror = null;
    };
  }, []);

  // Only track while the hero is the stage in view — reuses the single
  // IntersectionObserver in StageContext instead of adding another. `null` is
  // the pre-observer state on first paint, when the hero is visible anyway.
  const enabled = assets === 'ready' && (activeId === 'hero' || activeId === null);
  const frame = useCursorDirection(stackRef, enabled);

  if (assets !== 'ready') {
    return <img src="/pp.png" alt={alt} className="hero-avatar-lg" />;
  }

  return (
    <span className="avatar-stack" ref={stackRef}>
      {FRAME_KEYS.map((key) => (
        <img
          key={key}
          src={frameSrc(key)}
          alt={key === 'c' ? alt : ''}
          aria-hidden={key !== 'c'}
          className={`hero-avatar-lg avatar-frame${key === frame ? ' is-active' : ''}`}
          // the resting frame is the one that matters for LCP; the other twelve
          // are only needed once the pointer moves, so they yield to it
          fetchPriority={key === 'c' ? 'high' : 'low'}
          decoding="async"
          draggable={false}
        />
      ))}
    </span>
  );
};

export default AvatarTracker;
