import React from "react";
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// import '../style/Map.css';

export default function Map() {

    const location = useLocation();
    const { city } = location.state || {};

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