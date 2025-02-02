//bikes.js
require('dotenv').config();
const bikeBrain = require('./bikeBrain.js');

const API_URL = 'http://server:1337';

// initializing the bikes from the database
async function initBikes() {
    try {
        const bikesResponse = await fetch(`${API_URL}/api/v2/bikes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 1337`
            }
        });

        const bikes = await bikesResponse.json();

        console.log(`${bikes.length} bikes found`);

        const citiesResponse = await fetch(`${API_URL}/api/v2/cities`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 1337`
            }
        });

        const cities = await citiesResponse.json();

        // Add full city data to each bike for the city it's connected to
        for (const bike of bikes) {
            const cityData = cities.find(city => city.name === bike.city);
            bike.cityData = cityData;
        }

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
