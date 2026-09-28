import type { Metadata, Viewport } from 'next';
import { Schibsted_Grotesk, IBM_Plex_Mono, Newsreader } from 'next/font/google';
import Script from 'next/script';
import './reset.css';
import './monospace.css';
import './theme.css';
import './stages.css';
import './tailwind.css';
import { Providers } from './providers';

// Body: a grotesk with some newsprint character (narrow-ish, sturdy) rather
// than the ubiquitous Inter.
const sans = Schibsted_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans-face',
  display: 'swap',
});

// Mono is reserved for small labels — kickers, dates, nav — never body copy.
const mono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-mono-face',
  display: 'swap',
});

// Display serif for the hero name, stage titles and roles. Variable, with an
// optical-size axis, so big headings get the high-contrast display cut
// automatically; the italic carries the hero tagline.
const display = Newsreader({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-display-face',
  display: 'swap',
});

const SITE_URL = 'https://yusufanilyazici.com';

const DESCRIPTION =
  'yusuf anıl yazıcı — computer engineer. full-stack, blockchain & ML experience, projects, education, skills, and an AI chat that answers as me.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'yusuf anıl yazıcı',
  description: DESCRIPTION,
  // icon.png / apple-icon.png / opengraph-image.tsx in this folder are picked
  // up by file convention — no hotlinked GitHub avatar anymore.
  alternates: { canonical: '/' },
  openGraph: {
    title: 'yusuf anıl yazıcı',
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'yusuf anıl yazıcı',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'yusuf anıl yazıcı',
    description: DESCRIPTION,
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
  worksFor: {
    '@type': 'Organization',
    name: 'Turkish Technology',
  },
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
