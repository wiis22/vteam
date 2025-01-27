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
        this.city = null;
        this.cities = {};
        this.chargingZones = [];
        this.parkingZones = [];
        this.cityName = "";
        this.user = localStorage.getItem("user");
        this.socket = null;
        this.bikeCluster = new L.MarkerClusterGroup();
        this.rentedBike = null;
    }

    static get observedAttributes() {
        return ["bikes"];
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (property === "bikes") {
            this.updateBikeMarkers(JSON.parse(newValue));
        }
        if (oldValue === newValue) {
            return;
        } else {
            this[property] = newValue;
        }
    }

    // connect component
    async connectedCallback() {
        this.innerHTML = `
                <div id="city-selection" class="city-selection">
                    <button id="city-selection-toggle" class="city-selection-toggle">Select City</button>
                    <ul id="city-list" class="city-list"></ul>
                </div>
                <div id="map" class="map fade-in"></div>
            `;
        if (!this.token) {
            toast("Login required to view map");
            return
        }

        this.fetchCities();
        this.userId = JSON.parse(this.user)._id;
        this.socket = new socket(this.userId);
        this.socket.setupSocket();

        getUserLocation().then(coordinates => {
            this.renderMap(coordinates);
        }).catch(error => {
            toast(error);
        });
    }

    /*
    * Create city selection dropdown
    * @param {Array} cities - Array of city names
    */
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
                this.cityName = city;
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
        const coords = await getCoordinates(this.cityName);
        this.map.setView([coords[0].lat, coords[0].lon], 14);

        const bikes = await bikesModel.fetchBikes(this.token, this.cityName);
        this.bikes = bikes;
        this.setAttribute("bikes", JSON.stringify(this.bikes));
        this.updateBikeMarkers(bikes);
    }

    // Update bike markers on the map
    updateBikeMarkers(bikes) {
        // Clear existing bike markers
        this.bikeCluster.clearLayers();

        // Add new bike markers
        bikes.forEach((bike) => {
            const { latitude, longitude } = bike.position;
            if (latitude && longitude && bike.available) {
                this.bikeCluster.addLayer(L.marker([latitude, longitude], { icon: icons.bike, opacity: 0.8 }).bindPopup(`
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
        this.map.addLayer(this.bikeCluster);
        this.map.off('popupopen'); // Remove any existing event listeners
        this.map.on('popupopen', (e) => {
            const button = e.popup._contentNode.querySelector('.red-button');
            if (button) {
                button.addEventListener('click', () => {
                    const bikeId = button.getAttribute('data-bike-id');
                    const bike = bikes.find(b => b._id === bikeId);
                    this.map.setView([bike.position.latitude, bike.position.longitude], 18);
                    this.map.panTo([bike.position.latitude, bike.position.longitude]);
                    if (bike) {
                        this.gainControl(bike);
                        setTimeout(() => {
                            this.socket.endRide(bike._id);
                            this.map.removeLayer(this.rentedBike);
                            this.rentedBike = null;
                            this.renderBikes();
                            toast("Ride ended and bike parked.");
                        }, 10000);
                    }
                    console.log('Renting bike:', bikeId);
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
        let citiesArray = [];
        cities.forEach(city => {
            this.cities[city.name] = city;
            citiesArray.push(city.name);
        });
        this.createCitySelection(citiesArray);
    }

    /*
    * Render the current selected city in within this.cityName
    * Renders city borders, parking zones, and charging stations
    */
    renderCity() {
        // Clear existing city layers
        if (this.cityLayers) {
            this.cityLayers.forEach(layer => layer.remove());
        }
        this.cityLayers = [];

        const city = this.cities[this.cityName];
        if (!city) {
            console.error("City not found:", this.cityName);
            return;
        }

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
            const polygon = L.polygon(cityBorders, { color: 'green', fillOpacity: 0.05, weight: 8, opacity: 0.5, zIndexOffset: -1000 }).addTo(this.map);
            this.cityLayers.push(polygon);
        }

        this.chargingZones = [];
        this.parkingZones = [];
        // Render parking zones
        city.parkingZones.forEach((zone) => {
            const { latitude, longitude } = zone;
            if (latitude && longitude) {
                const circle = L.circle([latitude, longitude], {
                    color: 'blue',
                    opacity: 0.3,
                    radius: 50,
                    zIndexOffset: -500
                }).addTo(this.map);
                this.cityLayers.push(circle);
                this.parkingZones.push(circle);
                const marker = L.marker([latitude, longitude], { icon: icons.parking, opacity: 0.5, zIndexOffset: -1000 }).addTo(this.map);
                this.cityLayers.push(marker);
            } else {
                console.error("Invalid parking zone node:", zone);
            }
        });

        // Render charging stations
        city.chargingStations.forEach((station) => {
            const { latitude, longitude } = station;
            if (latitude && longitude) {
                const marker = L.marker([latitude, longitude], { icon: icons.charging, opacity: 0.7, zIndexOffset: -1000 }).addTo(this.map);
                this.cityLayers.push(marker);
                const circle = L.circle([latitude, longitude], {
                    color: 'green',
                    fillOpacity: 0.4,
                    fillColor: 'green',
                    radius: 30,
                    zIndexOffset: -500
                }).addTo(this.map);
                this.cityLayers.push(circle);
                this.chargingZones.push(circle);
            } else {
                console.error("Invalid charging station node:", station);
            }
        });
    }

    /*
    * Gain control of a bike
    * @param {Object} bike - The bike object to control
    */
    gainControl(bike) {
        this.socket.startRide(bike._id);
        this.rentedBike = L.marker([bike.position.latitude, bike.position.longitude], { icon: icons.bike, opacity: 0.8 }).addTo(this.map);
        this.map.removeLayer(this.bikeCluster);

        const step = 0.00001;

        const parkingZones = this.parkingZones || [];
        const chargingZones = this.chargingZones || [];

        console.log('Parking zones:', parkingZones);
        console.log('Charging stations:', chargingZones);

        const isInsideZone = (lat, lon, zones) => {
            return zones.some(zone => zone.getLatLng().distanceTo([lat, lon]) <= zone.getRadius());
        };

        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'w':
                    bike.position.latitude += step;
                    break;
                case 'a':
                    bike.position.longitude -= step * 2;
                    break;
                case 's':
                    bike.position.latitude -= step;
                    break;
                case 'd':
                    bike.position.longitude += step * 2;
                    break;
                default:
                    return; // Ignore other keys
            }
            this.map.panTo([bike.position.latitude, bike.position.longitude]);
            this.map.setView([bike.position.latitude, bike.position.longitude], 18);
            this.rentedBike.setLatLng([bike.position.latitude, bike.position.longitude]);
            checkZones();
        });

        const checkZones = () => {
            if (isInsideZone(bike.position.latitude, bike.position.longitude, parkingZones)) {
                console.log('Bike is inside a parking zone');
            }

            if (isInsideZone(bike.position.latitude, bike.position.longitude, chargingZones)) {
                console.log('Bike is inside a charging station');
            }
        };

        setInterval(() => {
            console.log('Socket: sending position ', bike.position);
            this.socket.sendPosition(bike.position);
        }, 5000);
    }
}
