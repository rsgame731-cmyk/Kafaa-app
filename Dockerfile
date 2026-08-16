# Production Multi-Stage Dockerfile for Kafa'a Node.js Server
FROM node:22-alpine AS builder

WORKDIR /app

# Install OpenSSL and libc compatibility for Prisma
RUN apk add --no-cache openssl libc6-compat

# Copy dependency manifests
COPY package.json package-lock.json ./
COPY server/prisma ./server/prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client & Build Server
RUN npx prisma generate --schema=server/prisma/schema.prisma
RUN npm run build

# Production Runner Stage
FROM node:22-alpine AS runner

WORKDIR /app

# Install OpenSSL and libc compatibility for Prisma runtime
RUN apk add --no-cache openssl libc6-compat

ENV NODE_ENV=production
ENV PORT=4000

# Copy node_modules & build artifacts from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server ./server
COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["npx", "tsx", "server/src/index.ts"]
