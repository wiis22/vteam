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
    getOneCity: async function getAllOneCity(cityId) {
        const response = await fetch(`${serverURL}/api/city/${cityId}`, {
            headers: {
                'Authorization': `Bearer ${authModel.token}`,
            },
            method: 'GET'
        });
        
        const result = await response.json();
        return result;
        },
};

export default city;
