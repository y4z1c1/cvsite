# Deploy

Self-hosted on the existing Hetzner CX22 via **Coolify**, fronted by
**Cloudflare** — the same box and pattern as `bogazicicim`. The image is built
in CI and pulled from GHCR; the server never runs `next build` (4GB alongside
Coolify would OOM).

## Pipeline

`push to main` → GitHub Actions builds the image → pushes
`ghcr.io/y4z1c1/cvsite:latest` + `:sha-…` → hits Coolify's deploy webhook →
Coolify pulls and rolling-deploys behind Traefik.

## One-time setup

### 1. GitHub secrets

Repo → Settings → Secrets and variables → Actions:

| Secret | Value |
| --- | --- |
| `COOLIFY_URL` | Coolify base URL, e.g. `https://coolify.example.com` |
| `COOLIFY_TOKEN` | Coolify → Keys & Tokens → API tokens |
| `COOLIFY_APP_UUID` | UUID of the app created in step 3 |

Leave them unset to build images without auto-deploying — you then click
Redeploy in Coolify by hand.

### 2. DNS

Add an **A record** in Cloudflare pointing the domain at the server's IP, with
the proxy **on** (orange cloud). SSL/TLS mode stays **Full (strict)** — Coolify's
Traefik terminates TLS with its own Let's Encrypt cert, so nothing needs to be
mounted manually.

### 3. Coolify app

New Resource → **Docker Image**:

- Image: `ghcr.io/y4z1c1/cvsite:latest`
- Registry credentials: a GitHub PAT with `read:packages` (the same one
  `bogazicicim` uses, if the package is private — make the package public and
  no credentials are needed)
- Port: `3000`
- Domain: the production hostname
- Health check path: `/api/health`

### 4. Runtime env

Set in the Coolify UI (**not** build variables — nothing here is inlined into
the client bundle):

| Var | Notes |
| --- | --- |
| `FAL_KEY` | fal.ai key, format `<uuid>:<secret>`. Without it `/api/chat` returns 500. |

## Notes

- **Rate limiting is in-process.** `src/app/api/chat/route.ts` keeps its window
  in memory, which is correct here because Coolify runs one long-lived
  container. If this is ever scaled to multiple replicas or moved to a
  serverless host, each instance gets its own window — swap in Upstash Redis
  (the `bogazicicim` account already exists).
- **Memory.** The box already runs Coolify's own stack, `bogazicicim`, Umami and
  Umami's Postgres on 4GB + a 2GB swapfile. This container adds roughly
  150–250MB. Check `free -h` and `docker stats` before and after the first
  deploy.
- **Health check is dependency-free** on purpose — a fal.ai outage degrades the
  chat instead of dropping the container out of the proxy.
