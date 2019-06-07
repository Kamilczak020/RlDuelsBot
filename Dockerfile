# Stage 1 - build
FROM node:latest AS builder

WORKDIR /app
COPY . .
RUN npm install && npm run build

# Stage 2 - Run
FROM node:latest
ENV NODE_ENV=production
WORKDIR /app

COPY ./package* ./
RUN npm install && npm cache clean --force
COPY --from=builder /app/build ./build

CMD npm start