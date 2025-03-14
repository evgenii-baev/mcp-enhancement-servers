FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Copy source files
COPY . .

# Install dependencies
RUN npm install && npm run build && npm prune --omit=dev && chmod +x dist/index.js

# Run as non-root user
USER node

# Start the server
CMD ["node", "dist/index.js"]

# Label the image
# LABEL org.opencontainers.image.source="https://github.com/waldzellai/clear-thought"
# LABEL org.opencontainers.image.description="MCP server for sequential thinking, mental models, and debugging approaches"
# LABEL org.opencontainers.image.licenses="MIT"
