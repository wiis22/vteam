import React from "react";
import { Link, Outlet } from "react-router-dom";
import authModel from "../models/auth";

export default function Navbar() {
    let logout = ""
    
    //Shows logout link if user is logged in.
    if (authModel.token) {
        logout = <Link to="/logout">Log out</Link>
    }
    
    return (
        <>
            <nav className="navbar">
                <Link to="/">Home</Link> |{" "}
                <Link to="/balance">Balance</Link> |{" "}
                <Link to="/details">Account details</Link> |{" "}
                <Link to="/history">Ride history</Link> |{" "}
                <Link to="/admin">Admin</Link>
                {logout}
            </nav>

            <Outlet />
        </>
    );
};
