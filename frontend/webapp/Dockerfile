FROM node:18

WORKDIR /frontend/webapp

COPY package*.json ./


#kanske kommer behöva exposa porten 3000

RUN npm install

CMD [ "npm", "start" ]
