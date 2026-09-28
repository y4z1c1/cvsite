import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { CONTACT } from '@/lib/persona';

// Link-preview card for social/chat unfurls. Rendered once at build time
// (no dynamic inputs), replacing the hotlinked GitHub avatar.
export const runtime = 'nodejs';
export const alt = `${CONTACT.name} — ${CONTACT.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const avatar = await readFile(path.join(process.cwd(), 'src/app/apple-icon.png'));
  const avatarSrc = `data:image/png;base64,${avatar.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 56,
          padding: '0 96px',
          background: 'linear-gradient(135deg, #0f0e13 0%, #17151c 55%, #2a1a1a 100%)',
          color: '#eee9e2',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- satori, not the DOM */}
        <img src={avatarSrc} width={220} height={220} style={{ borderRadius: 999, border: '4px solid #e8a0b2' }} alt="" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>{CONTACT.name}</div>
          <div style={{ fontSize: 36, color: '#e8a0b2' }}>{CONTACT.title}</div>
          <div style={{ fontSize: 28, color: '#9d978f' }}>Full-stack · blockchain · ML — ask my AI twin anything</div>
          <div style={{ fontSize: 26, color: '#9d978f', marginTop: 12 }}>yusufanilyazici.com</div>
        </div>
      </div>
    ),
    size,
  );
}
