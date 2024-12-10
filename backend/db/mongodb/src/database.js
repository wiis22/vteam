/**
 * Functions to manipulate the texteditor database.
 */
"use strict";

require('dotenv').config();
const mongo = require("mongodb").MongoClient;
const { MongoClient, ObjectId } = require("mongodb"); 
let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.twauw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0;`
// console.log("dsn: " + dsn)
// const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/texteditor";

const fs = require("fs");
const path = require("path");
const { error, log } = require("console");
const common = require('mocha/lib/interfaces/common');


const database = {
    /**
     * Insert one into the collection
     *
     * @async
     *
     * @param {string} colName Name of collection.
     * @param {string} data    Data to be inserted into Db.
     *
     * @throws Error when database operation fails.
     *
     * @return {string} Return the id.
     */
    addOneCity: async function addOneCity(colName, data) {
        const client  = await mongo.connect(dsn);
        const db = await client.db();
        const col = await db.collection(colName);
        console.log("data inne i addOneCity db:", data);
        const result = await col.insertOne(data);

        await client.close();

        return result.insertedId; //tock away the .tostring().
        // As it allready gets converted to sting in the index.ejs.
    },

};

module.exports = dbFunctions;
