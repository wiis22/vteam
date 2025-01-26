import React, { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polygon, LayerGroup, Circle} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import adminModel from "../models/admin-models";
import L from 'leaflet';
// import icon from 'leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';
// import redMarker from '../style/images/marker-icon.png';
import bikeIcon from '../style/images/micro-scooter.png';
import redBikeIcon from '../style/images/red-micro-scooter.png';

export default function Map() {
    const location = useLocation();
    const [city, setCity] = useState(null);
    const [borders, setBorders] = useState(null);
    const [bikes, setBikes] = useState(null);

    let bikeMarker = L.icon({
        iconUrl: bikeIcon,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
    });

    let lowBatteryBike = L.icon({
        iconUrl: redBikeIcon,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
    });


    // L.Marker.prototype.options.icon = DefaultIcon;

    //Fetch city and get data
    const fetchCity = useCallback(async () => {
        // console.log(location.state.cityId)
        try {
            const cityData = await adminModel.getOneCity(location.state.cityId);
            setCity({
                borders: cityData.borders,
                chargingStations: cityData.chargingStations,
                geolocation: cityData.geolocation,
                parkingZones: cityData.parkingZones,
            });
            if (cityData.borders) {
                const borderArray = cityData.borders.map(border => [border[1], border[0]]);
                setBorders(borderArray);
            }
            console.log(cityData);
        } catch (error) {
            console.error("Error fetching city data:", error);
        }
    }, [location.state]);

    //Fetch bikes and get data
    const fetchBikes = useCallback(async () => {
        try {
            const bikesData = await adminModel.getBikes(location.state.cityName);
            setBikes(bikesData);
            // console.log(bikesData)
        } catch (error) {
            console.error("Error fetching city data:", error);
        }
    }, [location.state]);

    useEffect(() => {
        //fetching data
        fetchBikes();
        fetchCity();
    }, [fetchCity, fetchBikes]);

    //render charging zones
    const renderChargingStations = () => {
        if(!city.chargingStations){
            return;
        }
        const chargingStations = [];
        const yellowOptions = { color: 'yellow' };
        city.chargingStations.forEach((element) => {
            chargingStations.push(
                <LayerGroup>
                <Circle
                    center={[element.latitude, element.longitude]}
                    pathOptions={yellowOptions}
                    radius={30}
                    />
                </LayerGroup>
            );
        });
        return chargingStations;
    };

    //render charging zones
    const renderParkingZones = () => {
        if(!city.parkingZones){
            return;
        }
        const parkingZones = [];
        const blueOptions = { color: 'blue' };
        city.parkingZones.forEach((element) => {
            parkingZones.push(
                <LayerGroup>
                <Circle
                    center={[element.latitude, element.longitude]}
                    pathOptions={blueOptions}
                    radius={50}
                    />
                </LayerGroup>
            );
        });
        return parkingZones;
    };

    //render bikes zones
    const renderBikes = () => {

        if (!bikes || bikes.length === 0) {
            return null;
        }
        //Button that toggles bike on and off.
        const  handleClick = async (bike) => {
            if (bike.operational !== true) {
                const result = await adminModel.changeOperational(true, bike._id);
                alert("Operational ändrades till true!");
                console.log(result);
                return;
            }
            const result = await adminModel.changeOperational(false, bike._id);
            alert("Operational ändrades till false!");
            console.log(result);
            return;
        };
        //Put all bikes markers in a array
        const allBikes = [];
        bikes.forEach((bike) => {
            const bikeCharging = bike.charging ? "Ja" : "Nej";
            const bikeAvailable = bike.available ? "Ja" : "Nej";
            const bikeOperational = bike.operational ? "Ja" : "Nej";
            //Add marker and popup to bikes array
            allBikes.push(
            <Marker 
            position={[bike.position.latitude, bike.position.longitude]}
            icon={bike.batteryPercentage <= 10 ? lowBatteryBike: bikeMarker}
            >
                <Popup>
                <p>ID: {bike._id}</p>
                Charging: {bikeCharging}<br/>
                Location: {bike.location}<br/>
                Available: {bikeAvailable}<br/>
                Operational: {bikeOperational}<br/>
                Battery percent: {`${bike.batteryPercentage}`}%<br/>

                <button onClick={() => handleClick(bike)}>
                    Change status on operational
                </button><br/>
                <Link to={`/admin/${ location.state.cityName }/single-bike`} state={{
                    bikeId: `${ bike._id }` 
                    }} className="small-button" >Inställningar & Historik
                </Link>
                </Popup>
            </Marker>
            );
        });
        return allBikes;
    };

    //render map
    const renderMap = () => {
        //setting up colors for border
        const greenOptions = { color: 'green' };

        return (
            <MapContainer className="map" center={[city.geolocation.latitude, city.geolocation.longitude]} zoom={13} scrollWheelZoom={true}>

            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* draw borders in city */}
            <Polygon pathOptions={greenOptions} positions={borders} />
            {renderChargingStations()}
            <MarkerClusterGroup>
                {renderBikes()}
            </MarkerClusterGroup>
            {renderParkingZones()}
            </MapContainer>
        );
    };

    const handleClickUpdate = async () => {
        await fetchBikes(); // Hämta ny cykeldata
        alert("Cykelpositioner har uppdaterats!");
    };

    return (
        <div className="dashboard">
            <h2>Vy över {location.state.cityName}</h2>
            <p>Grönt-område: hela användningsområdet</p>
            <p>Gula cirklar: ladd-zoner</p>
            <p>Blå cirklar: parkerings-zoner</p>
            <p>Cyklar med låg batterinivå visas som röda cyklar.</p>

            <p>
            <button className="button" onClick={handleClickUpdate}>
                Uppdatera cykel positioner
            </button>
            </p>

            {city && borders ? (
                renderMap()
            ) : (
                <p>Laddar karta över staden...</p>
            )}
        </div>
    );
};
