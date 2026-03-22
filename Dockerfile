# Multi-stage build for AI Career Copilot
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy all source files
COPY . .

# Install server dependencies
RUN cd server && npm ci

# Install client dependencies and build
RUN cd client && npm ci && npm run build

# Production stage
FROM node:20-alpine AS production

# Install production dependencies
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production

# Copy built client from builder stage
COPY --from=builder /app/client/dist ./server/public

# Copy server source
COPY server/ ./server/

# Create uploads directory
RUN mkdir -p uploads

# Install dependencies for pdf-parse native modules
RUN apk add --no-cache python3 make g++

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node server/src/healthcheck.js || exit 1

# Start the application
CMD ["node", "server/src/index.js"]
