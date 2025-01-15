import React, { useState, useEffect } from "react";
import { useParams, Link, Outlet } from "react-router-dom";

export default function City() {
    const [cityId, setCityId] = useState('');
    const [cityName, setCityName] = useState('');
    const { city } = useParams();

    useEffect(() => {
        if (city === "goteborg") {
            setCityId('676592ac888b2f6f00866c55');
            setCityName('Göteborg');
        } else if (city === "karlskrona") {
            setCityId('676592ac888b2f6f00866c56');
            setCityName('Karlskrona');
        } else if (city === "harnosand") {
            setCityId('676592ac888b2f6f00866c57');
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
