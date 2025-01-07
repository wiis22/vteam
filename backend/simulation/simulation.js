// TO DO
// Alla user bör skapas och simulera resa/resor för samtidigt
// Resorna måste få random slutposition
// Cykeln som sparar positionen. Ska cykeln ha stöd för simuleringen?
// så man kan skicka en slutposition till cykeln, och hastighet etc.



// This script simulates users in the system
const turf = require('@turf/turf');
const User = require('./User.js');

// Get the arguments from the command line
const args = process.argv.slice(2);
const city = args[0];
const numUsers = parseInt(args[1]);

if (!city || isNaN(numUsers)) {
    console.error('Please provide valid arguments: city and numUsers');
    process.exit(1);
}

console.log(`Adding ${numUsers} users in ${city}`);

async function simulation(numUsers) {
    const users = await addUsers(numUsers);

    // Get the geolocations for the city border
    const citiesFilePath = path.join(__dirname, '../db/mongodb/src/cities.JSON');
    const citiesData = JSON.parse(fs.readFileSync(citiesFilePath, 'utf8')).cities;

    const cityData = citiesData.find(c => c.name.toLowerCase() === city.toLowerCase());
    console.log(cityData);

    const cityPolygon = cityData.borders;
    const turfPolygon = turf.polygon([cityPolygon]);

    // Values

}

const addUsers = async (numUsers) => {
    const users = [];

    // Create users
    for (let i = 0; i < numUsers; i++) {
        const user = new User(i, io);
        
        // Register user
        await user.register();

        users.push(user);
    }

    return users;
}

simulation(numUsers);
