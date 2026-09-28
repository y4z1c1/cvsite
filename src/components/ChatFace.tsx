'use client';
import { useRef } from 'react';
import { useChatGaze, type ChatMode } from '../hooks/useChatGaze';
import AvatarStack from './AvatarStack';

type Props = { mode: ChatMode; inputLength: number };

// The chat's face: the same head-turn frames as the hero, sat at the left end
// of the input row (dock and open sheet alike), reacting to the conversation
// instead of only to the cursor. Decorative — the typing dots and message text
// already carry the state for assistive tech. The frames are already cached
// from the hero, so this costs no extra requests.
const ChatFace = ({ mode, inputLength }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useChatGaze(ref, mode, inputLength);
  return (
    <span className="chat-face" data-mode={mode} aria-hidden>
      <AvatarStack frame={frame} alt="" stackRef={ref} />
    </span>
  );
};

export default ChatFace;
