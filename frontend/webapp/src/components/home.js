import React from 'react';
import authModel from '../models/auth';
import Navbar from "./navbar";
import Header from "./header"

export default function Home() {
    const accessCheck = authModel.roleAccess("user");
    document.title = 'Hem';

    // checks access
    if (accessCheck) {
        return <div>{accessCheck}</div>;
    }

    return (
        <>
        <Header />
        <Navbar />
        <div className="dashboard">
            <h1>Hem</h1>
            <p>Välkommen tillbaka {authModel.username}</p>
        </div>
        </>
    );
};

