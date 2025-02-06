const { ObjectId } = require("mongodb");
const ride = require("../ride/ride.js");
const database = require("../db/mongodb/src/database.js");

function setupSocket(io) {
    let updateBikeQueue = [];
    // let connectCounter = 0;
    let counters = {
        connect: 0,
        rooms: 0
    };
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
        counters.connect++;
        console.log('Client connected to socket id: ', socket.id, '. The number of clients connected: ', counters.connect);


        // used by mobile app and bike to join a room
        socket.on('joinRoom', (data) => {
            socket.join(data.roomName);
            counters.rooms++;
            console.log(`Socket nr: ${counters.rooms} id: ${socket.id} joined room: ${data.roomName}.`);
            // console.log(`Socket ${socket.id} joined room: ${data.roomName}`);
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
            counters.rooms--;
            console.log(`Number of rooms: ${counters.rooms}`);
            // console.log(`Socket ${socket.id} left room: ${roomName}`);
        });

        socket.on('disconnect', () => {
            counters.connect--;
            console.log('Client disconnected from sockets', ' number of connected clients: ', counters.connect);
        });
    });

}

module.exports = setupSocket;
