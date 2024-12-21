FROM node:18

WORKDIR /backend

COPY package*.json ./

RUN npm install

# fungerar ej då Dockerfile inte har tillgång till filer ovanför mapppen man sätter som context
# COPY ../.env ./

# EXPOSE 1337

WORKDIR /backend

CMD [ "node", "server.js" ]
