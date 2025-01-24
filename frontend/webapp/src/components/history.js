import React from "react";
import authModel from "../models/auth";
import Login from './login';
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
            <h1>Historik</h1>
        </div>
        </>
    );
};

