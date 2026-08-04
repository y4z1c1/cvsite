'use client';
import { useContext, useRef, useState } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload, FaChevronDown, FaRobot, FaCheck } from 'react-icons/fa';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageContext } from '../context/LanguageContext';
import { CONTACT } from '../lib/persona';
import { LINKS } from '../lib/links';
import { buildAISummary } from '../lib/aiSummary';
import AvatarTracker from './AvatarTracker';

const COPIED_REVERT_MS = 2000;

const Hero = () => {
  const { t } = useTranslation();
  const { language } = useContext(LanguageContext);
  const [copied, setCopied] = useState(false);
  const revertTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const copyForAI = async () => {
    try {
      await navigator.clipboard.writeText(buildAISummary(language));
      setCopied(true);
      clearTimeout(revertTimerRef.current);
      revertTimerRef.current = setTimeout(() => setCopied(false), COPIED_REVERT_MS);
    } catch {
      // clipboard permission denied or unsupported — silently no-op, nothing
      // to recover into since there's no error state worth showing here.
    }
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
        <a className="chip glass" href={LINKS.cv} download aria-label={t('downloadCV')}>
          <FaDownload size={13} /> {t('downloadCV')}
        </a>
        <a className="chip glass" href={LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FaGithub size={13} /> GitHub
        </a>
        <a className="chip glass" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedin size={13} /> LinkedIn
        </a>
        <a className="chip glass" href={LINKS.email} aria-label={t('contact')}>
          <FaEnvelope size={13} /> {t('contact')}
        </a>
        <button type="button" className="chip glass" onClick={copyForAI} data-copied={copied}>
          {copied ? <FaCheck size={13} /> : <FaRobot size={13} />}
          {copied ? t('copiedForAI') : t('copyForAI')}
        </button>
      </div>
      <span className="hero-scroll-hint" style={{ '--i': 3 } as React.CSSProperties} aria-hidden>
        scroll <FaChevronDown size={11} />
      </span>
    </div>
  );
};

export default Hero;
