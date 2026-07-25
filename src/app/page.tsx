'use client';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import Chat from '../components/Chat';
import ThemeToggle from '../components/ThemeToggle';

const App = () => {
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 4vh, 3rem) 1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '44rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {/* Header */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/pp.jpg"
              alt="yusuf anıl yazıcı"
              width={52}
              height={52}
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid var(--border)',
                flex: '0 0 auto',
              }}
            />
            <div>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.15 }}>
                yusuf anıl yazıcı
              </h1>
              <span style={{ color: 'var(--muted)', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                computer engineer
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className="chip"
              onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
              title="switch language"
            >
              {language === 'en' ? 'türkçe' : 'english'}
            </button>
            <ThemeToggle />
          </div>
        </header>

        <Chat />
      </div>
    </main>
  );
};

export default App;
