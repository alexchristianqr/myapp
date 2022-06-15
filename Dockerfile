FROM node:10 AS server-build
WORKDIR /root/
COPY --from=ui-build /usr/src/app/myapp ./myapp
COPY ./package*.json ./myapp/
RUN cd api && npm install
COPY ./index.js ./myapp/

EXPOSE 3000

CMD ["node", "./myapp/index.js"]