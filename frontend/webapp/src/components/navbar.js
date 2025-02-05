import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import authModel from "../models/auth";

export default function Navbar() {
    const [adminLink, setAdminLink] = useState('');
    // const [authToken, setAuthToken] = useState('');

    // useEffect(() => {
    //     setAuthToken(authModel.token);
    // }, []);
    useEffect(() => {
        if (authModel.role === "admin") {
            setAdminLink(<NavLink to="/admin">Admin</NavLink>);
        }
    }, []);

    return (
        <div>
            <nav className="navbar">
                <NavLink to="/" className={({ isActive }) => (isActive ? "active" : undefined)}>Hem</NavLink>
                <NavLink to="/balance" className={({ isActive }) => (isActive ? "active" : undefined)}>Saldo</NavLink>
                <NavLink to="/details" className={({ isActive }) => (isActive ? "active" : undefined)}>Användare</NavLink>
                <NavLink to="/history" className={({ isActive }) => (isActive ? "active" : undefined)}>Historik & kvitton</NavLink>
                {adminLink}
            </nav>

            <Outlet />
        </div>
    );
};
