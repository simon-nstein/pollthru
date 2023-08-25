import React from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { BsBarChart } from 'react-icons/bs';
import "../components/navStyle.css";
import { useState, useEffect } from "react";
import Popup from "../components/popup";
import HowTo from "./how_to";
import { FiLogOut } from 'react-icons/fi';
import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [analyzeOpen, setAnalyzeOpen] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    try{
    await signOut(auth);
    navigate("/login");
    } catch(err) {
        console.error(err);
    }
};

  return (
    <div className="navbar">
      <div className="navbar__title">PollThru</div>
      <div className="navbar__icons">
        <AiOutlineQuestionCircle size={25} className="navbar__icon" onClick={() => setQuestionOpen(true)} />
        <BsBarChart size={25} className="navbar__icon" onClick={() => setAnalyzeOpen(true)} />
        <FiLogOut size={25} className="navbar__icon" onClick={() => setAnalyzeOpen(true)}/>
      </div>
      <div className="navbar__line"></div>

      {/* <Popup isOpen={analyzeOpen} onClose={() => setAnalyzeOpen(false)}/> */}
      <Popup isOpen={analyzeOpen} onClose={() => setAnalyzeOpen(false)} analyzeOpen={analyzeOpen} setAnalyzeOpen={setAnalyzeOpen} />
      <HowTo isOpen={questionOpen} onClose={logout}/>
    </div>
  );
};

export default NavBar;