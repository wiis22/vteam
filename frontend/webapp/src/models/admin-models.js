import { serverURL } from "../utils";
import authModel from "./auth";

const city = {
    //City get request function.
    getCities: async function getCities() {
        const response = await fetch(`${serverURL}/cities`, {
            headers: {
                'Authorization': `Bearer ${authModel.token}`,
            },
            method: 'GET'
        });
        
        const result = await response.json();
        return result;
        },
    getOneCity: async function getOneCity(cityId) {
        const response = await fetch(`${serverURL}/city/${cityId}`, {
            headers: {
                'Authorization': `Bearer ${authModel.token}`,
            },
            method: 'GET'
        });
        
        const result = await response.json();
        return result;
        },
    getBikes: async function getAllBikes(cityName) {
        const response = await fetch(`${serverURL}/bikes/${cityName}`, {
            headers: {
                'Authorization': `Bearer ${authModel.token}`,
            },
            method: 'GET'
        });
        
        const result = await response.json();
        return result;
        },
    getOneBike: async function getOneBike(bikeId) {
        const response = await fetch(`${serverURL}/bike/${bikeId}`, {
            headers: {
                'Authorization': `Bearer ${authModel.token}`,
            },
            method: 'GET'
        });
        
        const result = await response.json();
        return result;
        },
    changeOperational: async function changeOperational(setNewStatus, bikeId) {
        const newOperationalStatus = {
            "operational": setNewStatus
        };
        const result = await fetch(`${serverURL}/bike/${bikeId}`, {
            body: JSON.stringify(newOperationalStatus),
            headers: {
                'Authorization': `Bearer ${authModel.token}`,
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });

        return result;
        },
    changeAvailable: async function changeAvailable(setNewStatus, bikeId) {
        const newAvailableStatus = {
            "available": setNewStatus
        };
        const result = await fetch(`${serverURL}/bike/${bikeId}`, {
            body: JSON.stringify(newAvailableStatus),
            headers: {
                'Authorization': `Bearer ${authModel.token}`,
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });

        return result;
        },
    changeLocation: async function changeLocation(setNewLocation, bikeId) {
        const newLocationStatus = {
            "location": setNewLocation
        };
        const result = await fetch(`${serverURL}/bike/${bikeId}`, {
            body: JSON.stringify(newLocationStatus),
            headers: {
                'Authorization': `Bearer ${authModel.token}`,
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });

        return result;
        },
    getUsers: async function getAllUsers() {
        const response = await fetch(`${serverURL}/users`, {
            headers: {
                'Authorization': `Bearer ${authModel.token}`,
            },
            method: 'GET'
        });
        
        const result = await response.json();
        return result;
        },
    updateUserRole: async function updateUserRole(setNewRoll, userId) {
        const newRole = {
            "role": setNewRoll
        };
        const result = await fetch(`${serverURL}/user/${userId}`, {
            body: JSON.stringify(newRole),
            headers: {
                'Authorization': `Bearer ${authModel.token}`,
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });

        return result;
        },
};

export default city;
