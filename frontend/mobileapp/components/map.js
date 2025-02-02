/* global L */
/** global: HTMLElement, localStorage */
import getUserLocation from "../models/geolocation.js";
import icons from "../models/icons.js";
import citiesModel from "../models/cities.js";
import bikesModel from "../models/bikes.js";
import { toast, badToast } from "../utils.js";
import socket from "../socket.js";
import getCoordinates from "../models/nominatim.js";


export default class MapComponent extends HTMLElement {
    constructor() {
        super();
        this.token = localStorage.getItem("jwtToken");
        this.user = JSON.parse(localStorage.getItem("user"));
        this.map = null;
        this.userMarker = null;
        this.city = null;
        this.cities = {};
        this.chargingZones = [];
        this.parkingZones = [];
        this.cityName = "";
        this.socket = null;
        this.bikes = {};
        this.bikeCluster = new L.MarkerClusterGroup();
        this.rentedBike = null;
    }

    // Observe changes class properties
    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        } else {
            this[property] = newValue;
        }
    }

    /*
    * Connect component
    * Main function to render the map and city selection dropdown
    */
    async connectedCallback() {
        this.innerHTML = `
                <div id="city-selection" class="city-selection">
                    <button id="city-selection-toggle" class="city-selection-toggle">Select City</button>
                    <ul id="city-list" class="city-list"></ul>
                </div>
                <div id="map" class="map fade-in"></div>
            `;

        /*
        * Get user location and render the map
        * If it fails, return a toast message
        */
        getUserLocation().then(coordinates => {
            this.renderMap(coordinates);
        }).catch(error => {
            toast(error);
        });

        /*
        * Create city selection dropdown
        * Tries to fetch cities, if it doesn't work due to invalid or expired token, return a toast message
        * and cancel the rest of function.
        */
        const response = await this.createCitySelection();
        if (!response) {
            this.userId = this.user._id;
            this.socket = new socket(this.userId);
            this.socket.setupSocket();
        }
    }

    /*
    * Create city selection dropdown
    * Fetch cities from the API
    * Sets the cities object with city data
    * Sets up the city selection
    */
    async createCitySelection() {
        const cities = await citiesModel.fetchCities(this.token);
        let citiesArray = [];
        if (cities.message === 'Token invalid or expired') {
            badToast('Token invalid or expired, please log in');
            return 'Token invalid or expired';
        }
        cities.forEach(city => {
            this.cities[city.name] = city;
            citiesArray.push(city.name);
        });

        const toggleButton = this.querySelector("#city-selection-toggle");
        const cityList = this.querySelector("#city-list");
        const citySelection = document.getElementById("city-selection");

        citySelection.style.visibility = "visible";
        toggleButton.addEventListener("click", () => {
            cityList.classList.toggle("show");
        });

        citiesArray.forEach(city => {
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
    };

    /*
    * Render the map
    * @param {Object} coordinates - The coordinates to center the map on
    */
    renderMap(coordinates) {
        if (!coordinates.lat || !coordinates.lon) {
            console.error("Invalid coordinates:", coordinates);
            return;
        }
        // Create map with user location
        this.map = L.map('map', {
            minZoom: 14, // Prevent zooming out too far, remove this line to allow zooming out further
        }).setView([coordinates.lat, coordinates.lon], 18);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);
        // Create user marker
        L.marker([coordinates.lat, coordinates.lon], { icon: icons.user })
            .addTo(this.map)
            .bindPopup("You are here")
            .openPopup();
    }

    /*
    * Fetches bikes from the API and ships them along
    * to renderBikes() to render them on the map
    */
    async renderBikes() {
        const coords = await getCoordinates(this.cityName);
        this.map.setView([coords[0].lat, coords[0].lon], 14);

        const bikes = await bikesModel.fetchBikes(this.token, this.cityName);

        this.bikes = bikes;
        this.updateBikeMarkers(bikes);
    };

    /*
    * Removes existing bike markers and adds new bike markers
    * @param {Array} bikes - The bikes to render on the map
    */
    updateBikeMarkers(bikes) {
        // Clear existing bike markers
        this.bikeCluster.clearLayers();

        // Add new bike markers with popups
        bikes.forEach((bike) => {
            const { latitude, longitude } = bike.position;

            if (latitude && longitude && bike.available && bike.operational) {
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
        // Add event listener to rent button
        // When clicked, start ride and gain control of the bike
        this.map.on('popupopen', (e) => {
            const button = e.popup._contentNode.querySelector('.red-button');
            if (button) {
                button.addEventListener('click', () => {
                    const bikeId = button.getAttribute('data-bike-id');
                    const bike = bikes.find(b => b._id === bikeId);
                    this.map.setView([bike.position.latitude, bike.position.longitude], 18);
                    this.map.panTo([bike.position.latitude, bike.position.longitude]);
                    if (bike) {
                        this.socket.startRide(bike._id);
                        const timeout = setTimeout(() => {
                            badToast("Connection refused: failed to start bike");
                            return;
                        }, 3000);

                        this.socket.socket.on("bikeStartRideResponse", (data) => {
                            clearTimeout(timeout);
                            if (data.bikeId === bike._id && data.started) {
                                this.gainControl(bike);
                                this.createBikeControls();
                                toast("Ride successfully started");
                            } else {
                                badToast("Connection refused: bad bike");
                            }
                        });
                    }
                });
            }
        });
    };

    /*
    * Create bike controls
    * Create a button to end the ride
    * Remove all other buttons from the bottom nav
    */
    createBikeControls() {
        let bottomNav = document.getElementById('bottom-nav');
        for (let i = 0; i < bottomNav.children.length; i++) {
            bottomNav.children[i].style.display = 'none';
            bottomNav.children[i].style.width = 0;
        }
        let button = document.createElement('button');
        button.classList.add('red-button', 'full-width-button');
        button.textContent = 'End Ride';
        button.style.width = '99%';
        button.style.height = '90%';
        button.addEventListener('click', () => {
            this.socket.endRide();
            this.socket.socket.on("rideDone", (data) => {
                if (data.bikeId === this.bikes._id) {
                    this.map.removeLayer(this.rentedBike);
                    this.rentedBike = null;
                    this.renderBikes();
                    for (let i = 0; i < bottomNav.children.length; i++) {
                        bottomNav.children[i].style.width = '';
                        bottomNav.children[i].style.display = 'block';
                    }
                } else {
                    badToast("Failed to end ride");
                }
            });
        });
        bottomNav.appendChild(button);
    }

    /*
    * Render the current selected city in within this.cityName
    * Renders city borders, parking zones, and charging stations of selected city
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
                const circle = L.circle([latitude, longitude], { color: 'blue', opacity: 0.3, radius: 50, zIndexOffset: -500 }).addTo(this.map);
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
    };

    /*
    * Gain control of a bike
    * @param {Object} bike - The bike object to control
    */
    gainControl(bike) {
        if (this.rentedBike) {
            this.stopControl(); // Ensure previous bike control is stopped
        }

        this.socket.socket.on("bikeEndRide", (data) => {
            console.log("End ride event received with data: ", data);
            if (data.bikeId === bike._id) {
                this.stopControl();
                toast("Ride ended");
            }
        });

        this.rentedBike = L.marker([bike.position.latitude, bike.position.longitude], { icon: icons.bike, opacity: 0.8 }).addTo(this.map);
        this.map.removeLayer(this.bikeCluster);

        const step = 0.00001;

        // Remove previous keydown listener before adding a new one
        if (this.keydownListener) {
            document.removeEventListener('keydown', this.keydownListener);
        }

        this.keydownListener = (event) => {
            const keyMap = {
                'w': () => bike.position.latitude += step,
                'a': () => bike.position.longitude -= step * 2,
                's': () => bike.position.latitude -= step,
                'd': () => bike.position.longitude += step * 2
            };
            if (keyMap[event.key]) {
                keyMap[event.key]();
                this.map.panTo([bike.position.latitude, bike.position.longitude]);
                this.rentedBike.setLatLng([bike.position.latitude, bike.position.longitude]);
            }
        };

        document.addEventListener('keydown', this.keydownListener);

        // Clear previous interval before starting a new one
        if (this.controlInterval) {
            clearInterval(this.controlInterval);
        }

        this.controlInterval = setInterval(() => {
            if (!this.rentedBike) {
                clearInterval(this.controlInterval);
                this.controlInterval = null;
                return;
            }
            console.log(`Sending position of bike ${bike._id}`);
            this.socket.sendPosition(bike.position);
        }, 5000);
    };

    /*
    * Stop controlling the bike
    */
    stopControl() {
        if (this.keydownListener) {
            document.removeEventListener('keydown', this.keydownListener);
            this.keydownListener = null;
        }
        if (this.controlInterval) {
            clearInterval(this.controlInterval);
            this.controlInterval = null;
        }
        if (this.rentedBike) {
            this.map.removeLayer(this.rentedBike);
            this.rentedBike = null;
        }
    }
};
