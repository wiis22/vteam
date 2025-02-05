import React from "react";
import authModel from '../models/auth';
import Hamburger from "../style/images/hamburger.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Header() {

    return (
        <>
        <div className="header">
            <img src={Hamburger} alt="Goteburgare" />

            <p>Inloggad som: {authModel.username}</p>

            <div className="icon" >
            <Link to="/logout">
                <FontAwesomeIcon icon={faArrowRightFromBracket} size="2x" className="one-icon" />
            </Link>
            </div>
        </div>
        </>
    );
};
