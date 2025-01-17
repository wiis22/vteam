import { serverURL } from "../utils";
import authModel from "./auth";

const city = {
    //City get request function.
    getOneCity: async function getOneCity(cityId) {
        const response = await fetch(`${serverURL}/api/city/${cityId}`, {
            headers: {
                'Authorization': `Bearer ${authModel.token}`,
            },
            method: 'GET'
        });
        
        const result = await response.json();
        return result;
        },
    getBikes: async function getAllBikes(cityName) {
        const response = await fetch(`${serverURL}/api/bikes/${cityName}`, {
            headers: {
                'Authorization': `Bearer ${authModel.token}`,
            },
            method: 'GET'
        });
        
        const result = await response.json();
        return result;
        },
    getOneBike: async function getOneBike(bikeId) {
        const response = await fetch(`${serverURL}/api/bike/${bikeId}`, {
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
        const result = await fetch(`${serverURL}/api/bike/${bikeId}`, {
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
        const result = await fetch(`${serverURL}/api/bike/${bikeId}`, {
            body: JSON.stringify(newAvailableStatus),
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
