import React from 'react'
import authModel from '../models/auth';
import { useNavigate } from 'react-router-dom';

//resets session and redirect to home page
export default function Logout() {
    const navigate = useNavigate();

    const handleLogout = (event) => {
        event.preventDefault();

        authModel.resetSession();
        navigate("/");
    }


    return (
        handleLogout
    );
};
