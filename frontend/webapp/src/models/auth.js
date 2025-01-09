import { serverURL } from "../utils";

//Module with auth functions.
const auth = {
    token: null,
    username: null,
    role: null,
    userId: null,
    balance: 0,

    login: async function login (username, password) {
        const user = {
            email: username,
            password: password,
        };

        const response = await fetch(`${serverURL}/api/login`, {
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        });

        const result = await response.json();
        //status code 200?
        if (result !== false) {
            auth.token = result.jwtToken;
            auth.username = username;
            auth.role = result.role;
            auth.userId = result._id;
            auth.balance = result.balance;

            console.log(result);
            return "ok";
        }

        return "not ok";
    },

    register: async function register (firstName, lastName, email, password) {
        const user = {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        };

        const response = await fetch(`${serverURL}/api/user`, {
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        });

        const result = await response.json();

        if (result.success === true) {
            console.log(result)
            return "ok";
        }

        return "not ok";
    },
    resetSession: function resetSession () {
        auth.token = null;
        auth.username = null;
        auth.userId = null;
        auth.role = null;
        auth.balance = 0;
    },
};

export default auth;