import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SafeArea from 'react-safe-area-component'
import "../components/start.css";

export const Start = () => {
    const navigate = useNavigate();

    const start = async () => {
        navigate("/login");
    };

    return (
        <SafeArea top bottom>
            <div class="mainDiv">
                <h1 class="heading">PollThru</h1>
                <p class="descript">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <button onClick={start} class="btn"> Start!</button>
            </div>
        </SafeArea>
    );
};
