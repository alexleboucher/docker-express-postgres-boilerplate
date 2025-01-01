## Temporary image only used to build server
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

## Optimized image used as server
FROM node:22-alpine AS server
WORKDIR /app
COPY --from=builder ./app/build ./build
COPY package.json yarn.lock ./
RUN yarn install --production
EXPOSE 8080
CMD ["yarn", "start"]