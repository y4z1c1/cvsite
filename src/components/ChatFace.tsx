'use client';
import { useRef } from 'react';
import { useChatGaze, type ChatMode } from '../hooks/useChatGaze';
import AvatarStack from './AvatarStack';

type Props = { mode: ChatMode; inputLength: number; visible: boolean };

// The chat's face: the same head-turn frames as the hero, sat at the left end
// of the input row (dock and open sheet alike), reacting to the conversation
// instead of only to the cursor. Decorative — the typing dots and message text
// already carry the state for assistive tech. The frames are already cached
// from the hero, so this costs no extra requests.
// Only one face at a time: it stays collapsed while the hero avatar is on
// screen and slides in once that one scrolls away (or the sheet opens).
const ChatFace = ({ mode, inputLength, visible }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useChatGaze(ref, mode, inputLength, visible);
  return (
    <span className="chat-face" data-mode={mode} data-visible={visible} aria-hidden>
      <AvatarStack frame={frame} alt="" stackRef={ref} />
    </span>
  );
};

export default ChatFace;
