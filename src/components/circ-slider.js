import "../components/circ-slider.css";
import React, { useState, useRef, useEffect } from 'react';

export const CircularSlider = () => {
  const radius = 80;
  const knobRadius = 10;
  const center = radius + 10;

  const [percentage, setPercentage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [knobAngle, setKnobAngle] = useState(0);

  const svgRef = useRef(null);

  const handleDragStart = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDrag = (event) => {
    if (!isDragging) return;

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
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseLeave = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isDragging]);

  useEffect(() => {
    setKnobAngle(0); // Set the initial angle of the knob when the page loads
  }, []);

  return (
    <div className="circular-slider-container">
      <svg
        ref={svgRef}
        width={radius * 2 + 20}
        height={radius * 2 + 20}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          className="circular-slider-bg"
        />
        <circle
          cx={center + (radius - knobRadius) * Math.cos(knobAngle * (Math.PI / 180))}
          cy={center + (radius - knobRadius) * Math.sin(knobAngle * (Math.PI / 180))}
          r={knobRadius}
          className="circular-slider-knob"
          onMouseDown={handleDragStart}
        />
      </svg>
      <div className="slider-value">{Math.round(percentage)}%</div>
    </div>
  );
};
