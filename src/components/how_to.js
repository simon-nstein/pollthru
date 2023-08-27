import Modal from "react-modal";
import { GrClose } from 'react-icons/gr';


const HowTo = ({ isOpen, onClose }) => {

    const closeButtonStyle = {
        position: "absolute",
        top: "10px",
        right: "10px",
        background: "none",
        border: "none",
        fontSize: "20px",
        cursor: "pointer",
        };

        const modalContentStyle = {
          width: "35%",
          margin: "0 auto",
        };
        
        // Add media query for screens with width below 400px
        if (window.innerWidth < 500) {
          modalContentStyle.width = "82%";
          modalContentStyle.inset = "28px 14px";
        }
        
return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={{ content: modalContentStyle }}>
      <button style={closeButtonStyle} onClick={onClose}> <GrClose /> </button>
      <h1>How to Play</h1>
      <p>1. Guess what percent of people chose an answer on yesterday's poll.</p>
      <p><b>Example</b></p>
      <p>Based on yesterday's poll, what percent of people choose Drake as the better artist than Jay-Z?</p>
      <p>2. Provide your input in the daily poll, which will be part of tomorrow's daily challenge.</p>
      <p>3. Come back tomorrow! A new challenge is released daily at midnight.</p>

    </Modal>
  );
};

export default HowTo;