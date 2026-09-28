'use client';
import { useRef } from 'react';
import { useStageContext } from '../context/StageContext';
import { useCursorDirection } from '../hooks/useCursorDirection';
import AvatarStack from './AvatarStack';

type Props = { alt: string };

/**
 * The hero avatar, with the head turned toward the cursor.
 *
 * The frame stack is server-rendered directly: the resting frame is a ~10KB
 * WebP, so it doubles as the first-paint image. (This used to probe for the
 * frames first and render the 1.9MB original portrait meanwhile — which every
 * visitor downloaded, on every load, just to throw it away.)
 */
const AvatarTracker = ({ alt }: Props) => {
  const stackRef = useRef<HTMLSpanElement>(null);
  const { activeId } = useStageContext();

  // Only track while the hero is the stage in view — reuses the single
  // IntersectionObserver in StageContext instead of adding another. `null` is
  // the pre-observer state on first paint, when the hero is visible anyway.
  const enabled = activeId === 'hero' || activeId === null;
  const frame = useCursorDirection(stackRef, enabled);

  return <AvatarStack frame={frame} alt={alt} stackRef={stackRef} priority className="avatar-stack-hero" />;
};

export default AvatarTracker;
