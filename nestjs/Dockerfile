# Server Ubuntu
FROM ubuntu:latest as ubuntuServer
USER root
COPY . /myserver/www
WORKDIR /myserver/www
RUN apt-get update
RUN apt-get -y install curl nginx
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get -y install nodejs
RUN npm install
RUN npm install -g pm2
RUN npm run build
RUN rm -rf /usr/share/nginx/html/*
COPY .docker/nginx/general /etc/nginx/general/
COPY .docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["pm2-runtime", "start", "/myserver/www/dist/main.js"]
