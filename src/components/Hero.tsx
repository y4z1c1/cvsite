'use client';
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload } from 'react-icons/fa';
import { useTranslation } from '../hooks/useTranslation';
import { CONTACT } from '../lib/persona';
import { LINKS } from '../lib/links';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <div className="hero">
      <div className="hero-top">
        {/* Bare <img>, not next/image — see README/plan note on the 1.94 MB pp.png */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/pp.png"
          alt={CONTACT.name}
          width={88}
          height={88}
          className="hero-avatar"
        />
        <div className="hero-heading">
          <h1>{CONTACT.name}</h1>
          <p className="hero-title">{t('heroTitle')}</p>
          <p className="muted hero-location">{t('location')}</p>
        </div>
      </div>
      <p className="hero-tagline">{t('heroTagline')}</p>
      <div className="hero-links">
        <a className="chip" href={LINKS.cv} download aria-label={t('downloadCV')}>
          <FaDownload size={13} /> {t('downloadCV')}
        </a>
        <a className="chip" href={LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FaGithub size={13} /> GitHub
        </a>
        <a className="chip" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedin size={13} /> LinkedIn
        </a>
        <a className="chip" href={LINKS.email} aria-label={t('contact')}>
          <FaEnvelope size={13} /> {t('contact')}
        </a>
      </div>
    </div>
  );
};

export default Hero;
