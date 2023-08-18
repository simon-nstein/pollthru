import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from '../config/firebase';
import { getAuth } from "firebase/auth";
import Popup from "../components/popup";
import { BsShare } from 'react-icons/bs';
import NavBar from '../components/nav';

import "../components/daily_challenge.css";

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

  useEffect(() => {
    getQuestion();
  }, []);

  
  async function handleSubmit(event) {
    const value = 22; //I just put a random value
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
        
        {submitted ? (
          <>
            <h1 class="offBy">You were {difference} percent off</h1>

            <button class="shareBtn" onClick={handleShare}>
              <BsShare size={25} class="shareIcon"/>
              <span class="shareText">Share</span>
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