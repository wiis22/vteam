// This script simulates users in the system
const turf = require('@turf/turf');
const path = require('path');
const fs = require('fs');
const User = require('./User.js');
require('dotenv').config();

// Get the arguments from the command line
const args = process.argv.slice(2);
const numUsers = parseInt(args[0]);
const lengthInMinutes = parseInt(args[1]);
const API_URL = 'http://localhost:1337';

let globalUsers = [];

const setupGracefulShutdown = () => {
    const shutdown = async () => {
        console.log("\nShutting down simulation...");
        try {
            for (const user of globalUsers) {
                if (user.bikeId !== null) {
                    console.log(`ending ride for user: ${user.userId}`);
                    await user.endRide();
                }
            }
            console.log("All rides ended successfully");
            process.exit(0);
        } catch (error) {
            console.error("Error ending rides", error);
            process.exit(1);
        }
    };

    // Handle shutdown signals Ctrl+C and SIGTERM(avslutade signaler)
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    // Handle uncaught exceptions
    process.on('uncaughtException', async (error) => {
        console.error("Uncaught exception", error);
        await shutdown();
    });

    process.on('unhandledRejection', async (reason, promise) => {
        console.error("Unhandled rejection at:", promise, "reason: " ,reason);
        await shutdown();
    });
};

// Make sure arguments are passed correctly
if (isNaN(numUsers) | isNaN(lengthInMinutes)) {
    console.error('Please provide valid arguments:numUsers & lengthInMinutes');
    process.exit(1);
}

// The full simulation
async function simulation(numUsers, lengthInMinutes) {
    // Create dummy users
    const users = await addUsers(numUsers);
    // Split users into sets for each city
    const halfUsersLength = Math.floor(users.length / 2);
    const quarterUsersLength = Math.floor(users.length / 4);
    const goteborgUsers = users.slice(0, halfUsersLength);
    const harnosandUsers = users.slice(halfUsersLength, halfUsersLength + quarterUsersLength);
    const karlskronaUsers = users.slice(halfUsersLength + quarterUsersLength);
    // Simulate each city
    simulateCity(goteborgUsers, "Göteborg");
    simulateCity(harnosandUsers, "Härnösand");
    simulateCity(karlskronaUsers, "Karlskrona");

    const lengthInMilliseconds = lengthInMinutes * 60 * 1000;
    // End all rides and delete all users after set minutes
    setTimeout(async () => {
        try {
            for (const user of users) {
                if (user.bikeId !== null) {
                    console.log(`Ending ride for user: ${user.userId}`);
                    user.endRide();
                }
            }
            console.log("All rides ended successfully");
        } catch (error) {
            console.error("Error ending all rides", error);
        }

        await deleteUsers(users);
        process.exit(0);
    }, lengthInMilliseconds);

    console.log(`Simulation started with ${numUsers} users and will run for ${lengthInMinutes} minutes`);
}

// Simulation for one city
const simulateCity = async (users, city) => {
    // Get available bikes for the city
    let availableBikes = await getAvailableBikesCity(city);

    console.log("Available bikes in", city, availableBikes.length);

    // Get the geolocations for the city border
    const citiesFilePath = path.join(__dirname, '../db/mongodb/src/cities.JSON');
    const citiesData = JSON.parse(fs.readFileSync(citiesFilePath, 'utf8')).cities;
    const cityData = citiesData.find(c => c.name.toLowerCase() === city.toLowerCase());

    // Simulate a user completing rides on loop
    const simulateUser = async (user) => {
        while (true) {
            await new Promise(resolve => setTimeout(resolve, 100 * 1000 * Math.random())) // Random pause 0-100 sec before each ride
            // Pick a random bike
            const randomIndex = Math.floor(Math.random() * availableBikes.length);
            const bike = availableBikes[randomIndex];
            if (!bike) {
                console.log("bike is undefined, reuturning and user will simulate a new ride");
                return;;
            }
            // Remove picked bike from available bikes
            availableBikes.splice(randomIndex, 1);
            // Get end position of the ride
            const endPosition = getEndPosition(cityData);
            const route = getRoute(bike.position, endPosition);
            // Simulate the ride
            await simulateRide(user, bike._id, route);
        }
    };

    // Simulate all users
    for (const user of users) {
        simulateUser(user);
    }
};

// Simulate one ride
const simulateRide = async (user, bikeId, route) => {
    // Seconds between each position update (10 sec results in reasonable speed)
    const intervalSec = 20
    // console.log(`Starting ride. UserId: ${user.userId}. BikeId: ${bikeId}. The ride should take ${intervalSec * route.length} seconds.`)
    // Start the ride
    user.startRide(bikeId);
    // Sleep for 10 sec
    await new Promise(resolve => setTimeout(resolve, 5 * 1000))
    // Check if user has bike, i.e. if ride was started
    if (user.bike === null) {
        console.log("User does not have a bike which means ride never started, returning");
        return;
    }
    // Update positions from route on loop
    for (const position of route) {
        user.sendPosition(position);
        await new Promise(resolve => setTimeout(resolve, intervalSec * 1000)); // Pause intervalSec sec
    }
    // End ride
    // console.log(`Ending ride. UserId: ${user.userId}. BikeId: ${bikeId}`)
    user.endRide();
};

// Get the route array of positions between two positions
const getRoute = (startPosition, endPosition) => {
    // 20km/h = 56m/10sec
    // const interval = 56
    const interval = 1000;
    const turfStart = turf.point([startPosition.longitude, startPosition.latitude]);
    const turfEnd = turf.point([endPosition.longitude, endPosition.latitude]);
    const line = turf.lineString([turfStart.geometry.coordinates, turfEnd.geometry.coordinates]);
    const distance = turf.length(line, { units: 'meters' });
    const numPoints = Math.ceil(distance / interval);
    const route = [];

    for (let i = 0; i <= numPoints; i++) {
        const point = turf.along(line, (i * interval) / 1000, { units: 'kilometers' });
        const [longitude, latitude] = point.geometry.coordinates;
        const position = {
            latitude,
            longitude
        };
        route.push(position);
    }

    return route;
};

// Get all available bikes for a city
const getAvailableBikesCity = async (city) => {
    const response = await fetch(`${API_URL}/api/v2/bikes/${city}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 1337`
        }
    });

    const bikes = await response.json();

    const availableBikes = bikes.filter(bike => bike.available);
    return availableBikes;
};

// Add users
const addUsers = async (numUsers) => {
    // Create data for users
    const batchSize = 500;
    let usersRegisterData = [];

    for (let i = 0; i < numUsers; i++) {
        const registerData = {
            email: `user${i}@gmail.com`,
            password: `password${i}`,
            firstName: `John${i}`,
            lastName: `Doe${i}`,
            role: "user",
            balance: 0
        };

        usersRegisterData.push(registerData);
    };

    let userIds = [];

    for (let i = 0; i < usersRegisterData.length; i += batchSize) {
        const batch = usersRegisterData.slice(i, i + batchSize);


        console.log(`Trying to add batch of ${batch.length} users`);

        // Post users to save to the database
        const registerResponse = await fetch(`${API_URL}/api/v2/bulk-insert/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 1337`
            },
            body: JSON.stringify(batch)
        });

        const result = await registerResponse.json();

        if (result.insertedIds.length !== batch.length) {
            console.error('Failed to add users');
            return;
        }

        console.log(`Added batch of ${batch.length} users`);

        const newUserIds = result.insertedIds;
        userIds = userIds.concat(newUserIds);
    }

    // Create instances of User class and set userId
    let users = [];

    for (let i = 0; i < userIds.length; i++) {
        const user = new User(i);
        user.setUserId(userIds[i])
        users.push(user);
    }

    console.log(`Added all ${users.length} users`);

    return users;
};

// Delete users
const deleteUsers = async (users) => {
    const userIds = users.map(user => user.userId);

    const deleteResponse = await fetch(`${API_URL}/api/v2/bulk-delete/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 1337`
        },
        body: JSON.stringify(userIds)
    });

    if (deleteResponse.status === 200) {
        console.log(`Deleted ${numUsers} users`);
    } else {
        console.error('Failed to delete users');
    }
}

// Get end position of the ride
const getEndPosition = (cityData) => {
    const randomNum = Math.random();
    // 50% chance to get a random position in the city (field)
    if (randomNum < 0.5) {
        return randomPositionInPolygon(cityData.borders);
    }
    // 25% chance to get a random parking zone position
    if (randomNum < 0.75) {
        const randomIndex = Math.floor(Math.random() * cityData.parkingZones.length);
        return cityData.parkingZones[randomIndex];
    }
    // 25% chance to get a random charging station position
    const randomIndex = Math.floor(Math.random() * cityData.chargingStations.length);
    return cityData.chargingStations[randomIndex];
}

// Get "random" position in polygon
const randomPositionInPolygon = (cityPolygon) => {
    const turfPolygon = turf.polygon([cityPolygon]);
    let position;
    do {
        const point1 = cityPolygon[Math.floor(Math.random() * cityPolygon.length)];
        const point2 = cityPolygon[Math.floor(Math.random() * cityPolygon.length)];
        const point3 = cityPolygon[Math.floor(Math.random() * cityPolygon.length)];
        const point4 = cityPolygon[Math.floor(Math.random() * cityPolygon.length)];

        const longitude = point1[0] + Math.random() * (point2[0] - point1[0]);
        const latitude = point3[1] + Math.random() * (point4[1] - point3[1]);

        position = [longitude, latitude];
    } while (!turf.booleanPointInPolygon(position, turfPolygon));

    position = {
        longitude: position[0],
        latitude: position[1]
    };

    return position;
};

setupGracefulShutdown();

// Run the simulation
simulation(numUsers, lengthInMinutes);
