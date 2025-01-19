//bikes.js
require('dotenv').config();
// const database = require('../db/mongodb/src/database.js');
const bikeBrain = require('./bikeBrain.js');

const API_URL = 'http://localhost:1337';

// initializing the bikes from the database
async function initBikes() {
    try {
        // const bikes = await database.getAll("bikes");
        const response = await fetch(`${API_URL}/api/bikes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 1337`
            }
        })
    
        const bikes = await response.json();
        console.log(`${bikes.length} bikes found`);

        const bikeBrains = bikes.map(bike => new bikeBrain(bike));

        console.log(`Initialized ${bikeBrains.length} bike instances`);

        setInterval(() => {
                console.log("Bikes management is running");
            }, 60000);
    } catch (error) {
        console.error("Error initializing bikes", error);
        process.exit(1);
    }
}

initBikes();
