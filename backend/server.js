import database from "./db/mongodb/src/database.js";

const express = require('express');
const app = express();
const port = process.env.PORT || 1337;

app.get('/', async (req,res) => {
    const data = {
        city_name: "test_City",
        bikes: [12345, 54321],
        zones: [],
    }

    const result = await dbFunctions.updateOneDoc("documents", data);

    if (!result) {
        return res.status(404).json({ error: 'No returned id when trying to add new document' });
    }

    res.json(result); // result is info saying it went well or not

    res.send('Hello, this is from docker!')
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});