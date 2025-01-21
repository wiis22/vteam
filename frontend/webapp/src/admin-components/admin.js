import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import authModel from "../models/auth"

export default function Admin() {
    const [isHidden, setIsHidden] = useState(false);
    const [toggleButton, setToggleButton] = useState(false);
    const accessCheck = authModel.roleAccess("admin");
    document.title = 'Admin';

    useEffect(() => {
        setIsHidden(false)
        // checks access
        if (accessCheck) {
            return <div>{accessCheck}</div>;
        }
    }, []);

    const handleClick = () => {
        setIsHidden(!isHidden);
        setToggleButton(!toggleButton)
    };

    return (
        <div className="dashboard">
            <Link to="/">Till användar-sida</Link> |{" "}
            <Link to="/logout">Logga ut</Link>
            <h1>Admin sida</h1>

            <div style={{ display: isHidden ? "none" : "" }}>
            <ul>
                <li><Link to="/admin/goteborg" onClick={handleClick}>Göteborg</Link></li>
                <li><Link to="/admin/harnosand" onClick={handleClick}>Härnösand</Link></li>
                <li><Link to="/admin/karlskrona" onClick={handleClick}>Karlskrona</Link></li>
            </ul>
            </div>
            {toggleButton ? (
                <button onClick={handleClick}>
                    Ändra stad
                </button>
            ): ''}

            <Outlet />
        </div>
    );
};
