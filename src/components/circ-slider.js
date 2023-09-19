//circ-slider.js
import React, { useState, useRef, useEffect } from 'react';
import Text from 'react-svg-text';
import { animated } from 'react-spring';
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const AnimatedPath = animated.path;

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


export const CircularSlider = ({ onShowPercentChange, submitted, difference, setSubmitted, setShowOffBy}) => {
  const navigate = useNavigate();

  const radius = 80;
  const knobRadius = 10;
  const center = radius + 10;
  const knobOffset = -10; // Adjust this value to push the knob outwards

  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingMobile, setIsDraggingMobile] = useState(false);
  
  const [knobAngle, setKnobAngle] = useState(90);
  const [knob_dash_offset, setKnobDashOffest] = useState(804);
  const [show_percent, setShowPercent] = useState(0);
  const [dcPercent, setDcPercent] = useState(0);
  const [strokeDashoffsetNew, setSDO] = useState(804);

  async function getDC() {
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
        const { dc_percent } = docSnap.data();
        setKnobDashOffest(804-(484*(dc_percent/100)));
        setShowPercent(dc_percent);
        const { percent_off } = docSnap.data();
        setSubmitted(true);
      } else {
        //if they haven't done Daily Challenge yet
      }
    }
  }

  async function getDCNEW() {
    // Getting today's Date
    const formattedDate = getCurrentFormattedDate();

    const retrievedObjString = localStorage.getItem([formattedDate]);
    const retrievedObj = JSON.parse(retrievedObjString);
    if( retrievedObj !== null){
      //If they have done Daily Challenge
      const dc_percent = retrievedObj.dc_percent;
      setKnobDashOffest(804-(484*(dc_percent/100)));
      setShowPercent(dc_percent);
      setSubmitted(true);
    } else{
      //if they haven't done Daily Challenge yet
    }
  }

  async function getQuestion() {
    // Getting today's Date
    const formattedDate = getCurrentFormattedDate();

    // Checking if the user is authenticated
    const user = auth.currentUser;

    if (user) {
      const docRef = doc(db, "questions", formattedDate);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { dc_question_percent } = docSnap.data();

        setDcPercent(dc_question_percent);
        if(submitted){
          setSDO(804-(484*(dc_question_percent/100)));
        }
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
      const { dc_question_percent } = docSnap.data();
      console.log("dc_question_percent", dc_question_percent);

      setDcPercent(dc_question_percent);
      console.log("dcPercentNEW!!!", dcPercent);
      if(submitted){
        setSDO(804-(484*(dc_question_percent/100)));
      }
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
      const { dc_percent } = docSnap.data();
      console.log("dc_percent", dc_percent);

      setDcPercent(dc_percent);
      if(submitted){
        setSDO(804-(484*(dc_percent/100)));
      }
    } else {
      console.log("No such document!");
    }
  }

  //new
  const [number, setNumber] = useState(0);

  const svgRef = useRef(null);

  const handleDragStart = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDrag = (event) => {
    
    if (!isDragging || submitted) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - svgRect.left;
    const y = event.clientY - svgRect.top;
    const newAngle = Math.atan2(y - center, x - center) * (180 / Math.PI);

    setKnobAngle(newAngle);

    const angleToCenter = ((newAngle + 90) + 360) % 360;
    const percentageFromAngle = angleToCenter / 360;
    setShowPercent(Math.round(percentageFromAngle * 100));

    //new
    onShowPercentChange(Math.round(percentageFromAngle * 100));

    const knob_follow_length = 484 * percentageFromAngle;
    const new_knob_dash_offset = 804 - knob_follow_length;
    setKnobDashOffest(new_knob_dash_offset);
  };

  const handleTouchStart = (event) => {
    //event.preventDefault();
    setIsDraggingMobile(true);
  };

  const handleTouchMove = (event) => {
    
    if (!isDraggingMobile || submitted) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const x = event.touches[0].clientX - svgRect.left;
    const y = event.touches[0].clientY - svgRect.top;
    const newAngle = Math.atan2(y - center, x - center) * (180 / Math.PI);

    setKnobAngle(newAngle);

    const angleToCenter = ((newAngle + 90) + 360) % 360;
    const percentageFromAngle = angleToCenter / 360;
    setShowPercent(Math.round(percentageFromAngle * 100));

    //new
    onShowPercentChange(Math.round(percentageFromAngle * 100));

    const knob_follow_length = 484 * percentageFromAngle;
    const new_knob_dash_offset = 804 - knob_follow_length;
    setKnobDashOffest(new_knob_dash_offset);
  };

  useEffect(() => {
    if (submitted) {
      const interval = setInterval(() => {
        if (number < dcPercent) {
          setNumber(prevNumber => prevNumber + 1);
          setSDO(strokeDashoffsetNew - 6.26); //4.84 old
          
        }
        if(number === (dcPercent-1)){
          setShowOffBy(true);
          //when the animation is almost done
        }
      }, 70);
    

    return () => clearInterval(interval);
  }
  }, [submitted, number, dcPercent]);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseLeave = () => {
      setIsDragging(false);
    };

    const handlePressUp = () => {
      setIsDraggingMobile(true);
    };

    const handlePressLeave = () => {
      setIsDraggingMobile(false);
    };

    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseLeave);

    //mobile
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchstart', handlePressUp, { passive: false });
    window.addEventListener('touchend', handlePressLeave, { passive: false });


    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);

      //mobile
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handlePressUp);
      window.removeEventListener('touchend', handlePressLeave);
    };
  }, [isDragging, isDraggingMobile]);

  useEffect(() => {
    //getDC();
    getDCNEW();
    //getQuestion();
    //getQuestionNEW();
    get_question();
    setKnobAngle(270); // Set the initial angle of the knob when the page loads
  }, []);

  const circleStyle = {
    stroke: '#ccc',
    strokeWidth: 20,
    fill: 'none',
  };

  const pathStyle = {
    stroke: '#8848F5',
    strokeWidth: 20,
    strokeLinecap: 'round',
    fill: 'none',
  };

  const pathStyleTwo = {
    stroke: '#55b051',
    strokeWidth: 8,
    strokeLinecap: 'round',
    fill: 'none',
  };

  const knobStyle = {
    fill: 'white',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    visibility: submitted ? 'hidden': 'visible'
  };

  const mainDivSliderStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <div style={mainDivSliderStyle}>
      <svg
        ref={svgRef}
        //width={radius * 2 + 20}
        //height={radius * 2 + 20}
        width={200}
        height={200}
        viewBox="-15 10 230 180"
      >
        <circle cx={center} cy={center} r={radius} style={circleStyle} />
        <path
          strokeDasharray="804.361083984375"
          strokeDashoffset={knob_dash_offset}
          style={pathStyle}
          d={`M ${center}, ${center}
            m 0, -${radius}
            a ${radius},${radius} 0 0,1 0,${radius * 2}
            a -${radius},-${radius} 0 0,1 0,-${radius * 2}`}
        />
        <circle
          cx={center + (radius - knobRadius - knobOffset) * Math.sin((knobAngle + 90) * (Math.PI / 180))}
          cy={center - (radius - knobRadius - knobOffset) * Math.cos((knobAngle + 90) * (Math.PI / 180))}
          r={knobRadius}
          style={knobStyle}
          onMouseDown={handleDragStart}
          onTouchStart={handleTouchStart}
        />

        {submitted && (
          <AnimatedPath
            strokeDasharray="804.361083984375"
            //strokeDashoffset={knobDashOffsetAnimation.strokeDashoffset}
            strokeDashoffset={strokeDashoffsetNew}
            style={pathStyleTwo}
            d={`M ${center}, ${center}
              m 0, -${radius+20}
              a ${radius+20},${radius+20} 0 0,1 0,${(radius+ 20) * 2}
              a -${radius+20},-${radius+20} 0 0,1 0,-${(radius+20) * 2}`}
          />
        )}

        <Text
          x={center}
          y={center+10}
          textAnchor="middle"
          fill="#8848F5"
          style={{fontSize: '2rem', fontWeight: 'bold', }}
        >
          {`${show_percent}%`}
        </Text>
      </svg>
        {submitted && (
        <p style={{fontSize: '2rem', color: '#55b051', fontWeight: '600', position: 'absolute', marginLeft: '200px', zIndex: 'auto' }}>{number}%</p>
        )}
    </div>
  );
};