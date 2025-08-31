# 1️⃣ Build stage
FROM node:18-alpine as build

# Build-time arguments
ARG VITE_APP_NODE_ENV
ARG VITE_API_URL

# Set environment variables
ENV VITE_APP_NODE_ENV=$VITE_APP_NODE_ENV
ENV VITE_API_URL=$VITE_API_URL

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build React/Vite app
RUN npm run build

# 2️⃣ Final stage (just keeps dist/, no Nginx)
FROM alpine:3.18

WORKDIR /dist

# Copy built files only
COPY --from=build /app/dist ./

# Default command (useful if you exec inside)
CMD ["ls", "-la"]