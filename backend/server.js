const database = require('./db/mongodb/src/database.js');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 1337;

app.get('/', async (req,res) => {
    const data = {
        city_name: "test_City",
        bikes: [12345, 54321],
        zones: [],
    }

    const result = await database.updateOneDoc("documents", data);

    if (!result) {
        return res.status(404).json({ error: 'No returned id when trying to add new document' });
    }

    res.json(result); // result is info saying it went well or not

    res.send('Hello, this is from docker!')
});

app.get('/api/verify_token', async (req, res) => {
    
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
