// This script deletes all rides from the database
deleteAllRides();

async function deleteAllRides() {
    let deletePromises = [];

    try {
        const response = await fetch(`http://localhost:1337/api/v2/rides`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 1337`
            }
        });

        const rides = await response.json();

        for (const ride of rides) {
            const deletePromise = fetch(`http://localhost:1337/api/v2/ride/${ride._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer 1337`
                }
            });

            deletePromises.push(deletePromise);
        }
    } catch (error) {
        console.error('Error:', error);
    }

    console.log(`Deleting ${deletePromises.length} rides`);
    // resolve all promises in the array
    await Promise.all(deletePromises);
    console.log("All rides deleted");
}
