ARG NODE_VERSION=20.17.0
ARG PNPM_VERSION=10.2.1

FROM node:${NODE_VERSION}-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the project
RUN npm run build

# Expose the port your app runs on (NestJS default is 3000)
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]