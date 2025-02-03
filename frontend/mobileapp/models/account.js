/* global: localStorage, sessionStorage */

import { toast } from '../utils.js';
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

};

export default account;