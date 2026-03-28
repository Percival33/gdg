# Build stage
FROM node:22-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Configure Nginx to listen on port 4173
# Also configure for client-side routing by trying to serve index.html for missing files
RUN echo 'server { \
    listen 4173; \
    listen [::]:4173; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 4173
CMD ["nginx", "-g", "daemon off;"]
