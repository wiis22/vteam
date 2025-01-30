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

        console.log(`Found ${users.length} users `);

        // console.log(users)

        const userIds = users.map(user => user._id);

        const result = await fetch(`http://localhost:1337/api/bulk-delete/users/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 1337`
            },
            body: JSON.stringify(userIds)
        });

        if (result.status === 200) {
            console.log(`Deleted all ${users.length} users `);
        } else {
            console.error(`Failed to delete users`);
        }

    } catch (error) {
        console.error('Error:', error);
    }

    console.log(`Deleting ${deletePromises.length} users`);
    // resolve all promises in the array
    await Promise.all(deletePromises);
    console.log("All users deleted");
}
