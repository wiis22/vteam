import React, { useState, useEffect } from 'react';
import authModel from '../models/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    document.title = 'Login';

    //changes route when mounting
    useEffect(() => {
        navigate("/login");
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();

        const result = await authModel.login(email, password);
        if (result.error) {
            setErrorMessage("Skrivit fel lösenord eller användarnamn.");
            return;
        }

        alert("Login lyckades!");

        //admin goes directly to admin page
        if (authModel.role === "admin") {
            navigate("/admin");
            return;
        }
        navigate("/");
        return;
    };


    return (
        <>
        <div className="dashboard">

        <h1>Logga in</h1>

        <form onSubmit={handleLogin} className='login-form'>

        <p><label>E-mail/Användarnamn: </label></p>
        <input className='input form-input'
                type="email"
                value={email}
                placeholder='Email'
                onChange={(e) => setEmail(e.target.value)}
                required
            />

        <p><label>Password: </label></p>
        <input className='input form-input'
                type="password"
                value={password}
                placeholder='******'
                onChange={(e) => setPassword(e.target.value)}
                required
            />

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <button className='green-button form-button' type="submit">
            Logga in
        </button>

        <Link to="/register" className='button form-button'>Registera ny användare</Link>
        </form>
        </div>
        </>
    );
}
