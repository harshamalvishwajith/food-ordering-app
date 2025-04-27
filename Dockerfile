FROM node:20-alpine

WORKDIR /app

COPY package.json npm-lock.yaml ./
RUN npm install -g npm && npm install

COPY . .

RUN npm build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main"]
