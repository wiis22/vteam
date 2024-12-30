// This script deletes all bikes from the database
try {
    fetch('http://localhost:1337/api/bike', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 1337`
        }
    });
    console.log('All bikes deleted');
} catch (error) {
    console.error('Error:', error);
}
