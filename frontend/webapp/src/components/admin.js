import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function Admin() {
    return (
        <>
            <h1>Admin</h1>
                <ul>
                    <li><Link to="/admin/goteborg">Göteborg</Link></li>
                    <li><Link to="/admin/harnosand">Härnösand</Link></li>
                    <li><Link to="/admin/karlshamn">Karlshamn</Link></li>
                </ul>

            <Outlet />
        </>
    );
};
