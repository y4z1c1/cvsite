import { Resend } from 'resend';
import { CONTACT } from '@/lib/persona';
import { createRateLimiter, clientIp } from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_NAME_CHARS = 120;
const MAX_MESSAGE_CHARS = 4000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Much tighter than the chat route's 12/60s — each hit here sends a real
// email, not just a model call.
const rateLimited = createRateLimiter({ limit: 3, windowMs: 600_000 });

type Body = { name?: string; email?: string; message: string; company?: string };

function validate(raw: unknown): { name: string; email: string; message: string; company: string } | 'invalid-email' | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const b = raw as Record<string, unknown>;

  const message = typeof b.message === 'string' ? b.message.trim().slice(0, MAX_MESSAGE_CHARS) : '';
  if (!message) return null;

  const name = typeof b.name === 'string' ? b.name.trim().slice(0, MAX_NAME_CHARS) : '';
  const company = typeof b.company === 'string' ? b.company.trim() : '';

  const emailRaw = typeof b.email === 'string' ? b.email.trim() : '';
  if (emailRaw && !EMAIL_RE.test(emailRaw)) return 'invalid-email';

  return { name, email: emailRaw, message, company };
}

export async function POST(req: Request) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return Response.json({ error: 'Server not configured' }, { status: 500 });
  }

  if (rateLimited(clientIp(req))) {
    return Response.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': '600' } },
    );
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }

  const clean = validate(body);
  if (clean === 'invalid-email') {
    return Response.json({ error: 'Invalid email' }, { status: 400 });
  }
  if (!clean) {
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }

  // Honeypot: real visitors never fill this field. Pretend success so the
  // bot doesn't learn its submission was dropped.
  if (clean.company) {
    return Response.json({ ok: true });
  }

  try {
    const resend = new Resend(resendKey);
    // The SDK returns { data, error } rather than throwing on API-level
    // failures (bad key, invalid sender, etc.) — only network/parse errors
    // land in the catch block, so `error` must be checked explicitly too.
    // Resend's free plan allows one verified sending domain; bogazicicim.com
    // is already verified there, so we send through it instead of paying for
    // a second domain just for this contact form.
    const { error } = await resend.emails.send({
      from: `${CONTACT.name} <hello@bogazicicim.com>`,
      to: CONTACT.email,
      replyTo: clean.email || undefined,
      subject: `New message from ${clean.name || 'a visitor'} — yusufanilyazici.com`,
      text: [
        `Name: ${clean.name || 'Anonymous'}`,
        `Email: ${clean.email || 'not provided'}`,
        '',
        clean.message,
      ].join('\n'),
    });
    if (error) {
      console.error('message route error:', error);
      return Response.json({ error: 'Failed to send' }, { status: 500 });
    }
  } catch (err) {
    console.error('message route error:', err);
    return Response.json({ error: 'Failed to send' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
