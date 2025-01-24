import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import authModel from '../models/auth';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    document.title = 'Register';

    const handleRegister = async (event) => {
        event.preventDefault();

        if (password !== password2) {
            setErrorMessage("Lösenorden matchar inte!");
            return;
        }

        const result = await authModel.register(firstName, lastName, email, password);

        if (result !== "ok") {
            setErrorMessage("Registrering misslyckades. Försök igen.");
        } else {//If loggin succeed change route to homepage.
            setErrorMessage('');
            alert("Registrering lyckades!");
            navigate("/");
        }
    }

    return (
        <>
        <div className="dashboard">

        <h1>Registrera ny användare</h1>

        <form onSubmit={handleRegister}>
        <p><label>Namn: </label></p>
        <input className='textarea'
                type="text"
                value={firstName}
                placeholder='Ange namn'
                onChange={(e) => setFirstName(e.target.value)}
                required
            />

        <p><label>Efternamn: </label></p>
        <input className='textarea'
                type="text"
                value={lastName}
                placeholder='Ange efternamn'
                onChange={(e) => setLastName(e.target.value)}
                required
            />

        <p><label>E-mail: </label></p>
        <input className='textarea'
                type="email"
                value={email}
                placeholder='Email'
                onChange={(e) => setEmail(e.target.value)}
                // readOnly={!!email}
                required
            />

        <p><label>Password: </label></p>
        <input className='textarea'
                type="password"
                value={password}
                placeholder='******'
                onChange={(e) => setPassword(e.target.value)}
                required
            />

        <p><label>Confirm Password: </label></p>
        <input className='textarea'
                type="password"
                value={password2}
                placeholder='******'
                onChange={(e) => setPassword2(e.target.value)}
                required
            />

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <p>
        <button className='button green-button' type="submit">
            Register
        </button>
        </p>

        </form>
        </div>
        </>
    );
};
