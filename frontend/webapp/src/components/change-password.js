import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import userModel from '../models/user';
import Navbar from "./navbar";
import authModel from '../models/auth'

export default function ChangePassword() {
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const accessCheck = authModel.roleAccess("user");
    document.title = "Ändra lösenord";
    const navigate = useNavigate();

    // checks access
    if (accessCheck) {
        return <div>{accessCheck}</div>;
    }

    const handleChangePassword = async (event) => {
        event.preventDefault();

        if (password !== password2) {
            setErrorMessage("Lösenorden matchar inte!");
            return;
        }

        const newPassword = {
            newPassword: password
        };

        const result = await userModel.changeUserPassword(newPassword);

        if (result.status < 300) {
            setErrorMessage('');
            alert("Lösenordet har ändrats!");
            navigate("/details");
        };

        setErrorMessage("Registrering misslyckades. Försök igen.");
    }

    return (
        <>
        <Navbar />
        <div className="dashboard">
        <h1>Ändra lösenord</h1>

            <form onSubmit={handleChangePassword}>

                <p><label>Lösenord: </label></p>
                <input className='textarea'
                        type="password"
                        value={password}
                        placeholder='******'
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                <p><label>Upprepa lösenordet: </label></p>
                <input className='textarea'
                        type="password"
                        value={password2}
                        placeholder='******'
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                    />

                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                <p>
                <button className='green-button' type="submit">
                    Ändra lösenordet
                </button>
                </p>
            </form>
        </div>
        </>
    );
};
