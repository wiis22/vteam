/* global L */

import getCoordinates from "../models/nominatim.js";
import { baseURL } from "../utils.js";

export default class MapView extends HTMLElement {
    constructor() {
        super();
        this.map = null;
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }
        this[property] = newValue;
    }

    // connect component
    async connectedCallback() {
        const coordinates = await getCoordinates("Göteborg");
        coordinates.length > 0 ? console.log("Coordinates: ", coordinates) : console.error("No coordinates found");
        
        // If no token, redirect to login
        const token = localStorage.getItem("jwtToken")
        if (!token) {
            location.hash = "account";
            return;
        };
        this.innerHTML = `
            <main class="main">
                <div id="map" class="map fade-in"></div>
            </main>
        `;
        this.renderMap(coordinates[0], token);
    }

    renderMap(coordinates, token) {
        if (!coordinates.lat || !coordinates.lon) {
            console.error("Invalid coordinates:", coordinates);
            return;
        }
        this.map = L.map('map', {
            minZoom: 7,
        }
        ).setView([coordinates.lat, coordinates.lon], 18);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        this.renderMarkers(coordinates);
        this.renderLocation();
        this.renderCities(token);
        this.renderBikes(token);
    }

    renderMarkers(coordinates) {
        L.marker([coordinates.lat, coordinates.lon]).addTo(this.map);
    }

    // Render bikes on the map as markers
    async renderBikes(token) {
        const bikeResponse = await fetch(`${baseURL}/api/bikes/Göteborg`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const bikes = await bikeResponse.json();
        const bikeIssues = {};
        console.log(bikes)

        bikes.forEach((bike) => {
            const { latitude, longitude } = bike.position;
            if (bike.position.latitude && bike.position.longitude && bike.available) {
                L.marker([latitude, longitude]).addTo(this.map);
                L.marker([latitude, longitude])
                    .addTo(this.map)
                    .bindPopup(`
                        <b>Bike ID:</b> ${bike._id}<br>
                        <b>Charging:</b> ${bike.charging}<br>
                        <b>Operational:</b> ${bike.operational}<br>
                        <b>Available:</b> ${bike.available}<br>
                        <b>Location:</b> ${bike.location}<br>
                        <div class="button red-button full-width-button">Rent</div>
                    `);
            } else {
                bikeIssues[bike._id] = {
                    charging: bike.charging,
                    operational: bike.operational,
                    available: bike.available,
                    location: bike.location,
                    position: bike.position,
                };
            }
        });
        if (bikeIssues.length > 0) {
            console.error("There was an issue rendering the following bikes:", bikeIssues);
        }
    }

    async renderCities(token) {
        const cityResponse = await fetch(`${baseURL}/api/cities`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const cities = await cityResponse.json();
        console.log(cities);
        cities.forEach((city) => {
            if (city.borders && city.borders.length > 0) {
                const cityBorders = city.borders.map((border) => {
                    if (border.length === 2) {
                        return [border[1], border[0]]; // [latitude, longitude] - Not set by name, uses index
                    } else {
                        console.error("Invalid border node:", border);
                        return null;
                    }
                }).filter(coord => coord !== null);
                if (cityBorders.length > 0) {
                    L.polygon(cityBorders, { color: 'cyan' }).addTo(this.map);
                }
            } else {
                console.error("Invalid city borders:", city.borders);
            }
        });
    }

    renderLocation() {
        let locationMarker = L.icon({
            iconUrl: "location.png",
            iconSize: [45, 45],
            iconAnchor: [12, 12],
            popupAnchor: [0, 0]
        });

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                L.marker(
                    [position.coords.latitude, position.coords.longitude],
                    { icon: locationMarker }
                ).addTo(this.map);
                this.map.setView([position.coords.latitude, position.coords.longitude], 18);
            });
        }
    }
}
