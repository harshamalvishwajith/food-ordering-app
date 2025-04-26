# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.17.0
ARG PNPM_VERSION=10.2.1

FROM node:${NODE_VERSION}-alpine

# Create app directory
WORKDIR /app

# Copy only the package.json and install deps
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copy all source files
COPY . .

# Build TypeScript project
RUN pnpm run build

# Expose port (same as .env)
EXPOSE 3000

# Run compiled app
CMD ["node", "dist/app.js"]
