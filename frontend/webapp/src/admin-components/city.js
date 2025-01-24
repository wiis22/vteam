import React, { useState, useEffect } from "react";
import { useParams, NavLink, Outlet } from "react-router-dom";

export default function City() {
    const [cityId, setCityId] = useState('');
    const [cityName, setCityName] = useState('');
    const { city } = useParams();

    useEffect(() => {
        if (city === "goteborg") {
            setCityId('6783d9507857ca45566e04fd');
            setCityName('Göteborg');
        } else if (city === "karlskrona") {
            setCityId('6783d9507857ca45566e04fe');
            setCityName('Karlskrona');
        } else if (city === "harnosand") {
            setCityId('6783d9507857ca45566e04ff');
            setCityName('Härnösand');
        }
    }, [city]);

    return (
        <div className="dashboard">

            <nav className="navbar">
                <NavLink to={`/admin/${ city }/users`} className={({ isActive }) => (isActive ? "active" : undefined)}>Administrera användare</NavLink>
                <NavLink to={`/admin/${ city }/map`} state={{
                    cityId: `${ cityId }`,
                    cityName: `${ cityName }` 
                    }} className={({ isActive }) => (isActive ? "active" : undefined)}>Map</NavLink>
                <NavLink to={`/admin/${ city }/list`} state={{
                    cityName: `${ cityName }` 
                    }} className={({ isActive }) => (isActive ? "active" : undefined)}>Lista med cyklar</NavLink>
            </nav>

            <Outlet />
        </div>
    );
};
