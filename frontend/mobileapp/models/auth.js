import { baseURL, toast } from '../utils.js';

const auth = {
    token: '',

    /*
        * Log in the user
        * @param {string} username - The email of the user
        * @param {string} password - The password of the user
        * @returns {string} - The result of the login request
        * @returns {string} - The error message if the login request fails
    */
    login: async function login(username, password) {
        const response = await fetch(`${baseURL}/api/login`, {
            body: JSON.stringify({ email: username, password: password }),
            headers: {
                'content-type': 'application/json',
            },
            'method': 'POST',
        });
        const result = await response.json();
        console.log('Result of login request: ' + JSON.stringify(result));

        if ('error' in result) {
            return result.message;
        } else {
            auth.token = result.jwtToken;
            result.email = username;
            localStorage.setItem('user', JSON.stringify(result));
            localStorage.setItem('jwtToken', result.jwtToken);
            console.log('jwtToken: ' + localStorage.getItem('jwtToken'));
            console.log('All local storage items:');
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                console.log(`${key}: ${localStorage.getItem(key)}`);
            }
            location.hash = 'account';
            location.reload();
            return 'ok';
        }
    },

    /*
        * Register a new user
        * @param {string} username - The email of the user
        * @param {string} password - The password of the user
        * @param {string} firstName - The first name of the user
        * @param {string} lastName - The last name of the user    
    */
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
                'content-type': 'application/json',
            },
            'method': 'POST'
        }); const result = await response.json();

        console.log('Result of register request: ', result);
        if (result.success === true) {
            auth.login(username, password);
        }
        if (result.error) {
            toast(result.error);
        } else {
            toast(result.message);
        }
    },
};

export default auth;
