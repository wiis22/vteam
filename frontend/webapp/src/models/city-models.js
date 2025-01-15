import { serverURL } from "../utils";
import authModel from "./auth";

const city = {
    //City get request function.
    getCities: async function getAllCities() {
        const response = await fetch(`${serverURL}/api/cities`, {
            headers: {
                'Authorization': `Bearer ${authModel.token}`,
            },
            method: 'GET'
        });
        
        const result = await response.json();
        return result;
    },
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
};

export default city;
