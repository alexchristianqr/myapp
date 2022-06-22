# Server Ubuntu
FROM ubuntu:latest as ubuntuServer
USER root
COPY . /myserver/www
WORKDIR /myserver/www
#RUN cd /myserver/www
#RUN apt-get update
#RUN apt-get -y install curl rsync python2.7 python-pip
#RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
#RUN apt-get -y install nodejs
#RUN npm install
#RUN npm run build

# Server Nginx
FROM nginx:stable-alpine as nginxServer
RUN rm -rf /usr/share/nginx/html/*
COPY --from=ubuntuServer /myserver/www/.docker/nginx/general /etc/nginx/general/
COPY --from=ubuntuServer /myserver/www/.docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=ubuntuServer /myserver/www/dist /usr/share/nginx/html/dist/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]