# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /usr/src/app

# Copy only package.json files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source files
COPY . .

# Build the NestJS project
RUN npm run build

# Final production image
FROM node:${NODE_VERSION}-alpine as final

WORKDIR /usr/src/app
ENV NODE_ENV=production

# Use non-root user
USER node

# Copy built files and dependencies from previous build stages
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/package*.json ./

EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]
