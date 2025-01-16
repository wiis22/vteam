FROM node:18

WORKDIR /backend

COPY package*.json ./

RUN npm install

WORKDIR /backend/bike

CMD [ "node", "bikes.js" ]