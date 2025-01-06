import React, { useState } from "react";
import authModel from '../models/auth';

export default function Balance() {
    const [balance, setBalance] = useState(`${authModel.balance}`);

    function addBalance() {
        
    }
    return (
        <div>
            <h1>Saldo</h1>

            <h2>Nuvarande saldo: {balance}</h2>
            
            <form onSubmit={addBalance}>
                <label>Utöka saldo: </label>
                <input type="number" min="1" max="100000" step="1" />
                <button type="submit" className="button">Lägg till</button>
            </form>
        </div>
    );
};
