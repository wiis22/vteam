const fs = require('fs');
const path = require('path');
// const booleanPointInPolygon = require('@turf/boolean-point-in-polygon');
const turf = require('@turf/turf');

// Get the arguments from the command line
const args = process.argv.slice(2);
const city = args[0];
const numBikes = parseInt(args[1]);

if (!city || isNaN(numBikes)) {
    console.error('Please provide valid arguments: city and amountOfBikes');
    process.exit(1);
}

console.log(`Adding ${numBikes} bikes in ${city}`);

// Get the geolocations for the city border
const citiesFilePath = path.join(__dirname, '../db/mongodb/src/cities.JSON');
const citiesData = JSON.parse(fs.readFileSync(citiesFilePath, 'utf8')).cities;

const cityData = citiesData.find(c => c.name.toLowerCase() === city.toLowerCase());
console.log(cityData);

const addBikes = async (cityData, numBikes) => {
    const ratioChargingStations = 0.2
    const ratioParkingZones = 0.3
    let remainingChargingStations = parseInt(numBikes * ratioChargingStations)
    let remainingParkingZones = parseInt(numBikes * ratioParkingZones)
    const cityPolygon = cityData.borders;
    const turfPolygon = turf.polygon([cityPolygon]);
    const bikes = [];

    // Generate bike data and add to database
    for (let i = 0; i < numBikes; i++) {
        let position;
        let charging = false;

        if (remainingChargingStations > 0) {
            const chargingStations = cityData.chargingStations;
            const randomIndex = Math.floor(Math.random() * chargingStations.length);
            position = chargingStations[randomIndex];
            charging = true;
            remainingChargingStations--;
        } else if (remainingParkingZones > 0) {
            const parkingZones = cityData.parkingZones;
            const randomIndex = Math.floor(Math.random() * parkingZones.length);
            position = parkingZones[randomIndex];
            remainingParkingZones--;
        } else {
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
        }

        // Add bike to database
        const bike = await fetch('http://localhost:1337/api/bike', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 1337`
            },
            body: JSON.stringify({
                city: cityData.name,
                charging: charging,
                position: position
            })
        })
        .then(response => response.json())
        .then(data => console.log('Bike added:', data))
        .catch(error => console.error('Error:', error));

        // Add bike to array
        bikes.push(bike);
    }
}

addBikes(cityData, numBikes);
