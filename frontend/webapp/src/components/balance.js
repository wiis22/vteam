import React, { useState, useEffect } from "react";
import authModel from '../models/auth';
import userModel from "../models/user";
import Navbar from "./navbar";
import Header from "./header";
import Footer from "./footer";

export default function Balance() {
    const [balance, setBalance] = useState(authModel.balance);
    const [addBalance, setAddBalance] = useState(0);
    const accessCheck = authModel.roleAccess("user");
    document.title = 'Saldo';

    //Checks access
    useEffect(() => {
        // checks access
        if (accessCheck) {
            return <div>{accessCheck}</div>;
        }
    }, []);

    //Changes authModel.balance when balance changes.
    useEffect(() => {
        authModel.balance = balance;
    }, [balance]);

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
        setAddBalance(0);
        return console.log(result);
    };

    return (
        <>
        <Header />
        <Navbar />
        <div className="dashboard">
            <h1>Saldo</h1>

            <h2>Nuvarande saldo: {balance}</h2>
            
            <form onSubmit={handleAddBalance}>
                <label>Utöka saldo: </label>
                <input className='input'
                    type="number" 
                    min="1" 
                    max="100000" 
                    step="1"
                    onChange={(e) => setAddBalance(parseInt(e.target.value))}
                    />
                <button type="submit" className="button">Lägg till</button>
            </form>
        </div>
        <Footer />
        </>
    );
};
