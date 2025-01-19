//bikes.js
require('dotenv').config();
<<<<<<< HEAD
=======
// const database = require('../db/mongodb/src/database.js');
>>>>>>> dcd3543 (Fixed some errors)
const bikeBrain = require('./bikeBrain.js');

const API_URL = 'http://localhost:1337';

// initializing the bikes from the database
async function initBikes() {
    try {
<<<<<<< HEAD
        const bikesResponse = await fetch(`${API_URL}/api/bikes`, {
=======
        // const bikes = await database.getAll("bikes");
        const response = await fetch(`${API_URL}/api/bikes`, {
>>>>>>> dcd3543 (Fixed some errors)
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 1337`
            }
        })
<<<<<<< HEAD

        const bikes = await bikesResponse.json();

        console.log(`${bikes.length} bikes found`);

        const citiesResponse = await fetch(`${API_URL}/api/cities`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 1337`
            }
        })

        const cities = await citiesResponse.json();

        // Add full city data to each bike for the city it's connected to
        for (const bike of bikes) {
            const cityData = cities.find(city => city.name === bike.city);
            bike.cityData = cityData;
        }
=======
    
        const bikes = await response.json();
        console.log(`${bikes.length} bikes found`);
>>>>>>> dcd3543 (Fixed some errors)

        const bikeBrains = bikes.map(bike => new bikeBrain(bike));

        console.log(`Initialized ${bikeBrains.length} bike instances`);

        setInterval(() => {
<<<<<<< HEAD
            console.log("Bikes management is running");
        }, 60000);
=======
                console.log("Bikes management is running");
            }, 60000);
>>>>>>> dcd3543 (Fixed some errors)
    } catch (error) {
        console.error("Error initializing bikes", error);
        process.exit(1);
    }
}

initBikes();
