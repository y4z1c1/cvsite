'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { suggestedQuestions } from '../translations';

type Line =
  | { kind: 'boot'; text: string }
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

const Chat = () => {
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation();

  const lc = (s: string) => s.toLocaleLowerCase(language === 'tr' ? 'tr-TR' : 'en-US');

  const boot = (): Line[] => [
    { kind: 'boot', text: 'anil@yazici:~$ ./persona --init' },
    { kind: 'boot', text: 'loaded: yusuf anıl yazıcı · computer engineer' },
    { kind: 'boot', text: `${lc(t('currentEducation'))} · graduated june 2026` },
    { kind: 'boot', text: `stack: ${SKILLS}` },
    { kind: 'boot', text: t('termHint') },
  ];

  const [lines, setLines] = useState<Line[]>(boot);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // reset boot lines if language changes and no conversation yet
  const started = lines.some((l) => l.kind === 'user');
  useEffect(() => {
    if (!started) setLines(boot());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines, loading]);

  const print = (...ls: Line[]) => setLines((prev) => [...prev, ...ls]);

  // returns true if handled locally as a command
  const runCommand = (raw: string): boolean => {
    const cmd = raw.trim().toLowerCase();
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
        setLines([{ kind: 'boot', text: t('termHint') }]);
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
      <div className="term-bar">
        <span className="term-dots">
          <span className="term-dot" style={{ background: '#ff5f56' }} />
          <span className="term-dot" style={{ background: '#ffbd2e' }} />
          <span className="term-dot" style={{ background: '#27c93f' }} />
        </span>
        <span className="term-title">anil@yazici — ~/chat</span>
      </div>

      <div className="term-body" ref={bodyRef}>
        {lines.map((l, i) => {
          if (l.kind === 'user') {
            return (
              <div className="term-line" key={i}>
                <span className="prompt">visitor@web</span>
                <span className="muted">:~$ </span>
                {l.text}
              </div>
            );
          }
          if (l.kind === 'assistant') {
            return (
              <div className="term-line" key={i} style={{ marginTop: '0.2rem' }}>
                <span className="prompt">anil</span>
                <span className="muted"> ❯ </span>
                {l.text}
                {lastIsStreamingAssistant(i) && <span className="cursor" />}
                {loading && !l.text && !streaming && (
                  <span className="typing"><span /><span /><span /></span>
                )}
              </div>
            );
          }
          if (l.kind === 'boot') {
            return (
              <div className="term-line term-boot" key={i}>
                {l.text}
              </div>
            );
          }
          return (
            <div className="term-line muted" key={i} style={{ marginTop: '0.15rem' }}>
              {l.text}
            </div>
          );
        })}

        {/* clickable suggestions before the first question */}
        {!started && (
          <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            {suggestedQuestions[language].map((q) => (
              <button
                key={q}
                type="button"
                className="term-suggest"
                onClick={() => send(q)}
              >
                » {q}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        className="term-input-row"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <span className="prompt">visitor@web</span>
        <span className="muted">:~$</span>
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
      </form>
    </div>
  );
};

export default Chat;
