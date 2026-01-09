# Étape 1 : build
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Étape 2 : runtime
FROM node:22
WORKDIR /app
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "start"]
