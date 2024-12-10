FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY backend /app/backend

EXPOSE 1337

WORKDIR /app/backend

CMD [ "node", "server.js" ]