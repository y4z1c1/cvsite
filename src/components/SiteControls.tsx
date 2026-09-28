'use client';
import { useContext, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { FaMoon, FaSun } from 'react-icons/fa';
import { LanguageContext } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

// Top-right language + theme switch. Both were previously reachable only by
// typing into the chat ("türkçe", "dark mode"), which almost nobody would
// discover.
const SiteControls = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  const { t } = useTranslation();
  const { resolvedTheme, setTheme } = useTheme();
  // resolvedTheme is unknown on the server; render the icon only after mount
  // so the markup can't mismatch during hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <div className="site-controls glass">
      <button
        type="button"
        className="site-controls-btn"
        onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
        aria-label={t('switchLanguage')}
        title={t('switchLanguage')}
      >
        <span data-active={language === 'en'}>EN</span>
        <span aria-hidden>/</span>
        <span data-active={language === 'tr'}>TR</span>
      </button>
      <span className="site-controls-sep" aria-hidden />
      <button
        type="button"
        className="site-controls-btn"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        aria-label={isDark ? t('switchToLight') : t('switchToDark')}
        title={isDark ? t('switchToLight') : t('switchToDark')}
      >
        {mounted ? isDark ? <FaSun size={13} /> : <FaMoon size={12} /> : <span className="site-controls-icon-slot" />}
      </button>
    </div>
  );
};

export default SiteControls;
