/* global: localStorage, sessionStorage */

import { baseURL, toast, badToast } from '../utils.js';
import authModel from './auth.js';

const account = {
    /*
        * Log out the user by clearing the local storage and session storage
    */
    logout: function logout() {
        localStorage.clear();
        sessionStorage.clear();
        authModel.token = '';
        location.hash = 'account';
        location.reload();
        toast('Logged out');
    },

    /*
        * Refresh the account by fetching the user data from the server
        * Is triggered upon opening the account page
    */
    refreshAccount: async function refreshAccount() {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('jwtToken');
        if (user && user._id) {
            const response = await fetch(`${baseURL}/api/v2/user/${user._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (result.message != "Token invalid or expired") {
                localStorage.setItem('user', JSON.stringify(result));
                return "ok";
            } else {
                badToast('Token expired, automatic logout');
                setTimeout(() => {
                    account.logout();
                }, 2000);
            }
        } else {
            console.error('No user found in local storage in order to refresh account');
        }
    },
};

export default account;