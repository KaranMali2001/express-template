
FROM node:24-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

ENV NODE_ENV=production

# Build with esbuild
RUN pnpm build

# --------- Stage 2: Slim Runtime ----------
FROM node:24-alpine

WORKDIR /app

RUN npm install -g pnpm
COPY .env.production .env
RUN npx prisma generate
# Copy only needed output
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/server.js"]
