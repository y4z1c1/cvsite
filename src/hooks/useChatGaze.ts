'use client';
import { useEffect, useState } from 'react';
import type { FrameKey } from '../lib/avatarFrames';
import { useCursorDirection } from './useCursorDirection';

/** What the conversation is doing right now, as seen by the chat face. */
export type ChatMode = 'idle' | 'typing' | 'thinking' | 'speaking' | 'card';

// The face sits at the left end of the input row: the visitor's text runs off
// to its right, and the conversation stacks up above it. Gazes are picked for
// that geometry (r = viewer's right, u = up; see avatarFrames.ts).
const THINK_FRAMES: readonly FrameKey[] = ['ul', 'ur'];
const THINK_STEP_MS = 700;
// Past this many characters the text has run far enough right to warrant the
// outer column.
const LONG_INPUT_CHARS = 28;

/**
 * Picks the chat face's frame from the conversation state:
 * idle → follows the cursor (or glances around on touch), typing → reads the
 * visitor's text, thinking → a slow up-left/up-right "hmm", speaking → looks
 * up at its own reply, card → glances at the card it just pulled up.
 */
export function useChatGaze(
  ref: React.RefObject<HTMLElement>,
  mode: ChatMode,
  inputLength: number,
  /** False while the face is collapsed — no listeners, no timers. */
  active = true,
): FrameKey {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Always called (hooks can't be conditional); it only listens while idle.
  const cursorFrame = useCursorDirection(ref, active && mode === 'idle' && !reduceMotion);

  const [thinkIndex, setThinkIndex] = useState(0);
  useEffect(() => {
    if (!active || mode !== 'thinking' || reduceMotion) return;
    setThinkIndex(0);
    const id = setInterval(() => setThinkIndex((i) => (i + 1) % THINK_FRAMES.length), THINK_STEP_MS);
    return () => clearInterval(id);
  }, [active, mode, reduceMotion]);

  if (reduceMotion) return 'c';
  switch (mode) {
    case 'typing':
      return inputLength > LONG_INPUT_CHARS ? 'r2' : 'r1';
    case 'thinking':
      return THINK_FRAMES[thinkIndex];
    case 'speaking':
      return 'u';
    case 'card':
      return 'ur';
    default:
      return cursorFrame;
  }
}
