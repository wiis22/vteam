import React, { useState, useEffect } from "react";
import userModel from "../models/user";
import { Link } from 'react-router-dom';
import authModel from "../models/auth";
import Navbar from "./navbar";
import Header from "./header"

export default function AccountDetails() {
    //all user details.
    const [userDetails, setUserDetails] = useState("");
    const accessCheck = authModel.roleAccess("user");
    document.title = 'Användare';

    useEffect(() => {
        // checks access
        if (accessCheck) {
            return <div>{accessCheck}</div>;
        }
        //fetch and sets all userdetails.
        const fetchUser = async () => {
            try {
                const userData = await userModel.getOneUser();
                setUserDetails({
                    name: `${userData.firstName} ${userData.lastName}`,
                    email: userData.email,
                    role: userData.role,
                    balance: userData.balance
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, []);

    return (
        <>
        <Header />
        <Navbar />
        <div className="dashboard">
            <h1>Användar-uppgifter</h1>

            <p>Namn: {userDetails.name}</p>

            <p>Användarnamn: {userDetails.email}</p>

            <p>Status: {userDetails.role}</p>

            <p>Nuvarande saldo: {userDetails.balance}</p>

            <Link to="/change-password" className="button">Ändra lösenord</Link>
        </div>
        </>
    );
};

