/* global L */

const icons = {
    user: L.icon({
        iconUrl: "img/location.png",
        iconSize: [45, 45],
        iconAnchor: [22.5, 22.5],
        popupAnchor: [0, -22.5],
    }),
    bike: L.icon({
        iconUrl: "img/ebike.png",
        iconSize: [45, 45],
        iconAnchor: [22.5, 22.5],
        popupAnchor: [0, -22.5],
    }),
    parking: L.icon({
        iconUrl: "img/parking.png",
        iconSize: [45, 45],
        iconAnchor: [22.5, 22.5],
        popupAnchor: [0, -22.5],
    }),
    charging: L.icon({
        iconUrl: "img/charging.png",
        iconSize: [45, 45],
        iconAnchor: [17.5, 22.5],
        popupAnchor: [0, -22.5],
    }),
};

export default icons;