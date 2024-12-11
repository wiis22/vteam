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
    addOne: async function addOne(colName, data) {
        const client  = await mongo.connect(dsn);
        const db = await client.db();
        const col = await db.collection(colName);
        console.log("data i addOne:", data, ", collection name: ", colName);
        const result = await col.insertOne(data);

        await client.close();

        return result.insertedId; //tock away the .tostring().
        // As it allready gets converted to sting in the index.ejs.
    },


    /**
     * Get evrything from the collection
     *
     * @async
     *
     * @param {string} colName Name of collection.
     * @param {string} data    Data to be inserted into Db.
     *
     * @throws Error when database operation fails.
     *
     * @return {Object|null} The resould in JSON format, or null if no doc found.
     */
    getAll: async function getAll(colName) {
        try {
            // console.log('DSN:', dsn);
            const client  = await mongo.connect(dsn);
            const db = await client.db();

            // check if the collection exist
            const collections = await db.listCollections().toArray();
            const collectionNames = collections.map(col => col.name);

            if (!collectionNames.includes(colName)) {
                throw new Error("Collection does not exist");
            }

            const col = await db.collection(colName);
            const result = await col.find().toArray();

            await client.close();

            // console.log(result);

            return result;
        } catch (err) {
            console.log(err);
            if (err.message == "Collection does not exist") {
                throw err;
            } // Could throw general error below here
        }
    },

    /**
     * Remove one into the collection
     *
     * @async
     *
     * @param {string} colName  Name of collection.
     * @param {string} id       Id to be Removed into Db.
     *
     * @throws Error when database operation fails.
     *
     * @return {object} Return info about the operation.
     */
    deleteOne: async function deleteOne(colName, id) {
        const client  = await mongo.connect(dsn);
        const db = await client.db();
        const col = await db.collection(colName);

        const data = {
            _id: new ObjectId(String(id))
        };
        const result = await col.deleteOne(data);

        await client.close();

        return result;
    },


    /**
     * Update's fields by collection and id from data.
     *
     * @async
     *
     * @param {string} colName Name of collection.
     * @param {object} data    Data containing: _id in hexadecimal format and other fields to update sould be in json format.
     *
     * @throws Error when database operation fails.
     *
     * @return {Object|null} The resould in JSON format
     */
    updateOne: async function updateOne(colName, data) {
        try {
            // if (!ObjectId.isValid(String(data.id))) {
            //     throw new Error("ID format is not valid");
            // }

            // console.log("data", data)
            // console.log("id", data._id)
            // ObjectId: Needs to be super sure
            // that id is in a correct format else it wont work.
            const objectId = new ObjectId(String(data._id)); // this should only be done if it's a string. in api/doc-add-user it's already an ObjectId as it becomes a string when its converted to json
            // console.log("id", data._id)
            // console.log("objectId", objectId)
            // console.log("here 1")

            const {_id, ...updateFields } = data;

            if (Object.keys(updateFields).length === 0) {
                throw new Error("No fields provided to update")
            }
            //console.log("updateFields", updateFields);

            const client  = await mongo.connect(dsn);
            const db = await client.db();
            const col = await db.collection(colName);
            // console.log("here 2")

            const result = await col.updateOne(
                { _id: objectId },
                { $set: updateFields }
            );
            // console.log("here 3")
            await client.close();
            // console.log('result:', result);
            // console.log("here 4")
            return result;


        } catch (err) {
            console.error("Error in updateOneDoc:", err.message);
            throw new Error("Error updating a document");
        }
    },
};

module.exports = database;
