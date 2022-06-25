# Server nestjs
FROM node:16.15-alpine as nodejsServer
COPY . /myserver/www/
WORKDIR /myserver/www/
RUN npm install
EXPOSE 3000
CMD ["node", "index.js"]
