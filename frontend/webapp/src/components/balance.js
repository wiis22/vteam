import React, { useState, useEffect } from "react";
import authModel from '../models/auth';
import userModel from "../models/user";
import Login from './login';

export default function Balance() {
    const [balance, setBalance] = useState(authModel.balance);
    const [addBalance, setAddBalance] = useState(0);

    document.title = 'Saldo';
    //Changes authModel.balance when balance changes.
    useEffect(() => {
        authModel.balance = balance;
    }, [balance]);

    //Check if logged in.
    if(!authModel.token) {
        return (
            <Login  />
        );
    }

    const handleAddBalance = async (event) => {
        event.preventDefault();
        //new balance
        const updatedBalance = balance + addBalance;

        //update balance
        setBalance(updatedBalance);

        const newBalance = {
            balance: updatedBalance
        };
        //new balance put request to database 
        const result = await userModel.updateUser(newBalance);
        alert(`${addBalance} Har lagts till i ditt saldo!`);
        setAddBalance(0)
        return console.log(result);
    }

    return (
        <div>
            <h1>Saldo</h1>

            <h2>Nuvarande saldo: {balance}</h2>
            
            <form onSubmit={handleAddBalance}>
                <label>Utöka saldo: </label>
                <input className='textarea'
                    type="number" 
                    min="1" 
                    max="100000" 
                    step="1"
                    onChange={(e) => setAddBalance(parseInt(e.target.value))}
                    />
                <button type="submit" className="button">Lägg till</button>
            </form>
        </div>
    );
};
