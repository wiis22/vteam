import { baseURL } from '../utils.js';

const rides = {
    fetchRides: async (token, userId) => {
        try {
            const rideResponse = await fetch(`${baseURL}/api/v2/user/rides/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const rides = await rideResponse.json();
            return rides;
        } catch (error) {
            console.error('Error fetching rides:', error);
            return [];
        }
    },
};

export default rides;