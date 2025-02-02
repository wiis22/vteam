// This script deletes all bikes from the database (not tested yet!)

const cities = ["Göteborg", "Karlskrona", "Härnösand"];

deleteAllBikes(cities);

async function deleteAllBikes(cities) {
    for (const city of cities) {
        try {
            const response = await fetch(`http://localhost:1337/api/v2/bikes/${city}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer 1337`
                }
            });

            const bikes = await response.json();
            console.log(`Found ${bikes.length} bikes in ${city}`);

            if (bikes.length === 0) {
                continue;
            }

            const bikeIds = bikes.map(bike => bike._id);

            // Split bikes into chunks of 500
            const chunks = [];
            for (let i = 0; i < bikeIds.length; i += 500) {
                chunks.push(bikeIds.slice(i, i + 500));
            }

            // Delete bikes in batches of 500
            for (const chunk of chunks) {
                const deleteResponse = await fetch(`http://localhost:1337/api/v2/bulk-delete/bikes/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer 1337`
                    },
                    body: JSON.stringify(chunk)
                });

                if (deleteResponse.status === 200) {
                    console.log(`Deleted ${chunk.length} bikes in ${city}`);
                } else {
                    console.error(`Failed to delete bikes in ${city}`);
                }
            }

            console.log(`Deleted all bikes in ${city}`);
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

// Function to split an array into chunks
function chunkArray(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}
