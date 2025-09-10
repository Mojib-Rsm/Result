# Dockerfile

# Stage 1: Builder
# This stage installs dependencies, builds the source code, and runs tests.
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Runner
# This stage creates a lightweight, production-ready image.
FROM node:20-alpine AS runner

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy the built app from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy public folder if it exists
# The wildcard `*` makes this command succeed even if the public directory doesn't exist
COPY --from=builder /app/public* ./public

# Expose the port the app runs on
EXPOSE 3000

# The command to start the app
CMD ["npm", "start"]
