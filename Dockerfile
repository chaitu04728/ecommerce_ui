# 1️⃣ Build stage
FROM node:alpine3.18 as build

# Build-time environment variables
ARG VITE_APP_NODE_ENV
ARG VITE_API_URL

# Set environment variables
ENV VITE_APP_NODE_ENV=$VITE_APP_NODE_ENV
ENV VITE_API_URL=$VITE_API_URL

# Build app
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# 2️⃣ Serve with Nginx
FROM nginx:1.23-alpine

# Remove default content
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443
ENTRYPOINT ["nginx", "-g", "daemon off;"]