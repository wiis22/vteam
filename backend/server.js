require('dotenv').config({ debug: true });
const database = require("./db/mongodb/src/database.js");;
const auth = require('./auth/auth.js');
const ride = require('./ride/ride.js');
const { Server } = require('socket.io');
const http = require("http");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT_API || 1337;
app.use(express.json());
const httpserver = http.createServer(app);

const webAppURL = 'http://localhost:3000';
const mobileAppURL = 'http://localhost:3001';

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

let updateBikeQueue = [];
// Update bikes to the database in bulks every x seconds
setInterval(async () => {
    if (updateBikeQueue.length > 0) {
        bikeDataArray = updateBikeQueue;
        updateBikeQueue = [];
        let operations = [];
        for (const bikeData of bikeDataArray) {
            const { id, ...updateFields } = bikeData
            // console.log("bikeData", bikeData)
            const objectId = new ObjectId(String(id));
            const operation = {
                updateOne: {
                    filter: { _id: objectId },
                    update: { $set: updateFields }
                }
            }
            // console.log(operation);
            operations.push(operation);
        }

        try {
            const startDate = new Date();
            const result = await database.bulkWrite("bikes", operations);
            const endDate = new Date();
            console.log("Time to update bikes: ", (endDate - startDate) / 1000, "seconds");
            console.log("Number of operations: ", operations.length);
            console.log("result", result);
        } catch (error) {
            console.error('Error updating bikes:', error);
        }
    }
    if (updateBikeQueue.length > 0 && updateBikeQueue.length < 10) {
        console.log(updateBikeQueue);
    }
}, 10000); // 10 seconds

io.sockets.on('connection', (socket) => {
    console.log('Client connected to sockets');

    // used by mobile app and bike to join a room
    socket.on('joinRoom', (data) => {
        socket.join(data.roomName);
        console.log(`Socket ${socket.id} joined room: ${data.roomName}`);
    }),

        // used by mobile app when user starts a ride
        socket.on("startRide", (data) => {
            console.log("Socket route: startRide", data)
            io.to(data.bikeId).emit("startRide", { userId: data.userId });
        });

    // used by bike to confirm if ride was started or not
    socket.on("bikeStartRideResponse", (data) => {
        // console.log("Socket route: bikeStartRideResponse", data)
        io.to(data.userId).emit("bikeStartRideResponse", { bikeId: data.bikeId, started: data.started, }); // started is boolean
    });

    // used by mobile app when user ends the ride
    socket.on("userEndRide", (data) => {
        io.to(data.bikeId).emit("endRide");
    });

    // used by bike when bike ends the ride (beacuse of low battery etc.)
    socket.on("bikeEndRide", (data) => {
        io.to(data.userId).emit("endRide");
    });

    // used by bike when ride is ended and should be saved to database
    socket.on("saveRide", async (data) => {
        try {
            // console.log("data in socket route saveRide:")
            // console.log(data)
            const price = ride.getPrice(data.log.startLocation, data.log.endLocation, data.log.startTime, data.log.endTime);
            const rideLengthSeconds = ride.getLengthSeconds(data.log.startTime, data.log.endTime);

            const rideData = {
                userId: data.userId,
                bikeId: data.bikeId,
                startTime: data.log.startTime,
                endTime: data.log.endTime,
                startPosition: data.log.startPosition,
                endPosition: data.log.endPosition,
                startLocation: data.log.startLocation,
                endLocation: data.log.endLocation,
                rideLengthSeconds,
                price
            };

            const result = await database.addOne("rides", rideData);
            io.to(data.userId).emit("rideDone", { ride: rideData });
            console.log("Ride saved to the database");
        } catch (error) {
            console.error('Error saving ride:', error);
            socket.to(data.userId).emit("rideSaveErorr", { error: error.message });
        }
    });

    // used by mobile app to update it's position to the bike
    socket.on('updatePosition', (data) => {
        // console.log(`User updating position to Bike ${data.bikeId}. position: ${data.position}`);
        socket.to(data.bikeId).emit('updatePosition', { position: data.position });
    });

    // used by bike to save updated values to database
    socket.on('updateBike', async (data) => {
        updateBikeQueue.push(data);
        // try {
        //     const result = await database.updateOne("bikes", data);
        //     // console.log("result: ", result);
        // } catch (error) {
        //     console.error('Error updating bike:', error);
        // }
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

app.get('/test1', async (req, res) => {
    const data = {
        city_name: "test_City",
        bikes: [12345, 54321],
        zones: [],
    };

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
    };

    res.json(data);
});

app.post('/api/user', async (req, res) => {
    const userData = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: "user",
        balance: 0
    };

    try {
        const userId = await auth.register(userData);
        // console.log("result: ", userId);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            userId: userId
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
    };

    // console.log("loginData: ", loginData);

    try {
        const userInfo = await auth.login(loginData);
        res.status(200).json(userInfo);
    } catch (error) {
        console.error('Failed to login:', error);
        res.status(401).json({ message: 'Invalid email or password', error: error.message });
    }
});

app.delete('/api/user/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await database.deleteOne("users", id);
        // console.log("result: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.get('/api/cities', auth.verifyJwt, async (req, res) => {
    try {
        const result = await database.getAll("cities");
        // console.log("result: ", result);
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
        // console.log("result: ", result);
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
    };

    try {
        const result = await database.addOne("cities", cityData);
        // console.log("result: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error adding city:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.get('/api/users', auth.verifyJwt, async (req, res) => {
    try {
        const result = await database.getAll("users");
        // console.log("result: ", result);
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
        // console.log("result: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching city:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.put('/api/user/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;

    const updatedUserData = {
        ...{ id: id },
        ...req.body
    };

    try {
        const result = await database.updateOne("users", updatedUserData);
        // console.log("result: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.put('/api/user/password/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;
    const newPassword = req.body.newPassword;

    try {
        const result = await auth.updatePassword(id, newPassword);
        // console.log("result: ", result);
        res.status(201).json({
            success: true,
            message: "Password updated successfully"
        });
        console.log("Password updated successfully and route returned success");
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error', error: error.message
        });
    }
});

app.post('/api/bike', auth.verifyJwt, async (req, res) => {
    // console.log(req.body)
    const bikeData = {
        city: req.body.city,
        position: req.body.position,
        location: req.body.location,
        charging: req.body.location === "chargingStation",
        available: true,
        operational: true,
        batteryPercentage: 100
    };

    try {
        const result = await database.addOne("bikes", bikeData);
        // console.log("result: ", result);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding new bike to database:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.put('/api/bike/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;

    const updatedBikeData = {
        ...{ id: id },
        ...req.body
    };

    try {
        const result = await database.updateOne("bikes", updatedBikeData);
        // console.log("result: ", result);
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
    };

    try {
        const result = await database.filterAll("bikes", cityFilter);
        // console.log("result: ", result);
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
        // console.log("result: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error retrieving one bike:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.get('/api/bikes', auth.verifyJwt, async (req, res) => {
    try {
        const result = await database.getAll("bikes");
        // console.log("result: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error retrieving all bikes:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.delete('/api/bike/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await database.deleteOne("bikes", id);
        // console.log("result: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting bike:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.get('/api/rides', auth.verifyJwt, async (req, res) => {
    try {
        const result = await database.getAll("rides");
        // console.log("result: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error retrieving all rides', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.get('/api/user/rides/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;

    const ridesFilter = { userId: id };

    try {
        const result = await database.filterAll("rides", ridesFilter);
        // console.log("result: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error filtering rides on user id:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.get('/api/bike/rides/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;

    const ridesFilter = { bikeId: id };

    try {
        const result = await database.filterAll("rides", ridesFilter);
        // console.log("result: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error filtering rides on user id:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.delete('/api/ride/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await database.deleteOne("rides", id);
        // console.log("result: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting ride:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.post('/api/bulk-insert/:collection', auth.verifyJwt, async (req, res) => {
    const { collection } = req.params;
    const data = req.body;

    const chunkSize = 350;
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize));
    };

    let insertedIds = [];
    
    try {
        for (const chunk of chunks) {
            const operations = chunk.map(doc => ({
                insertOne: { document: { ...doc, _id: new ObjectId() } }
            }));

            const result = await database.bulkWrite(collection, operations);
            // console.log("result: ", result);
            const chunkInsertedIds = operations.map(op => op.insertOne.document._id);
            insertedIds = insertedIds.concat(chunkInsertedIds);
        }

        res.status(200).json({message: 'Bulk inserts successful', insertedIds: insertedIds});
    } catch (error) {
        console.error('Error performing bulk inserts:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.post('/api/bulk-delete/:collection', auth.verifyJwt, async (req, res) => {
    const { collection } = req.params;
    const data = req.body;

    const chunkSize = 350;
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize));
    };

    // console.log("chunks.length: ", chunks.length);
    // console.log("chunks[0][0]: ", chunks[0][0]);

    let deleteResults = [];

    try {
        for (const chunk of chunks) {
            const operations = chunk.map(id => ({
                deleteOne: { filter: { _id: new ObjectId(String(id)) } }
            }));

            // console.log("operations: ", operations);

            const result = await database.bulkWrite(collection, operations);
            // console.log("result: ", result);
            deleteResults = deleteResults.concat(result);
        }

        res.status(200).json({message: 'Bulk deletes successful', result: deleteResults});
    } catch (error) {
        console.error('Error performing bulk deletes:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

const server = httpserver.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

module.exports = server;
