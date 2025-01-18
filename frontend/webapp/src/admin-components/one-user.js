import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import cityModel from "../models/city-models";

const OneUser = ({ user }) => {
    const [buttons, setButtons] = useState(null);
    const [userData, setUserData] = useState(user);

    const changeButtonsFunction = () => {
        //Checks user status and sets buttons according
        if (userData.role === "banned") {
            setButtons(
                <div>
                    <button onClick={() => handleRollChange('user', userData._id)}>
                        User
                    </button>

                    <button onClick={() => handleRollChange('admin', userData._id)}>
                        Admin
                    </button>
                </div>
            );
            return;
        }

        if (userData.role === "admin") {
            setButtons(
                <div>
                    <button onClick={() => handleRollChange('banned', userData._id)}>
                        Bannad
                    </button>

                    <button onClick={() => handleRollChange('user', userData._id)}>
                        User
                    </button>
                </div>
            );
            return;
        }

        setButtons(
            <div>
                <button onClick={() => handleRollChange('banned', userData._id)}>
                    Bannad
                </button>

                <button onClick={() => handleRollChange('admin', userData._id)}>
                    Admin
                </button>
            </div>
        );
    }

    const handleRollChange = async (setNewRoll, userId) => {

        //put request to change location status
        const result = await cityModel.updateUserRole(setNewRoll, userId);

        //Check if request "ok"
        if (!result.ok) {
            alert(`Användar status ändrades ej`);
            return
        }
        alert(`Användar status har ändrats till ${setNewRoll}`);
        setUserData({
            ...userData,
            role: setNewRoll
        })
        setButtons(null)
    }

    const handleClick = () => {

        //toggle off
        if (buttons) {
            setButtons(null)
            return
        }

        //Checks user status and sets buttons according
        changeButtonsFunction();
    };

    return (
        <div className="user-list">
            <p>Användare/E-mail: {userData.email}</p>
            <p>Namn: {userData.firstName} {userData.lastName}</p>
            <p>Status: {userData.role}</p>

            <p>
                <button onClick={handleClick}>
                    Ändra status
                </button>
            </p>

            {buttons}
        </div>
    );
};

export default OneUser;
