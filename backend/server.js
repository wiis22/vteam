require('dotenv').config({debug: true});
const database = require("./db/mongodb/src/database.js");;
const auth = require('./auth/auth.js');
const { Server } = require('socket.io');
const http = require("http");
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT_API || 1337;
app.use(express.json());
const httpserver = http.createServer(app);

const webAppURL = process.env.WEB_APP_URL || 'http://localhost:3000';
const mobileAppURL = process.env.MOBILE_APP_URL || 'http://localhost:3001';

app.use(cors({
    origin: [webAppURL, mobileAppURL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

const io = new Server(httpserver, {
    cors: {
        origin: mobileAppURL,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.sockets.on('connection', (socket) => {
    console.log('Client connected to sockets');

    // used by mobile app and bike to join a room
    socket.on('joinRoom', (roomName) => { // Använda userId och bikeId som roomName?
        socket.join(roomName);
        console.log(`Socket ${socket.id} joined room: ${roomName}`);
    }),

    // used by mobile app when user starts a ride
    socket.on("startRide", (bikeId, userId) => {
        io.to(bikeId).emit("startRide", userId);
    });

    // used by mobile app when user ends the ride
    socket.on("userEndRide", (bikeId) => {
        io.to(bikeId).emit("endRide");
    });

    // used by bike when bike ends the ride (beacuse of low battery etc.)
    socket.on("bikeEndRide", (userId) => {
        io.to(userId).emit("endRide");
    });

    // used by bike when ride is saved
    socket.on("rideDone", (userId) => {
        io.to(userId).emit("rideDone");
    });

    socket.on("leaveRoom", (roomName) => {
        socket.leave(roomName);
        console.log(`Socket ${socket.id} left room: ${roomName}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected from sockets');
    });
});

// Så här kan en fetch se ut med token. Fungerar på samma sätt med POST, PUT och DELETE routes
// fetch("http://localhost:1337/api/cities", {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
// })

app.get('/test1', async (req,res) => {
    const data = {
        city_name: "test_City",
        bikes: [12345, 54321],
        zones: [],
    }

    const result = await database.updateOneDoc("documents", data);

    if (!result) {
        return res.status(404).json({ error: 'No returned id when trying to add new document' });
    }
});

app.get('/test2', async (req, res) => {
    data = {
        one: 1,
        two: 2,
        three: 3
    }

    res.json(data)
})

app.post('/api/user', async (req, res) => {
    const userData = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: "user",
        balance: 0
    }

    try {
        const result = await auth.register(userData);
        console.log("res: ", result);
        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error', error: error.message
        });
    }
});

app.post('/api/login', async (req, res) => {
    const loginData = {
        email: req.body.email,
        password: req.body.password
    }

    // console.log("loginData: ", loginData);

    try {
        const token = await auth.login(loginData);
        res.status(200).json(token);
    } catch (error) {
        console.error('Failed to login:', error);
        res.status(401).json({ message: 'Invalid email or password', error: error.message });
    }
});

app.get('/api/cities', auth.verifyJwt, async (req, res) => {
    try {
        const result = await database.getAll("cities");
        console.log("res: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.get('/api/city/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await database.getOne("cities", id);
        console.log("res: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching city:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.post('/api/city', auth.verifyJwt, async (req, res) => {
    const cityData = {
        name: req.body.name,
        area: req.body.area,
        parkingStations: req.body.parkingStations,
        chargingStations: req.body.chargingStations
    }

    try {
        const result = await database.addOne("cities", cityData);
        console.log("res: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error adding city:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.get('/api/users', auth.verifyJwt, async (req, res) => {
    try {
        const result = await database.getAll("users");
        console.log("res: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.get('/api/user/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await database.getOne("users", id);
        console.log("res: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching city:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


app.put('/api/user/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;

    const updatedUserData = {
        ...{id: id},
        ... req.body
    }

    try {
        const result = await database.updateOne("users", updatedUserData);
        console.log("res: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.post('/api/bike', auth.verifyJwt, async (req, res) => {
    console.log(req.body)
    const bikeData = {
        city: req.body.city,
        charging: req.body.charging,
        position: req.body.position,
        location: "field",
        available: true,
        operational: true,
        batteryPercentage: 100
    }

    try {
        const result = await database.addOne("bikes", bikeData);
        console.log("res: ", result);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding new bike to database:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.put('/api/bike/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;

    const updatedBikeData = {
        ...{id: id},
        ... req.body
    }

    try {
        const result = await database.updateOne("bikes", updatedBikeData);
        console.log("res: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error updating bike data:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.get('/api/bikes/:city', auth.verifyJwt, async (req, res) => {
    const { city } = req.params;

    const cityFilter = {
        city: city
    }

    try {
        const result = await database.filterAll("bikes", cityFilter);
        console.log("res: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error retrieving bikes:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.get('/api/bike/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await database.getOne("bikes", id);
        console.log("res: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error retrieving one bike:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.delete('/api/bike/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await database.deleteOne("bikes", id);
        console.log("res: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting bike:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.delete('/api/bikes', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await database.deleteOne("bikes", id);
        console.log("res: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting bike:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

const server = httpserver.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

// export of server is for testing
module.exports = server;
