import React from "react";
import authModel from "../models/auth";
import Rides from "../admin-components/rides";
import Navbar from "./navbar";

export default function History() {
    const accessCheck = authModel.roleAccess("user");
    document.title = 'Historik & kvitton'

    // checks access
    if (accessCheck) {
        return <div>{accessCheck}</div>;
    }

    return (
        <>
        <Navbar />
        <div className="dashboard">
            <h1>Historik & kvitto</h1>
            <Rides userOrBike={ 'user' } id={authModel.userId} receipt={true} />
        </div>
        </>
    );
};
