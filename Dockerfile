FROM node:16.15-alpine
COPY . /usr/src/myapp/
WORKDIR /usr/src/myapp/
RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]
