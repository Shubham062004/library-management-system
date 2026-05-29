# Base stage
FROM node:20-bookworm-slim AS base

RUN apk add --no-cache openssl

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate

# Development target stage (ts-node-dev hot reload)
FROM base AS development
RUN chmod +x entrypoint.sh
EXPOSE 5000
ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "run", "dev"]

# Production build compilation target stage
FROM base AS build
RUN npm run build

# Production target stage
FROM node:20-alpine AS production

RUN apk add --no-cache openssl

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/
COPY entrypoint.sh ./

RUN npm ci --only=production && chmod +x entrypoint.sh

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "dist/app.js"]
