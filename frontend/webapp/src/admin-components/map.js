import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, Polygon, LayerGroup, Circle} from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
import cityModel from "../models/city-models";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
// import '../style/Map.css';

export default function Map() {
    const location = useLocation();
    const [city, setCity] = useState(null);
    const [borders, setBorders] = useState(null);
    const [zones, setZones] = useState(null);
    const [bikes, setBikes] = useState(null);

    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    //Fetch city and get data
    const fetchCity = async () => {
        try {
            const cityData = await cityModel.getOneCity(location.state.cityId);
            setCity({
                borders: cityData.borders,
                chargingStations: cityData.chargingStations,
                geolocation: cityData.geolocation,
                parkingZones: cityData.parkingZones,
                zones: cityData.zones
            });
            if (cityData.borders && cityData.zones) {
                const borderArray = cityData.borders.map(border => [border[1], border[0]]);
                setBorders(borderArray);
                //Setting up parking zones
                const zones = [];
                cityData.zones.forEach(element => {
                    zones.push(element.map(border => [border[1], border[0]]));
                });
                // console.log(zones)
                setZones(zones);
            }
            // console.log(cityData)
        } catch (error) {
            console.error("Error fetching city data:", error);
        }
    };

    //Fetch bikes and get data
    const fetchBikes = async () => {
        try {
            const bikesData = await cityModel.getBikes(location.state.cityName);
            setBikes(bikesData);
            // console.log(bikesData)
        } catch (error) {
            console.error("Error fetching city data:", error);
        }
    };

    useEffect(() => {
        //fetching data
        fetchBikes();
        fetchCity();
    }, [location.state]);

    //render charging zones
    const renderChargingStations = () => {
        const chargingStations = [];
        const yellowOptions = { color: 'yellow' }
        city.chargingStations.forEach((element) => {
            chargingStations.push(
                <LayerGroup>
                <Circle
                    center={[element.latitude, element.longitude]}
                    pathOptions={yellowOptions}
                    radius={100}
                    />
                </LayerGroup>
            );
        });
        return chargingStations;
    };

    //render charging zones
    const renderParkingZones = () => {
        const parkingZones = [];
        const blueOptions = { color: 'blue' }
        city.parkingZones.forEach((element) => {
            parkingZones.push(
                <LayerGroup>
                <Circle
                    center={[element.latitude, element.longitude]}
                    pathOptions={blueOptions}
                    radius={100}
                    />
                </LayerGroup>
            );
        });
        return parkingZones;
    };

    //render charging zones
    const renderBikes = () => {
        //update new bike position.
        fetchBikes();

        if (!bikes || bikes.length === 0) {
            return null;
        }
        //Button that toggles bike on and off.
        const  handleClick = async (bike) => {
            if (bike.operational !== true) {
                const result = await cityModel.changeOperational(true, bike._id);
                alert("Operational ändrades till true!");
                console.log(result)
                return
            }
            const result = await cityModel.changeOperational(false, bike._id);
            alert("Operational ändrades till false!");
            console.log(result)
            return
        };
        //Put all bikes markers in a array
        const allBikes = [];
        bikes.forEach((bike) => {
            const bikeCharging = bike.charging ? "Yes" : "No";
            const bikeAvailable = bike.available ? "Yes" : "No";
            const bikeOperational = bike.operational ? "Yes" : "No";
            //Add marker and popup to bikes array
            allBikes.push(
            <Marker position={[bike.position.latitude, bike.position.longitude]}>
                <Popup>
                <p>ID: {bike._id}</p>
                Charging: {bikeCharging}<br/>
                Location: {bike.location}<br/>
                Available: {bikeAvailable}<br/>
                Operational: {bikeOperational}<br/>
                Battery percent: {`${bike.batteryPercentage}`}%<br/>

                <button onClick={() => handleClick(bike)}>
                    Change status on operational
                </button>
                </Popup>
            </Marker>
            );
        });
        return allBikes;
    };

    //render map
    const renderMap = () => {
        //setting up colors for border
        const blackOptions = { color: 'black' }
        const greenOptions = { color: 'green' }

        return (
            <MapContainer className="map" center={[city.geolocation.latitude, city.geolocation.longitude]} zoom={13} scrollWheelZoom={true}>

            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* <Marker position={[51.505, -0.09]}>
                <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker> */}

            {/* draw borders in city */}
            <Polyline pathOptions={blackOptions} positions={borders} />
            <Polygon pathOptions={greenOptions} positions={zones} />
            {renderChargingStations()}
            {renderBikes()}
            {renderParkingZones()}
            </MapContainer>
        );
    };

    return (
        <div>
            <h1>Map</h1>
            <p>Svartalinjegränsen: hela användningsområdet</p>
            <p>Grönt-område: zoner</p>
            <p>Gula cirklar: ladd-zoner</p>
            <p>Blå cirklar: parkerings-zoner</p>
            {city && borders && zones ? (
                renderMap()
            ) : (
                <p>Laddar karta över staden...</p>
            )}
        </div>
    );
};