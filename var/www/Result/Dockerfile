
# Stage 1: Builder
# This stage builds the Next.js application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
# Using npm ci for cleaner, more reliable builds
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the Next.js application for production
RUN npm run build

# Stage 2: Runner
# This stage creates the final, lean image for production
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Create a non-root user for security purposes
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# The public folder is not present in this project, so we don't copy it.

# Change ownership of the app directory
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# The command to start the Next.js server
CMD ["npm", "start"]
