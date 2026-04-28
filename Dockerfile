# Stage 1: Build
#
# Vite 8 + tooling here requires Node 20.19+ or 22.12+.
# Also, Alpine (musl) can cause optional native deps (e.g. rolldown) to fail.
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copy nginx template and entrypoint
COPY nginx.template.conf /etc/nginx/conf.d/default.conf.template
COPY entrypoint.sh /

# Make entrypoint executable
RUN chmod +x /entrypoint.sh

# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost:80 || exit 1

# Start via entrypoint
ENTRYPOINT ["/entrypoint.sh"]