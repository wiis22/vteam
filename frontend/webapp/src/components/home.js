import React from 'react'
import authModel from '../models/auth';
import Login from './login';

export default function Home() {
    //Login component if not logged in.
    if(!authModel.username) {
        return (
            <Login  />
        );
    }
    return (
        <div>
            <h1>Home page</h1>
            <p>Välkommen tillbaka {authModel.username}</p>
        </div>
    );
};

