'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { LanguageContext } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

type Line =
  | { kind: 'system'; text: string }
  | { kind: 'user'; text: string }
  | { kind: 'assistant'; text: string };

const SKILLS = 'python · java · typescript · react · move · solidity · django';

const LINKS: Record<string, string> = {
  cv: '/resume-yusuf-anil-yazici.pdf',
  github: 'https://github.com/y4z1c1',
  linkedin: 'https://www.linkedin.com/in/y4z1c1/',
  email: 'mailto:yusufanilyazici@gmail.com',
};

const Anil = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/pp.png"
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

// Loose keyword matching for chat-driven theme/language switches — not full
// NLU, just enough to catch "dark mode", "koyu tema", "türkçeye geç", etc.
// Requires a color word + a "theme/mode" word together to avoid firing on
// unrelated sentences that happen to mention "dark" or "light".
const DARK_RE = /\b(dark|koyu|karanlık)\b/i;
const LIGHT_RE = /\b(light|açık|aydınlık)\b/i;
const THEME_WORD_RE = /\b(theme|mode|tema|mod)\b/i;
const TURKISH_RE = /\b(türkçe|turkish)\b/i;
const ENGLISH_RE = /\b(english|ingilizce)\b/i;

const Chat = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  const { setTheme } = useTheme();
  const { t } = useTranslation();

  const lc = (s: string) => s.toLocaleLowerCase(language === 'tr' ? 'tr-TR' : 'en-US');

  const [lines, setLines] = useState<Line[]>([{ kind: 'assistant', text: t('chatIntro') }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines, loading]);

  const print = (...ls: Line[]) => setLines((prev) => [...prev, ...ls]);

  // returns true if handled locally as a command
  const runCommand = (raw: string): boolean => {
    const cmd = raw.trim().toLowerCase();
    // Turkish-locale lowercase so "İngilizce"/"TÜRKÇE" fold correctly (plain
    // toLowerCase mangles the dotted İ).
    const trCmd = raw.trim().toLocaleLowerCase('tr-TR');

    if (THEME_WORD_RE.test(trCmd) && DARK_RE.test(trCmd)) {
      setTheme('dark');
      print({ kind: 'system', text: language === 'tr' ? 'karanlık moda geçildi.' : 'switched to dark mode.' });
      return true;
    }
    if (THEME_WORD_RE.test(trCmd) && LIGHT_RE.test(trCmd)) {
      setTheme('light');
      print({ kind: 'system', text: language === 'tr' ? 'aydınlık moda geçildi.' : 'switched to light mode.' });
      return true;
    }
    if (TURKISH_RE.test(trCmd)) {
      setLanguage('tr');
      print({ kind: 'system', text: 'türkçeye geçildi.' });
      return true;
    }
    if (ENGLISH_RE.test(trCmd)) {
      setLanguage('en');
      print({ kind: 'system', text: 'switched to english.' });
      return true;
    }

    switch (cmd) {
      case 'help':
        print({
          kind: 'system',
          text:
            'commands: help · about · skills · experience · cv · github · linkedin · email · clear\nor just ask me anything in plain english / türkçe.',
        });
        return true;
      case 'about':
        print({
          kind: 'system',
          text: 'computer engineer · sariyer, istanbul. graduated from boğaziçi university (june 2026). full-stack, blockchain & ml.',
        });
        return true;
      case 'skills':
        print({ kind: 'system', text: SKILLS });
        return true;
      case 'experience':
        print({
          kind: 'system',
          text: [
            `- ${lc(t('turkishTechRole'))}${lc(t('turkishTechDate'))}`,
            `- ${lc(t('riskOptimaRole'))}${lc(t('riskOptimaDate'))}`,
            `- ${lc(t('suiCityRole'))}${lc(t('suiCityDate'))}`,
            `- ${lc(t('freelanceRole'))}${lc(t('freelanceDate'))}`,
          ].join('\n'),
        });
        return true;
      case 'clear':
        setLines([{ kind: 'assistant', text: t('chatIntro') }]);
        return true;
      case 'cv':
      case 'github':
      case 'linkedin':
      case 'email':
        print({ kind: 'system', text: `opening ${cmd}…` });
        if (typeof window !== 'undefined') window.open(LINKS[cmd], '_blank');
        return true;
      default:
        return false;
    }
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    print({ kind: 'user', text: trimmed });
    setInput('');

    if (runCommand(trimmed)) return;

    setLoading(true);
    setStreaming(false);
    print({ kind: 'assistant', text: '' });

    try {
      const history = lines
        .filter((l) => l.kind === 'user' || l.kind === 'assistant')
        .map((l) => ({ role: l.kind as 'user' | 'assistant', content: l.text }));
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
        const clean = acc.replace(/\n?\[error\]$/, '');
        setLines((prev) => {
          const c = [...prev];
          c[c.length - 1] = { kind: 'assistant', text: clean };
          return c;
        });
      }
      if (!acc.replace(/\n?\[error\]$/, '').trim()) throw new Error('empty');
    } catch {
      setLines((prev) => {
        const c = [...prev];
        if (c.length && c[c.length - 1].kind === 'assistant' && !c[c.length - 1].text.trim()) {
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

  return (
    <div className="term" onClick={() => inputRef.current?.focus()}>
      <div className="term-body" ref={bodyRef}>
        {lines.map((l, i) => {
          if (l.kind === 'user') {
            return (
              <div className="msg-row msg-row-user msg-in" key={i}>
                <div className="msg-bubble msg-bubble-user">{l.text}</div>
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
          return (
            <div className="msg-row msg-row-assistant msg-in" key={i}>
              <div className="msg-bubble msg-bubble-system muted">{l.text}</div>
            </div>
          );
        })}
      </div>

      <form
        className="term-input-row"
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
          placeholder={t('chatPlaceholder')}
          aria-label={t('chatPlaceholder')}
          autoFocus
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
    </div>
  );
};

export default Chat;
