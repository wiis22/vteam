import React, { useState, useEffect } from "react";
import { useParams, Link, Outlet } from "react-router-dom";

export default function City() {
    const [cityId, setCityId] = useState('');
    const { city } = useParams();

    useEffect(() => {
        if (city === "goteborg") {
            setCityId('676592ac888b2f6f00866c55');
        } else if (city === "karlskrona") {
            setCityId('676592ac888b2f6f00866c56');
        } else if (city === "harnosand") {
            setCityId('676592ac888b2f6f00866c57');
        }
    }, [city]);

    return (
        <div className="citys">

            <p>
                <Link to={`/admin/${ city }/users`}>Sök användare</Link> |{" "}
                <Link to={`/admin/${ city }/map`} state={{ cityId: `${ cityId }` }}>Map</Link> |{" "}
                <Link to={`/admin/${ city }/list`}>Lista med cyklar</Link>
            </p>

            <Outlet />
        </div>
    );
};
