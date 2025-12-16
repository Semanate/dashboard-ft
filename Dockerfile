# Simple Dockerfile optimized for Dockploy - handles .env creation issues
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Create necessary directories early (before any potential .env creation)
RUN mkdir -p build static .svelte-kit && \
    chmod -R 755 build static .svelte-kit

# Build the application
RUN npm run build

# Verify build was successful
RUN ls -la build/ || (echo "Build failed - no build directory" && exit 1)

# Remove dev dependencies to reduce image size
RUN npm ci --only=production && npm cache clean --force

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S sveltekit -u 1001

# Change ownership of app directory (including build folder)
RUN chown -R sveltekit:nodejs /app && \
    chmod -R 755 /app

USER sveltekit

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:$PORT', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start application with proper init system
CMD ["dumb-init", "node", "build"]