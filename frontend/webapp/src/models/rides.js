import { serverURL } from "../utils";
import authModel from "./auth";

const rides = {
    getRides: async function getRides(userOrBike, Id) {
        const response = await fetch(`${serverURL}/api/${userOrBike}/rides/${Id}`, {
            headers: {
                'Authorization': `Bearer ${authModel.token}`,
            },
            method: 'GET'
        });
        
        const result = await response.json();
        console.log(`API URL: ${serverURL}/api/${userOrBike}/rides/${Id}`);
        return result;
        },
};

export default rides;
