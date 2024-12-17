const database = require("./db/mongodb/src/database.js");
require('dotenv').config();


const jwt = require('jsonwebtoken');
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 1337;

app.get('/test1', async (req,res) => {
    const data = {
        city_name: "test_City",
        bikes: [12345, 54321],
        zones: [],
    }

    const result = await database.updateOneDoc("documents", data);

    if (!result) {
        return res.status(404).json({ error: 'No returned id when trying to add new document' });
}

app.get('/api/get-all', async (req,res) => {
    try {
        const result = await database.getAll("cities");
        console.log("res: ", result);
        res.json(result);
    } catch(error) {
        console.error('Error fetching documents:', error);
        return res.status(500).send('Internal server Error');
    }
});

app.get('/api/verify_token', async (req, res) => {
    
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
