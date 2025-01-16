// This script simulates users in the system
const turf = require('@turf/turf');
const User = require('./User.js');
const { timeout } = require('../server.js');

// Get the arguments from the command line
const args = process.argv.slice(2);
const city = args[0];
const numUsers = parseInt(args[1]);
const lengthInMinutes = args[2] | 5
const API_URL = 'http://localhost:1337';

// Make sure arguments are passed correctly
if (!city || isNaN(numUsers)) {
    console.error('Please provide valid arguments: city, numUsers & lengthInMinutes');
    process.exit(1);
}

console.log(`Adding ${numUsers} users in ${city}`);

// Run the simulation
simulation(numUsers, lengthInMinutes);

// The full simulation
async function simulation(numUsers, lengthInMinutes) {
    // Create dummy users
    const users = await addUsers(numUsers);
    // Split users into sets for each city
    const halfUsersLength = Math.floor(users.length / 2);
    const quarterUsersLength = Math.floor(users.length / 4);
    const goteborgUsers = users.slice(0, halfUsersLength);
    const harnosandUsers = users.slice(halfUsersLength, halfUsersLength + quarterUsersLength)
    const karlskronaUsers = users.slice(halfUsersLength + quarterUsersLength);
    // Simulate each city
    simulateCity(goteborgUsers, "Göteborg");
    simulateCity(harnosandUsers, "Härnösand");
    simulateCity(karlskronaUsers, "Karlskrona");
    // Delete users after set minutes
    setTimeout(() => {
        deleteUsers(users);
    }, lengthInMinutes * 60 * 1000)
}

// Simulation for one city
const simulateCity = async (users, city) => {
    // Get available bikes for the city
    let availableBikes = await getAvailableBikesCity(city);

    // Get the geolocations for the city border
    const citiesFilePath = path.join(__dirname, '../db/mongodb/src/cities.JSON');
    const citiesData = JSON.parse(fs.readFileSync(citiesFilePath, 'utf8')).cities;
    const cityData = citiesData.find(c => c.name.toLowerCase() === city.toLowerCase());
    const cityPolygon = cityData.borders;
    const turfPolygon = turf.polygon([cityPolygon]);
    
    // Sumulate all users
    for (const user of users) {
        simulateUser(user);
    }

    // Simulate a user completing rides on loop
    const simulateUser = async (user) => {
        while (true) {
            setTimeout(() => {}, 60 * 1000 * Math.random()) // Random pause 0-60 sec before each ride
            // Pick a random bike
            const randomIndex = Math.floor(Math.random() * availableBikes.length);
            const bike = availableBikes[randomIndex];
            // Remove picked bike from available bikes
            availableBikes.splice(randomIndex, 1);
            // Get a random end position of the ride
            const endPosition = randomPositionInPolygon(turfPolygon);
            const route = getRoute(bike.position, endPosition);
            // Simulate the ride
            await simulateRide(user, bike._id, route)
        }
    }
}

// Simulate one ride
const simulateRide = async (user, bikeId, route) => {
    // Start the ride
    user.startRide()
    // Sleep for 10 sec
    await new Promise(resolve => setTimeout(resolve, 10 * 1000))
    // Check if user has bike, i.e. if ride was started
    if (user.bike === null) {
        return;
    }
    // Update positions from route on loop
    for (const position of route) {
        user.sendPosition(position);
        await new Promise(resolve => setTimeout(resolve, 10 * 1000)) // Pause 10 sec
    }
    // End ride
    user.endRide();
}

// Get the route array of positions between two positions
const getRoute = (startPosition, endPosition) => {
    // 20km/h = 200m/min = 33.33m/10sec
    const interval = 33
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
        }
        route.push(position);
    }

    return route;
}

// Get all available bikes for a city
const getAvailableBikesCity = async (city0) => {
    const response = await fetch(`${API_URL}/api/bikes/${city}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 1337`
        }
    })

    const bikes = await response.json();
    const availableBikes = bikes.filter(bike => bike.available)
    return availableBikes
}

// Add users
const addUsers = async (numUsers) => {
    let users = [];

    // Create users and associate registration promises with them
    const registerPromises = Array.from({ length: numUsers }, (_, i) => {
        const user = new User(i);
        users.push(user);
        return user.getRegisterPromise()
            .then(userId => {
                user.setUserId(userId);
            })
            .catch(error => {
                console.error(`Error registering user ${i}:`, error);
            });
    });

    await Promise.all(registerPromises)
    console.log("All users registered successfully")

    return users;
}

// Delete users
const deleteUsers = async (users) => {
    let deletePromises = [];

    for (const user of users) {
        deletePromises.push(user.delete());
    }

    await Promise.all(deletePromises);
    console.log("All users deleted successfully")
}

// Get "random" position in polygon
const randomPositionInPolygon = (turfPolygon) => {
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

    return position
}
