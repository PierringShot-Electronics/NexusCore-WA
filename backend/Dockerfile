FROM node:20-alpine AS base
WORKDIR /usr/src/app

COPY backend/package*.json ./

RUN npm install --legacy-peer-deps && npm cache clean --force

COPY backend/tsconfig.json ./tsconfig.json
COPY backend/src ./src
COPY backend/scripts ./scripts
COPY docs ./docs

RUN npm run build

FROM node:20-alpine AS production
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=base /usr/src/app/package.json ./
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/docs ./docs

EXPOSE 3000
CMD ["node", "dist/src/index.js"]
