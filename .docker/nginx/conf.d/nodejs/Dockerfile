FROM node:14-alpine AS server-build
COPY . /usr/src/myapp/
WORKDIR /usr/src/myapp/
COPY ./package*.json ./myapp/
RUN cd  myapp && npm install
COPY ./index.js ./myapp/

EXPOSE 3000

CMD ["node", "./myapp/index.js"]