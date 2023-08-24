import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from '../config/firebase';
import { getAuth } from "firebase/auth";
import Popup from "../components/popup";
import { BsShare } from 'react-icons/bs';
import NavBar from '../components/nav';

import "../components/daily_challenge.css";
import { CircularSlider } from '../components/circ-slider';

const auth = getAuth();

function getCurrentFormattedDate() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  
  const formattedDate = currentDate.split("/").join("-");
  return formattedDate;
}

export const DC = () => {
  const [dcQuestion, setDcQuestion] = useState("");
  const [dcPercent, setDcPercent] = useState(0);
  const [difference, setDifference] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  //new
  const [parentShowPercent, setParentShowPercent] = useState(0);

  const handleShowPercentChange = (newShowPercent) => {
    // Update the show_percent value in the parent component's state
    setParentShowPercent(newShowPercent);
  };

  async function getQuestion() {
    // Getting today's Date
    const formattedDate = getCurrentFormattedDate();

    // Checking if the user is authenticated
    const user = auth.currentUser;

    if (user) {
      const docRef = doc(db, "questions", formattedDate);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { dc_question } = docSnap.data();
        const { dc_question_percent } = docSnap.data();

        setDcQuestion(dc_question);
        setDcPercent(dc_question_percent);
      } else {
        console.log("No such document!");
      }
    } else {
      console.log("User is not authenticated. Query cannot be executed.");
    }
  }

  async function getOffBy() {
    // Getting today's Date
    const formattedDate = getCurrentFormattedDate();

    // Checking if the user is authenticated
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const docRef = doc(db, "entries", userId, "date", formattedDate);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        //If they have done Daily Challenge
        const { percent_off } = docSnap.data();
        setDifference(percent_off);
      } else {
        //if they haven't done Daily Challenge yet
      }
    }
  }

  useEffect(() => {
    getQuestion();
    getOffBy();
  }, []);

  
  async function handleSubmit(event) {
    const value = parentShowPercent;
    const user = auth.currentUser;
  
    if (user) {
      const userId = user.uid;
  
      const formattedDate = getCurrentFormattedDate();
      const dcDocRef = doc(db, "entries", userId, "date", formattedDate);

      const diff = Math.abs(value - dcPercent);
    
      await setDoc(dcDocRef, {
        dc_percent: value,
        percent_off: diff,
      });

      
      setDifference(diff);
      setSubmitted(true);
    }

    setTimeout(() => {
        setModalIsOpen(true);
      }, 4000); // 4 seconds delay
  }

  async function handleShare(event) {
    //share button function
  }


  return (
    <div >
      <NavBar />
      <div class="main-dc-div">
        <h1 class="challenge-header">DAILY CHALLENGE</h1>
        <h1 class="dcQuestion">{dcQuestion}</h1>
        <CircularSlider onShowPercentChange={handleShowPercentChange} submitted={submitted} difference={difference} setSubmitted={setSubmitted}/>
        
        {submitted ? (
          <>
            <p style={{fontSize: '1.5rem', marginTop: '0'}}>You were <b>{difference}% off</b></p>

            <button class="shareBtn" onClick={handleShare}>
              <span class="shareText">Share</span>
              <BsShare size={20} class="shareIcon"/>
            </button>

            <Popup isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} difference={difference} />
          </>
        ) : (
          <button class="submit" onClick={handleSubmit}>Submit</button>
        )}
      </div>
    </div>
  );
};