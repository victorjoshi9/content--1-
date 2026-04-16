# Complete Ollama + Web UI in one container
# All models bundled - no local storage needed

FROM ollama/ollama:latest AS ollama-base

# Install Node.js for Web UI
FROM node:20-alpine

# Install Ollama
RUN apk add --no-cache curl bash

# Copy Ollama from official image
COPY --from=ollama-base /bin/ollama /bin/ollama

WORKDIR /app

# Copy Web UI files
COPY web-ui/ ./web-ui/

# Install Web UI dependencies
RUN cd web-ui && npm install && npm run build

# Expose ports
EXPOSE 11434 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:11434/api/tags || exit 1

# Start script
COPY docker-ollama/start.sh /start.sh
RUN chmod +x /start.sh

ENTRYPOINT ["/start.sh"]
