import React, {useState} from "react";

export default function Footer() {
    const [message, setMessage] = useState('');

    const handleClick = () => {
        if (message.length === 0) {
            setMessage("Viktor, Wiktor, Joel och Lucas har skapat detta projektet!");
            return
        }
        setMessage('');
        return
    }

    return (
        <>
        <div className="footer">
            <button onClick={handleClick}>
                Om oss
            </button>
            {message}
        </div>
        </>
    );
};
