import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../config/firebase';
import { getAuth } from "firebase/auth";
import Popup from "../components/popup";
import { BsShare } from 'react-icons/bs';
import NavBar from '../components/nav';
import { useNavigate } from 'react-router-dom';
import { CircularSlider } from '../components/circ-slider';
import HowTo from "./how_to";

import "../components/daily_challenge.css";
import { Auth } from '../components/auth';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';


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

  const [showHowTo, setShowHowTo] = useState(false);

  async function ShowHowToNEW() {
    const userId = uuidv4();

    const findUser = localStorage.getItem("player");
    if(findUser == null){
      console.log("user doesn't exist");
      //user doesn't exist
      const player = {
        userId: userId,
      };
      localStorage.setItem("player", JSON.stringify(player));
    } else{
      //user does exist
      console.log("user exists");

      /*
      //UPDATE
      const currentValue = localStorage.getItem("player");
      const userInfo = JSON.parse(currentValue);

      const updatedPlayer = {
        ...userInfo,
        date: "7-5"
      };

      localStorage.setItem("player", JSON.stringify(updatedPlayer));
      */

    }

    /*
    
    const retrievedObjString = localStorage.getItem("player");
    const retrievedObj = JSON.parse(retrievedObjString);
    console.log(retrievedObj.userId);

    const dcDocRef = doc(db, "entries", "userId????", "date", "11-11-1111");
    
    await setDoc(dcDocRef, {
      test: "value",
    });
    */
  }

  async function ShowHowTo() {
    //gets the number of days the user has played the game
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const collectionRef = collection(db, "entries", userId, "date");
      const querySnapshot = await getDocs(collectionRef);
      const count = querySnapshot.size;
      console.log(count);

      if( count === 0 ){
        console.log("IN");
        setShowHowTo(true);
      } else{
        console.log("IN2");
        setShowHowTo(false);
      }
    }
  }

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

  async function getQuestionNEW() {
    // Getting today's Date
    const formattedDate = getCurrentFormattedDate();

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

  async function getOffByNEW() {
    // Getting today's Date
    const formattedDate = getCurrentFormattedDate();

    const retrievedObjString = localStorage.getItem([formattedDate]);
    const retrievedObj = JSON.parse(retrievedObjString);
    if( retrievedObj !== null){
      //If they have done Daily Challenge
      const percent_off = retrievedObj.percent_off;
      setDifference(percent_off);
      //HERE!!!!
      setSubmitted(true);
      console.log("submitted in DC", submitted);
    } else{
      //if they haven't done Daily Challenge yet
    }
  }

  useEffect(() => {

    //ShowHowTo();
    ShowHowToNEW();
    //getQuestion();
    getQuestionNEW();
    //getOffBy();
    getOffByNEW();
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
      }, 9000);
  }

  async function handleSubmitNEW(event) {
    const value = parentShowPercent;
    const diff = Math.abs(value - dcPercent);

    const formattedDate = getCurrentFormattedDate();
    
    const daily_challenge = {
      dc_percent: value,
      percent_off: diff,
    };
    localStorage.setItem([formattedDate], JSON.stringify(daily_challenge));

    ///////// STATS /////////
    const findStats = localStorage.getItem("statistics");

    const strk = {
      days: 0,
      last_day: [formattedDate],
    }

    const stats = {
      played: 1,
      avrg_off_by: diff,
      streak: strk,
      closest_guess_off: value,
    };

    if(findStats === null){
      //FIRST DAY
      const statistics = {
        statistics: stats,
      };

      localStorage.setItem("statistics", JSON.stringify(statistics));
    } else{
      //UPDATE

      const retrievedObjString = localStorage.getItem("statistics");
      const retrievedObj = JSON.parse(retrievedObjString);
      const played = retrievedObj.played;
      const avrg_off_by = retrievedObj.avrg_off_by;
      
      
      //streak
      const last_day = retrievedObj.streak.last_day
      const isYesterday = moment(last_day, 'MM-DD-YYYY').isSame(moment(formattedDate, 'MM-DD-YYYY').subtract(1, 'days'), 'day');
      let streak = retrievedObj.streak.days;
      if( isYesterday ){
        //if they also played yesterday
        streak += 1;
      } else{
        streak = 0;
      }

      const strkNEW = {
        days: streak,
        last_day: [formattedDate],
      }

      // closest guess off
      let closest_guess_off = retrievedObj.closest_guess_off;
      if(diff < closest_guess_off){
        closest_guess_off = diff;
      }

      const updatedStats = {
        played: played+1,
        avrg_off_by: avrg_off_by + (diff - avrg_off_by) / played,
        streak: strkNEW,
        closest_guess_off: closest_guess_off,
      };

      localStorage.setItem("statistics", JSON.stringify(updatedStats));
    }

    setDifference(diff);
    setSubmitted(true);

    setTimeout(() => {
        setModalIsOpen(true);
      }, 7500);
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
      <HowTo isOpen={showHowTo} onClose={() => setShowHowTo(false)}/>
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
          <button class="submit" onClick={handleSubmitNEW}>Submit</button>
        )}
      </div>
    </div>
  );
};