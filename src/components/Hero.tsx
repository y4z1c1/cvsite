'use client';
import { useContext, useRef, useState } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload, FaChevronDown, FaRobot, FaCheck, FaTimes } from 'react-icons/fa';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageContext } from '../context/LanguageContext';
import { CONTACT } from '../lib/persona';
import { LINKS } from '../lib/links';
import { buildAISummary } from '../lib/aiSummary';
import { goTo } from '../lib/scroll';
import AvatarTracker from './AvatarTracker';

const COPIED_REVERT_MS = 2000;

const buildCVDownloadName = () => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  const date = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
  ].join('-');
  const time = [
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join('-');

  return `cv-yusuf-anil-yazici-${date}_${time}.pdf`;
};

const Hero = () => {
  const { t } = useTranslation();
  const { language } = useContext(LanguageContext);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const revertTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleCVDownload = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.download = buildCVDownloadName();
  };

  const copyForAI = async () => {
    let next: 'copied' | 'failed' = 'copied';
    try {
      await navigator.clipboard.writeText(buildAISummary(language));
    } catch {
      // Clipboard denied/unsupported (insecure context, some in-app
      // browsers). Say so rather than leaving a click that did nothing.
      next = 'failed';
    }
    setCopyState(next);
    clearTimeout(revertTimerRef.current);
    revertTimerRef.current = setTimeout(() => setCopyState('idle'), COPIED_REVERT_MS);
  };

  return (
    <div className="hero">
      <div className="hero-stage-top" style={{ '--i': 0 } as React.CSSProperties}>
        <span className="hero-avatar-ring">
          <AvatarTracker alt={CONTACT.name} />
        </span>
        <div className="hero-heading">
          <h1 className="hero-name">{CONTACT.name}</h1>
          <p className="hero-title">{t('heroTitle')}</p>
          <p className="muted hero-location">{t('location')}</p>
        </div>
      </div>
      <p className="hero-tagline" style={{ '--i': 1 } as React.CSSProperties}>{t('heroTagline')}</p>
      <div className="hero-links" style={{ '--i': 2 } as React.CSSProperties}>
        <a
          className="chip glass"
          href={LINKS.cv}
          download="cv-yusuf-anil-yazici.pdf"
          onClick={handleCVDownload}
          aria-label={t('downloadCV')}
        >
          <FaDownload size={13} /> {t('downloadCV')}
        </a>
        <a className="chip glass" href={LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FaGithub size={13} /> GitHub
        </a>
        <a className="chip glass" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedin size={13} /> LinkedIn
        </a>
        {/* Scrolls to the on-page contact form rather than opening mailto —
            the form is the page's one call to action. */}
        <button type="button" className="chip glass" onClick={() => goTo('contact')}>
          <FaEnvelope size={13} /> {t('contact')}
        </button>
        <button type="button" className="chip glass" onClick={copyForAI} data-copied={copyState === 'copied'}>
          {copyState === 'copied' ? <FaCheck size={13} /> : copyState === 'failed' ? <FaTimes size={13} /> : <FaRobot size={13} />}
          {copyState === 'copied' ? t('copiedForAI') : copyState === 'failed' ? t('copyFailed') : t('copyForAI')}
        </button>
      </div>
      <span className="hero-scroll-hint" style={{ '--i': 3 } as React.CSSProperties} aria-hidden>
        {t('scrollHint')} <FaChevronDown size={11} />
      </span>
    </div>
  );
};

export default Hero;
