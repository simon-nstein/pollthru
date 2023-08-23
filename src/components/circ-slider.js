//circ-slider.js
import React, { useState, useRef, useEffect } from 'react';
import Text from 'react-svg-text';
import { useSpring, animated } from 'react-spring';
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from '../config/firebase';

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


export const CircularSlider = ({ onShowPercentChange, submitted, difference}) => {
  const radius = 80;
  const knobRadius = 10;
  const center = radius + 10;
  const knobOffset = -10; // Adjust this value to push the knob outwards

  const [percentage, setPercentage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [knobAngle, setKnobAngle] = useState(90);
  const [knob_dash_offset, setKnobDashOffest] = useState(804);
  const [show_percent, setShowPercent] = useState(0);
  const [dcPercent, setDcPercent] = useState(0);
  const [strokeDashoffsetNew, setSDO] = useState(0);

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
        setSDO(804-(484*(dc_question_percent/100)));
      } else {
        console.log("No such document!");
      }
    } else {
      console.log("User is not authenticated. Query cannot be executed.");
    }
  }

  //new
  const [number, setNumber] = useState(0);

  const svgRef = useRef(null);
  
  const knobDashOffsetAnimation = useSpring({
    from: { strokeDashoffset: 804 },
    to: { strokeDashoffset: submitted ? strokeDashoffsetNew : 804 }, //change 600 to percent that you bring in my daily_challenge
    config: { duration: 3000 }, // Adjust the duration as needed
  });

  console.log("submitted", submitted)

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
    const distance = Math.sqrt((x - center) ** 2 + (y - center) ** 2);
    const maxDistance = radius - knobRadius;

    setKnobAngle(newAngle);

    const clampedDistance = Math.min(maxDistance, Math.max(0, distance));
    const newPercentage = (clampedDistance / maxDistance) * 100;
    setPercentage(newPercentage);

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
    //console.log("YOOOOOOOOO", dcPercent);
    //NEW
    if (submitted) {
      console.log("HMMMMMMMM");
      const interval = setInterval(() => {
        if (number < dcPercent) {
          setNumber(prevNumber => prevNumber + 1);
        }
      }, 30);
    

    return () => clearInterval(interval);
  }
  }, [submitted, number]);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseLeave = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDragging]);

  useEffect(() => {
    getQuestion();
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
    stroke: '#F54842',
    strokeWidth: 20,
    strokeLinecap: 'round',
    fill: 'none',
  };

  const knobStyle = {
    fill: 'white',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  };

  return (
    <div>
      <svg
        ref={svgRef}
        width={radius * 2 + 20}
        height={radius * 2 + 20}
        viewBox="0 0 180 180"
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
        />

        {submitted && (
          <AnimatedPath
            strokeDasharray="804.361083984375"
            strokeDashoffset={knobDashOffsetAnimation.strokeDashoffset}
            style={pathStyleTwo}
            d={`M ${center}, ${center}
              m 0, -${radius}
              a ${radius},${radius} 0 0,1 0,${radius * 2}
              a -${radius},-${radius} 0 0,1 0,-${radius * 2}`}
          />
        )}

        <Text
          x={center}
          y={center}
          textAnchor="middle"
          fill="black"
        >
          {show_percent}%
        </Text>
      </svg>
      {submitted && (
      <p>{number}%</p>
      )}
    </div>
  );
};