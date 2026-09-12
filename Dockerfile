# Stage 1: Build the Angular application
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

RUN printf '%s\n' \
  'server {' \
  '    listen 80;' \
  '    server_name localhost;' \
  '    root /usr/share/nginx/html;' \
  '    index index.html;' \
  '    location / {' \
  '        try_files $uri $uri/ /index.html;' \
  '    }' \
  '}' > /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/uday-builders-web /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]