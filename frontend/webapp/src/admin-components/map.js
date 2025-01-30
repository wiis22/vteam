import React, { useState, useEffect} from "react";
import { useLocation, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polygon, LayerGroup, Circle} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import adminModel from "../models/admin-models";
import L from 'leaflet';
import bikeIcon from '../style/images/micro-scooter.png';
import redBikeIcon from '../style/images/red-micro-scooter.png';

export default function Map() {
    const location = useLocation();
    const [city, setCity] = useState(null);
    // const [borders, setBorders] = useState(null);
    const [bikes, setBikes] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const cityData = await fetchCity(location.state.cityId);
            const bikeData = await fetchBikes(location.state.cityName);
            setCity(cityData);
            setBikes(bikeData);
        };

        loadData();
    }, [location.state.cityId, location.state.cityName]);
    // console.log(city)
    // console.log(bikes)

    const handleClickUpdate = async () => {
        const newBikesData = await fetchBikes(location.state.cityName);
        setBikes(newBikesData); // Hämta ny cykeldata
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

            {city ? (
                renderMap(city, bikes, location.state.cityName)
            ) : (
                <p>Laddar karta över staden...</p>
            )}
        </div>
    );
};

//Fetch city and get data
const fetchCity = async (cityId) => {
    // console.log(location.state.cityId)
    try {
        const cityData = await adminModel.getOneCity(cityId);
        // setCity({
        //     borders: cityData.borders,
        //     chargingStations: cityData.chargingStations,
        //     geolocation: cityData.geolocation,
        //     parkingZones: cityData.parkingZones,
        // });
        let borderArray = ''
        if (cityData.borders) {
            borderArray = cityData.borders.map(border => [border[1], border[0]]);
            // setBorders(borderArray);
        }
        // console.log(cityData);
        return ({
            borders: borderArray,
            chargingStations: cityData.chargingStations,
            geolocation: cityData.geolocation,
            parkingZones: cityData.parkingZones,
        })
    } catch (error) {
        console.error("Error fetching city data:", error);
    }
};

//Fetch bikes and get data
const fetchBikes = async (cityName) => {
    try {
        const bikesData = await adminModel.getBikes(cityName);
        // setBikes(bikesData);
        return bikesData
        // console.log(bikesData)
    } catch (error) {
        console.error("Error fetching city data:", error);
    }
};

//render charging zones
const renderChargingStations = (chargingStations) => {
    // if(!chargingStations){
    //     return;
    // }
    const chargingStationsArray = [];
    const yellowOptions = { color: 'yellow' };
    chargingStations.forEach((element) => {
        chargingStationsArray.push(
            <LayerGroup>
            <Circle
                center={[element.latitude, element.longitude]}
                pathOptions={yellowOptions}
                radius={30}
                />
            </LayerGroup>
        );
    });
    return chargingStationsArray;
};

//render charging zones
const renderParkingZones = (parkingZones) => {
    // if(parkingZones){
    //     return;
    // }
    const parkingZonesArray = [];
    const blueOptions = { color: 'blue' };
    parkingZones.forEach((element) => {
        parkingZonesArray.push(
            <LayerGroup>
            <Circle
                center={[element.latitude, element.longitude]}
                pathOptions={blueOptions}
                radius={50}
                />
            </LayerGroup>
        );
    });
    return parkingZonesArray;
};

//render bikes zones
const renderBikes = (bikes, cityName) => {
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

    // if (!bikes || bikes.length === 0) {
    //     return null;
    // }
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
            <Link to={`/admin/${ cityName }/single-bike`} state={{
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
const renderMap = (city, bikes, cityName) => {
    //setting up colors for border
    const greenOptions = { color: 'green' };

    return (
        <MapContainer className="map" center={[city.geolocation.latitude, city.geolocation.longitude]} zoom={13} scrollWheelZoom={true}>

        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* draw borders in city */}
        <Polygon pathOptions={greenOptions} positions={city.borders} />
        {renderChargingStations(city.chargingStations)}
        <MarkerClusterGroup>
            {renderBikes(bikes, cityName)}
        </MarkerClusterGroup>
        {renderParkingZones(city.parkingZones)}
        </MapContainer>
    );
};