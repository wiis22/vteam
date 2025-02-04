/* global: localStorage */

import { baseURL, toast, badToast } from '../utils.js';
import accountModel from './account.js';

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
        const response = await fetch(`${baseURL}/api/v2/login`, {
            body: JSON.stringify({ email: username, password: password }),
            headers: {
                'content-type': 'application/json',
            },
            'method': 'POST',
        });
        const result = await response.json();
        console.log('Result of login request: ' + JSON.stringify(result));

        if ('error' in result) {
            badToast(result.error);
            return result.message;
        } else {
            auth.token = result.jwtToken;
            result.email = username;
            localStorage.setItem('user', JSON.stringify(result));
            localStorage.setItem('jwtToken', result.jwtToken);
            accountModel.refreshAccount();
            console.log('jwtToken: ' + localStorage.getItem('jwtToken'));
            console.log('All local storage items:');
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                console.log(`${key}: ${localStorage.getItem(key)}`);
            }
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
        const response = await fetch(`${baseURL}/api/v2/user`, {
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
            badToast(result.error);
        } else {
            toast(result.message);
            setTimeout(() => {
                document.body.classList.add('slide-out');
                setTimeout(() => {
                    document.body.classList.remove('slide-out');
                    location.hash = '#account';
                }, 250);
            }, 2000);
        }
    },

    /*
        * Update User Balance
        * @param {number} amount - The amount to add to the balance
    */
    addBalance: async function addBalance(amount) {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user._id;
            const token = localStorage.getItem('jwtToken');

            // Update the balance
            user.balance = (user.balance || 0) + amount;

            const response = await fetch(`${baseURL}/api/v2/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ balance: user.balance })
            });
            const result = await response.json();

            if (response.ok) {
                // Update the user in localStorage
                localStorage.setItem('user', JSON.stringify(user));
                toast('Balance updated successfully');
                console.log('Balance updated successfully:', result);
            } else {
                badToast(result.message || 'Failed to update balance');
                console.error('Failed to update balance:', result);
            }
            return result;
        } catch (error) {
            console.error('Error updating balance:', error);
            badToast('Error updating balance');
            return error;
        }
    },
};

export default auth;
