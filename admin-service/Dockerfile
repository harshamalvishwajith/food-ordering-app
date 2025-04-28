ARG NODE_VERSION=20.17.0
ARG PNPM_VERSION=10.2.1

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install

COPY . .
RUN npm run build

CMD ["node", "dist/main"]