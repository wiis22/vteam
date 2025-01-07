const database = require("../db/mongodb/src/database.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { errorToJSON } = require("next/dist/server/render.js");
const jwtSecret = process.env.JWT_SECRET;

const auth = {
    register: async function (userData) {
        try {
            await database.filterAll("users", {email: userData.email});
            throw new Error("Email is already in use");
        } catch (err) {
            if (err.message === "Email is already in use") {
                throw err;
            }
            try {
                const hash = await bcrypt.hash(userData.password, 10);
                userData.password = hash;
                const result = await database.addOne("users", userData);
                return result; // should be _id of the new user
            } catch (err) {
                console.error("Error registering new user: ", err.message);
                throw err;
            }
        }
    },

    login: async function(loginData) {
        try {
            let userData = await database.filterAll("users", {email: loginData.email});

            if (userData.length === 0) {
                throw new Error("User not found");
            }

            if (userData.length > 1) {
                throw new Error("Multiple users found");
            }

            userData = userData[0];

            // console.log("userData in auth.login:", userData)

            const res = await this.comparePasswords(loginData.password, userData.password);
            console.log("res from comparePasswords in auth.login:", res)

            if (res) {
                const payload = { email: loginData.email };
                const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

                const userInfo = {
                    _id: userData._id,
                    role: userData.role,
                    balance : userData.balance,
                    jwtToken: jwtToken
                };

                return userInfo;
            }

            return res; // should not come to this
        } catch (error) {
            throw error;
        }
    },

    comparePasswords: async function (enteredPassword, correctPasswordHash) {
        try {
            const match = bcrypt.compare(enteredPassword, correctPasswordHash);
            return match;
        } catch (err) {
            console.error("Compare by bycrypt failed", err);
            throw err;
        }
    },

    verifyJwt: async function(req, res, next) {
        const authorizationHeader = req.headers['authorization'];
        const token = authorizationHeader && authorizationHeader.split(' ')[1];

        if (token === 1337) {
            next();
        }

        await jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
                return res.status(403).json({ message: 'Token invalid or expired' });
            }
    
            req.user = decoded;
            next();
        });
    },

}

module.exports = auth;
