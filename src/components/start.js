import { useNavigate } from 'react-router-dom';
import "../components/start.css";

export const Start = () => {
    const navigate = useNavigate();

    const start = async () => {
        navigate("/login");
    };

    return (
        <div class="mainDiv">
            <h1 class="heading">PollThru</h1>
            <p class="descript">Test your knowledge of the broader population as you guess how other user's responded to poll questions.</p>
            <button onClick={start} class="btn"> Start</button>
        </div>
    );
};
