require('dotenv').config({ debug: true });
// const database = require("./db/mongodb/src/database.js");;
// const auth = require('./auth/auth.js');
const { Server } = require('socket.io');
const http = require("http");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const { MongoClient, ObjectId } = require("mongodb");
const setupSocket = require('./sockets/server-sockets.js');
const v1Routes = require('./api/v1-routes.js');
const v2Routes = require('./api/v2-routes.js');

const app = express();
const port = process.env.PORT_API || 1337;
const webAppURL = 'http://localhost:3000';
const mobileAppURL = 'http://localhost:3001';

app.use(express.json());
const httpserver = http.createServer(app);

// Allow CORS
app.use(cors({
    origin: [webAppURL, mobileAppURL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.options('*', cors());

// Increase the payload size limit
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));

const io = new Server(httpserver, {
    cors: {
        origin: mobileAppURL,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Setup sockets
setupSocket(io);

// Routes
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);


const server = httpserver.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

module.exports = server;
