import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Countdown from 'react-countdown';

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from '../config/firebase';
import { getAuth } from "firebase/auth";
import { BsShare } from 'react-icons/bs';
import { async } from "@firebase/util";
import { collection, getDocs } from "firebase/firestore";
import { GrClose } from 'react-icons/gr';
import {Alert, Share, View, Button} from 'react-native';

import { useNavigate } from 'react-router-dom';

import "../components/popup.css";

Modal.setAppElement("#root");
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

const Popup = ({ isOpen, onClose, analyzeOpen }) => {
  const navigate = useNavigate();
  const [timeTill12AM, setTimeTill12AM] = useState(null);

  const [button1Color, setButton1Color] = useState("white");
  const [button2Color, setButton2Color] = useState("white");
  const [button1TextColor, setButton1TextColor] = useState("black");
  const [button2TextColor, setButton2TextColor] = useState("black");

  const [submitted, setSubmitted] = useState(false);

  const [Option_1, setOpt1] = useState("");
  const [Option_2, setOpt2] = useState("");
  const [Question, setQ] = useState("");
  const [DP_Share_Message, setDPSM] = useState("");

  const [Played, setPlayed] = useState(0);
  const [AvrgPO, setAvrgPO] = useState(0);
  const [Streak, setStreak] = useState(0);
  const [OffBy, setOffBy] = useState(0);

  const [shareClicked, setShareClicked] = useState(false);

  const [dp_pick, setDPpick] = useState("");

  //const [pollPick, setPollPick] = useState(null);


  const calculateTimeUntil12AM = () => {
    const currentDate = new Date();
    const twelveAM = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
    if (currentDate.getHours() >= 0 && currentDate.getMinutes() >= 0 && currentDate.getSeconds() >= 0) {
      twelveAM.setDate(twelveAM.getDate() + 1);
    }
    setTimeTill12AM(twelveAM);
  };

  useEffect(() => {
    calculateTimeUntil12AM();
  }, []);

  useEffect(() => {
    if (shareClicked) {
      const timeout = setTimeout(() => {
        setShareClicked(false);
      }, 2500);

      return () => clearTimeout(timeout);
    }
  }, [shareClicked]);

  const modalContentStyle = {
    width: "35%",
    margin: "0 auto",
  };
  
  // Add media query for screens with width below 400px
  if (window.innerWidth < 500) {
    modalContentStyle.width = "82%";
    modalContentStyle.inset = "28px 14px";
  }

  const handleButton1Click = () => {
    setButton1Color("#8848F5");
    setButton2Color("white");

    setButton1TextColor("white");
    setButton2TextColor("black");
  };

  const handleButton2Click = () => {
    setButton1Color("white");
    setButton2Color("#8848F5");

    setButton1TextColor("black");
    setButton2TextColor("white");
  };

  async function getQuestion() {
    // Getting today's Date
    const formattedDate = getCurrentFormattedDate();

    // Checking if the user is authenticated
    const user = auth.currentUser;

    if (user) {
      const docRef = doc(db, "daily_poll", formattedDate);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { Option_1 } = docSnap.data();
        const { Option_2 } = docSnap.data();
        const { Question } = docSnap.data();
        const { dp_share_message } = docSnap.data();

        setOpt1(Option_1);
        setOpt2(Option_2);
        setQ(Question);
        setDPSM(dp_share_message)
        
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

    const docRef = doc(db, "daily_poll", formattedDate);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { Option_1 } = docSnap.data();
      const { Option_2 } = docSnap.data();
      const { Question } = docSnap.data();
      const { dp_share_message } = docSnap.data();

      setOpt1(Option_1);
      setOpt2(Option_2);
      setQ(Question);
      setDPSM(dp_share_message)
      
    } else {
      console.log("No such document!");
    }
  }

  async function get_question() {
    // Getting today's Date
    const formattedDate = getCurrentFormattedDate();

    const docRef = doc(db, "daily_pulls", formattedDate);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { option_1 } = docSnap.data();
      const { option_2 } = docSnap.data();
      const { dp_q } = docSnap.data();
      const { dp_share_message } = docSnap.data();

      setOpt1(option_1);
      setOpt2(option_2);
      setQ(dp_q);
      setDPSM(dp_share_message)
      
    } else {
      console.log("No such document!");
    }
  }

  async function getPlayed() {
    //gets the number of days the user has played the game
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const collectionRef = collection(db, "entries", userId, "date");
      const querySnapshot = await getDocs(collectionRef);
      const count = querySnapshot.size;
      
      setPlayed(count);
      return count
    }
  }

  async function getStats(){
    const retrievedObjString = localStorage.getItem("statistics");
    const retrievedObj = JSON.parse(retrievedObjString);

    console.log("WE ARE HERE", retrievedObj);

    if( retrievedObj !== null ){
      //console.log("PLAYED ", retrievedObj.statistics.played);
      setPlayed(retrievedObj.statistics.played);
      setAvrgPO(retrievedObj.statistics.avrg_off_by);
      setOffBy(retrievedObj.statistics.closest_guess_off);
      setStreak(retrievedObj.statistics.streak.days);
    }
  }

  async function getAvrgPO() {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const collectionRef = collection(db, "entries", userId, "date");
      const querySnapshot = await getDocs(collectionRef);

      let avrg_percent_off = 0;
      let num_entries = 0;
      querySnapshot.forEach((doc) => {
        const { percent_off } = doc.data();
        avrg_percent_off += percent_off;
        num_entries += 1;
      });

      setAvrgPO(avrg_percent_off / num_entries);
      return avrg_percent_off / num_entries;
    }
  }

  async function getLowestGuess() {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const collectionRef = collection(db, "entries", userId, "date");
      const querySnapshot = await getDocs(collectionRef);

      let lowest_guess = 100;
      querySnapshot.forEach((doc) => {
        const { percent_off } = doc.data();
        if( percent_off < lowest_guess){
          lowest_guess = percent_off
        }
      });

      setOffBy(lowest_guess);
      return lowest_guess;
    }
  }

  async function getStreak() {
    // Checking if the user is authenticated
    const user = auth.currentUser;
    let streak = 0;
  
    if (user) {
      const userId = user.uid;
      let currentDate = new Date();
      let previousDateExists = true;
  
      while (previousDateExists) {
        const formattedDate = currentDate
          .toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric", })
          .split("/")
          .join("-");
  
        const docRef = doc(db, "entries", userId, "date", formattedDate);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1); // Move to the previous date
        } else {
          previousDateExists = false;
        }
      }
    }

    streak -= 1 //because a streak needs to be two consectuave days so they first day can't count
    setStreak(streak);
    return streak;
  }

  async function getPollPick() {
    // Getting today's Date
    const formattedDate = getCurrentFormattedDate();

    // Checking if the user is authenticated
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const docRef = doc(db, "entries", userId, "date", formattedDate);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { dp_pick } = docSnap.data();
        const docRefTwo = doc(db, "daily_poll", formattedDate);
        const docSnapTwo = await getDoc(docRefTwo);
        if (docSnapTwo.exists()) {
          const { Option_1 } = docSnapTwo.data();
          if( Option_1 === dp_pick ){
            setSubmitted(true);
            //setPollPick("option_1");
            setButton1Color("#8848F5");
            setButton2Color("white");

            setButton1TextColor("white");
            setButton2TextColor("black");
          } if( Option_2 === dp_pick ){
            setSubmitted(true);
            //setPollPick("option_2");
            setButton1Color("white");
            setButton1TextColor("black");

            setButton2Color("#8848F5");
            setButton2TextColor("white");

          }
        } else{
          setSubmitted(false);
          setButton1Color("white");
          setButton2Color("white");

          setButton1TextColor("black");
          setButton1TextColor("black");
        }
      } else {
        //if they haven't done either DC or DP today
        setButton1Color("white");
        setButton2Color("whtie");

        setButton1TextColor("black");
        setButton1TextColor("black");
      }
    } else {
      console.log("User is not authenticated. Query cannot be executed.");
    }
  }

  async function getPollPickNEW() {
    // Getting today's Date
    const formattedDate = getCurrentFormattedDate();

    const retrievedObjString = localStorage.getItem([formattedDate]);
    const retrievedObj = JSON.parse(retrievedObjString);
    
    if( retrievedObj !== null ){
      //if they've've done the daily poll already
      const docRef = doc(db, "daily_poll", formattedDate);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { Option_1 } = docSnap.data();
        const dp_pick = retrievedObj.dp_pick;
        if( dp_pick === null ){
          //if they haven't  done the daily poll already
          setSubmitted(false);
          setButton1Color("white");
          setButton2Color("white");

          setButton1TextColor("black");
          setButton1TextColor("black");

          return
          
        }
        if( Option_1 === dp_pick ){
          setSubmitted(true);
          //setPollPick("option_1");
          setButton1Color("#8848F5");
          setButton2Color("white");

          setButton1TextColor("white");
          setButton2TextColor("black");
        } if( Option_2 === dp_pick ){
          setSubmitted(true);
          //setPollPick("option_2");
          setButton1Color("white");
          setButton1TextColor("black");

          setButton2Color("#8848F5");
          setButton2TextColor("white");
        }
      }
    } else{
      //if they haven't  done the daily poll already
      setSubmitted(false);
      setButton1Color("white");
      setButton2Color("white");

      setButton1TextColor("black");
      setButton1TextColor("black");

    }
  }

  async function get_pull_pick() {
    // Getting today's Date
    const formattedDate = getCurrentFormattedDate();

    const retrievedObjString = localStorage.getItem([formattedDate]);
    const retrievedObj = JSON.parse(retrievedObjString);
    
    if( retrievedObj !== null ){
      //if they've've done the daily poll already
      const docRef = doc(db, "daily_poll", formattedDate);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { option_1 } = docSnap.data();
        const { option_2 } = docSnap.data();
        const dp_pick = retrievedObj.dp_pick;
        if( dp_pick === null ){
          //if they haven't  done the daily poll already
          setSubmitted(false);
          setButton1Color("white");
          setButton2Color("white");

          setButton1TextColor("black");
          setButton1TextColor("black");

          return
          
        }
        if( option_1 === dp_pick ){
          setSubmitted(true);
          //setPollPick("option_1");
          setButton1Color("#8848F5");
          setButton2Color("white");

          setButton1TextColor("white");
          setButton2TextColor("black");
        } if( option_2 === dp_pick ){
          setSubmitted(true);
          //setPollPick("option_2");
          setButton1Color("white");
          setButton1TextColor("black");

          setButton2Color("#8848F5");
          setButton2TextColor("white");
        }
      }
    } else{
      //if they haven't  done the daily poll already
      setSubmitted(false);
      setButton1Color("white");
      setButton2Color("white");

      setButton1TextColor("black");
      setButton1TextColor("black");

    }
  }

  async function onShare() {
    const userAgent = navigator.userAgent.toLowerCase();
    const currentDate = new Date().toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric"
    });
    const message =`${DP_Share_Message} I chose ${dp_pick}% 🫢. \n What do you think?`

    if (userAgent.match(/mobile|iphone|android/)) {
      // User is on a phone
      const shareData = {
        title: 'PollThru',
        text: message,
        url: 'https://developer.mozilla.org', //change
      };

      try {
        await navigator.share(shareData);
        console.log('Shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // User is on a computer
      navigator.clipboard.writeText(message);
      setShareClicked(true);
    }
  }

  useEffect(() => {
    //getQuestion();
    //getQuestionNEW();
    get_question();
    
    /*
    getPlayed();
    getAvrgPO();
    getLowestGuess();
    getStreak();
    */

    getStats();

    //getPollPick();
    //getPollPickNEW();
    get_pull_pick();
  }, [analyzeOpen]);

  const handleSubmit = async (event) => {

    if( button1Color === "#8848F5" || button2Color === "#8848F5" ){

        let pick;
        let whichOption;
        if( button1Color === "#8848F5"){
            pick = Option_1;
            whichOption = 1;
            setDPpick(pick);
        } else{
            pick = Option_2;
            whichOption = 2;
            setDPpick(pick);
        }

        event.preventDefault();
        const user = auth.currentUser;
    
        if (user) {
            const userId = user.uid;
        
            const formattedDate = getCurrentFormattedDate();
            const dcDocRef = doc(db, "entries", userId, "date", formattedDate);
            
            await updateDoc(dcDocRef, {
                dp_pick: pick,
            });

            //GETTING CURRENT NUMBERS FOR OPTIONS
            const docRef = doc(db, "daily_poll_all", formattedDate);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const { Option_1 } = docSnap.data();
              const { Option_2 } = docSnap.data();
              const dcDocRefTwo = doc(db, "daily_poll_all", formattedDate);
              if( whichOption === 1){
                await updateDoc(dcDocRefTwo, {
                  Option_1: Option_1 + 1,
                });
              } else{
                await updateDoc(dcDocRefTwo, {
                  Option_2: Option_2 + 1,
                });
              }
            };
            setSubmitted(true);
        };
    }
  };

  const handleSubmitNEW = async (event) => {

    if( button1Color === "#8848F5" || button2Color === "#8848F5" ){

        let pick;
        let whichOption;
        if( button1Color === "#8848F5"){
            pick = Option_1;
            whichOption = 1;
            setDPpick(pick);
        } else{
            pick = Option_2;
            whichOption = 2;
            setDPpick(pick);
        }

        const formattedDate = getCurrentFormattedDate();

        const currentValue = localStorage.getItem([formattedDate]);
        const userInfo = JSON.parse(currentValue);
  
        const updatedDC = {
          ...userInfo,
          dp_pick: pick,
        };
  
        localStorage.setItem([formattedDate], JSON.stringify(updatedDC));

        event.preventDefault();

        //GETTING CURRENT NUMBERS FOR OPTIONS
        const docRef = doc(db, "daily_poll_all", formattedDate);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const { Option_1 } = docSnap.data();
          const { Option_2 } = docSnap.data();
          const dcDocRefTwo = doc(db, "daily_poll_all", formattedDate);
          if( whichOption === 1){
            await updateDoc(dcDocRefTwo, {
              Option_1: Option_1 + 1,
            });
          } else{
            await updateDoc(dcDocRefTwo, {
              Option_2: Option_2 + 1,
            });
          }
        };
        setSubmitted(true);
    }
  };

  const renderer = ({ hours, minutes, seconds }) => {
    return (
      <span>{hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>
    );
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={{ content: modalContentStyle }}>
      {shareClicked && <div class="copiedClipboard">Copied Results to Clipboard</div>}
      {/* {submitted && <div class="copiedClipboard">We appreciate your active participation in the poll. The more people who vote, the better insights we can gather. Share with your friends so they can blah blah blah.</div> */}
      <button style={closeButtonStyle} onClick={onClose} size={25}> <GrClose /> </button>
      <div class="most-all">
        <h1 class="topHeader">NEXT CHALLENGE</h1>
        {/* countdown */}
        <div style={{ fontSize: '3rem' }}>
          {timeTill12AM && (
            <Countdown date={timeTill12AM} onComplete={calculateTimeUntil12AM} renderer={renderer} />
          )}
        </div>

        <div class="poll">
          <p class="question">{Question}</p>
          <p class="italic" id="bottom-italic">There is no right answer, just share your thoughts. Your answer goes towards the daily challenge tomorrow!</p>
          <button class="option" style={{ backgroundColor: button1Color, color: button1TextColor, pointerEvents: submitted ? 'none' : 'auto' }} onClick={handleButton1Click}>{Option_1}</button>
          <button class="option" style={{ backgroundColor: button2Color, color: button2TextColor, pointerEvents: submitted ? 'none' : 'auto' }} onClick={handleButton2Click}>{Option_2}</button>

          {!submitted ? (
            <button class="submit-popup" type="submit" onClick={handleSubmitNEW}>Submit</button>
          ) : (
            <button class="shareBtnPopup" onClick={onShare}>
                  <span class="shareText">Share</span>
                  <BsShare size={20} class="shareIcon"/>
            </button>
          )}
        </div>

        <h1 class="topHeader">STATISTICS</h1>
        <div class="statsContainer">
          <div class="statContainer">
            <p class="h1Style">{Played}</p>
            <p class="pStyle">Played</p>
          </div>

          <div class="statContainer">
            <p class="h1Style">{AvrgPO}%</p>
            <p class="pStyle">Average Off By</p>
          </div>

          <div class="statContainer">
            <p class="h1Style">{Streak}</p>
            <p class="pStyle">Streak</p>
          </div>

          <div class="statContainer">
            <p class="h1Style">{OffBy}%</p>
            <p class="pStyle">Closest Guess Off</p>
          </div>
        </div>
      </div>

    </Modal>
  );
};

export default Popup;