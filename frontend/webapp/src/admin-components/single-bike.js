import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import cityModel from "../models/city-models";

export default function SingleBike() {
    const location = useLocation();
    const [bikeDetails, setBikeDetails] = useState("");
    document.title = 'Cykel inställningar & historik';

    //fetch and sets all bike details.
    const fetchBike = async () => {
        try {
            const bikeData = await cityModel.getOneBike(location.state.bikeId);
            setBikeDetails({
                id: bikeData._id,
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

    useEffect(() => {
        fetchBike();
    }, [location.state]);

    return (
        <div>
            <h1>Cykel information och settings</h1>

            <p>Id: {bikeDetails.id}</p>

            <p>På laddning: {bikeDetails.charging ? "Ja": "Nej"}</p>

            <p>Batteri: {bikeDetails.batteryPercentage}%</p>

            <p>Tillgänglig: {bikeDetails.available ? "Ja": "Nej"}</p>

            <p>Operativ: {bikeDetails.operational ? "Ja": "Nej"}</p>

            <h2>Cykel historik</h2>
        </div>
    );
};

