import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import authModel from "../models/auth";

export default function Navbar() {
    const [adminLink, setAdminLink] = useState('');
    // const [authToken, setAuthToken] = useState('');

    // useEffect(() => {
    //     setAuthToken(authModel.token);
    // }, []);
    useEffect(() => {
        if (authModel.role === "admin") {
            setAdminLink(<Link to="/admin">Admin</Link>);
        }
    }, []);

    return (
        <div>
            <nav className="navbar">
                <Link to="/">Hem</Link>
                <Link to="/balance">Saldo</Link>
                <Link to="/details">Användare</Link>
                <Link to="/history">Historik & kvitton</Link>
                {adminLink}
                <Link to="/logout">Logga ut</Link>
            </nav>

            <Outlet />
        </div>
    );
};
