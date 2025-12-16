FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

# Install deps but skip lifecycle scripts for better Docker caching.
# We'll run `prepare` after copying the source so SvelteKit can find `svelte.config.js`.
RUN npm ci --ignore-scripts

COPY . .

RUN npm run prepare
RUN npm run build


FROM node:20-alpine AS runner

WORKDIR /app
RUN apk add --no-cache dumb-init

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["dumb-init", "node", "build"]
