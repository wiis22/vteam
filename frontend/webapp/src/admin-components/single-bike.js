import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import adminModel from "../models/city-models";

export default function SingleBike() {
    const location = useLocation();
    const [bikeDetails, setBikeDetails] = useState("");
    const [newLocation, setNewLocation] = useState("");
    document.title = 'Cykel inställningar & historik';

    useEffect(() => {
        fetchBike();
    }, [location.state]);

    //fetch and sets all bike details.
    const fetchBike = async () => {
        try {
            const bikeData = await adminModel.getOneBike(location.state.bikeId);
            setBikeDetails({
                id: bikeData._id,
                location: bikeData.location,
                charging: bikeData.charging,
                location: bikeData.location,
                available: bikeData.available,
                operational: bikeData.operational,
                batteryPercentage: bikeData.batteryPercentage
            });
        } catch (error) {
            console.error("Error fetching bike data:", error);
        }
    };

    //Button that toggles operational on and off.
    const  handleClickOperational = async (bikeId) => {
        if (bikeDetails.operational !== true) {
            const result = await adminModel.changeOperational(true, bikeId);
            alert("Operational ändrades till true!");
            console.log(result)
            fetchBike();
            return
        }
        const result = await adminModel.changeOperational(false, bikeId);
        alert("Operational ändrades till false!");
        console.log(result);
        fetchBike();
        return
    };

    //Button that toggles available on and off.
    const  handleClickAvailable = async (bikeId) => {
        if (bikeDetails.available !== true) {
            const result = await adminModel.changeAvailable(true, bikeId);
            alert("Available ändrades till true!");
            console.log(result);
            fetchBike();
            return
        }
        const result = await adminModel.changeAvailable(false, bikeId);
        alert("Available ändrades till false!");
        console.log(result);
        fetchBike();
        return
    };

    //handle location submit
    const handleLocationSubmit = async (event) => {
        event.preventDefault();

        //put request to change location status
        const result = await adminModel.changeLocation(newLocation, bikeDetails.id);

        //Check if request "ok"
        if (!result.ok) {
            alert("Plats ändringen lyckades inte");
            return
        }
        alert(`Plats har nu ändrats till ${newLocation}`);
        setNewLocation("");
        fetchBike();
    }

    return (
        <div>
            <h2>Cykel information och settings</h2>

            <p>Id: {bikeDetails.id}</p>

            <p>Plats: {bikeDetails.location}</p>

            <form onSubmit={handleLocationSubmit}>
                <input className='textarea'
                        type="text"
                        value={newLocation}
                        placeholder='Ange ny plats'
                        onChange={(e) => setNewLocation(e.target.value)}
                        required
                    />
                <input type="submit" value="Ändra"/>
            </form>

            <p>På laddning: {bikeDetails.charging ? "Ja": "Nej"}</p>

            <p>Batteri: {bikeDetails.batteryPercentage}%</p>

            <p>
                Tillgänglig: {bikeDetails.available ? "Ja": "Nej"}
            </p>
            <button onClick={() => handleClickAvailable(bikeDetails.id)}>
                    Ändra tillgänglig status
            </button>

            <p>
                Operativ: {bikeDetails.operational ? "Ja": "Nej"}
            </p>
            <button onClick={() => handleClickOperational(bikeDetails.id)}>
                    Ändra operativ status
            </button>

            <h2>Cykel historik</h2>
        </div>
    );
};

