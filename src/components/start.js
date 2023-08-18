import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import "../components/start.css";

export const Start = () => {
    const navigate = useNavigate();

    const start = async () => {
        navigate("/login");
    };

    return (
        <div class="mainDiv">
            <h1 class="heading">PollThru</h1>
            <p class="descript">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <button onClick={start} class="btn"> Start</button>
        </div>
    );
};
