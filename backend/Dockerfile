FROM node:20-alpine AS base
WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --legacy-peer-deps && npm cache clean --force

COPY tsconfig.json ./tsconfig.json
COPY src ./src
COPY scripts ./scripts

RUN npm run build

FROM node:20-alpine AS production
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=base /usr/src/app/package.json ./
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
