import React, { useState, useEffect } from "react";
import authModel from '../models/auth';
import userModel from "../models/user";

export default function Balance() {
    const [balance, setBalance] = useState(authModel.balance);
    document.title = 'Saldo';
    //Changes authModel.balance when balance changes.
    useEffect(() => {
        authModel.balance = balance;
    }, [balance]);

    const handleAddBalance = async (event) => {
        event.preventDefault();

        const newBalance = {
            balance: balance
        };
        //new balance put request to database 
        const result = await userModel.updateUser(newBalance);

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
                    onChange={(e) => setBalance(balance + e.target.value)}
                    />
                <button type="submit" className="button">Lägg till</button>
            </form>
        </div>
    );
};
