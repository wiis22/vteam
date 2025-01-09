import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import authModel from "../models/auth";

export default function Navbar() {
    const [authToken, setAuthToken] = useState('');

    useEffect(() => {
        setAuthToken(authModel.token);
    }, []);

    return (
        <div>
            <nav className="navbar">
                <Link to="/">Home</Link>
                <Link to="/balance">Balance</Link>
                <Link to="/details">Account details</Link>
                <Link to="/history">Ride history</Link>
                <Link to="/admin">Admin</Link>
                <Link to="/logout">Log out</Link>
            </nav>

            <Outlet />
        </div>
    );
};
