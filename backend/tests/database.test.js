const databaseFunctions = require('../db/mongodb/src/database.js');

describe('Database Functions tests', () => {
    const testData = {
        name: "test",
        value: 42
    };

    const colName = "testCollection";

    let id;

    describe('addOne', () => {
        it('should insert a document and return its id', async () => {
            testData.name = "test1";
            res = await databaseFunctions.addOne(colName, testData);
            id = res;
            expect(res).toBeTruthy();
            expect(typeof res).toBe("object");
        });
    });

    describe('deleteOne', () => {
        it('should delete a document by id', async () => {
            const res = await databaseFunctions.deleteOne(colName, String(id));
            expect(res).toEqual({"acknowledged": true, "deletedCount": 1});
            expect(res).toBeInstanceOf(Object);
        });

        it('should return null if document does not exist', async () => {
            const res = await databaseFunctions.deleteOne(colName, String(id));
            expect(res).toEqual({"acknowledged": true, "deletedCount": 0});
        });
    });

    describe('getOne', () => {
        it('should retrieve a document by id', async () => {
            id = await databaseFunctions.addOne(colName, testData);
            const res = await databaseFunctions.getOne(colName, String(id));
            expect(res).toMatchObject(testData);
            expect(res).toBeInstanceOf(Object);
        });

        it('should throw an error if id is invalid', async () => {
            try {
                await databaseFunctions.getOne(colName, "invalidId");
            } catch (err) {
                expect(err.message).toBe("Error: id has invalid format");
            }
        });
    });

    describe('getAll', () => {
        it('should retrieve all documents from a collection', async () => {
            const res = await databaseFunctions.getAll(colName);
            console.log("GetAll: ", res);
            
            expect(res).toBeInstanceOf(Array);
            expect(res).toHaveLength(1);
        });

        it('should return an empty array if collection is empty', async () => {
            await databaseFunctions.deleteOne(colName, String(id));
            const res = await databaseFunctions.getAll(colName);
            expect(res).toEqual([]);
        });

        it('should throw an error if collection does not exist', async () => {
            try {
                await databaseFunctions.getAll("nonExistentCollection");
            } catch (err) {
                expect(err.message).toBe("Collection does not exist");
            }
        });
    });


    describe('updateOne', () => {

        it('should throw "Error updating" if no data is sent in', async () => {
            const data = {
                id: id
            };

            // console.log("Data: ", data);

            try {
                await databaseFunctions.updateOne(colName, data);
            } catch (err) {
                expect(err.message).toBe("Error updating");
            }
        });

        it('should update a document by id', async () => {
        
            const updateData = {
                id: String(id),
                name: "testUpdate",
                value: 43
            };
            const res = await databaseFunctions.updateOne(colName, updateData);
            console.log("UpdateOne: ", res);
            // expect(res).toEqual({"acknowledged": true, "modifiedCount": 1, "upsertedId": null});
            expect(res).toBeInstanceOf(Object);
        });

        it('should throw "Error updating" if document does not exist', async () => {
            const updateData = {
                name: "test2",
                value: 43
            };
            await databaseFunctions.deleteOne(colName, String(id));
            try {
                await databaseFunctions.updateOne(colName, updateData);
            } catch (err) {
                expect(err.message).toBe("Error updating");
            }
        });

    });

    describe('filterAll', () => {
        it('should throw an error "Error retrieving data" if no filter is used.', async () => {
            try {
                await databaseFunctions.filterAll(colName);
            } catch (err) {
                expect(err.message).toBe("Error retrieving data");
            }
        });
    });
});
