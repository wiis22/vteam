import getCoordinates from "./nominatim.js";
import { toast } from "../utils.js";

/* 
* Get the user's geolocation
* If geolocation is available, get the user's coordinates
* If geolocation is not available, get the coordinates for Göteborg as a fallback
* @returns {Object} coordinates - The user's coordinates
*/
export default async function getGeolocation() {
    let coordinates;

    // Sets the view of the map to the user's location if available
    if ("geolocation" in navigator) {
        coordinates = await new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition((position) => {
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            }, async () => {
                // If geolocation (fails), use Karlskrona coordinates
                const coords = await getCoordinates("Göteborg");
                toast("Using standard location");
                resolve(coords[0]);
            });
        });
    }

    return coordinates;
}
