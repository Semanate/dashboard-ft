# Etapa 1: Construcción
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG SUPABASE_URL
ARG SUPABASE_PUBLISHABLE_DEFAULT_KEY
ARG EDGE_INTERNAL_URL
ENV EDGE_INTERNAL_URL=$EDGE_INTERNAL_URL
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_PUBLISHABLE_DEFAULT_KEY=${SUPABASE_PUBLISHABLE_DEFAULT_KEY}
ENV NODE_ENV=production

RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY package*.json ./
COPY static ./static

RUN npm ci
COPY --from=builder --chown=nodejs:nodejs /app/build ./build

USER nodejs

ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

EXPOSE 3001

CMD ["dumb-init", "node", "build/index.js"]