FROM node:18

WORKDIR /backend

COPY package*.json ./

RUN npm install

# EXPOSE 1337

WORKDIR /backend

CMD [ "node", "server.js" ]
