import { baseURL } from '../utils.js';

const cities = {
    fetchCities: async (token) => {
        const cityResponse = await fetch(`${baseURL}/api/v2/cities`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const result = await cityResponse.json();
        return result;
    }
}

export default cities;
