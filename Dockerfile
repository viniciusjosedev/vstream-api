# Build stage
FROM node:22-alpine3.20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Development stage
FROM node:20-alpine3.16 AS development

WORKDIR /app

COPY --from=build /app /app

CMD ["npm", "run", "start:dev"]
