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
          background: 'linear-gradient(135deg, #0b0b0d 0%, #16161a 60%, #1f2a0a 100%)',
          color: '#ededed',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- satori, not the DOM */}
        <img src={avatarSrc} width={220} height={220} style={{ borderRadius: 999, border: '4px solid #d3ff4f' }} alt="" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>{CONTACT.name}</div>
          <div style={{ fontSize: 36, color: '#d3ff4f' }}>{CONTACT.title}</div>
          <div style={{ fontSize: 28, color: '#8b8b90' }}>Full-stack · blockchain · ML — ask my AI twin anything</div>
          <div style={{ fontSize: 26, color: '#8b8b90', marginTop: 12 }}>yusufanilyazici.com</div>
        </div>
      </div>
    ),
    size,
  );
}
