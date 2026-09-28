'use client';
/* eslint-disable @next/next/no-img-element -- a hand-managed stack of
   preloaded frames; next/image's wrapper markup and lazy loading would fight
   both the instant frame swap and the preload strategy. */
import type { Ref } from 'react';
import { FRAME_KEYS, frameSrc, type FrameKey } from '../lib/avatarFrames';

type Props = {
  frame: FrameKey;
  /** Alt text for the resting frame; pass '' when the avatar is decorative. */
  alt: string;
  stackRef?: Ref<HTMLSpanElement>;
  /** True for the LCP-relevant instance (the hero); the rest yield to it. */
  priority?: boolean;
  className?: string;
};

/**
 * All 13 head-turn frames rendered stacked and toggled via opacity rather than
 * swapping a single `src` — swapping would show a decode flash on every turn,
 * whereas toggling already-decoded layers is instant. The swap is a hard cut,
 * not a fade (see .avatar-frame in stages.css for why). Whoever renders this
 * decides which frame shows: the hero follows the cursor, the chat face
 * follows the conversation.
 */
const AvatarStack = ({ frame, alt, stackRef, priority = false, className }: Props) => (
  <span className={`avatar-stack${className ? ` ${className}` : ''}`} ref={stackRef}>
    {FRAME_KEYS.map((key) => (
      <img
        key={key}
        src={frameSrc(key)}
        alt={key === 'c' ? alt : ''}
        aria-hidden={key !== 'c' || !alt}
        className={`avatar-frame${key === frame ? ' is-active' : ''}`}
        // the resting frame is the one that matters for LCP; the other twelve
        // are only needed once the head turns, so they yield to it
        fetchPriority={priority && key === 'c' ? 'high' : 'low'}
        decoding="async"
        draggable={false}
      />
    ))}
  </span>
);

export default AvatarStack;
