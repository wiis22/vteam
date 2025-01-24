import { serverURL } from "../utils";
import authModel from "./auth";

const user = {
    updateUser: async function updateUser(userObject) {
        const updatedUser = {
            ...userObject,
        };

        const result = await fetch(`${serverURL}/api/user/${authModel.userId}`, {
            body: JSON.stringify(updatedUser),
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${authModel.token}`,
            },
            method: 'PUT'
        });

        return result;
    },
    changeUserPassword: async function changeUserPassword(NewPassword) {
        const updatedPassword = {
            ...NewPassword
        };

        const result = await fetch(`${serverURL}/api/user/password/${authModel.userId}`, {
            body: JSON.stringify(updatedPassword),
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${authModel.token}`,
            },
            method: 'PUT'
        });

        return result;
    },

    getOneUser: async function getOneUser() {
        const response = await fetch(`${serverURL}/api/user/${authModel.userId}`, {
            headers: {
                'Authorization': `Bearer ${authModel.token}`,
            },
            method: 'GET'
        });

        const result = await response.json();
        return result;
    },
};

export default user;