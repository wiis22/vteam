/* global L */
import getUserLocation from "../models/geolocation.js";
import icons from "../models/icons.js";
import citiesModel from "../models/cities.js";
import bikesModel from "../models/bikes.js";
import { toast } from "../utils.js";
import socket from "../socket.js";
import getCoordinates from "../models/nominatim.js";


export default class MapComponent extends HTMLElement {
    constructor() {
        super();
        this.map = null;
        this.bikes = {};
        this.token = localStorage.getItem("jwtToken");
        this.userMarker = null;
        this.cities = {};
        this.city = "";
    }

    static get observedAttributes() {
        return ["bikes"];
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }
        if (property === "bikes") {
            this.updateBikeMarkers(JSON.parse(newValue));
        }
    }

    // connect component
    async connectedCallback() {
        this.innerHTML = `
                    <div id="city-selection" class="city-selection">
                    <button id="city-selection-toggle" class="city-selection-toggle">Select City</button>
                    <ul id="city-list" class="city-list">
                    </ul>
                </div>
                <div id="map" class="map fade-in"></div>
            `;

        if (!this.token) {
            toast("Login required to view map");
            return
        }
        this.fetchCities();

        getUserLocation().then(coordinates => {
            this.renderMap(coordinates);
        }).catch(error => {
            toast(error);
        });
    }

    async createCitySelection(cities) {
        const toggleButton = this.querySelector("#city-selection-toggle");
        const cityList = this.querySelector("#city-list");

        toggleButton.addEventListener("click", () => {
            cityList.classList.toggle("show");
        });

        // Example cities, replace with actual city data
        cities.forEach(city => {
            const li = document.createElement("li");
            li.textContent = city;
            li.addEventListener("click", () => {
                this.city = city;
                this.renderBikes();
                this.renderCity();
                cityList.classList.remove("show");
            });
            cityList.appendChild(li);
        });
    }

    /*
        * Render the map
        * @param {Object} coordinates - The coordinates to center the map on
    */
    renderMap(coordinates) {
        if (!coordinates.lat || !coordinates.lon) {
            console.error("Invalid coordinates:", coordinates);
            return;
        }
        this.map = L.map('map', {
            minZoom: 14,
        }).setView([coordinates.lat, coordinates.lon], 18);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);
        // Add marker with popup "You are here"
        L.marker([coordinates.lat, coordinates.lon], { icon: icons.user })
            .addTo(this.map)
            .bindPopup("You are here")
            .openPopup();
    }

    // Render bikes on the map as markers
    async renderBikes() {
        const coords = await getCoordinates(this.city);
        this.map.setView([coords[0].lat, coords[0].lon], 14);

        const bikes = await bikesModel.fetchBikes(this.token, this.city);
        this.bikes = bikes;
        this.setAttribute("bikes", JSON.stringify(this.bikes));
    }

    // Update bike markers on the map
    updateBikeMarkers(bikes) {
        // Clear existing bike markers
        if (this.bikeMarkers) {
            this.bikeMarkers.forEach(marker => marker.remove());
        }
        this.bikeMarkers = [];
        var bikeClusterGroup = new L.MarkerClusterGroup();

        // Add new bike markers
        bikes.forEach((bike) => {
            const { latitude, longitude } = bike.position;
            if (latitude && longitude && bike.available) {
                bikeClusterGroup.addLayer(L.marker([latitude, longitude], { icon: icons.bike }).bindPopup(`
                    <b>Bike ID:</b> ${bike._id}<br>
                    <b>Charging:</b> ${bike.charging}<br>
                    <b>Operational:</b> ${bike.operational}<br>
                    <b>Location:</b> ${bike.location}<br>
                    <br>
                    <b>Available:</b> ${bike.available}<br>
                    <b>Battery:</b> ${Math.round(bike.batteryPercentage)}%<br>
                    <button class="button red-button full-width-button" data-bike-id="${bike._id}">Rent</button>
                `));
            }
        });
        this.map.addLayer(bikeClusterGroup);
        this.map.on('popupopen', (e) => {
            const button = e.popup._contentNode.querySelector('.red-button');
            if (button) {
                button.addEventListener('click', () => {
                    const bikeId = button.getAttribute('data-bike-id');
                    socket.emit('joinRoom', { roomName: bikeId });
                });
            }
        });
    }

    /*
        * Fetch cities from the API
        * Sets the cities object with city data
        * Sets up the city selection
    */
    async fetchCities() {
        const cities = await citiesModel.fetchCities(this.token);
        cities.forEach(city => {
            this.cities[city.name] = city;
        });
        let citiesArray = [];
        cities.forEach((city) => {
            citiesArray.push(city.name);
        });
        this.createCitySelection(citiesArray);
    }

    /*
        * Render the current selected city in within this.city
        * Renders city borders, parking zones, and charging stations
    */
    renderCity() {
        const city = this.cities[this.city];
        // Render city borders
        const cityBorders = city.borders.map((border) => {
            if (border.length === 2) {
                return [border[1], border[0]]; // [latitude, longitude]
            } else {
                console.error("Invalid border node:", border);
                return null;
            }
        }).filter(coord => coord !== null);
        if (cityBorders.length > 0) {
            L.polygon(cityBorders, { color: 'green', fillOpacity: 0.05, weight: 4, opacity: 1 }).addTo(this.map);
        }
        // Render parking zones
        city.parkingZones.forEach((zone) => {
            const { latitude, longitude } = zone;
            if (latitude && longitude) {
                L.circle([latitude, longitude], {
                    color: 'blue',
                    opacity: 0.3,
                    radius: 50,
                }).addTo(this.map);
                L.marker([latitude, longitude], { icon: icons.parking, opacity: 0.5, zIndexOffset: -1000 }).addTo(this.map);
                // Adjust circle radius based on zoom level
                // this.map.on('zoomend', () => {
                //     const zoomLevel = this.map.getZoom();
                //     const newRadius = 8 * (20 / zoomLevel);
                //     circle.setRadius(newRadius);
                // });
            } else {
                console.error("Invalid parking zone node:", zone);
            }
        });
        // Render charging stations
        city.chargingStations.forEach((station) => {
            const { latitude, longitude } = station;
            if (latitude && longitude) {
                L.marker([latitude, longitude], { icon: icons.charging, opacity: 0.7, zIndexOffset: -1000 }).addTo(this.map);
                L.circle([latitude, longitude], {
                    color: 'green',
                    fillOpacity: 0.4,
                    fillColor: 'green',
                    radius: 30,
                    zIndexOffset: -500
                }).addTo(this.map);
            } else {
                console.error("Invalid charging station node:", station);
            }
        });
    };

}
