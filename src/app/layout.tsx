import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './reset.css';
import './monospace.css';
import './globals.css';
import './theme.css';
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

const SITE_URL = 'https://yusufanilyazici.com';
const OG_IMAGE = 'https://avatars.githubusercontent.com/u/56488393?v=4';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'yusuf anıl yazıcı',
  description: 'yusuf anıl yazıcı — computer engineer. ask me anything.',
  icons: {
    icon: OG_IMAGE,
  },
  openGraph: {
    title: 'yusuf anıl yazıcı',
    description: 'yusuf anıl yazıcı — computer engineer. ask me anything.',
    url: SITE_URL,
    siteName: 'yusuf anıl yazıcı',
    images: [OG_IMAGE],
    type: 'profile',
  },
  twitter: {
    card: 'summary',
    title: 'yusuf anıl yazıcı',
    description: 'yusuf anıl yazıcı — computer engineer. ask me anything.',
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
