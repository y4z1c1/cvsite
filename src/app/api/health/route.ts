// Liveness probe for the Docker HEALTHCHECK and Coolify's zero-downtime swap.
// Deliberately dependency-free: it must stay green when fal.ai is down, so a
// third-party outage degrades the chat instead of dropping the whole container
// out of the proxy.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } });
}
