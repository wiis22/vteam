import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function Navbar() {
    return (
        <>
            <nav className="navbar">
                <Link to="/">Home</Link> |{" "}
                <Link to="/balance">Balance</Link> |{" "}
                <Link to="/details">Account details</Link> |{" "}
                <Link to="/history">Ride history</Link> |{" "}
                <Link to="/admin">Admin</Link>
            </nav>

            <Outlet />
        </>
    );
};
