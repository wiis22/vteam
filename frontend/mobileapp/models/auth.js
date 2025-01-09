import { baseURL } from "../utils.js";

const auth = {
    token: "",

    login: async function login(username, password) {
        const user = {
            email: username,
            password: password
        };

        const response = await fetch(`${baseURL}/login`, {
            body: JSON.stringify(user),
            // headers: {
            //     'content-type': "application/json",
            // },
            "method": "POST",
        });

        const result = await response.json();

        if ("errors" in result) {
            return result.errors.detail;
        } else {
            auth.token = result.data.token;
            console.log(auth.token);
            return "ok";
        }
    },

    register: async function register(username, password, firstName, lastName) {
        const user = {
            email: username,
            password: password,
            firstName: firstName,
            lastName: lastName
        };

        const response = await fetch(`${baseURL}/auth/register`, {
            body: JSON.stringify(user),
            headers: {
                'content-type': "application/json",
            },
            "method": "POST"
        });

        const result = await response.json();

        if (result.data.message === "User successfully registered.") {
            auth.token = result.data.token;
            console.log(auth.token);
            return "ok";
        }
        return result.data.message;
    },
};

export default auth;
