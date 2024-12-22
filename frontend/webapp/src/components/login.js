import React, { useState } from 'react'
import authModel from '../models/auth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();

        const result = await authModel.login(email, password);

        return result;
    }


    return (
        <div className='login'>

        <h1>Logga in</h1>

            <form onSubmit={handleLogin}>

                <div>
                <p><label>E-mail/Användarnamn: </label></p>
                <input className='textarea'
                        type="email"
                        value={email}
                        placeholder='Email'
                        onChange={(e) => setEmail(e.target.value)}
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

                <button className='button green-button' type="submit">
                    Register
                </button>
            </form>
        </div>
    )
}
