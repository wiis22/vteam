import React, { useState } from 'react'
import authModel from '../models/auth';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegister = async (event) => {
        event.preventDefault();

        if (password !== password2) {
            setErrorMessage("Lösenorden matchar inte!");
            return;
        }

        const result = await authModel.register(firstName, lastName, email, password, password2);

        if (result !== "ok") {
            setErrorMessage("Registrering misslyckades. Försök igen.");
        } else {
            setErrorMessage('');
            alert("Registrering lyckades!");
        }
    }

    return (
        <div className='register'>

        <h1>Registrera ny användare</h1>

            <form onSubmit={handleRegister}>
                <div>
                <p><label>Namn: </label></p>
                <input className='textarea'
                        type="text"
                        value={firstName}
                        placeholder='Ange namn'
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>

                <div>
                <p><label>Efternamn: </label></p>
                <input className='textarea'
                        type="text"
                        value={lastName}
                        placeholder='Ange efternamn'
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>

                <div>
                <p><label>E-mail: </label></p>
                <input className='textarea'
                        type="email"
                        value={email}
                        placeholder='Email'
                        onChange={(e) => setEmail(e.target.value)}
                        // readOnly={!!email}
                        required
                    />
                </div>

                <div>
                <p><label>Password: </label></p>
                <input className='textarea'
                        type="password"
                        value={password}
                        placeholder='******'
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div>
                <p><label>Confirm Password: </label></p>
                <input className='textarea'
                        type="password"
                        value={password2}
                        placeholder='******'
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                    />
                </div>

                {/* {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} */}

                <button className='button green-button' type="submit">
                    Register
                </button>
            </form>
        </div>
    );
};