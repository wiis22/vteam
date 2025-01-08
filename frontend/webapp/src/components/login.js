import React, { useState } from 'react'
import authModel from '../models/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    document.title = 'Login';

    const handleLogin = async (event) => {
        event.preventDefault();

        const result = await authModel.login(email, password);
        if (result === "not ok") {
            setErrorMessage("Skrivit fel lösenord eller användarnamn.");
        }
        navigate("/");
        return console.log(result);
    }


    return (
        <div className='login'>

        <h1>Logga in</h1>

            <form onSubmit={handleLogin}>

                <p><label>E-mail/Användarnamn: </label></p>
                <input className='textarea'
                        type="email"
                        value={email}
                        placeholder='Email'
                        onChange={(e) => setEmail(e.target.value)}
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

                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <button className='button green-button' type="submit">
                    Log in
                </button>
            </form>
            <Link to="/register">Registera ny användare</Link>
        </div>
    )
}
