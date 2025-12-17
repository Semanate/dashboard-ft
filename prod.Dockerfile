# Etapa 1: Construcción
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG SUPABASE_URL
ARG SUPABASE_PUBLISHABLE_DEFAULT_KEY
ARG PUBLIC_EDGE_BASE_URL
ENV PUBLIC_EDGE_BASE_URL=$PUBLIC_EDGE_BASE_URL
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_PUBLISHABLE_DEFAULT_KEY=${SUPABASE_PUBLISHABLE_DEFAULT_KEY}
ENV NODE_ENV=production

# Construir la aplicación
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder --chown=nodejs:nodejs /app/build ./build

USER nodejs

ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

EXPOSE 3001

CMD ["dumb-init", "node", "build/index.js"]