import React from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { BsBarChart } from 'react-icons/bs';
import "../components/navStyle.css";
import { useState, useEffect } from "react";
import Popup from "../components/popup";
import HowTo from "./how_to";

const NavBar = () => {
  const [analyzeOpen, setAnalyzeOpen] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);

  return (
    <div className="navbar">
      <div className="navbar__title">PollThru</div>
      <div className="navbar__icons">
        <AiOutlineQuestionCircle size={25} className="navbar__icon" onClick={() => setQuestionOpen(true)} />
        <BsBarChart size={25} className="navbar__icon" onClick={() => setAnalyzeOpen(true)} />
      </div>
      <div className="navbar__line"></div>

      {/* <Popup isOpen={analyzeOpen} onClose={() => setAnalyzeOpen(false)}/> */}
      <Popup isOpen={analyzeOpen} onClose={() => setAnalyzeOpen(false)} analyzeOpen={analyzeOpen} setAnalyzeOpen={setAnalyzeOpen} />
      <HowTo isOpen={questionOpen} onClose={() => setQuestionOpen(false)}/>
    </div>
  );
};

export default NavBar;