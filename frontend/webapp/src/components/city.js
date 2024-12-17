import React from "react";
import { useParams, Link, Outlet } from "react-router-dom";

export default function City() {
    const { city } = useParams();

    return (
        <>

            <p>
                <Link to={`/admin/${ city }/users`}>Användare</Link> |{" "}
                <Link to={`/admin/${ city }/map`}>Map</Link> |{" "}
                <Link to={`/admin/${ city }/list`}>Lista med cyklar</Link>
            </p>

            <Outlet />
        </>
    );
};
