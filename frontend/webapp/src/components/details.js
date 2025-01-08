import React, { useState, useEffect } from "react";
import userModel from "../models/user";
import { Link } from 'react-router-dom';

export default function AccountDetails() {
    //all user details.
    const [name, setName] = useState(null);
    const [account, setAccount] = useState(null);
    const [role, setRole] = useState(null);
    const [balance, setBalance] = useState(null);
    document.title = 'Användare';

    useEffect(() => {
        //fetch and sets all userdetails.
        const fetchUser = async () => {
            try {
                const userData = await userModel.getOneUser();
                setName(`${userData.firstName} ${userData.lastName}`);
                setAccount(`${userData.email}`);
                setRole(`${userData.role}`);
                setBalance(`${userData.balance}`);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, []);

    return (
        <div>
            <h1>Användar-uppgifter</h1>

            <p>Namn: {name}</p>

            <p>Användarnamn: {account}</p>

            <p>Status: {role}</p>

            <p>Nuvarande saldo: {balance}</p>

            <Link to="/change-password">Ändra lösenord</Link>
        </div>
    );
};

