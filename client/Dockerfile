FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY .env.production ./.env.production

# Instalar dependencias
RUN npm ci

# Copiar código fuente y construir
COPY . .
RUN npm run build

# Etapa de producción con nginx
FROM nginx:alpine

# Copiar archivos construidos a nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]