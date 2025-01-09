import React, { useState, useEffect } from "react";
import userModel from "../models/user";
import { Link } from 'react-router-dom';
import authModel from "../models/auth";
import Login from './login';

export default function AccountDetails() {
    //all user details.
    const [userDetails, setUserDetails] = useState("");
    document.title = 'Användare';

    useEffect(() => {
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

    //Check if logged in.
    if(!authModel.token) {
        return (
            <Login  />
        );
    }

    return (
        <div>
            <h1>Användar-uppgifter</h1>

            <p>Namn: {userDetails.name}</p>

            <p>Användarnamn: {userDetails.email}</p>

            <p>Status: {userDetails.role}</p>

            <p>Nuvarande saldo: {userDetails.balance}</p>

            <Link to="/change-password">Ändra lösenord</Link>
        </div>
    );
};

