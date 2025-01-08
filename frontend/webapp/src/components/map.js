import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import cityModel from "../models/city-models";
// import '../style/Map.css';

export default function Map() {
    const location = useLocation();
    const [city, setCity] = useState(null);
    //get city id
    useEffect(() => {
        const fetchCity = async () => {
            try {
                const cityData = await cityModel.getOneCity(location.state.cityId);
                setCity(cityData);
            } catch (error) {
                console.error("Error fetching city data:", error);
            }
        };

        fetchCity();
    }, [location.state.cityId]);

    console.log(city.geolocation);

    return (
        <div>
            <h1>Map</h1>

            <MapContainer className="map" center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>

            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]}>
                <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            </MapContainer>
        </div>
    );
};