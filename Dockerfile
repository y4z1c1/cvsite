# syntax=docker/dockerfile:1
# Built in CI and pushed to GHCR — never built on the server. A `next build`
# on the 4GB Hetzner box alongside Coolify would OOM.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# No NEXT_PUBLIC_* build args: nothing in this app is inlined into the client
# bundle. FAL_KEY is server-side only and injected by Coolify at runtime.
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1
# Coolify's own healthcheck execs into the container looking for curl first;
# alpine ships only busybox wget, so without this it falls straight through
# to "curl: not found" in the deploy log before trying wget.
RUN apk add --no-cache curl
RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
USER nextjs
EXPOSE 3000
# $PORT follows whatever the runtime sets (Coolify uses 80). Generous
# start-period/retries: cold boot on a memory-constrained shared box can be
# slow, and a flapping healthcheck is worse than a slightly late one.
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=5 \
  CMD curl -fsS "http://127.0.0.1:${PORT:-3000}/api/health" || exit 1
CMD ["node", "server.js"]
