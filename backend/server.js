const database = require("./db/mongodb/src/database.js");
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 1337;

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

app.get('/', async (req,res) => {

    res.send('Hello, this is from docker!')
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
