
FROM node:16-alpine as base

FROM base AS deps
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
COPY ./package.json ./
RUN npm install -g npm@9.7.1
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm install

# FROM base AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY ./ .

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}
# RUN npm run generate

FROM base AS runner
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

#COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
#COPY ./node_modules/.prisma ./node_modules/.prisma
COPY . .
RUN npm run generate
#RUN npm run gqlgen

EXPOSE 3002
CMD ["npm", "start"]

