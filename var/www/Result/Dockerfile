# Stage 1: Builder - Install dependencies and build the app
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Runner - Create the final, optimized image
FROM node:20-alpine AS runner
WORKDIR /app

# Set the environment to production
ENV NODE_ENV=production

# Copy built assets from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port the app runs on
EXPOSE 3000

# Command to start the app
CMD ["npm", "start"]
