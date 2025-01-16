//bikes.js
require('dotenv').config();
const database = require('../db/mongodb/src/database.js');
const bikeBrain = require('./bikeBrain.js');

// initializing the bikes from the database
async function initBikes() {
    try {
        const bikes = await database.getAll("bikes");
        console.log(`${bikes.length} bikes found in database`);

        const bikeBrains = bikes.map(bike => new bikeBrain(bike));

        console.log(`Initialized ${bikeBrains.length} bike instances`);

        setInterval(() => {
                console.log("Bikes mangagent is running");
            }, 60000);
    } catch (error) {
        console.error("Error initializing bikes", error);
        process.exit(1);
    }
}

initBikes();