// This script deletes all users from the database
deleteAllUsers();

async function deleteAllUsers() {
    let deletePromises = [];

    try {
        const response = await fetch(`http://localhost:1337/api/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 1337`
            }
        });

        const users = await response.json();

        // console.log(bikes)

        for (const user of users) {
            const deletePromise = fetch(`http://localhost:1337/api/user/${user._id}`, {
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

    console.log(`Deleting ${deletePromises.length} users`);
    // resolve all promises in the array
    await Promise.all(deletePromises);
    console.log("All users deleted");
}
