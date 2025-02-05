import React from "react";
import authModel from "../models/auth";
import Rides from "../admin-components/rides";
import Navbar from "./navbar";
import Header from "./header"

export default function History() {
    const accessCheck = authModel.roleAccess("user");
    document.title = 'Historik & kvitton';

    // checks access
    if (accessCheck) {
        return <div>{accessCheck}</div>;
    }

    return (
        <>
        <Header />
        <Navbar />
        <div className="dashboard">
            <h1>Historik & kvitto</h1>
            <Rides userOrBike={ 'user' } id={authModel.userId} receipt={true} />
        </div>
        </>
    );
};
