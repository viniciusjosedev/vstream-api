# Build stage
FROM node:22-alpine3.20 AS build

WORKDIR /app

COPY . .

# Development stage
FROM node:20-alpine3.16 AS development

WORKDIR /app

COPY --from=build /app /app

RUN npm install

CMD ["npm", "run", "start:dev"]

# Development stage
FROM node:20-alpine3.16 AS production

WORKDIR /app

COPY --from=build /app /app

RUN npm ci

RUN npm run build

CMD ["npm", "run", "start:prod"]
