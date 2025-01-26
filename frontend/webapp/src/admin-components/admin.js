import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import authModel from "../models/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Hamburger from "../style/images/hamburger.jpg";

export default function Admin() {
    const [isHidden, setIsHidden] = useState(false);
    const [toggleButton, setToggleButton] = useState(false);
    const accessCheck = authModel.roleAccess("admin");
    document.title = 'Admin';

    useEffect(() => {
        setIsHidden(false);
    }, []);

    const handleClick = () => {
        setIsHidden(!isHidden);
        setToggleButton(!toggleButton);
    };

    // checks access
    if (accessCheck) {
        return <div>{accessCheck}</div>;
    }

    return (
        <div className="dashboard">

        <div className="admin">

        <div className="icon" >
        <Link to="/">
            <FontAwesomeIcon icon={faUser} size="2x" className="one-icon" />
        </Link>

        <Link to="/logout">
            <FontAwesomeIcon icon={faArrowRightFromBracket} size="2x" className="one-icon" />
        </Link>
        </div>

        <h1>Admin sida</h1>

        <div style={{ display: isHidden ? "none" : "" }}>

            <Link to="/admin/goteborg" className="city-button" onClick={handleClick}>
            Göteborg
            </Link>

            <Link to="/admin/harnosand" className="city-button" onClick={handleClick}>
            Härnösand
            </Link>

            <Link to="/admin/karlskrona" className="city-button" onClick={handleClick}>
            Karlskrona
            </Link>

        </div>
        {toggleButton ? (
            <button className="header-button" onClick={handleClick}>
                Ändra stad
            </button>
        ): ''}
        </div>
        <img src={Hamburger} alt="Goteburgare" className="burger" />
            <Outlet />
        </div>
    );
};
