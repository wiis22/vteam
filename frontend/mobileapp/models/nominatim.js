/*
    * This function takes an address as an argument and returns the coordinates of the address.
    * @param {string} address - The address to get coordinates for
    * @returns {Object} - The coordinates of the address
*/
export default async function getCoordinates(address) {
    const urlEncodedAddress = encodeURIComponent(address);
    const url = "https://nominatim.openstreetmap.org/search.php?format=jsonv2&q=";
    const response = await fetch(`${url}${urlEncodedAddress}`);
    const result = await response.json();

    return result;
}
