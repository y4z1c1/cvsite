'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { LanguageContext } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import CareerTimeline from './CareerTimeline';
import ProjectCard from './ProjectCard';
import MessageForm from './MessageForm';
import { PROJECTS } from '../lib/projects';
import { LINKS } from '../lib/links';
import { SKILL_GROUPS, TECH_ICONS } from '../lib/career';
import { translations } from '../translations';

type Line =
  | { kind: 'intro' }
  | { kind: 'system'; text: string }
  | { kind: 'user'; text: string }
  | { kind: 'assistant'; text: string }
  | { kind: 'timeline' }
  | { kind: 'project'; id: string }
  | { kind: 'message' };

type Props = { open: boolean; onOpen: () => void; onClose: () => void };

const Anil = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/avatar/pp-c-sm.webp"
    alt="anıl"
    width={30}
    height={30}
    style={{
      width: 30,
      height: 30,
      borderRadius: '50%',
      objectFit: 'cover',
      border: '1px solid var(--border)',
      flex: '0 0 auto',
    }}
  />
);

// Loose keyword matching for chat-driven quick actions — not full NLU, just
// enough to catch "dark mode", "koyu tema", "türkçeye geç", "experience",
// "bogazicicim" etc. locally without an LLM round-trip.
//
// Only SHORT, command-like inputs are handled here (see isCommandLike).
// Anything that reads like a real question goes to the model, which can still
// trigger the same actions via [[show:...]] / [[set:...]] markers — otherwise
// "what was your experience with React?" got a canned timeline card and
// "lightweight ML models" flipped the theme.
//
// JS \b is ASCII-only, so it misfires around Turkish letters (ı, ç, ş…);
// these use Unicode letter lookarounds instead. \p{L}* tails absorb Turkish
// suffixes ("temaya", "moda", "karanlığa").
const word = (alts: string) => new RegExp(`(?<!\\p{L})(?:${alts})(?!\\p{L})`, 'iu');
const DARK_RE = word('dark|koyu|karanl[ıi][kğ]\\p{L}*');
const LIGHT_RE = word('light|açık|aydınlık\\p{L}*');
const THEME_WORD_RE = word('theme|mode|tema\\p{L}*|mod|moda|modu|moduna|modda');
const TURKISH_RE = word('türkçe\\p{L}*|turkish');
const ENGLISH_RE = word('english|ingilizce\\p{L}*');
// "do you speak turkish" is a question about me, not a request to switch.
const LANG_QUESTION_RE = word('speak|know|konuş\\p{L}*|biliyor\\p{L}*');
const CAREER_RE = word('experience|career|work history|jobs?|deneyim\\p{L}*|kariyer\\p{L}*|iş geçmişi\\p{L}*');
const PLANSTUDIO_RE = word('plan ?studio');
const PROJECTS_RE = word('projects?|proje\\p{L}*|bo[gğ]azi[cç]i ?[cç]im|bogazicicim');
const MESSAGE_RE = word('leave (you )?(a )?message|get in touch|contact( you)?|mesaj b[ıi]rak\\p{L}*|ileti[sş]im\\p{L}*');

const COMMAND_MAX_WORDS = 4;
const isCommandLike = (s: string) => !s.includes('?') && s.split(/\s+/).length <= COMMAND_MAX_WORDS;

// The LLM can request UI actions by ending its reply with [[show:...]] or
// [[set:...]] tokens (see persona.ts "UI actions"). Markers are stripped from
// the visible text; a trailing half-arrived "[[show:tim" is withheld too so
// it never flashes.
const MARKER_RE = /\[\[(show|set):([a-z:_-]+)\]\]/g;
const stripMarkers = (s: string) =>
  s.replace(/\[\[(?:show|set):[^\]]*\]\]/g, '').replace(/\[\[[^\]]*$/, '').replace(/\n?\[error\]$/, '').trimEnd();

// Bottom-sheet slide duration — kept in one place so the JS unmount timer
// (below) can't drift out of sync with the CSS transition it's waiting on.
const SHEET_TRANSITION_MS = 300;

const Chat = ({ open, onOpen, onClose }: Props) => {
  const { language, setLanguage } = useContext(LanguageContext);
  const { setTheme } = useTheme();
  const { t } = useTranslation();

  // The intro is rendered from t() at paint time (not captured here) so it
  // follows a later language switch.
  const [lines, setLines] = useState<Line[]>([{ kind: 'intro' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // The panel stays mounted for the duration of its slide-down transition
  // even after `open` flips false, so the close animation can play out.
  const [renderPanel, setRenderPanel] = useState(open);
  // CSS length applied as translateY: '100%' offscreen, '0' resting open, or
  // a live 'Npx' value while the handle is being dragged.
  const [offset, setOffset] = useState(open ? '0' : '100%');
  const [dragging, setDragging] = useState(false);
  const dragDeltaRef = useRef(0);
  const dragStartYRef = useRef(0);
  // True once a drag has moved past a few px — suppresses the synthetic
  // click that follows pointerup, so a drag-release doesn't also toggle
  // via the handle's own onClick.
  const dragMovedRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Slide the sheet in/out on open changes. Closing keeps it mounted long
  // enough to finish the transition before actually unmounting.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (open) {
      clearTimeout(closeTimerRef.current);
      setRenderPanel(true);
      if (reduceMotion) {
        setOffset('0');
      } else {
        // Mount offscreen first, then animate to 0 next frame — otherwise
        // the browser paints it already-open and there's nothing to transition.
        requestAnimationFrame(() => requestAnimationFrame(() => setOffset('0')));
      }
    } else {
      setOffset('100%');
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = setTimeout(
        () => setRenderPanel(false),
        reduceMotion ? 0 : SHEET_TRANSITION_MS,
      );
    }
    return () => clearTimeout(closeTimerRef.current);
  }, [open]);

  const onHandlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!open) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartYRef.current = e.clientY;
    dragDeltaRef.current = 0;
    dragMovedRef.current = false;
    setDragging(true);
  };
  const onHandlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;
    const delta = Math.max(0, e.clientY - dragStartYRef.current);
    dragDeltaRef.current = delta;
    if (delta > 4) dragMovedRef.current = true;
    setOffset(`${delta}px`);
  };
  const endDrag = () => {
    if (!dragging) return;
    setDragging(false);
    // Past ~1/5 of a typical sheet height reads as an intentional dismiss;
    // closing from here continues the same downward motion instead of
    // snapping back to 0 first, so the drag and the close animation read as
    // one continuous gesture.
    if (dragDeltaRef.current > 90) onClose();
    else setOffset('0');
  };
  // The handle's onClick fires after pointerup regardless of drag distance —
  // skip it once for a real drag so it doesn't fight endDrag's own decision.
  const onHandleClick = () => {
    if (dragMovedRef.current) {
      dragMovedRef.current = false;
      return;
    }
    onClose();
  };

  // Escape closes the sheet; body scroll stays locked for as long as it's
  // mounted (including the closing animation) so the overview can't scroll
  // behind it mid-transition.
  useEffect(() => {
    if (!renderPanel) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [renderPanel, onClose]);

  // Focus programmatically instead of `autoFocus` — this is what stops the
  // mobile keyboard from popping the moment the page loads. Only steal focus
  // when the sheet actually opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Pin the message area to the bottom. Instant (not smooth) because a tall
  // rich card can outrun a smooth animation mid-flight; the ResizeObserver
  // catches any late layout growth (images, streaming) the effect misses.
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    requestAnimationFrame(() => el.scrollTo({ top: el.scrollHeight }));
  }, [lines, loading]);

  useEffect(() => {
    const el = bodyRef.current;
    const inner = el?.firstElementChild;
    if (!el || !inner) return;
    const ro = new ResizeObserver(() => {
      el.scrollTo({ top: el.scrollHeight });
    });
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  const print = (...ls: Line[]) => setLines((prev) => [...prev, ...ls]);

  // returns true if handled locally as a command
  const runCommand = (raw: string): boolean => {
    const cmd = raw.trim().toLowerCase();
    // Turkish-locale lowercase so "İngilizce"/"TÜRKÇE" fold correctly (plain
    // toLowerCase mangles the dotted İ).
    const trCmd = raw.trim().toLocaleLowerCase('tr-TR');

    switch (cmd) {
      case 'help':
        print({ kind: 'system', text: t('chatHelp') });
        return true;
      case 'about':
        print({ kind: 'system', text: t('chatAbout') });
        return true;
      case 'skills':
        print({
          kind: 'system',
          text: SKILL_GROUPS.map(
            (g) => `${g.label[language].toLowerCase()}: ${g.items.map((id) => TECH_ICONS[id].label).join(' · ')}`,
          ).join('\n'),
        });
        return true;
      case 'message':
      case 'contact':
        print({ kind: 'message' });
        return true;
      case 'clear':
        setLines([{ kind: 'intro' }]);
        return true;
      case 'cv':
      case 'github':
      case 'linkedin':
      case 'email':
        print({ kind: 'system', text: `${t('chatOpening')} ${cmd}…` });
        // mailto: in a new tab just leaves an empty tab behind once the mail
        // client takes over; navigate in place instead.
        if (cmd === 'email') window.location.href = LINKS.email;
        else window.open(LINKS[cmd], '_blank', 'noopener');
        return true;
    }

    if (!isCommandLike(trCmd)) return false;

    if (THEME_WORD_RE.test(trCmd) && DARK_RE.test(trCmd)) {
      setTheme('dark');
      print({ kind: 'system', text: t('chatDark') });
      return true;
    }
    if (THEME_WORD_RE.test(trCmd) && LIGHT_RE.test(trCmd)) {
      setTheme('light');
      print({ kind: 'system', text: t('chatLight') });
      return true;
    }
    if (!LANG_QUESTION_RE.test(trCmd)) {
      const target = TURKISH_RE.test(trCmd) ? 'tr' : ENGLISH_RE.test(trCmd) ? 'en' : null;
      if (target) {
        setLanguage(target);
        // t() still resolves against the old language during this render.
        print({ kind: 'system', text: translations[target].chatLangSwitched });
        return true;
      }
    }
    if (CAREER_RE.test(trCmd)) {
      print({ kind: 'timeline' });
      return true;
    }
    if (PLANSTUDIO_RE.test(trCmd)) {
      print({ kind: 'project', id: 'planstudio' });
      return true;
    }
    if (PROJECTS_RE.test(trCmd)) {
      print({ kind: 'project', id: 'bogazicicim' });
      return true;
    }
    if (MESSAGE_RE.test(trCmd)) {
      print({ kind: 'message' });
      return true;
    }
    return false;
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    if (!open) onOpen();

    print({ kind: 'user', text: trimmed });
    setInput('');

    if (runCommand(trimmed)) return;

    setLoading(true);
    setStreaming(false);
    print({ kind: 'assistant', text: '' });

    try {
      const history = lines
        .filter((l): l is Extract<Line, { kind: 'user' | 'assistant' }> => l.kind === 'user' || l.kind === 'assistant')
        .map((l) => ({ role: l.kind, content: l.text }));
      history.push({ role: 'user', content: trimmed });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) throw new Error('request failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setStreaming(true);
        const clean = stripMarkers(acc);
        setLines((prev) => {
          const c = [...prev];
          c[c.length - 1] = { kind: 'assistant', text: clean };
          return c;
        });
      }
      const markers = Array.from(acc.matchAll(MARKER_RE));
      if (!stripMarkers(acc).trim() && markers.length === 0) throw new Error('empty');

      // Execute whatever UI actions the model requested.
      for (const m of markers) {
        const [, verb, arg] = m;
        if (verb === 'set') {
          if (arg === 'theme:dark') setTheme('dark');
          else if (arg === 'theme:light') setTheme('light');
          else if (arg === 'lang:tr') setLanguage('tr');
          else if (arg === 'lang:en') setLanguage('en');
          continue;
        }
        // show: append the card after the text bubble.
        const card: Line | null = arg === 'timeline'
          ? { kind: 'timeline' }
          : arg === 'message'
            ? { kind: 'message' }
            : arg.startsWith('project:') && PROJECTS.some((p) => p.id === arg.slice(8))
              ? { kind: 'project', id: arg.slice(8) }
              : null;
        if (card) {
          setLines((prev) => {
            const c = [...prev];
            // Drop the text bubble entirely if the model sent only a marker.
            const last = c[c.length - 1];
            if (last && last.kind === 'assistant' && !last.text.trim()) c.pop();
            c.push(card);
            return c;
          });
        }
      }
    } catch {
      setLines((prev) => {
        const c = [...prev];
        const last = c[c.length - 1];
        if (last && last.kind === 'assistant' && !last.text.trim()) {
          c[c.length - 1] = { kind: 'system', text: t('chatError') };
        } else {
          c.push({ kind: 'system', text: t('chatError') });
        }
        return c;
      });
    } finally {
      setLoading(false);
      setStreaming(false);
      inputRef.current?.focus();
    }
  };

  const lastIsStreamingAssistant = (i: number) =>
    streaming && i === lines.length - 1 && lines[i].kind === 'assistant';

  const inputForm = (
    <form
      className="spot-input-row"
      onSubmit={(e) => {
        e.preventDefault();
        send(input);
      }}
    >
      <input
        ref={inputRef}
        className="term-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => {
          if (!open) onOpen();
        }}
        placeholder={t('askAnything')}
        aria-label={t('askAnything')}
        spellCheck={false}
        autoComplete="off"
      />
      <button type="submit" className="send-btn" aria-label={t('chatSend')} disabled={loading || !input.trim()}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </form>
  );

  if (!renderPanel) {
    return <div className="chat-dock">{inputForm}</div>;
  }

  return (
    <>
      <div className={`chat-panel-backdrop${open ? ' is-visible' : ''}`} onClick={onClose} aria-hidden />
      <div
        className={`chat-panel${offset === '0' ? ' is-open' : ''}`}
        style={{
          transform: `translateY(${offset}) scale(${offset === '0' ? 1 : 0.96})`,
          transition: dragging ? 'none' : undefined,
        }}
      >
        <button
          type="button"
          className="chat-panel-handle"
          onClick={onHandleClick}
          onPointerDown={onHandlePointerDown}
          onPointerMove={onHandlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          aria-label={t('backToOverview')}
        >
          <span className="chat-panel-grip" aria-hidden />
        </button>
        <div className="spot-col" onClick={() => inputRef.current?.focus()}>
        <div className="spot-messages" ref={bodyRef}>
          <div className="spot-messages-inner">
            {lines.map((l, i) => {
              if (l.kind === 'user') {
                return (
                  <div className="msg-row msg-row-user msg-in" key={i}>
                    <div className="msg-bubble msg-bubble-user">{l.text}</div>
                  </div>
                );
              }
              if (l.kind === 'intro') {
                return (
                  <div className="msg-row msg-row-assistant msg-in" key={i}>
                    <Anil />
                    <div className="msg-bubble msg-bubble-assistant">{t('chatIntro')}</div>
                  </div>
                );
              }
              if (l.kind === 'assistant') {
                return (
                  <div className="msg-row msg-row-assistant msg-in" key={i}>
                    <Anil />
                    <div className="msg-bubble msg-bubble-assistant">
                      {l.text}
                      {lastIsStreamingAssistant(i) && <span className="cursor" />}
                      {loading && !l.text && !streaming && (
                        <span className="typing"><span /><span /><span /></span>
                      )}
                    </div>
                  </div>
                );
              }
              if (l.kind === 'timeline') {
                return (
                  <div className="msg-row msg-row-assistant msg-in" key={i}>
                    <Anil />
                    <div className="msg-bubble msg-bubble-rich">
                      <CareerTimeline language={language} />
                    </div>
                  </div>
                );
              }
              if (l.kind === 'project') {
                const project = PROJECTS.find((p) => p.id === l.id);
                if (!project) return null;
                return (
                  <div className="msg-row msg-row-assistant msg-in" key={i}>
                    <Anil />
                    <div className="msg-bubble msg-bubble-rich">
                      <ProjectCard project={project} language={language} />
                    </div>
                  </div>
                );
              }
              if (l.kind === 'message') {
                return (
                  <div className="msg-row msg-row-assistant msg-in" key={i}>
                    <Anil />
                    <div className="msg-bubble msg-bubble-rich">
                      <MessageForm
                        onSuccess={() => print({ kind: 'system', text: t('messageSentInChat') })}
                      />
                    </div>
                  </div>
                );
              }
              return (
                <div className="msg-row msg-row-assistant msg-in" key={i}>
                  <div className="msg-bubble msg-bubble-system muted">{l.text}</div>
                </div>
              );
            })}
          </div>
        </div>

          {inputForm}
        </div>
      </div>
    </>
  );
};

export default Chat;
