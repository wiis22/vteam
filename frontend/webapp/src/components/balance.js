import React from "react";

export default function Balance() {
    return (
        <>
            <h1>Saldo</h1>

            <h2>Nuvarande saldo: </h2>
            
            <form>
                <label>Utöka saldo: </label>
                <input type="number" min="1" max="100000" step="1" />
                <button type="submit" className="button">Lägg till</button>
            </form>
        </>
    );
};
