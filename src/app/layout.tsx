import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Instrument_Serif } from 'next/font/google';
import Script from 'next/script';
import './reset.css';
import './monospace.css';
import './theme.css';
import './stages.css';
import './tailwind.css';
import { Providers } from './providers';

const sans = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

// Display serif for stage titles / hero name — weight 400 is the only weight
// this face ships (not a variable font), so it's required here.
const display = Instrument_Serif({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const SITE_URL = 'https://yusufanilyazici.com';
const OG_IMAGE = 'https://avatars.githubusercontent.com/u/56488393?v=4';

const DESCRIPTION =
  'yusuf anıl yazıcı — computer engineer. full-stack, blockchain & ML experience, projects, education, skills, and an AI chat that answers as me.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'yusuf anıl yazıcı',
  description: DESCRIPTION,
  icons: {
    icon: OG_IMAGE,
  },
  openGraph: {
    title: 'yusuf anıl yazıcı',
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'yusuf anıl yazıcı',
    images: [OG_IMAGE],
    type: 'profile',
  },
  twitter: {
    card: 'summary',
    title: 'yusuf anıl yazıcı',
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

// Cheap, real SEO win now that the page has actual content worth marking up.
const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Yusuf Anıl Yazıcı',
  jobTitle: 'Computer Engineer',
  url: SITE_URL,
  email: 'mailto:yusufanilyazici@gmail.com',
  sameAs: ['https://github.com/y4z1c1', 'https://www.linkedin.com/in/y4z1c1/'],
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Boğaziçi University',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Stops iOS Safari's auto-zoom on input focus. Since iOS 10 this does NOT
  // block manual pinch-zoom, so accessibility is unaffected.
  maximumScale: 1,
  // Mobile keyboard resizes the layout (100dvh shrinks) instead of overlaying
  // it, so the input row slides up above the keyboard.
  interactiveWidget: 'resizes-content',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${display.variable}`} suppressHydrationWarning>
      <body>
        {/* Plain <script>, not next/script — JSON-LD must be in the initial
            server-rendered HTML for crawlers, not injected client-side. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
        />
        <Providers>{children}</Providers>
        {process.env.NEXT_PUBLIC_UMAMI_SRC && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ? (
          <Script
            src={process.env.NEXT_PUBLIC_UMAMI_SRC}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
