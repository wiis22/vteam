import { serverURL } from "../utils";

//Module with auth functions.
const auth = {
    token: "",
    username: "",
    name: "",
    role: "",
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
        if (result.data.type === "success") {
            auth.token = result.data.token;
            auth.username = username
            console.log(auth.token);
            return "ok";
        }

        return "not ok";
    },

    register: async function register (firstName, lastName, email, password, password2) {
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

        if (result.data.message === "User registered successfully") {
            return "ok";
        }

        return "not ok";
    },
    resetSession: function resetSession () {
        auth.token = "";
        auth.username = "";
        auth.name = "";
        auth.role = "";
        auth.balance = 0;
    },
};

export default auth;