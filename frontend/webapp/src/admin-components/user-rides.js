import React from "react";
import { useLocation } from "react-router-dom";
import Rides from "./rides";

export default function UserRides() {
    const location = useLocation();
    document.title = 'Användar historik'

    return (
        <>
        <div className="dashboard">
            <h1>{location.state.user}-Historik</h1>
            <Rides userOrBike={ 'user' } id={location.state.userId} receipt={false} />
        </div>
        </>
    );
};
