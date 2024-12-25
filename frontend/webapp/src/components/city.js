import React from "react";
import { useParams, Link, Outlet } from "react-router-dom";

export default function City() {
    const { city } = useParams();

    return (
        <>

            <p>
                <Link to={`/admin/${ city }/users`} state={{ city: `${ city }` }}>Användare</Link> |{" "}
                <Link to={`/admin/${ city }/map`} state={{ city: `${ city }` }}>Map</Link> |{" "}
                <Link to={`/admin/${ city }/list`} state={{ city: `${ city }` }}>Lista med cyklar</Link>
            </p>

            <Outlet />
        </>
    );
};
