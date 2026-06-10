FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

FROM node:18-alpine

WORKDIR /usr/src/app

# Copy production dependencies and application files
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . .

# Ensure the uploads directory exists and is owned by the node user for local storage fallback
RUN mkdir -p uploads && chown -R node:node /usr/src/app

# Run the container under the non-root 'node' user
USER node

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Define basic container health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(res => res.status === 200 ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
