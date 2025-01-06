// This script deletes all bikes from the database (not tested yet!)

const cities = ["Göteborg", "Karlskrona", "Härnösand"];

deleteAllBikes(cities);

async function deleteAllBikes(cities) {
    for (const city of cities) {
        try {
            const response = await fetch(`http://localhost:1337/api/bikes/${city}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const bikes = await response.json();

            for (let i = 0; i < bikes.length; i++) {
                await fetch(`http://localhost:1337/api/bike/${bikes[i]._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer 1337`
                    }
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}
