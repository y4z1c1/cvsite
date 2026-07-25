'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      aria-label="toggle theme"
      title="toggle theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      style={{
        width: '2.4rem',
        height: '2.4rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-pill)',
        padding: 0,
        flex: '0 0 auto',
      }}
    >
      {/* render nothing until mounted to avoid hydration flash */}
      {mounted ? (isDark ? <FaSun /> : <FaMoon />) : <span style={{ width: '1em' }} />}
    </button>
  );
};

export default ThemeToggle;
