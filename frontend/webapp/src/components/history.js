import React from "react";
import authModel from "../models/auth";
import Login from './login';

export default function History() {
    if(!authModel.token) {
        return (
            <Login  />
        );
    }

    return (
        <h1>History</h1>
    );
};

