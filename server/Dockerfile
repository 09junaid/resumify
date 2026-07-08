# syntax=docker/dockerfile:1

# ─── Base ──────────────────────────────────────────────
# bcrypt ships prebuilt binaries; alpine keeps the image small.
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# ─── Dependencies (cached layer) ───────────────────────
FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev

# ─── Runtime ───────────────────────────────────────────
FROM base AS runner

# Tiny init so PID 1 reaps zombies and forwards signals.
RUN apk add --no-cache tini

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src

# Writable uploads dir owned by the non-root user.
RUN mkdir -p uploads && chown -R node:node /app
USER node

EXPOSE 5000

# Uses the /health endpoint exposed by the app.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||5000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/server.js"]
