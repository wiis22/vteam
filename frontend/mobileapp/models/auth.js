import { baseURL } from "../utils.js";

const auth = {
    token: "",

    login: async function login(username, password) {
        const user = {
            email: username,
            password: password
        };

        const response = await fetch(`${baseURL}/api/login`, {
            body: JSON.stringify(user),
            headers: {
                'content-type': "application/json",
            },
            "method": "POST",
        });

        const result = await response.json();

        console.log("Result of login request: " + JSON.stringify(result));
        if ("error" in result) {
            return result.message;
        } else {
            const returnedUser = {
                id: result._id,
                role: result.role,
                email: result.email,
                balance: result.balance,
                email: user.email
                // firstName: result.user.firstName,    This is currently not returned from login route
                // lastName: result.user.lastName          -||-
            };
            localStorage.setItem("user", JSON.stringify(returnedUser));
            localStorage.setItem("jwtToken", result.jwtToken);

            auth.token = result.jwtToken;
            console.log("jwtToken: " + localStorage.getItem("jwtToken"));
            console.log("All local storage items:");
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                console.log(`${key}: ${localStorage.getItem(key)}`);
            }
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

        const response = await fetch(`${baseURL}/api/user`, {
            body: JSON.stringify(user),
            headers: {
                'content-type': "application/json",
            },
            "method": "POST"
        });

        const result = await response.json();
        console.log(result);

        if (result.message === "User successfully registered.") {
            return auth.login(username, password);
        }
        return result.message;
    },

    logout: function logout() {
        localStorage.clear();
        sessionStorage.clear();
        auth.token = "";
        location.hash = "login";
    },
};

export default auth;
