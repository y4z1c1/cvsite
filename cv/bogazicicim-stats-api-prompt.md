# Prompt — paste this into a coding session in the `bogazicicim` repo

Add a public, read-only JSON endpoint that exposes Boğaziçi Çim's aggregate
platform counts, so my portfolio site (yusufanilyazici.com) can display live
numbers instead of the hardcoded ones it ships today.

## Route

`GET /api/public/stats` on `https://bogazicicim.com`.

Unauthenticated. No API key, no token — the consumer must be able to call it
from a server route with a plain `fetch` and nothing else.

## Response shape (this is a contract — treat it as frozen)

HTTP 200, `Content-Type: application/json; charset=utf-8`:

```json
{
  "generatedAt": "2026-08-15T09:12:03.114Z",
  "metrics": {
    "users": 3239,
    "courseTeacherReviews": 17815,
    "teachers": 2008,
    "courses": 4206,
    "clubs": 50,
    "clubReviews": 1812,
    "forumPosts": 34997
  }
}
```

- `generatedAt` — ISO 8601 UTC, when the counts were computed (NOT when the
  request arrived). The consumer shows staleness from this.
- `metrics` — flat object, string key to non-negative integer. No nesting, no
  strings-that-are-numbers, no `null`.
- Keys are the API. You may **add** keys later; never rename or remove one.
- If a single count fails, omit that key and still return 200 with the rest.
  A partial payload is useful; a 500 means my page falls back to stale
  hardcoded numbers. Only return 5xx if you can produce no metrics at all.

## Metric definitions — match these exactly

The numbers above are what my site currently hardcodes. Use them to sanity-check
your queries; if yours disagree by more than a rounding-scale amount, the
definitions differ and we should reconcile before shipping.

| key | means |
|---|---|
| `users` | registered accounts, excluding soft-deleted/banned |
| `courseTeacherReviews` | course reviews + teacher reviews, combined |
| `teachers` | distinct teacher records |
| `courses` | distinct course records |
| `clubs` | distinct club records |
| `clubReviews` | club reviews only (not included in `courseTeacherReviews`) |
| `forumPosts` | forum posts including replies, excluding deleted |

State in a comment which table/filter each key maps to, so the definition is
readable next to the query rather than living only in my head.

## Constraints

**Privacy.** Aggregate counts only. No user rows, no emails, no IDs, no
per-course breakdowns, nothing that could identify a person. This response is
world-readable and will be cached publicly — treat everything in it as
published permanently.

**Query cost.** Don't `SELECT *` and count in JS. Use Supabase
`.select('*', { count: 'exact', head: true })` so no rows cross the wire. If
`forumPosts` gets slow at that size, move to a single `public_stats` table
refreshed on a schedule and have the route read one row.

**Caching — this matters most.** These counts change slowly and the endpoint
will get hit by every page render on my side.
- Cache the computed result server-side with a TTL of ~15 min (in-process
  cache or `unstable_cache`), so a burst of requests is one DB round-trip.
- Send `Cache-Control: public, s-maxage=900, stale-while-revalidate=3600` so
  Cloudflare serves it from the edge and my origin barely sees traffic.
- Make sure the Coolify/Next config doesn't force this route dynamic in a way
  that defeats the header.

**CORS.** `Access-Control-Allow-Origin: *` is fine — the payload is public
aggregate data and the endpoint is unauthenticated. Do **not** set
`Access-Control-Allow-Credentials`, and make sure no cookie is read or written
on this route (a route that reads cookies can end up caching per-user).
Handle `OPTIONS` preflight.

**Abuse.** Edge caching absorbs almost everything, but add a modest per-IP rate
limit (say 60 req/min) so an uncached-path flood can't reach the DB.

**Secrets.** Server-side only. The service-role key must not appear in any
client bundle. If the route can be served with the anon key under RLS, prefer
that.

## Done when

- `curl -s https://bogazicicim.com/api/public/stats | jq` returns the shape above.
- A second `curl -sI` within the TTL shows it served from cache (`cf-cache-status: HIT`).
- Hitting it from a browser on a different origin succeeds (CORS works).
- No secret, no PII, no per-user data anywhere in the response.
