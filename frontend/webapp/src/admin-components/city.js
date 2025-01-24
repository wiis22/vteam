import React, { useState, useEffect } from "react";
import { useParams, NavLink, Outlet } from "react-router-dom";
// import adminModel from "../models/admin-models";

export default function City() {
    const [cityId, setCityId] = useState('');
    const [cityName, setCityName] = useState('');
    // const [cities, setCities] = useState([])
    const { city } = useParams();

    useEffect(() => {
        if (city === "goteborg") {
            setCityId('6790fc1e8ed7b6439b3fc430');
            setCityName('Göteborg');
            // console.log(cities[0]._id)
        } else if (city === "karlskrona") {
            setCityId('6790fc1e8ed7b6439b3fc431');
            setCityName('Karlskrona');
        } else if (city === "harnosand") {
            setCityId('6790fc1e8ed7b6439b3fc432');
            setCityName('Härnösand');
        }
    }, [city]);

    //Fetch cities and get data
    // const fetchCities = async () => {
    //     try {
    //         const citiesData = await adminModel.getCities();
    //         setCities(citiesData);
    //         // console.log(citiesData)
    //     } catch (error) {
    //         console.error("Error fetching cities data:", error);
    //     }
    // };

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
