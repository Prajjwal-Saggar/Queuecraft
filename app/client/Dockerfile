# Stage 1

FROM node:24-slim AS builder
WORKDIR /app
COPY package*.json /app/
RUN npm ci
COPY . .
RUN npm run build

# Stage 2

FROM nginx:stable-alpine-slim
WORKDIR /app
COPY --from=builder /app/dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
