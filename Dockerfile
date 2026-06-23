FROM node:20-slim

# Enable pnpm
RUN corepack enable pnpm

WORKDIR /app

# Copy the entire monorepo
COPY . .

# Set environment variables to skip puppeteer download
ENV PUPPETEER_SKIP_DOWNLOAD="true"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

# Install all dependencies across the monorepo
RUN pnpm install --frozen-lockfile

# Build the api and its dependencies
RUN pnpm --filter api build

# Expose the API port
EXPOSE 5001

# Start the API
CMD ["pnpm", "--filter", "api", "start"]
