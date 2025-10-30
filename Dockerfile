## Temporary image only used to build server
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

## Optimized image used as server
FROM node:22-alpine AS server
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/src/infra/database/migrations ./build/infra/database/migrations
COPY package.json yarn.lock ./
RUN yarn install --production
EXPOSE 8080
ENV DRIZZLE_OUT=build/infra/database/migrations
ENV DRIZZLE_SCHEMA=build/infra/database/schemas
CMD ["sh", "-c", "yarn drizzle-kit migrate --config=./build/infra/database/config/drizzle.config.js && yarn start"]