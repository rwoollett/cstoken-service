
FROM node:22.11-alpine as base

FROM base AS deps
RUN apk update
# && apk add --no-cache bash vips-dev
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
COPY ./package.json ./
RUN npm install -g npm@10.9.0
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

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

#COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
#COPY ./node_modules/.prisma ./node_modules/.prisma
COPY . .
RUN npm run generate
#RUN npm run gqlgen

EXPOSE 3002
CMD ["npm", "start"]

