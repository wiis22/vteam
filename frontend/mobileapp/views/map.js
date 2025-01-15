/* global L */

import getCoordinates from "../models/nominatim.js";
import { baseURL } from "../utils.js";

export default class MapView extends HTMLElement {
    constructor() {
        super();
        this.map = null;
    }

    static get observedAttributes() {
        return ["order"];
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }
        this[property] = newValue;
    }

    // connect component
    async connectedCallback() {
        const coordinates = await getCoordinates("Stockholm");

        coordinates.length > 0 ? console.log("Coordinates: ", coordinates) : console.error("No coordinates found");

        this.innerHTML = `

            <main class="main">
                <div id="map" class="map fade-in"></div>
            </main>
        `;
        this.renderMap(coordinates[0]);
    }

    renderMap(coordinates) {
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
    }

    renderMarkers(coordinates) {
        L.marker([coordinates.lat, coordinates.lon]).addTo(this.map);
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
            });
        }
    }
}
