import { fal } from '@fal-ai/client';
import { buildSystemPrompt } from '@/lib/persona';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// fal any-llm model id. gemini-flash is among the cheapest with solid quality.
// Swap to 'google/gemini-flash-1.5-8b' for even lower cost.
const MODEL = 'google/gemini-flash-1.5';

// Abuse caps. The endpoint is public and spends a real API key, so bound both
// how often a visitor can call it and how much text a single call can carry.
const MAX_MESSAGES = 12;
const MAX_CHARS_PER_MESSAGE = 2000;
const MAX_CHARS_TOTAL = 8000;
const RATE_LIMIT = 12; // requests per window, per IP
const RATE_WINDOW_MS = 60_000;

type ChatMessage = { role: 'user' | 'assistant'; content: string };

// In-memory fixed-window counter. Good enough for a personal site; on a
// multi-instance deploy each instance keeps its own window, so the effective
// limit is RATE_LIMIT × instances. Swap for Redis/Upstash if that matters.
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now >= entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (now >= v.resetAt) hits.delete(k);
    }
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

// Keep only the tail of the conversation and clamp each message, so a crafted
// client cannot push an arbitrarily large prompt through the key.
function sanitize(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw)) return null;
  const cleaned: ChatMessage[] = [];
  for (const m of raw.slice(-MAX_MESSAGES)) {
    const role = (m as any)?.role;
    const content = (m as any)?.content;
    if (role !== 'user' && role !== 'assistant') continue;
    if (typeof content !== 'string') continue;
    const text = content.slice(0, MAX_CHARS_PER_MESSAGE);
    if (!text.trim()) continue;
    cleaned.push({ role, content: text });
  }
  let total = 0;
  const bounded: ChatMessage[] = [];
  for (let i = cleaned.length - 1; i >= 0; i--) {
    total += cleaned[i].content.length;
    if (total > MAX_CHARS_TOTAL) break;
    bounded.unshift(cleaned[i]);
  }
  return bounded;
}

// Flatten chat history into a single prompt string (any-llm takes one prompt
// + one system_prompt, not a messages array).
function renderConversation(messages: ChatMessage[]): string {
  const history = messages
    .map((m) => `${m.role === 'user' ? 'Visitor' : 'Yusuf'}: ${m.content}`)
    .join('\n');
  return `${history}\nYusuf:`;
}

// The prompt ends with a "Yusuf:" cue, and the model often echoes that label
// back at the start of its reply. Strip it so the terminal shows only the answer.
const LABEL_RE = /^\s*(?:yusuf(?:\s+an[ıi]l)?(?:\s+yaz[ıi]c[ıi])?|an[ıi]l)\s*:\s*/i;
// Longest label we might strip — hold back at least this much before emitting.
const LABEL_MAX = 32;

function stripLabel(s: string): string {
  return s.replace(LABEL_RE, '');
}

export async function POST(req: Request) {
  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    return Response.json({ error: 'Server not configured' }, { status: 500 });
  }

  if (rateLimited(clientIp(req))) {
    return Response.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(RATE_WINDOW_MS / 1000) } },
    );
  }

  let messages: ChatMessage[] = [];
  try {
    const body = await req.json();
    const clean = sanitize(body?.messages);
    if (!clean) {
      return Response.json({ error: 'Bad request' }, { status: 400 });
    }
    messages = clean;
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }
  if (messages.length === 0) {
    return Response.json({ error: 'No messages provided' }, { status: 400 });
  }

  fal.config({ credentials: falKey });

  // Stream the reply token-by-token. any-llm emits cumulative `output` per
  // event, so we forward only the newly-appended delta.
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sent = 0;

      // Emit everything of `full` past what we already sent, after stripping a
      // leading speaker label. Until `full` is longer than the longest possible
      // label we withhold output, so a half-arrived "Yusu" is never emitted and
      // then contradicted once the full "Yusuf:" lands.
      const push = (full: string, final: boolean) => {
        if (!final && full.length < LABEL_MAX) return;
        const clean = stripLabel(full);
        if (clean.length > sent) {
          controller.enqueue(encoder.encode(clean.slice(sent)));
          sent = clean.length;
        }
      };

      try {
        const falStream = await fal.stream('fal-ai/any-llm', {
          input: {
            model: MODEL,
            system_prompt: buildSystemPrompt(),
            prompt: renderConversation(messages),
          },
        });

        for await (const event of falStream) {
          push(String((event as any)?.output ?? ''), false);
        }

        // Flush any remainder from the final resolved output.
        const final: any = await falStream.done();
        push(String(final?.output ?? ''), true);
        controller.close();
      } catch (err) {
        console.error('chat route error:', err);
        // Best-effort error signal without leaking internals or FAL_KEY.
        try {
          controller.enqueue(encoder.encode('\n[error]'));
        } catch {}
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  });
}
