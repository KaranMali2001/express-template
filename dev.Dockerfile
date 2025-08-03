# Use Node.js LTS
FROM node:24-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies required by Prisma
RUN apk add --no-cache openssl bash

# Install PNPM
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml tsconfig.json ./
RUN pnpm install

# Install Prisma CLI globally (optional, for running migrations inside container)
RUN pnpm add -g prisma

# Copy the application code
COPY . .

# Expose app port
EXPOSE 3000

# Run development command (esbuild + nodemon)
CMD ["pnpm", "dev"]
