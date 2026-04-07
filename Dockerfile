# Build React app using Node
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files (layer cache optimization)
COPY package*.json ./

# Install all dependencies (including dev for build)
RUN npm ci

# Copy source code
COPY . .

# Build app (outputs /dist)
RUN npm run build

# ══════════════════════════════════════════════
# STAGE 2 — SERVE
# Use Nginx to serve the compiled static files
# Node.js is completely gone at this point!

FROM nginx:alpine

# Copy built files to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]