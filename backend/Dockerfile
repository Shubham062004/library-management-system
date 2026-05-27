# Base stage
FROM node:20-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate

# Development target stage (ts-node-dev hot reload)
FROM base AS development
EXPOSE 5000
CMD ["npm", "run", "dev"]

# Production build compilation target stage
FROM base AS build
RUN npm run build

# Production target stage
FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["node", "dist/app.js"]
