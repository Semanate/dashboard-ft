FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init

ARG PUBLIC_SUPABASE_URL
ARG PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

ENV PUBLIC_SUPABASE_URL=$PUBLIC_SUPABASE_URL
ENV PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=$PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY


COPY package*.json ./
RUN npm ci

COPY . .

# Build de SvelteKit
RUN npm run build

# 🔑 CLAVE: Dokploy necesita esta carpeta existente
RUN mkdir -p build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', r => process.exit(r.statusCode === 200 ? 0 : 1))"

# 🔑 Entry correcto de SvelteKit
CMD ["dumb-init", "node", "build"]