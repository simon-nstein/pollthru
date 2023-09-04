import Modal from "react-modal";
import { GrClose } from 'react-icons/gr';
import myGif from '../components/sliderGIF.gif';
import { ImShare2 } from "react-icons/im";


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
          fontFamily: "Poppins"
        };

        const gifStyle = {
          width: "40%",
          display: "block",
          margin: "0 auto"
        }
        
        // Add media query for screens with width below 400px
        if (window.innerWidth < 500) {
          modalContentStyle.width = "82%";
          modalContentStyle.inset = "28px 14px";
        }

return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={{ content: modalContentStyle }}>
      <button style={closeButtonStyle} onClick={onClose}> <GrClose /> </button>
      <h1>How to Play</h1>
      <p>1. Drag the slider to guess the percentage (From 0% to 100%) of users who selected a specific answer on yesterday's poll.</p>
      <img src={myGif} alt="my-gif" style={ gifStyle }/>
      <div style={{display: "flex", alignItems: "center"}}>
        <ImShare2 size={50} color="#8848F5"/>
        <p style={{fontStyle: "italic", marginLeft: "15px"}}>Share your results and compete with you friends to see who can get the closest to the correct percentage.</p>
      </div>
      <p>2. Provide your input on a poll, and come back tomorrow to guess the percentage of users who selected a specific answer.</p>
    </Modal>
  );
};

export default HowTo;