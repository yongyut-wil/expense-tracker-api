# Multi-stage Dockerfile for NestJS Expense Tracker API

# Stage 1: Production dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
# Increase yarn network timeout
RUN yarn config set network-timeout 300000 -g
# Install only production dependencies and clean cache immediately
RUN yarn install --production --frozen-lockfile && yarn cache clean
# Copy prisma directory and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Stage 2: Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn config set network-timeout 300000 -g
# Install all dependencies for building
RUN yarn install --frozen-lockfile
COPY . .
# Generate client for build
RUN npx prisma generate
RUN yarn build

# Stage 3: Production stage
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Copy only the necessary files
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

# Copy Prisma schema for migrations
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

# Expose application port
EXPOSE 3005

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3005/api', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/src/main"]
