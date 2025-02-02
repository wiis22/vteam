import { serverURL } from "../utils";
import Login from "../components/login";

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

        const response = await fetch(`${serverURL}/login`, {
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

            // console.log(result);
            return result;
        }
        // console.log(result);
        return "not ok";
    },

    register: async function register (firstName, lastName, email, password) {
        const user = {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        };

        const response = await fetch(`${serverURL}/user`, {
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        });

        const result = await response.json();

        if (result.success === true) {
            console.log(result);
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
    //checks if role has access to page, put role that have access in argument.
    roleAccess: function roleAccess (roleAccess) {
        //checks if logged in, if not renders login page
        if(!auth.token) {
            return (
                <Login  />
            );
        }

        if (auth.role === "banned") {
            return 'Du är bannad kontakta admin@admin.se för mer info';
        }

        if (auth.role === "user" && roleAccess === "admin") {
            return 'Denna sidan är endast avsedd för admin användare';
        }
        return;
    }
};

export default auth;