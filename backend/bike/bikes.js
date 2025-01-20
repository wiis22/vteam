//bikes.js
require('dotenv').config();
<<<<<<< HEAD
<<<<<<< HEAD
=======
// const database = require('../db/mongodb/src/database.js');
>>>>>>> dcd3543 (Fixed some errors)
=======
>>>>>>> e4a2020 (Simulation now works)
const bikeBrain = require('./bikeBrain.js');

const API_URL = 'http://localhost:1337';

// initializing the bikes from the database
async function initBikes() {
    try {
<<<<<<< HEAD
<<<<<<< HEAD
        const bikesResponse = await fetch(`${API_URL}/api/bikes`, {
=======
        // const bikes = await database.getAll("bikes");
        const response = await fetch(`${API_URL}/api/bikes`, {
>>>>>>> dcd3543 (Fixed some errors)
=======
        const bikesResponse = await fetch(`${API_URL}/api/bikes`, {
>>>>>>> e4a2020 (Simulation now works)
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 1337`
            }
        })
<<<<<<< HEAD
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
=======

        const bikes = await bikesResponse.json();

>>>>>>> e4a2020 (Simulation now works)
        console.log(`${bikes.length} bikes found`);
>>>>>>> dcd3543 (Fixed some errors)

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

        const bikeBrains = bikes.map(bike => new bikeBrain(bike));

        console.log(`Initialized ${bikeBrains.length} bike instances`);

        setInterval(() => {
<<<<<<< HEAD
<<<<<<< HEAD
            console.log("Bikes management is running");
        }, 60000);
=======
                console.log("Bikes management is running");
            }, 60000);
>>>>>>> dcd3543 (Fixed some errors)
=======
            console.log("Bikes management is running");
        }, 60000);
>>>>>>> e4a2020 (Simulation now works)
    } catch (error) {
        console.error("Error initializing bikes", error);
        process.exit(1);
    }
}

initBikes();
