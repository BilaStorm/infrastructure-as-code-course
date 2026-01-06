# Étape 1 : build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape 2 : serveur nginx
FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf

# Copie notre app buildée
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
