FROM node:20.11.0-alpine3.19 as builder

RUN npm i -g pnpm

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install 

COPY . .

RUN pnpm build

FROM node:20.11.0-alpine3.19 


# copy over build files from builder step
COPY --from=builder /app/.output  app/.output
COPY --from=builder /app/.nuxt  app/.nuxt

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0

RUN mkdir -p assets/docs
RUN mkdir -p public/logo

EXPOSE 3000

CMD [ "node", ".output/server/index.mjs" ]

