# FROM node:20.16.0-alpine as builder


# WORKDIR /app

# COPY package.json .
# COPY pnpm-lock.yaml .
# RUN yarn global add pnpm
# RUN pnpm install 

# COPY . .

# RUN pnpm build

# FROM node:20.16.0-alpine 


# # copy over build files from builder step
# # RUN rm -rf /app/.nuxt /app/.output /app/dist
# COPY --from=builder /app/.output  app/.output
# COPY --from=builder /app/.nuxt  app/.nuxt

# WORKDIR /app

# ENV NODE_ENV=production
# ENV HOST=0.0.0.0

# RUN mkdir -p assets/docs
# RUN mkdir -p assets/logo
# RUN mkdir -p public/logo

# EXPOSE 3000

# CMD [ "node", ".output/server/index.mjs" ]

FROM node:20.16.0-alpine

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN yarn global add pnpm
RUN pnpm install

COPY . .
RUN pnpm build

ENV NODE_ENV=production
ENV HOST=0.0.0.0

RUN mkdir -p assets/docs
RUN mkdir -p assets/logo
RUN mkdir -p public/logo

EXPOSE 3000

CMD [ "node", ".output/server/index.mjs" ]