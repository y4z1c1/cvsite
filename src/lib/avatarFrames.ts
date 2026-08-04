// The 13 head-turn frames of the hero avatar, and the mapping from a bucketed
// cursor direction to one of them. Single source of truth shared by
// useCursorDirection (which picks a frame) and AvatarTracker (which renders
// the stack) so the two can't drift apart.
//
// Grid is deliberately asymmetric: horizontal cursor travel dominates, and the
// page content sits *below* the avatar, so the mid and down rows get 5 columns
// of resolution while the up row (cursor near the browser chrome — rare) stays
// coarse at 3.
//
//        ul    u    ur          pitch +1  (chin raised ~14°)
//   l2   l1    c    r1   r2     pitch  0  (level)
//   dl2  dl1   d    dr1  dr2    pitch -1  (chin lowered ~14°)
//
// Negative yaw = looking toward the VIEWER'S left (the left edge of the image).

export type FrameKey =
  | 'ul' | 'u' | 'ur'
  | 'l2' | 'l1' | 'c' | 'r1' | 'r2'
  | 'dl2' | 'dl1' | 'd' | 'dr1' | 'dr2';

const UP = ['ul', 'u', 'ur'] as const;
const MID = ['l2', 'l1', 'c', 'r1', 'r2'] as const;
const DOWN = ['dl2', 'dl1', 'd', 'dr1', 'dr2'] as const;

export const FRAME_KEYS: readonly FrameKey[] = [...UP, ...MID, ...DOWN];

/** Frames worth glancing at during the touch-device idle loop (skips `c`, which is the resting pose). */
export const GLANCE_KEYS: readonly FrameKey[] = ['ul', 'u', 'ur', 'l2', 'l1', 'r1', 'r2', 'dl1', 'd', 'dr1'];

export const frameSrc = (key: FrameKey) => `/avatar/pp-${key}.webp`;

/**
 * @param yaw   −2..2, negative = viewer's left
 * @param pitch 1 = looking up, 0 = level, −1 = looking down
 */
export function frameFor(yaw: number, pitch: number): FrameKey {
  if (pitch === 1) {
    // the up row only has 3 columns — collapse yaw to its sign
    const s = Math.sign(yaw);
    return s < 0 ? 'ul' : s > 0 ? 'ur' : 'u';
  }
  const row = pitch === 0 ? MID : DOWN;
  return row[Math.max(0, Math.min(4, yaw + 2))];
}
