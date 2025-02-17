import { baseURL } from '../utils.js';

const bikes = {
    fetchBikes: async (token, city) => {
        const bikeResponse = await fetch(`${baseURL}/api/v2/bikes/${city}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const bikes = await bikeResponse.json();
        return bikes;
    },
};

export default bikes;