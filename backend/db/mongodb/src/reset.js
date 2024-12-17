/**
 * Connect to the database and reset it
 */
"use strict";

require('dotenv').config();
const mongo = require("mongodb").MongoClient;
// const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/texteditor";
// let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.twauw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0;`
let dsn = `mongodb+srv://main_user:user_main@cluster0.twauw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0;`;
console.log("dsn: " + dsn)

const fs = require("fs");
const path = require("path");


// reset collection citys
resetCollection(dsn, "cities")
    .then(() => repopCollection(dsn, "cities", "cities.JSON"))
    .catch(err => console.log(err));

// // reset collection bikes
// resetCollection(dsn, "bikes")
//     .catch(err => console.log(err));

// // reset collection users
// resetCollection(dsn, "users")
//     .catch(err => console.log(err));

// // reset collection users
// resetCollection(dsn, "rides")
//     .catch(err => console.log(err));






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

/**
 * Repopulate a collection with data from a JSON file.
 *
 * @async
 * @param {string} dsn       DSN to connect to the database.
 * @param {string} colName   Name of the collection to populate.
 * @param {string} fileName  Path to the JSON file with new data.
 * @return {Promise<void>} Void
 */
async function repopCollection(dsn, colName, fileName) {
    const client = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);

    try {
        console.log(`Reading data from file: ${fileName}`);
        const filePath = path.join(__dirname, fileName);
        const fileContent = fs.readFileSync(filePath, "utf8");
        const data = JSON.parse(fileContent);

        if (data[colName] && Array.isArray(data[colName])) {
            console.log(`Inserting data into collection: ${colName}`);
            await col.insertMany(data[colName]);
        } else {
            console.error(`File ${fileName} does not contain a valid array for collection: ${colName}`);
        }
    } catch (error) {
        console.error(`Error populating collection ${colName}:`, error);
    } finally {
        await client.close();
    }
}