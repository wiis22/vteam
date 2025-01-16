// This script deletes all bikes from the database (not tested yet!)

const cities = ["Göteborg", "Karlskrona", "Härnösand"];

deleteAllBikes(cities);

async function deleteAllBikes(cities) {
    let deletePromises = []

    for (const city of cities) {
        try {
            const response = await fetch(`http://localhost:1337/api/bikes/${city}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer 1337`
                }
            });

            const bikes = await response.json();

            // console.log(bikes)

            for (let i = 0; i < bikes.length; i++) {
                const deletePromise = fetch(`http://localhost:1337/api/bike/${bikes[i]._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer 1337`
                    }
                });

                deletePromises.push(deletePromise)
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // resolve all promises in the array
    await Promise.all(deletePromises);
    console.log("All bikes deleted")
}
