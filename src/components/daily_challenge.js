import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from '../config/firebase';
import { getAuth } from "firebase/auth";
import Popup from "../components/popup";
import { BsShare } from 'react-icons/bs';
import NavBar from '../components/nav';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [dcQuestion, setDcQuestion] = useState("");
  const [dcPercent, setDcPercent] = useState(0);
  const [dcMessage, setDcMessage] = useState("");
  const [difference, setDifference] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  //new
  const [parentShowPercent, setParentShowPercent] = useState(0);
  const [parentShowOffBy, setParentShowOffBy] = useState(false);

  const [shareClicked, setShareClicked] = useState(false);

  const handleShowPercentChange = (newShowPercent) => {
    // Update the show_percent value in the parent component's state
    setParentShowPercent(newShowPercent);
  };

  const handleshowOffByChange = (newShowOffBy) => {
    // Update the show_percent value in the parent component's state
    setParentShowOffBy(newShowOffBy);
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
        const { dc_share_message } = docSnap.data();

        setDcQuestion(dc_question);
        setDcPercent(dc_question_percent);
        setDcMessage(dc_share_message);
      } else {
        console.log("No such document!");
      }
    } else {
      console.log("User is not authenticated. Query cannot be executed.");
      navigate("/login");
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

  useEffect(() => {
    if (shareClicked) {
      const timeout = setTimeout(() => {
        setShareClicked(false);
      }, 2500);

      return () => clearTimeout(timeout);
    }
  }, [shareClicked]);

  
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
      }, 11000);
  }

  async function onShare() {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.match(/mobile|iphone|android/)) {
      // User is on a phone
      const shareData = {
        title: 'PollThru',
        text: `${dcMessage} Simon's guess was ${difference}% off 😎\nThink you can do better?`,
        url: 'https://developer.mozilla.org',
      };

      try {
        await navigator.share(shareData);
        console.log('Shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // User is on a computer
      let message = `${dcMessage} Simon's guess was ${difference}% off 😎\nThink you can do better? PollThru.com`;
      navigator.clipboard.writeText(message);
      setShareClicked(true);
    }
  }


  return (
    <div >
      {shareClicked && <div class="copiedClipboard">Copied Results to Clipboard</div>}
      <NavBar />
      <div class="main-dc-div">
        <h1 class="challenge-header">DAILY CHALLENGE</h1>
        <h1 class="dcQuestion">{dcQuestion}</h1>
        <CircularSlider onShowPercentChange={handleShowPercentChange} submitted={submitted} difference={difference} setSubmitted={setSubmitted} setShowOffBy={handleshowOffByChange}/>
        
        {submitted ? (
          <>
            {parentShowOffBy && ( //showOffBy
            <p style={{fontSize: '1.5rem', marginTop: '0'}}>You were <b>{difference}% off</b></p>
            )}

            <button class="shareBtn" onClick={onShare}>
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