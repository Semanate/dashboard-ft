# Etapa 1: Construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm ci

# Copiar el resto del código
COPY . .

# Pasar las variables de entorno necesarias para el build
ARG SUPABASE_URL
ARG SUPABASE_PUBLISHABLE_DEFAULT_KEY
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_PUBLISHABLE_DEFAULT_KEY=${SUPABASE_PUBLISHABLE_DEFAULT_KEY}
ENV NODE_ENV=production

# Construir la aplicación
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine

WORKDIR /app

# Instalar dumb-init
RUN apk add --no-cache dumb-init

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar la build desde la etapa de builder
COPY --from=builder --chown=nodejs:nodejs /app/build ./build

# Cambiar al usuario no-root
USER nodejs

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

EXPOSE 3001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/ || exit 1
# Comando de inicio
CMD ["dumb-init", "node", "build/index.js"]