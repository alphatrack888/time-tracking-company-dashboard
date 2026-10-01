FROM node:22-slim AS build
WORKDIR /app
ARG VITE_BASE_URL
ARG VITE_GMAP_API_KEY
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_GMAP_API_KEY=$VITE_GMAP_API_KEY
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=10s \
  CMD wget -q --spider http://127.0.0.1:80/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
