/**
 * Connect to the texteditor database and reset it
 */
"use strict";

require('dotenv').config();
const mongo = require("mongodb").MongoClient;
// const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/texteditor";
let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.ehwhv.mongodb.net/texteditor?retryWrites=true&w=majority&appName=Cluster0`;
// let dsn = `mongodb+srv://main_user:user_main@cluster0.ehwhv.mongodb.net/texteditor?retryWrites=true&w=majority&appName=Cluster0`;
console.log("dsn: " + dsn)

const fs = require("fs");
const path = require("path");


// reset collection citys
resetCollection(dsn, "cities")
    .catch(err => console.log(err));

// reset collection bikes
resetCollection(dsn, "bikes")
    .catch(err => console.log(err));

// reset collection users
resetCollection(dsn, "users")
    .catch(err => console.log(err));

// reset collection users
resetCollection(dsn, "rides")
    .catch(err => console.log(err));






/**
 * Reset a collection by removing existing content.
 *
 * @async
 *
 * @param {string} dsn     DSN to connect to database.
 * @param {string} colName Name of collection.
 *
 * @return {Promise<void>} Void
 */
async function resetCollection(dsn, colName) {
    const client  = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);

    await col.deleteMany();

    await client.close();
}
