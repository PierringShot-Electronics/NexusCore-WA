FROM node:20-alpine AS base
WORKDIR /usr/src/app

COPY package.json ./
RUN npm install --legacy-peer-deps && npm cache clean --force

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY --from=base /usr/src/app/package.json ./
COPY --from=base /usr/src/app/next.config.mjs ./
COPY --from=base /usr/src/app/public ./public
COPY --from=base /usr/src/app/.next ./.next
COPY --from=base /usr/src/app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "run", "start"]
