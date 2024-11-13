FROM node:20-alpine3.20 as build_frontend

WORKDIR /app

COPY ./package.json ./

RUN npm install

COPY . .

RUN npm run build


FROM nginx:latest

COPY --from=build_frontend /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80/tcp
