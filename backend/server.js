require('dotenv').config();
const database = require("./db/mongodb/src/database.js");
// const jwt = require('jsonwebtoken');
const verifyJwt = require("./auth/auth.js")

const express = require('express');
const app = express();
const port = process.env.PORT || 1337;

// This is how you should send
// fetch("http://localhost:3000/protected", {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
// })

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
});

app.get('/api/cities', verifyJwt, async (req,res) => {
    try {
        const result = await database.getAll("cities");
        console.log("res: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.get('/api/city/:id', verifyJwt, async (req,res) => {
    const { id } = req.params;

    try {
        const result = await database.getOne("cities", id);
        console.log("res: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching city:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.post('/api/city', verifyJwt, async (req,res) => {
    const cityData = {
        name: req.params.name,
        area: req.params.area,
        parkingStations: req.params.parkingStations,
        chargingStations: req.params.chargingStations
    }

    try {
        const result = await database.addOne("cities", cityData);
        console.log("res: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error adding city:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.get('/api/users', verifyJwt, async (req,res) => {
    try {
        const result = await database.getAll("users");
        console.log("res: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.get('/api/user/:id', verifyJwt, async (req,res) => {
    const { id } = req.params;

    try {
        const result = await database.getOne("users", id);
        console.log("res: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching city:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.post('/api/user', verifyJwt, async (req,res) => {
    const userData = {
        email: req.params.email,
        password: req.params.password,
        role: req.params.role
    }

    try {
        const result = await database.addOne("users", userData);
        console.log("res: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.put('/api/user', verifyJwt, async (req,res) => {
    const { id } = req.params;

    const updatedUserData = {
        ...{id: id},
        ... req.body
    }

    try {
        const result = await database.updateOne("users", updatedUserData);
        console.log("res: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.get('/api/verify_token', async (req, res) => {
    // this route might not be used and therefore not needed
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
