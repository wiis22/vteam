import React from "react";
import { Outlet, Link } from "react-router-dom";
import authModel from "../models/auth"

export default function Admin() {
    const accessCheck = authModel.roleAccess("admin");
    document.title = 'Admin';

    // checks access
    if (accessCheck) {
        return <div>{accessCheck}</div>;
    }

    return (
        <div className="chooseCity">
            <Link to="/">Till användar-sida</Link> |{" "}
            <Link to="/logout">Logga ut</Link>
            <h1>Admin sida</h1>
                <ul>
                    <li><Link to="/admin/goteborg">Göteborg</Link></li>
                    <li><Link to="/admin/harnosand">Härnösand</Link></li>
                    <li><Link to="/admin/karlskrona">Karlskrona</Link></li>
                </ul>

            <Outlet />
        </div>
    );
};
