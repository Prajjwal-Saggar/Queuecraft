# Stage 1 

FROM node:24-slim AS builder
WORKDIR /app
COPY package*.json /app/
RUN npm ci --omit=dev

# Stage 2 

FROM gcr.io/distroless/nodejs24-debian12
WORKDIR /app
COPY --from=builder /app/node_modules /app/node_modules
COPY . .
EXPOSE 3000
CMD ["server.js"]

