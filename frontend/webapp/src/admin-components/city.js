import React, { useState, useEffect } from "react";
import { useParams, Link, Outlet } from "react-router-dom";

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
        <div className="citys">

            <p>
                <Link to={`/admin/${ city }/users`}>Sök användare</Link> |{" "}
                <Link to={`/admin/${ city }/map`} state={{
                    cityId: `${ cityId }`,
                    cityName: `${ cityName }` 
                    }}>Map</Link> |{" "}
                <Link to={`/admin/${ city }/list`} state={{
                    cityName: `${ cityName }` 
                    }}>Lista med cyklar</Link>
            </p>

            <Outlet />
        </div>
    );
};
