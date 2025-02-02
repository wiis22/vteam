import { baseURL } from '../utils.js';

const cities = {
    fetchCities: async (token) => {
<<<<<<< HEAD
        const cityResponse = await fetch(`${baseURL}/api/v2/cities`, {
=======
        const cityResponse = await fetch(`${baseURL}/cities`, {
>>>>>>> 482a151e70038fcfe02521ceb7ed96c328894042
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const result = await cityResponse.json();
        return result;
    }
}

export default cities;