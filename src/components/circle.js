import React from 'react';
import CircularSlider from '@fseehawer/react-circular-slider';
import { AiOutlinePercentage } from 'react-icons/ai';

export const Circle = () => {
    const renderLabel = value => `${Math.round(value)}%`; // Format value as a percent string

    return (
        <CircularSlider
            min={0}
            max={100}
            label=" "
            labelColor="#8848F5"
            knobColor="#FFFFFF"
            appendToValue="%"
            progressColorFrom="#8848F5"
            progressColorTo="#8848F5"
            progressSize={24}
            trackColor="#E5E5E5"
            trackSize={24}
            onChange={value => console.log(value)}
            renderLabel={renderLabel} // Use custom label renderer
        >
        <AiOutlinePercentage x="9" y="9" width="18px" height="18px" color="#FFFFFF"/>
        </CircularSlider>
        
    );    
};